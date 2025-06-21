from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
from dotenv import load_dotenv
import os
import json
import base64
from models.Customer import Customer
import gspread
from oauth2client.service_account import ServiceAccountCredentials
from models.Order import Order
from datetime import datetime

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
def get_sheet(sheet_name="CLIENTES"):
    scope = [
        "https://spreadsheets.google.com/feeds",
        "https://www.googleapis.com/auth/drive"
    ]
    b64_creds = os.getenv("GOOGLE_SHEETS_CREDENTIALS_B64")
    creds_json = base64.b64decode(b64_creds).decode()
    spreadsheet_id = os.getenv("SPREADSHEET_ID")

    if not creds_json or not spreadsheet_id:
        raise Exception("Missing Google Sheets credentials JSON or spreadsheet ID.")

    # Parse the JSON string from the environment variable
    creds_dict = json.loads(creds_json)
    creds = ServiceAccountCredentials.from_json_keyfile_dict(creds_dict, scope)

    client = gspread.authorize(creds)
    sheet = client.open_by_key(spreadsheet_id).worksheet(sheet_name)
    return sheet

# ----------- Routes -----------

@app.get("/")
def root():
    return {"message": "Google Sheets Customer Lookup API"}

sheets_fields = {
    "id": "ID",
    "name": "NOMBRE",
    "phone": "TELEFONO",
    "email": "MAIL",
    "direction": "DIRECCION",
    "city": "CIUDAD",
    "department": "DEPARTAMENTO",
    "rut": "RUT",
    "company": "RAZON SOCIAL"
}

from typing import Optional
from fastapi import FastAPI, Query

@app.get("/customers")
def list_customers(
    q: Optional[str] = Query(None),
    id: Optional[str] = Query(None)
):
    sheet = get_sheet()
    records = sheet.get_all_records()

    if id:
        # Buscar solo por ID exacto
        filtered = [r for r in records if str(r.get("ID", "")).strip() == id.strip()]
    elif q:
        # Búsqueda general
        q_lower = q.lower()
        filtered = [
            r for r in records
            if q_lower in str(r.get("NOMBRE", "")).lower()
            or q_lower in str(r.get("RAZON SOCIAL", "")).lower()
            or q_lower in str(r.get("TELEFONO", "")).lower()
            or q_lower in str(r.get("ID", "")).lower()
        ]
    else:
        filtered = records

    result = [
        {key: r.get(sheet_key, "") for key, sheet_key in sheets_fields.items()}
        for r in filtered
    ]
    return result



@app.post("/customer")
def add_customer(customer: Customer):
    sheet = get_sheet()

    all_rows = sheet.get_all_values()
    next_id = len(all_rows) 

    print(customer)
    customer_dict = {
        "NOMBRE": customer.nombre,
        "RAZON SOCIAL": customer.company,
        "RUT": customer.rut,
        "DIRECCION": customer.direccion,
        "TELEFONO": customer.telefono,
        "CIUDAD": customer.ciudad,
        "DEPARTAMENTO": customer.departamento,
        "MAIL": customer.mail,
    }

    headers = all_rows[0]
    new_row = [next_id] + [customer_dict.get(col, "") for col in headers[1:]]

    try:
        sheet.append_row(new_row)
        return {"message": "Customer added successfully", "id": next_id}
    except Exception as e:
        return {"error": str(e)}

@app.post("/order")
def create_order(order: Order):
    from datetime import datetime

    sheet = get_sheet("PULSERAS")

    # Obtener todos los valores
    values = sheet.get_all_values()

    # Buscar encabezado "FECHA" para ubicar la tabla
    try:
        header_row_idx = next(i for i, row in enumerate(values) if "FECHA" in row)
    except StopIteration:
        return {"error": "No se encontró la tabla 'Pulseras 2025'"}

    # Determinar la siguiente fila disponible dentro del rango de la tabla
    data_start_idx = header_row_idx + 1
    data_rows = values[data_start_idx:]

    # Encontrar la primera fila vacía después del header
    next_row_idx = data_start_idx + len(data_rows)

    # Buscar cliente por ID
    customer_sheet = get_sheet("CLIENTES")
    customers = customer_sheet.get_all_records()
    customer = next((c for c in customers if str(c.get("ID", "")) == str(order.customer_id)), None)

    if not customer:
        return {"error": "Cliente no encontrado"}

    fecha = datetime.now().strftime("%d/%m/%Y")
    nombre = customer.get("NOMBRE", "")
    telefono = customer.get("TELEFONO", "")

    nueva_fila = [
        fecha,
        nombre,
        telefono,
        True if order.redes else False,
        str(order.cantidad),
        order.modelo,
        str(order.precio),
        order.pedido,
        # order.producto_base64 or "",
    ]

    try:
        sheet.insert_row(nueva_fila, index=next_row_idx + 1)
        return {"message": "Pedido guardado correctamente"}
    except Exception as e:
        return {"error": str(e)}

