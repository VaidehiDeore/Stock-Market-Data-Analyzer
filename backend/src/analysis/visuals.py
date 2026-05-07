import os
import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd


def save_charts(df: pd.DataFrame, ticker: str, output_dir: str = "outputs/charts") -> dict:
    """
    Save important stock analysis charts.
    """
    os.makedirs(output_dir, exist_ok=True)

    paths = {}

    plt.figure(figsize=(12, 6))
    plt.plot(df["date"], df["close"], label="Close Price")
    plt.title(f"{ticker} Stock Price Trend")
    plt.xlabel("Date")
    plt.ylabel("Close Price")
    plt.legend()
    plt.tight_layout()
    price_path = os.path.join(output_dir, f"{ticker}_price_trend.png")
    plt.savefig(price_path)
    plt.close()
    paths["price_trend"] = price_path

    plt.figure(figsize=(12, 6))
    plt.plot(df["date"], df["close"], label="Close Price")
    plt.plot(df["date"], df["sma_20"], label="SMA 20")
    plt.plot(df["date"], df["sma_50"], label="SMA 50")
    plt.title(f"{ticker} Moving Average Analysis")
    plt.xlabel("Date")
    plt.ylabel("Price")
    plt.legend()
    plt.tight_layout()
    ma_path = os.path.join(output_dir, f"{ticker}_moving_average.png")
    plt.savefig(ma_path)
    plt.close()
    paths["moving_average"] = ma_path

    plt.figure(figsize=(12, 6))
    plt.plot(df["date"], df["daily_return"])
    plt.title(f"{ticker} Daily Returns")
    plt.xlabel("Date")
    plt.ylabel("Daily Return")
    plt.tight_layout()
    returns_path = os.path.join(output_dir, f"{ticker}_daily_returns.png")
    plt.savefig(returns_path)
    plt.close()
    paths["daily_returns"] = returns_path

    plt.figure(figsize=(10, 6))
    sns.histplot(df["daily_return"].dropna(), bins=40, kde=True)
    plt.title(f"{ticker} Return Distribution")
    plt.xlabel("Daily Return")
    plt.ylabel("Frequency")
    plt.tight_layout()
    dist_path = os.path.join(output_dir, f"{ticker}_return_distribution.png")
    plt.savefig(dist_path)
    plt.close()
    paths["return_distribution"] = dist_path

    plt.figure(figsize=(12, 6))
    plt.bar(df["date"], df["volume"])
    plt.title(f"{ticker} Volume Analysis")
    plt.xlabel("Date")
    plt.ylabel("Volume")
    plt.tight_layout()
    volume_path = os.path.join(output_dir, f"{ticker}_volume.png")
    plt.savefig(volume_path)
    plt.close()
    paths["volume"] = volume_path

    return paths