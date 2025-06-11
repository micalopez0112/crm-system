from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from typing import Optional
from dotenv import load_dotenv
import os
import gspread
from oauth2client.service_account import ServiceAccountCredentials

# Load environment variables from .env
load_dotenv()

# Initialize FastAPI app
app = FastAPI()

# Enable CORS
origins = [
    os.getenv("ORIGIN"),
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Google Sheets setup
def get_sheet():
    scope = [
        "https://spreadsheets.google.com/feeds",
        "https://www.googleapis.com/auth/drive"
    ]
    creds_path = os.getenv("GOOGLE_SHEETS_CREDENTIALS")
    spreadsheet_id = os.getenv("SPREADSHEET_ID")

    if not creds_path or not spreadsheet_id:
        raise Exception("Missing Google Sheets credentials or spreadsheet ID.")

    creds = ServiceAccountCredentials.from_json_keyfile_name(creds_path, scope)
    client = gspread.authorize(creds)
    sheet = client.open_by_key(spreadsheet_id).sheet1  # Use .worksheet("Sheet1") if needed
    return sheet

# ----------- Routes -----------

@app.get("/customers")
def list_customers(q: Optional[str] = Query(None)):
    sheet = get_sheet()
    records = sheet.get_all_records()  # List of 
    
    print(records)

    if q:
        filtered = [
            r for r in records
            if q.lower() in str(r.get("Nombre", "")).lower()
            or q.lower() in str(r.get("Mail", "")).lower()
            or q.lower() in str(r.get("Telefono", "")).lower()
        ]
    else:
        filtered = records

    # Only return address info for printing
    result = [
        {
            "name": r.get("Nombre"),
            "phone": r.get("Telefono"),
            "direction": r.get("Direccion"),
            "city": r.get("Ciudad"),
            "department": r.get("Departamento")
        }
        for r in filtered
    ]
    return result

@app.get("/print_label", response_class=HTMLResponse)
def print_label(q: Optional[str] = Query(None)):
    sheet = get_sheet()
    records = sheet.get_all_records()

    # Search for matching customer
    customer = None
    for r in records:
        if q and (
            q.lower() in str(r.get("Nombre", "")).lower()
            or q.lower() in str(r.get("Mail", "")).lower()
            or q.lower() in str(r.get("Telefono", "")).lower()
        ):
            customer = r
            break

    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")

    # Render printable HTML
    html = f"""
    <html>
    <head><title>Shipping Label</title></head>
    <body style="font-family:sans-serif;padding:20px;">
        <h2>Shipping Label</h2>
        <p><strong>Name:</strong> {customer.get('Nombre')}</p>
        <p><strong>Name:</strong> {customer.get('Telefono')}</p>
        <p><strong>Direction:</strong> {customer.get('Direccion')}</p>
        <p><strong>City:</strong> {customer.get('Ciudad')}</p>
        <p><strong>Department:</strong> {customer.get('Departamento')}</p>
    </body>
    </html>
    """
    return HTMLResponse(content=html)

# ----------- Optional Root Route -----------

@app.get("/")
def root():
    return {"message": "Google Sheets Customer Lookup API"}
