import marshmallow as ma


class LoginSchema(ma.Schema):
    email = ma.fields.Email(required=True)
    password = ma.fields.Str(required=True)


class RegisterSchema(ma.Schema):
    email = ma.fields.Email(required=True)
    password = ma.fields.Str(required=True)
    city = ma.fields.Integer(required=True)
