from fastapi import Request, APIRouter, Depends, HTTPException, status
from typing import Annotated

from backend.api.users.v1 import check_credentials
from backend.models import User, Messages, LastReadMessage
from backend.socket_server import manager

from .schemas import MessagesSchema

router = APIRouter(prefix="/api/users/v1/messages", tags=["messages"])

schema = MessagesSchema()


@router.post("/{companion_id}")
async def send_message_to_user(request: Request, user: Annotated[User, Depends(check_credentials)]):
    companion_id = request.path_params.get("companion_id")
    companion = await User.select().where(User.id == companion_id).first()
    if not companion:
        return HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    data = await request.json()
    chat_id = Messages.make_chat_id(companion_id, user.id)
    last_message_id = await Messages.get_last_id(chat_id) or 0

    text = data["message"]
    message = await Messages.insert(
        user=user,
        companion=companion,
        text=text,
        chat_id=chat_id,
        message_id=last_message_id + 1
    ).returning(Messages)

    await manager.send_message_by_id(text, companion_id, author_id=str(user.id))

    await LastReadMessage.insert(
        user_id=user.id,
        chat_id=chat_id,
        message_id=message[0].id
    ).on_conflict(
        conflict_target=(LastReadMessage.user_id, LastReadMessage.chat_id),
        update={LastReadMessage.message_id:message[0].message_id}
    )
    return {"success": True, "message": schema.dump(message[0])}


@router.get("/{companion_id}")
async def get_messages_for_chat(request: Request, user: Annotated[User, Depends(check_credentials)]):
    companion_id = int(request.path_params.get("companion_id"))
    if not await User.select().where(User.id == companion_id).exists():
        return HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    chat_id = Messages.make_chat_id(companion_id, user.id)
    filters = [(Messages.chat_id == chat_id), ]
    last_read = (
        await LastReadMessage.select(LastReadMessage.message_id)
        .where(
            LastReadMessage.user_id == user.id,
            LastReadMessage.chat_id == chat_id,
        ).first()
    )
    if last_read and last_read.message_id >= 15:
        last_id = last_read.message_id
        last_id = last_id - 15 if last_id - 15 >= 0 else last_id
        filters.append((Messages.message_id > last_id,))

    messages = (
        await Messages.select()
        .where(
            *filters,
            ~Messages.is_hidden
        )
        .order_by(Messages.id).limit(30)
    )
    if messages:
        await LastReadMessage.insert(
            user_id=user.id,
            chat_id=chat_id,
            message_id=messages[-1].id
        ).on_conflict(
            conflict_target=(LastReadMessage.user_id, LastReadMessage.chat_id),
            update={LastReadMessage.message_id: messages[-1].message_id}
        )
    print(messages)
    return {"success": True, "messages": schema.dump(messages, many=True)}


@router.get("/{companion_id}/load_more_from/{message_id}")
async def load_more_message(request: Request, user: Annotated[User, Depends(check_credentials)]):
    companion_id = int(request.path_params.get("companion_id"))
    message_id = int(request.path_params.get("message_id"))
    if not await User.select().where(User.id == companion_id).exists():
        return HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    chat_id = Messages.make_chat_id(companion_id, user.id)
    messages = (
        await Messages.select()
        .where(
            Messages.chat_id == chat_id,
            Messages.message_id > message_id - 15 if message_id - 15 >= 0 else message_id,
            ~Messages.is_hidden
        ).order_by(Messages.id).limit(30)
    )
    if messages:
        last_read = (
            await LastReadMessage.select(LastReadMessage.message_id)
            .where(
                LastReadMessage.user_id == user.id,
                LastReadMessage.chat_id == chat_id,
            ).first()
        )
        if last_read and messages[-1].id > last_read.message_id:
            await LastReadMessage.insert(
                user_id=user.id,
                chat_id=chat_id,
                message_id=messages[-1].id
            ).on_conflict(
                conflict_target=(LastReadMessage.user_id, LastReadMessage.chat_id),
                update={LastReadMessage.message_id: messages[-1].message_id},
            )

    return {"success": True, "messages": schema.dump(messages, many=True)}


@router.delete("/{message_id}/{companion_id}")
async def delete_message(request: Request, user: Annotated[User, Depends(check_credentials)]):
    companion_id = int(request.path_params.get("companion_id"))
    message_id = int(request.path_params.get("message_id"))
    chat_id = Messages.make_chat_id(companion_id, user.id)

    message = await Messages.select().where(
        Messages.user_id == user.id,
        Messages.message_id == message_id,
        Messages.chat_id == chat_id,
    ).first()

    if not message:
        return HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Message not found."
        )
    message.is_hidden = True
    await message.save()

    return {"success": True}
