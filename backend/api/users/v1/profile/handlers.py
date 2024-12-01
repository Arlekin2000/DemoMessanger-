from fastapi import Request, APIRouter, Depends, HTTPException
from typing import Annotated
from marshmallow import ValidationError

from backend.api.users.v1 import check_credentials
from backend.models import User
from .schemas import ProfileSchema


router = APIRouter(prefix="/api/users/v1/profile", tags=["profile"])
SCHEMA = ProfileSchema()


@router.get("/me")
async def profile(request: Request, user: Annotated[User, Depends(check_credentials)]):
    return {
        "success": True,
        "data": SCHEMA.dump(user)
    }


@router.post("/me")
async def edit_profile(request: Request, user: Annotated[User, Depends(check_credentials)]):
    json = await request.json()

    try:
        update: User = SCHEMA.load(json)
    except ValidationError as err:
        raise HTTPException(status_code=400, detail=err.messages)

    if user.email == update.email:
        user.name = update.name
        user.age = update.age
        await user.save()

    return {
        "success": True,
        "data": SCHEMA.dump(user)
    }
