import pandas as pd
import numpy as np

def get_last_fcf(cash_flow):
    """
    Extracts the most recent Free Cash Flow (FCF) from the cash flow data.
    If "Free Cash Flow" is not present, tries to compute it as:
    FCF = Operating Cash Flow - Capital Expenditures.
    """
    fcf_data = cash_flow.get("Free Cash Flow", None)
    
    if fcf_data is None:
        operating_cf = cash_flow.get("Total Cash From Operating Activities", None)
        capex = cash_flow.get("Capital Expenditures", None)
        if operating_cf and capex:
            fcf_data = {}
            for date in operating_cf:
                op_val = operating_cf.get(date, 0)
                capex_val = capex.get(date, 0)
                fcf_data[date] = op_val - capex_val
        else:
            return None

    sorted_dates = sorted(fcf_data.keys())
    latest_date = sorted_dates[-1]
    return fcf_data[latest_date]

def calculate_dcf(cash_flow_data, growth_rate=0.05, discount_rate=0.1, forecast_period=5, terminal_growth_rate=0.02):
    """
    Calculates the intrinsic value using the Discounted Cash Flow (DCF) model and returns a detailed breakdown.
    """
    last_fcf = get_last_fcf(cash_flow_data)
    if last_fcf is None:
        return {"error": "Free Cash Flow data not available"}

    yearly_breakdown = []
    projected_pvs = []
    # Project and log FCF for each forecast year
    for year in range(1, forecast_period + 1):
        projected_fcf = last_fcf * ((1 + growth_rate) ** year)
        pv = projected_fcf / ((1 + discount_rate) ** year)
        projected_pvs.append(pv)
        yearly_breakdown.append({
            "year": year,
            "projected_fcf": projected_fcf,
            "present_value": pv
        })

    sum_pv = sum(projected_pvs)
    
    # Calculate Terminal Value
    terminal_value = (last_fcf * ((1 + growth_rate) ** forecast_period) * (1 + terminal_growth_rate)) / (discount_rate - terminal_growth_rate)
    pv_terminal = terminal_value / ((1 + discount_rate) ** forecast_period)
    
    intrinsic_value = sum_pv + pv_terminal

    return {
        "yearly_breakdown": yearly_breakdown,
        "sum_present_value": sum_pv,
        "terminal_value": terminal_value,
        "present_value_terminal": pv_terminal,
        "intrinsic_value": intrinsic_value
    }

def sensitivity_analysis_dcf(cash_flow_data, growth_rates, discount_rates, forecast_period=5, terminal_growth_rate=0.02):
    """
    Computes DCF valuations over a range of growth and discount rates.
    
    Returns a nested dictionary where each growth rate maps to discount rates and their resulting intrinsic values.
    """
    analysis_results = {}
    for g in growth_rates:
        analysis_results[g] = {}
        for d in discount_rates:
            dcf_result = calculate_dcf(cash_flow_data, growth_rate=g, discount_rate=d, forecast_period=forecast_period, terminal_growth_rate=terminal_growth_rate)
            # Save only the intrinsic value
            analysis_results[g][d] = dcf_result.get("intrinsic_value", None)
    return analysis_results
