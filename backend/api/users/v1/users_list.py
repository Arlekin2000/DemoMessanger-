from fastapi import Request, APIRouter, Depends
from typing import Annotated
from marshmallow import fields
from marshmallow_peewee import ModelSchema

from backend.api.users.v1 import check_credentials
from backend.models import User


router = APIRouter(prefix="/api/users/v1/all", tags=["users_list"])


class UsersListSchema(ModelSchema):
    id = fields.Integer(dump_only=True)
    name = fields.Str(required=True)
    age = fields.Integer(required=False)


@router.get('/')
async def get_users_list(request: Request, user: Annotated[User, Depends(check_credentials)]):
    users = await User.select().where(User.id != user.id)

    # TODO: 2) сделать так, чтобы в каждом профиле был признак is_friend логического типа указывающий
    #  добавлен пользователь в список друзей или нет

    return {
        "success": True,
        "data": UsersListSchema().dump(users, many=True)
    }
