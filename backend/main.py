from datetime import datetime
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from typing import Optional
from dotenv import load_dotenv
import os
import json
import base64
from models.Customer import Customer
from oauth2client.service_account import ServiceAccountCredentials
from models.Order import Order
import io
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseUpload
import gspread

IMG_HEIGHT = 50
IMG_WIDTH = 300
COLUMNS = {
    "FECHA": 1,
    "ID_CLIENTE": 2,
    "NOMBRE": 3,
    "TELEFONO": 4,
    "REDES": 5,
    "CANTIDAD": 6,
    "MODELO": 7,
    "COLOR": 8,
    "PRECIO_U": 9,
    "PEDIDO": 10,
    "PRODUCTO": 11,
    "IMPORTE": 12,
    "SENA": 13,
    "SALDO": 14,
    "ENTREGA": 15,
}


# Load environment variables from .env
load_dotenv()

# Initialize FastAPI apps
app = FastAPI()  # Main app for static files
api_app = FastAPI(title="CRM API")  # API app for all endpoints

# Enable CORS
origins = [
    os.getenv("ORIGIN"),
    "http://localhost:8000",
    "*",  # Allow all origins for testing
]

# Add CORS middleware to the API app
api_app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API root endpoint
@api_app.get("/")
def root():
    return {"message": "CRM System API"}

# Mount the API under /api
app.mount("/api", api_app)

# Then mount static files at root
static_files_path = os.path.abspath("../frontend/dist")
print(f"Serving static files from: {static_files_path}")
if not os.path.exists(static_files_path):
    print(f"WARNING: Static files directory not found at {static_files_path}")

app.mount("/", StaticFiles(directory=static_files_path, html=True), name="frontend")

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

@api_app.get("/")
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


@api_app.get("/customers")
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

@api_app.get("/customers-list")
def list_customers(
    q: Optional[str] = Query(None),
    id: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1)
):
    sheet = get_sheet()
    records = sheet.get_all_records()

    if id:
        filtered = [r for r in records if str(r.get("ID", "")).strip() == id.strip()]
    elif q:
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

    # Pagination
    start = (page - 1) * limit
    end = start + limit
    paginated = result[start:end]

    return {
        "data": paginated,
        "total": len(result),
        "page": page,
        "limit": limit
    }



@api_app.post("/customer")
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


@api_app.post("/order")
def create_order(order: Order):
    sheet = get_sheet("PULSERAS")
    customer_sheet = get_sheet("CLIENTES")
    customers = customer_sheet.get_all_records()

    customer = next((c for c in customers if str(c.get("ID", "")) == str(order.customer_id)), None)
    if not customer:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")

    fecha = datetime.now().strftime("%d/%m/%Y")
    id_cliente = customer.get("ID", "")
    nombre = customer.get("NOMBRE", "")
    telefono = customer.get("TELEFONO", "")

    try:
        total = order.cantidad * order.precio

        all_rows = sheet.get_all_values()
        last_order_row_index = 0
        for i, row in enumerate(all_rows):
            if row and row[0].strip():
                last_order_row_index = i + 1
        row_index = last_order_row_index + 1

        nueva_fila = [
            fecha,                      # FECHA
            id_cliente,                 # ID CLIENTE
            nombre,                     # NOMBRE
            telefono,                   # TELEFONO
            bool(order.redes),          # REDES
            order.cantidad,             # CANTIDAD
            order.modelo,               # MODELO
            order.color,                # COLOR 
            order.precio,               # PRECIO U
            order.pedido,               # PEDIDO
            "",                         # PRODUCTO (se completa luego si hay imagen)
            total,                      # IMPORTE
            order.senia,                # SENA
            "",                         # SALDO (se calcula luego)
            ""                          # ENTREGA
        ]

        sheet.insert_row(nueva_fila, index=row_index)

        if order.producto_base64:
            image_url = upload_image_to_drive(
                order.producto_base64,
                f"pulsera_{order.customer_id}_{datetime.now().timestamp()}.png"
            )
            formula_imagen = f'=IMAGE("{image_url}"; 4; {IMG_HEIGHT}; {IMG_WIDTH})'
            sheet.update_cell(row_index, COLUMNS["PRODUCTO"], formula_imagen)

        formula_restante = f"=L{row_index}-M{row_index}"
        sheet.update_cell(row_index, COLUMNS["SALDO"], formula_restante)

        if float(order.senia) == total:
            col_senia_letter = chr(COLUMNS["SENA"] % 26 + ord('A'))
            print(col_senia_letter)
            sheet.format(f"{col_senia_letter}{row_index}", {
                "backgroundColor": {
                    "red": 1.0,
                    "green": 0.8,
                    "blue": 0.6
                }
            })
        return {"message": "Pedido guardado correctamente"}
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))


def upload_image_to_drive(base64_str: str, filename: str) -> str:
    print(f'aaa {base64_str} {filename}')
    creds_json = base64.b64decode(os.getenv("GOOGLE_SHEETS_CREDENTIALS_B64")).decode()
    creds_dict = json.loads(creds_json)
    print(creds_dict)
    creds = ServiceAccountCredentials.from_json_keyfile_dict(creds_dict, [
        "https://www.googleapis.com/auth/drive"
    ])
    
    print(f'creds {creds}')

    drive_service = build("drive", "v3", credentials=creds)
    print(f'drive_service {drive_service}')

    header, encoded = base64_str.split(",", 1)
    file_bytes = io.BytesIO(base64.b64decode(encoded))

    media = MediaIoBaseUpload(file_bytes, mimetype="image/png", resumable=True)
    file_metadata = {
        "name": filename,
        "parents": [os.getenv("GOOGLE_DRIVE_FOLDER_ID")]
    }

    file = drive_service.files().create(body=file_metadata, media_body=media, fields="id").execute()
    drive_service.permissions().create(fileId=file["id"], body={"type": "anyone", "role": "reader"}).execute()

    return f"https://drive.google.com/uc?export=view&id={file['id']}"

@api_app.get("/orders")
def list_orders(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1)
):
    sheet = get_sheet("PULSERAS")
    records = sheet.get_all_records()

    result = []
    for idx, row in enumerate(records):
        order = {
            "id": idx + 2,
            "date": row.get("FECHA", ""),
            "customer_name": row.get("NOMBRE", ""),
            "phone": row.get("TELEFONO", ""),
            "redes": row.get("REDES", ""),
            "quantity": row.get("CANTIDAD", ""),
            "model": row.get("MODELO", ""),
            "price": row.get("PRECIO U", ""),
            "description": row.get("PEDIDO", ""),
            "logo": row.get("PRODUCTO", ""),
        }
        result.append(order)

    # Pagination
    start = (page - 1) * limit
    end = start + limit
    paginated = result[start:end]

    return {
        "data": paginated,
        "total": len(result),
        "page": page,
        "limit": limit
    }
