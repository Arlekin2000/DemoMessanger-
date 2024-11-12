import hashlib
import jwt
from peewee_aio import fields
from peewee_enum_field import EnumField
from enum import Enum

from .base import BaseModel
from backend.models import db


class Genders(Enum):
    male = 1
    female = 2


SECRET = "secret_key"


@db.register
class User(BaseModel):
    name = fields.CharField(null=True)
    age = fields.IntegerField(null=True)
    gender = EnumField(Genders, null=True)
    email = fields.CharField(unique=True, null=False)
    password_hash = fields.CharField(null=True)

    @property
    def token(self):
        return jwt.encode({"id":self.id, "email":self.email}, SECRET, algorithm="HS256")

    @classmethod
    async def load_from_token(cls, token):
        payload = jwt.decode(token, SECRET, algorithms=["HS256"])
        return (
            await cls.select()
            .where(cls.id == payload["id"], cls.email == payload["email"])
            .first()
        )

    async def set_password(self, password:str):
        self.password_hash = hashlib.sha256(password.encode('utf-8')).hexdigest()
        await self.save()
        return True

    def check_password(self, password:str):
        phash = hashlib.sha256(password.encode('utf-8')).hexdigest()
        return phash == self.password_hash
