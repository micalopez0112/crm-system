from pydantic import BaseModel, EmailStr
from typing import Optional
from uuid import UUID
from datetime import datetime

class CustomerCreate(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str]

class CustomerOut(CustomerCreate):
    id: UUID
    created_at: datetime

    class Config:
        from_attributes = True

class OrderCreate(BaseModel):
    customer_id: UUID
    quantity: int
    color: str
    type: str
    logo: str | None = None  # base64 string

class OrderOut(OrderCreate):
    id: UUID
    
    class Config:
        from_attributes = True



