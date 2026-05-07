import pandas as pd


def clean_stock_data(df: pd.DataFrame) -> pd.DataFrame:
    """
    Clean stock market data.
    """
    df = df.copy()

    df.columns = [str(col).lower().replace(" ", "_") for col in df.columns]

    if "date" not in df.columns:
        raise ValueError("Date column is missing.")

    required_columns = ["open", "high", "low", "close", "volume"]

    for col in required_columns:
        if col not in df.columns:
            raise ValueError(f"{col} column is missing.")

    df["date"] = pd.to_datetime(df["date"])
    df = df.drop_duplicates()
    df = df.sort_values("date")

    numeric_columns = ["open", "high", "low", "close", "volume"]

    for col in numeric_columns:
        df[col] = pd.to_numeric(df[col], errors="coerce")

    df = df.dropna(subset=["date", "open", "high", "low", "close", "volume"])

    df = df[df["close"] > 0]

    return df