from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models, schemas
import os
from dotenv import load_dotenv
import psycopg2
from typing import Optional
from sqlalchemy import String
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
import os




# Load environment variables from .env
load_dotenv()

# Initialize FastAPI app
app = FastAPI()


from fastapi.middleware.cors import CORSMiddleware

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



# Create database tables
models.Base.metadata.create_all(bind=engine)

# Dependency for database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ----------- Routes -----------

@app.post("/customers", response_model=schemas.CustomerOut)
def create_customer(customer: schemas.CustomerCreate, db: Session = Depends(get_db)):
    print(f"Received customer: {customer}")
    db_customer = models.Customer(**customer.dict())
    db.add(db_customer)
    db.commit()
    db.refresh(db_customer)
    return db_customer

from typing import Optional

@app.get("/customers", response_model=list[schemas.CustomerOut])
def list_customers(
    q: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.Customer)
    if q:
        query = query.filter(
            (models.Customer.phone.ilike(f"%{q}%")) |
            (models.Customer.id.cast(String).ilike(f"%{q}%"))
        )
    return query.all()


@app.post("/orders", response_model=schemas.OrderOut)
def create_order(order: schemas.OrderCreate, db: Session = Depends(get_db)):
    print(f"Received order: {order}")  # Print the received order (order)
    db_order = models.Order(**order.dict())
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    db_order.created_at = datetime.now()  # Add this line

    return db_order

@app.get("/orders", response_model=list[schemas.OrderOut])
def list_orders(db: Session = Depends(get_db)):
    return db.query(models.Order).all()

# ----------- Optional DB Connection Test -----------

if __name__ == "__main__":
    USER = os.getenv("USER")
    PASSWORD = os.getenv("PASSWORD")
    HOST = os.getenv("HOST")
    PORT = os.getenv("PORT")
    DBNAME = os.getenv("DBNAME")

    try:
        connection = psycopg2.connect(
            user=USER,
            password=PASSWORD,
            host=HOST,
            port=PORT,
            dbname=DBNAME
        )
        print("✅ Connection successful!")

        cursor = connection.cursor()
        cursor.execute("SELECT NOW();")
        result = cursor.fetchone()
        print("🕒 Current Time:", result)

        cursor.close()
        connection.close()
        print("🔌 Connection closed.")
    except Exception as e:
        print(f"❌ Failed to connect: {e}")
