from peewee_aio import fields

from .base import BaseModel
from .user import User
from backend.models import db


@db.register
class Messages(BaseModel):
    chat_id = fields.CharField(unique=False)
    message_id = fields.IntegerField(unique=False)
    user = fields.ForeignKeyField(
        model=User,
        field=User.id,
        backref="messages",
        on_delete="CASCADE"
    )
    companion = fields.ForeignKeyField(
        model=User,
        field=User.id
    )
    text = fields.TextField()
    is_hidden = fields.BooleanField(default=False)

    @staticmethod
    def make_chat_id(first_user_id, second_user_id):
        ids = sorted([int(first_user_id), int(second_user_id)])
        return f"{ids[0]}{ids[1]}"

    @classmethod
    async def get_last_id(cls, chat_id):
        """Get last message id for chat"""
        last_message = await cls.select().where(cls.chat_id == chat_id).order_by(cls.created.desc()).first()
        if not last_message:
            return None

        return last_message.message_id


@db.register
class LastReadMessage(BaseModel):
    user = fields.ForeignKeyField(
        model=User,
        field=User.id,
        backref="last_read",
        on_delete="CASCADE"
    )
    chat_id = fields.CharField()
    message_id = fields.IntegerField()

    class Meta:
        indexes = ((("user_id", "chat_id"), True),)
