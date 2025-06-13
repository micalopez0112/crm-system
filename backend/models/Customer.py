from typing import Optional
from pydantic import BaseModel

class Customer(BaseModel):
    nombre: str
    telefono: str
    direccion: Optional[str] = ""
    ciudad: Optional[str] = ""
    departamento: Optional[str] = ""
    mail: Optional[str] = ""
    rut: Optional[str] = ""
    razon_social: Optional[str] = ""
