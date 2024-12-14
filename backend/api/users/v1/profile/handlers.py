from fastapi import Request, APIRouter, Depends, HTTPException
from typing import Annotated
from marshmallow import ValidationError

from backend.api.users.v1 import check_credentials
from backend.models import User, Friends
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


@router.get('/')
async def get_profile_by_id(request: Request, user: Annotated[User, Depends(check_credentials)]):
    profile_id = request.query_params.get('profile_id', None)
    profile = await User.select().where(User.id == profile_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail='profile not found')

    is_friend = await Friends.select().where(
        Friends.friend_id == profile_id,
        Friends.user_id == user.id,
    ).exists()

    return {
        "success": True,
        "data": dict(**SCHEMA.dump(profile), friend=is_friend)
    }

