import datetime as dt
from marshmallow import pre_dump, post_dump
from marshmallow_peewee import ModelSchema

from backend.models import Messages


class MessagesSchema(ModelSchema):
    class Meta:
        model = Messages
        dump_only = ('id',)

    @pre_dump
    def process_datetime(self, obj, **kwargs):
        if isinstance(obj.created, int):
            created = dt.datetime.fromtimestamp(obj.created // 1000)
            obj.created = created

        if isinstance(obj.updated, int):
            updated = dt.datetime.fromtimestamp(obj.updated // 1000)
            obj.updated = updated

        return obj

    @post_dump
    def post_process_datetime(self, data, **kwargs):
        date, time = data["created"].split('T')
        time, _ = time.split(".")
        data["created"] = f"{date} {time[:5]}"
        return data
