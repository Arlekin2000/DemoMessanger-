import fastapi

from backend import app


@app.get("/profile")
async def get_profile(request: fastapi.Request):
    return {
        "status": "ok",
        "data": {
            "name": "UserName",
            "email": "user@email.com",
            "age": "unknown",
        }
    }
