from marshmallow import fields, pre_load
from marshmallow_peewee import ModelSchema, fields as peewee_fields

from backend.models import User, City


class UserCitySchema(ModelSchema):
    id = fields.Integer()
    name = fields.String()

    class Meta:
        model = City
        fields = ("id", "name")


class ProfileSchema(ModelSchema):
    id = fields.Integer(dump_only=True)
    email = fields.Email(required=True)
    name = fields.Str(required=False, allow_none=True)
    age = fields.Integer(required=False, allow_none=True)
    city = peewee_fields.FKNested(UserCitySchema)

    class Meta:
        model = User
        fields = ('id', 'email', 'name', 'age', 'city')
        string_keys = True

    @pre_load
    def check_city_is_id(self, data, **kwargs):
        if data.get("city"):
            data["city"] = {'id': int(data.pop("city"))}

        return data

# + 1. отрефакторить профиль на фронте (сделать одно хранилище для данных профиля)
# + 2. сделать подгрузку городов по фильтру названия
# 3. добавить api для поиска ...
# 4. сделать загрузку изображений
