from marshmallow import fields
from marshmallow_peewee import ModelSchema

from backend.models import User


class FriendsSchema(ModelSchema):
    id = fields.Integer()
    name = fields.Str(required=False, allow_none=True)
    age = fields.Integer(required=False, allow_none=True)

    class Meta:
        model = User
        fields = ('id', 'name', 'age')
        dump_only = ('id',)