import fastapi
from fastapi.middleware.cors import CORSMiddleware

from .utils import load_configs


cfg = load_configs()
app = fastapi.FastAPI()

from backend.api.users.v1.auth.handlers import router as users_router
app.include_router(users_router)

origins = ["http://localhost:*", ]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)
