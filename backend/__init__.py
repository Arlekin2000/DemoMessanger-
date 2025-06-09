import fastapi
from fastapi.middleware.cors import CORSMiddleware
from .utils import load_configs


cfg = load_configs()

app = fastapi.FastAPI()


from backend.api.users.v1.auth.handlers import router as auth_router
from backend.api.users.v1.profile.handlers import router as profile_router
from backend.api.users.v1.friends.handlers import router as friends_router
from backend.api.users.v1.users_list import router as users_router
from backend.api.users.v1.messages.handlers import router as messages_router
from backend.api.users.v1.cities import router as cities_router
app.include_router(auth_router)
app.include_router(profile_router)
app.include_router(friends_router)
app.include_router(users_router)
app.include_router(messages_router)
app.include_router(cities_router)


origins = [
    'http://localhost:3000',
    'http://localhost:8000',
    'http://127.0.0.1:8000',
    'http://0.0.0.0:8000'
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
from .socket_server import *
