from marshmallow import fields
from marshmallow_peewee import ModelSchema

from backend.models import User


class ProfileSchema(ModelSchema):
    id = fields.Integer(dump_only=True)
    email = fields.Email(required=True)
    name = fields.Str(required=False, allow_none=True)
    age = fields.Integer(required=False, allow_none=True)

    class Meta:
        model = User
        fields = ('id', 'email', 'name', 'age')
        dump_only = ('id',)