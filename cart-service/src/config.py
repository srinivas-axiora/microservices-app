import os

MONGO_URI = os.getenv("MONGO_URI")
if not MONGO_URI:
    mongo_user = os.getenv("MONGO_USER")
    mongo_pass = os.getenv("MONGO_PASSWORD")
    mongo_host = os.getenv("MONGO_HOST", "mongo_cart")
    mongo_port = os.getenv("MONGO_PORT", "27017")
    mongo_db = os.getenv("MONGO_DB", "cartdb")
    if mongo_user and mongo_pass:
        MONGO_URI = f"mongodb://{mongo_user}:{mongo_pass}@{mongo_host}:{mongo_port}/{mongo_db}?authSource=admin"
    else:
        MONGO_URI = f"mongodb://{mongo_host}:{mongo_port}/{mongo_db}"

from motor.motor_asyncio import AsyncIOMotorClient

client = AsyncIOMotorClient(MONGO_URI)

def get_database():
    db_name = os.getenv("MONGO_DB", "cartdb")
    return client.get_database(db_name)

def get_carts_collection():
    db = get_database()
    return db["carts"]
