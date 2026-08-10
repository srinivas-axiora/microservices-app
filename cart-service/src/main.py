from fastapi import FastAPI
from src.routes import router
from src.config import client

app = FastAPI(
    title="Cart Service",
    description="FastAPI + MongoDB microservice for managing shopping carts",
    version="1.0.0"
)

app.include_router(router)

@app.get("/health")
@app.get("/api/cart/health")
async def health():
    db_status = "UNKNOWN"
    try:
        await client.admin.command('ping')
        db_status = "CONNECTED"
    except Exception as e:
        db_status = f"DISCONNECTED: {str(e)}"

    return {
        "status": "UP",
        "database": db_status
    }
