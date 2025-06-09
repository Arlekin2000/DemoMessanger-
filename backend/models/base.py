from peewee_aio import AIOModel, fields, Manager
import datetime as dt

from backend import cfg


db = Manager(
    cfg.PEEWEE_CONNECTION,
    **cfg.PEEWEE_CONNECTION_PARAMS
)


class BaseModel(AIOModel):
    id: int
    created = fields.DateTimeField(null=True, default=dt.datetime.now)
    updated = fields.DateTimeField(null=True, default=dt.datetime.now)


@db.register
class City(AIOModel):
    id: int
    name = fields.CharField()
    search_name = fields.CharField()
    lat = fields.FloatField()
    lon = fields.FloatField()
