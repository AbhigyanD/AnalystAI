from fastapi import FastAPI
from backend.services.dcf import calculate_dcf
from backend.services.finance import fetch_financials
from backend.services.dcf import sensitivity_analysis_dcf

app = FastAPI()

@app.get("/")
def home():
    return {"message": "MyGPT DCF API is running!"}

@app.get("/fetch_financials/{ticker}")
def get_financials(ticker: str):
    return fetch_financials(ticker)

@app.get("/compute_dcf/{ticker}")
def compute_dcf(ticker: str, growth_rate: float = 0.05, discount_rate: float = 0.1, forecast_period: int = 5, terminal_growth_rate: float = 0.02):
    financials = fetch_financials(ticker)
    if "error" in financials:
        return financials
    intrinsic_value = calculate_dcf(financials["cash_flow"], growth_rate, discount_rate, forecast_period, terminal_growth_rate)
    return {"intrinsic_value": intrinsic_value}

@app.get("/sensitivity_dcf/{ticker}")
def sensitivity_dcf(ticker: str):
    financials = fetch_financials(ticker)
    if "error" in financials:
        return financials

    # Define a range of values for sensitivity analysis
    growth_rates = [0.03, 0.04, 0.05, 0.06, 0.07]
    discount_rates = [0.08, 0.09, 0.1, 0.11, 0.12]

    analysis = sensitivity_analysis_dcf(financials["cash_flow"], growth_rates, discount_rates)
    return {"sensitivity_analysis": analysis}
