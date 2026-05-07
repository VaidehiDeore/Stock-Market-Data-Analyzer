import pandas as pd
import numpy as np


def calculate_risk_summary(df: pd.DataFrame) -> dict:
    """
    Calculate risk and performance summary.
    """
    latest_close = float(df["close"].iloc[-1])
    first_close = float(df["close"].iloc[0])

    overall_return = ((latest_close - first_close) / first_close) * 100

    daily_returns = df["daily_return"].dropna()

    volatility = float(daily_returns.std() * np.sqrt(252) * 100)
    avg_daily_return = float(daily_returns.mean() * 100)

    highest_price = float(df["high"].max())
    lowest_price = float(df["low"].min())

    cumulative = (1 + daily_returns).cumprod()
    peak = cumulative.cummax()
    drawdown = (cumulative / peak) - 1
    max_drawdown = float(drawdown.min() * 100)

    if volatility < 15:
        risk_level = "Low"
    elif volatility < 30:
        risk_level = "Medium"
    else:
        risk_level = "High"

    latest_trend = str(df["trend"].iloc[-1])
    latest_signal = str(df["signal"].iloc[-1])

    return {
        "latest_close": round(latest_close, 2),
        "highest_price": round(highest_price, 2),
        "lowest_price": round(lowest_price, 2),
        "overall_return_percent": round(overall_return, 2),
        "average_daily_return_percent": round(avg_daily_return, 4),
        "volatility_percent": round(volatility, 2),
        "max_drawdown_percent": round(max_drawdown, 2),
        "risk_level": risk_level,
        "trend": latest_trend,
        "signal": latest_signal,
    }