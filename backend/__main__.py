import asyncio
import argparse
import uvicorn

from . import app
from .models import User


def args_parser():
    parser = argparse.ArgumentParser()

    parser.add_argument('-init_db', required=False, action='store_true')
    parser.add_argument('-run', required=False, action='store_true')
    return parser


async def create_db():
    await User.create_table()


if __name__ == "__main__":
    parser = args_parser()
    namespace = parser.parse_args()

    if namespace.init_db:
        asyncio.run(create_db())

    if namespace.run:
        uvicorn.run(app, host='0.0.0.0', port=8000)
