from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.src.data.fetch_data import fetch_stock_data
from backend.src.data.clean_data import clean_stock_data
from backend.src.analysis.indicators import add_indicators
from backend.src.analysis.risk import calculate_risk_summary
from backend.src.analysis.backtest import run_sma_backtest

app = FastAPI(title="Stock Market Data Analyzer API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "Stock Market Data Analyzer API is running"}

@app.get("/analyze")
def analyze_stock(ticker: str = "AAPL", start: str = "2024-01-01", end: str = "2026-05-07"):
    df = fetch_stock_data(ticker, start, end)
    df = clean_stock_data(df)
    df = add_indicators(df)

    summary = calculate_risk_summary(df)
    backtest = run_sma_backtest(df)

    chart_data = df.tail(250).copy()
    chart_data["date"] = chart_data["date"].dt.strftime("%Y-%m-%d")

    return {
        "ticker": ticker,
        "summary": summary,
        "backtest": {
            "initial_capital": backtest["initial_capital"],
            "final_value": backtest["final_value"],
            "profit_loss": backtest["profit_loss"],
            "roi_percent": backtest["roi_percent"],
            "trades": backtest["trades"],
        },
        "chart_data": chart_data[
            ["date", "close", "sma_20", "sma_50", "daily_return", "volume"]
        ].fillna(0).to_dict(orient="records"),
    }