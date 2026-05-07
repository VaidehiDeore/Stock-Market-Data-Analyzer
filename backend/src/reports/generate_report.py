import os
import pandas as pd


def generate_summary_report(ticker: str, summary: dict, output_dir: str = "reports") -> str:
    """
    Generate CSV summary report.
    """
    os.makedirs(output_dir, exist_ok=True)

    report_path = os.path.join(output_dir, f"{ticker}_summary_report.csv")

    report_df = pd.DataFrame([summary])
    report_df.insert(0, "ticker", ticker)

    report_df.to_csv(report_path, index=False)

    return report_path


def generate_excel_report(ticker: str, df: pd.DataFrame, summary: dict, output_dir: str = "reports") -> str:
    """
    Generate Excel report with data and summary.
    """
    os.makedirs(output_dir, exist_ok=True)

    report_path = os.path.join(output_dir, f"{ticker}_analysis_report.xlsx")

    with pd.ExcelWriter(report_path, engine="openpyxl") as writer:
        df.to_excel(writer, sheet_name="Stock Data", index=False)
        pd.DataFrame([summary]).to_excel(writer, sheet_name="Summary", index=False)

    return report_path