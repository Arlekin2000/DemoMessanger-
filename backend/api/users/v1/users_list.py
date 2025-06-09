from fastapi import Request, APIRouter, Depends
import peewee as pw
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
    friend = fields.Boolean(required=False, dump_default=False, load_default=False)


@router.get('/')
async def get_users_list(request: Request, user: Annotated[User, Depends(check_credentials)]):
    friends = ','.join([str(f.friend_id) for f in await user.friends])
    users = (
        await User.select(
            User.id,
            User.name,
            User.age,
            pw.SQL(f'CASE WHEN id IN ({friends}) THEN 1 ELSE 0 END').alias("friend")
        )
        .where(
            User.id != user.id,
        )
    )

    return {
        "success": True,
        "data": UsersListSchema().dump(users, many=True)
    }
