from peewee_aio import AIOModel, fields, Manager
import datetime as dt

from backend import ROOT


db = Manager(
    f"aiosqlite:///{ROOT}/db.sqlite"
)


class BaseModel(AIOModel):
    id: int
    created = fields.DateTimeField(null=True, default=dt.datetime.now)
    updated = fields.DateTimeField(null=True, default=dt.datetime.now)
