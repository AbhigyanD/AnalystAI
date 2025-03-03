import yfinance as yf
import pandas as pd
import numpy as np

def sanitize_data(data):
    """ Convert NaN, inf, and -inf to None for JSON serialization """
    cleaned_data = {}
    for key, value in data.items():
        if isinstance(value, dict):
            cleaned_data[key] = {
                k: None if pd.isna(v) or np.isinf(v) else v for k, v in value.items()
            }
        else:
            cleaned_data[key] = None if pd.isna(value) or np.isinf(value) else value
    return cleaned_data

def fetch_financials(ticker: str):
    """
    Fetch key financial statements (Income Statement, Balance Sheet, Cash Flow)
    for a given stock ticker using Yahoo Finance.
    """
    try:
        stock = yf.Ticker(ticker)
        
        # Fetch financial statements
        income_stmt = stock.financials
        balance_sheet = stock.balance_sheet
        cash_flow = stock.cashflow
        
        # Convert DataFrames to dicts with row labels as keys
        return {
            "income_statement": income_stmt.to_dict(orient="index"),
            "balance_sheet": balance_sheet.to_dict(orient="index"),
            "cash_flow": cash_flow.to_dict(orient="index"),
        }
    
    except Exception as e:
        return {"error": str(e)}
