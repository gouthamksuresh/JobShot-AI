"""
Google Sheets export — pushes application data on demand.
No live sync. No OAuth headache. Simple push when you want it.

Setup (one time):
1. Go to console.cloud.google.com
2. Create project → Enable Google Sheets API
3. Create Service Account → Download JSON key
4. Set GOOGLE_SERVICE_ACCOUNT_JSON in .env (path to the JSON file)
5. Create a Google Sheet → share it with the service account email
6. Set GOOGLE_SHEET_ID in .env
"""

import os, json
from datetime import datetime

SHEET_ID = os.getenv("GOOGLE_SHEET_ID", "")
SERVICE_ACCOUNT_PATH = os.getenv("GOOGLE_SERVICE_ACCOUNT_JSON", "")

def export_to_sheets(apps: list) -> str:
    """Push all applications to Google Sheets. Returns sheet URL."""
    if not SHEET_ID or not SERVICE_ACCOUNT_PATH:
        raise Exception("Google Sheets not configured. Set GOOGLE_SHEET_ID and GOOGLE_SERVICE_ACCOUNT_JSON in .env")

    try:
        import gspread
        from google.oauth2.service_account import Credentials

        scopes = [
            "https://www.googleapis.com/auth/spreadsheets",
            "https://www.googleapis.com/auth/drive"
        ]
        creds = Credentials.from_service_account_file(SERVICE_ACCOUNT_PATH, scopes=scopes)
        client = gspread.authorize(creds)
        sheet = client.open_by_key(SHEET_ID).sheet1

        # Clear and write header
        sheet.clear()
        headers = ["Company","Role","HR Email","Status","Applied At","Job URL"]
        sheet.append_row(headers)

        # Write data
        for app in apps:
            sheet.append_row([
                app.get("company",""),
                app.get("role",""),
                app.get("hr_email",""),
                app.get("status",""),
                app.get("applied_at","")[:10] if app.get("applied_at") else "",
                app.get("job_url",""),
            ])

        return f"https://docs.google.com/spreadsheets/d/{SHEET_ID}"

    except ImportError:
        raise Exception("Install gspread: pip install gspread google-auth")
    except Exception as e:
        raise Exception(f"Sheets export failed: {e}")
