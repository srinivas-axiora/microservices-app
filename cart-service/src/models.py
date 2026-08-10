from pydantic import BaseModel, Field
from typing import List
from datetime import datetime

class CartItem(BaseModel):
    productId: str
    quantity: int = Field(gt=0, description="Quantity must be greater than 0")
    price: float = Field(ge=0.0, description="Price must be non-negative")

class AddItemRequest(BaseModel):
    productId: str
    quantity: int = Field(gt=0, description="Quantity must be greater than 0")
    price: float = Field(ge=0.0, description="Price must be non-negative")

class CartResponse(BaseModel):
    userId: str
    items: List[CartItem] = []
    updatedAt: datetime
