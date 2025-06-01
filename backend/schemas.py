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
        orm_mode = True

class OrderCreate(BaseModel):
    customer_id: UUID
    color: str
    type: str
    quantity: int
    image_url: Optional[str]

class OrderOut(OrderCreate):
    id: UUID
    status: str
    created_at: datetime

    class Config:
        orm_mode = True
