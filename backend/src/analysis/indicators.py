import pandas as pd
import numpy as np


def add_indicators(df: pd.DataFrame) -> pd.DataFrame:
    """
    Add technical indicators and stock analysis metrics.
    """
    df = df.copy()

    df["daily_return"] = df["close"].pct_change()
    df["cumulative_return"] = (1 + df["daily_return"]).cumprod() - 1

    df["sma_20"] = df["close"].rolling(window=20).mean()
    df["sma_50"] = df["close"].rolling(window=50).mean()
    df["sma_200"] = df["close"].rolling(window=200).mean()

    df["volatility_20"] = df["daily_return"].rolling(window=20).std() * np.sqrt(252)

    df["rolling_high"] = df["high"].rolling(window=20).max()
    df["rolling_low"] = df["low"].rolling(window=20).min()

    df["trend"] = np.where(
        df["sma_20"] > df["sma_50"],
        "Bullish",
        "Bearish"
    )

    df["signal"] = "Hold"
    df.loc[df["sma_20"] > df["sma_50"], "signal"] = "Buy"
    df.loc[df["sma_20"] < df["sma_50"], "signal"] = "Sell"

    return df