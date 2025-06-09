import asyncio
import json
import websockets


async def main():
    async with websockets.connect('ws://localhost:8000/dms/3') as ws:
        while True:
            data = input("Input message: ")
            await ws.send(data)

if __name__ == '__main__':
    asyncio.run(main())
