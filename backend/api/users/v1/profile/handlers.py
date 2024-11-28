from fastapi import Request, APIRouter, Depends
from typing import Annotated

from backend.api.users.v1 import check_credentials


router = APIRouter(prefix="/api/users/v1/profile", tags=["profile"])

@router.get("/me")
async def get_profile(request: Request, user: Annotated[str, Depends(check_credentials)]):
    return {
        "status": "ok",
        "data": {
            "name": "UserName",
            "email": "user@email.com",
            "age": "unknown",
        }
    }
