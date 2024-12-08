from fastapi import Request, APIRouter, Depends, HTTPException, status
from typing import Annotated
from peewee import IntegrityError

from backend.api.users.v1 import check_credentials
from backend.models import User, Friends
from .schemas import FriendsSchema

router = APIRouter(prefix="/api/users/v1/friends", tags=["friends"])


@router.get("/")
async def get_friends(request: Request, user: Annotated[User, Depends(check_credentials)]):
    friends = (
        await User.select()
        .join(Friends, on=Friends.user_id == user.id)
        .where(User.id == Friends.friend)
    )
    return {
        "success": True,
        "data": FriendsSchema().dump(friends, many=True)
    }


@router.post('/{id}')
async def add_friend(request: Request, user: Annotated[User, Depends(check_credentials)]):
    friend_id = request.path_params.get('id')
    friend = await User.select().where(User.id == friend_id).first()
    if not friend:
        return HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Friend not found"
        )

    try:
        await Friends.insert(user=user, friend=friend)
    except IntegrityError:
        raise HTTPException(status_code=400, detail="Friend already exists")

    return {
        "success": True,
        "data": FriendsSchema().dump(friend)
    }