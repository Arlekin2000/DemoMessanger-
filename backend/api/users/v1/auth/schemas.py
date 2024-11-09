import marshmallow as ma


class RegisterLoginSchema(ma.Schema):
    email = ma.fields.Email(required=True)
    password = ma.fields.Str(required=True)
