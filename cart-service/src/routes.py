from fastapi import APIRouter, HTTPException, status
from datetime import datetime, timezone
from src.models import CartResponse, AddItemRequest, CartItem
from src.config import get_carts_collection

router = APIRouter()

def format_cart(doc: dict) -> dict:
    return {
        "userId": doc["userId"],
        "items": doc.get("items", []),
        "updatedAt": doc.get("updatedAt", datetime.now(timezone.utc))
    }

@router.get("/cart/{userId}", response_model=CartResponse)
@router.get("/api/cart/{userId}", response_model=CartResponse)
async def get_cart(userId: str):
    carts = get_carts_collection()
    doc = await carts.find_one({"userId": userId})
    if not doc:
        return CartResponse(
            userId=userId,
            items=[],
            updatedAt=datetime.now(timezone.utc)
        )
    return format_cart(doc)

@router.post("/cart/{userId}/items", response_model=CartResponse)
@router.post("/api/cart/{userId}/items", response_model=CartResponse)
async def add_item_to_cart(userId: str, item: AddItemRequest):
    carts = get_carts_collection()
    now = datetime.now(timezone.utc)
    new_item = item.model_dump()

    # Check if cart exists
    existing_cart = await carts.find_one({"userId": userId})

    if not existing_cart:
        # Create new cart document
        new_cart = {
            "userId": userId,
            "items": [new_item],
            "updatedAt": now
        }
        await carts.insert_one(new_cart)
        return format_cart(new_cart)

    # Check if item exists in existing cart
    items = existing_cart.get("items", [])
    item_found = False
    for i in items:
        if i.get("productId") == item.productId:
            i["quantity"] = item.quantity
            i["price"] = item.price
            item_found = True
            break

    if not item_found:
        items.append(new_item)

    await carts.update_one(
        {"userId": userId},
        {"$set": {"items": items, "updatedAt": now}}
    )

    updated_doc = await carts.find_one({"userId": userId})
    return format_cart(updated_doc)

@router.delete("/cart/{userId}/items/{productId}", response_model=CartResponse)
@router.delete("/api/cart/{userId}/items/{productId}", response_model=CartResponse)
async def remove_item_from_cart(userId: str, productId: str):
    carts = get_carts_collection()
    now = datetime.now(timezone.utc)

    existing_cart = await carts.find_one({"userId": userId})
    if not existing_cart:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Cart for user '{userId}' not found"
        )

    await carts.update_one(
        {"userId": userId},
        {
            "$pull": {"items": {"productId": productId}},
            "$set": {"updatedAt": now}
        }
    )

    updated_doc = await carts.find_one({"userId": userId})
    return format_cart(updated_doc)

@router.delete("/cart/{userId}")
@router.delete("/api/cart/{userId}")
async def clear_cart(userId: str):
    carts = get_carts_collection()
    result = await carts.delete_one({"userId": userId})
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Cart for user '{userId}' not found"
        )
    return {"message": "Cart cleared successfully", "userId": userId}
