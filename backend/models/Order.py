from pydantic import BaseModel
from typing import Optional, Union

class Order(BaseModel):
    customer_id: int
    redes: bool
    cantidad: int
    modelo: str
    precio: float
    pedido: str
    senia: Optional[float]
    producto_base64: Optional[str] = None
