import pandas as pd
import numpy as np


def run_sma_backtest(df: pd.DataFrame, initial_capital: float = 100000) -> dict:
    """
    Simple SMA 20/50 crossover backtest.
    """
    data = df.copy().dropna(subset=["sma_20", "sma_50", "daily_return"])

    data["position"] = np.where(data["sma_20"] > data["sma_50"], 1, 0)
    data["strategy_return"] = data["position"].shift(1).fillna(0) * data["daily_return"]

    data["portfolio_value"] = initial_capital * (1 + data["strategy_return"]).cumprod()

    final_value = float(data["portfolio_value"].iloc[-1])
    profit_loss = final_value - initial_capital
    roi = (profit_loss / initial_capital) * 100

    trades = int(data["position"].diff().abs().sum())

    return {
        "initial_capital": round(initial_capital, 2),
        "final_value": round(final_value, 2),
        "profit_loss": round(profit_loss, 2),
        "roi_percent": round(roi, 2),
        "trades": trades,
        "dates": data["date"].dt.strftime("%Y-%m-%d").tolist(),
        "portfolio_curve": data["portfolio_value"].round(2).tolist(),
    }