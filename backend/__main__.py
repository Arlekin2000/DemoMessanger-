import asyncio
import argparse
import json
import uvicorn

from . import app
from .models import User, Friends, City


def args_parser():
    parser = argparse.ArgumentParser()

    parser.add_argument('-init_db', required=False, action='store_true')
    parser.add_argument('-run', required=False, action='store_true')
    return parser


async def create_db():
    await User.create_table()
    await Friends.create_table()
    await City.create_table()
    with open("cities.json", "r") as file:
        data = json.load(file)
        for name, coords in data.items():
            await City.insert(name=name, search_name=name.lower(), **coords)
    for city in await City.select():
        print(city.id, city.name, city.lat, city.lon)

if __name__ == "__main__":
    parser = args_parser()
    namespace = parser.parse_args()

    if namespace.init_db:
        asyncio.run(create_db())

    if namespace.run:
        uvicorn.run(app, host='0.0.0.0', port=8000)
