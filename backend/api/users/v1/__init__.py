from fastapi import Depends, HTTPException, status
from jwt.exceptions import DecodeError
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Annotated

from backend.models import User

security = HTTPBearer()


async def check_credentials(credentials: Annotated[HTTPAuthorizationCredentials, Depends(security)]):
    token = credentials.credentials

    try:
        user = await User.load_from_token(token)
    except DecodeError as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Wrong Bearer Token")

    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized User")

    return user
