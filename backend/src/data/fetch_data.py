import os
import pandas as pd
import yfinance as yf


def fetch_stock_data(ticker: str, start_date: str, end_date: str) -> pd.DataFrame:
    """
    Fetch stock data from Yahoo Finance.
    """
    try:
        df = yf.download(ticker, start=start_date, end=end_date, auto_adjust=False)

        if df.empty:
            raise ValueError("No data found for this ticker.")

        df.reset_index(inplace=True)

        if isinstance(df.columns, pd.MultiIndex):
            df.columns = [col[0] for col in df.columns]

        df.columns = [str(col).lower().replace(" ", "_") for col in df.columns]

        if "adj_close" not in df.columns and "adj close" in df.columns:
            df.rename(columns={"adj close": "adj_close"}, inplace=True)

        return df

    except Exception as e:
        raise Exception(f"Error fetching stock data: {e}")


def load_csv_data(file_path: str) -> pd.DataFrame:
    """
    Load stock data from CSV file.
    Expected columns: Date, Open, High, Low, Close, Volume
    """
    if not os.path.exists(file_path):
        raise FileNotFoundError("CSV file not found.")

    df = pd.read_csv(file_path)
    df.columns = [str(col).lower().replace(" ", "_") for col in df.columns]

    return df