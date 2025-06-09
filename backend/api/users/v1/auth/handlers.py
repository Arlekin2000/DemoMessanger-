import fastapi

from backend.models import User
from .schemas import RegisterSchema, LoginSchema



router = fastapi.APIRouter(prefix="/api/users/v1", tags=["auth"])


@router.post("/login")
async def login(request: fastapi.Request):
    data = await request.json()
    data = LoginSchema().load(data)

    user = await User.select().where(User.email == data["email"]).first()
    if not user:
        raise fastapi.HTTPException(status_code=404, detail="User not found")

    if not user.check_password(data["password"]):
        raise fastapi.HTTPException(status_code=401, detail="Incorrect password")

    return {"success": True, "id": user.id, "token": user.token}


@router.post("/register")
async def register(request: fastapi.Request):
    data = await request.json()
    data = RegisterSchema().load(data)

    user = await User.select().where(User.email == data["email"]).first()
    if not user:
        user = await User.create(email=data["email"], city_id=data["city"])
        await user.set_password(data["password"])

    return {"success": True, "id": user.id, "token": user.token}

