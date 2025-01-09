from fastapi import Request, APIRouter, Depends
from typing import Annotated

from backend.api.users.v1 import check_credentials
from backend.models import User

router = APIRouter(prefix="/api/users/v1/messages", tags=["messages"])


@router.get("/")
async def get_messages(request: Request, user: Annotated[User, Depends(check_credentials)]):


    return {
        "success": True,
        "data": {}
    }
