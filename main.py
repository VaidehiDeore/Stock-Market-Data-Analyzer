from backend.src.data.fetch_data import fetch_stock_data, load_csv_data
from backend.src.data.clean_data import clean_stock_data
from backend.src.analysis.indicators import add_indicators
from backend.src.analysis.risk import calculate_risk_summary
from backend.src.analysis.visuals import save_charts
from backend.src.analysis.backtest import run_sma_backtest
from backend.src.reports.generate_report import generate_summary_report, generate_excel_report


def print_summary(ticker: str, summary: dict):
    print("\n" + "=" * 60)
    print(f"📊 FINAL STOCK ANALYSIS SUMMARY: {ticker}")
    print("=" * 60)

    for key, value in summary.items():
        clean_key = key.replace("_", " ").title()
        print(f"{clean_key}: {value}")

    print("=" * 60)


def main():
    print("\n🚀 Stock Market Data Analyzer Started\n")

    mode = input("Choose data source - API or CSV? (api/csv): ").strip().lower()

    ticker = input("Enter stock ticker symbol, example AAPL or RELIANCE.NS: ").strip().upper()

    if mode == "csv":
        file_path = input("Enter CSV file path: ").strip()
        df = load_csv_data(file_path)
    else:
        start_date = input("Enter start date (YYYY-MM-DD): ").strip()
        end_date = input("Enter end date (YYYY-MM-DD): ").strip()
        print("\nFetching stock data...")
        df = fetch_stock_data(ticker, start_date, end_date)

    print("Cleaning data...")
    df = clean_stock_data(df)

    print("Calculating indicators...")
    df = add_indicators(df)

    print("Calculating risk summary...")
    summary = calculate_risk_summary(df)

    print("Running SMA backtest...")
    backtest_result = run_sma_backtest(df)

    summary.update({
        "backtest_final_value": backtest_result["final_value"],
        "backtest_profit_loss": backtest_result["profit_loss"],
        "backtest_roi_percent": backtest_result["roi_percent"],
        "backtest_trades": backtest_result["trades"],
    })

    print("Generating charts...")
    chart_paths = save_charts(df, ticker)

    print("Generating reports...")
    csv_report = generate_summary_report(ticker, summary)
    excel_report = generate_excel_report(ticker, df, summary)

    print_summary(ticker, summary)

    print("\n✅ Charts Generated:")
    for name, path in chart_paths.items():
        print(f"{name}: {path}")

    print("\n✅ Reports Generated:")
    print(f"CSV Report: {csv_report}")
    print(f"Excel Report: {excel_report}")

    print("\n🎯 Analysis completed successfully!")


if __name__ == "__main__":
    main()