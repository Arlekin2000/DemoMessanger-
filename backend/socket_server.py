import json, logging
from fastapi import WebSocket, WebSocketDisconnect

from backend import app


logger = logging.getLogger(__name__)


class ConnectionManager:
    def __init__(self):
        self.active_connections: dict[str, WebSocket] = {}

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        params = websocket.path_params
        self.active_connections[params.get("client_id")] = websocket

    def disconnect(self, websocket: WebSocket):
        params = websocket.path_params
        self.active_connections.pop(params.get("client_id"), None)

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def send_message_by_id(self, message: dict, user_id: str, author_id=None):
        conn = self.active_connections.get(user_id)
        if not conn:
            return False

        data = {
            "type": "new_message",
            "from": author_id,
            "message": message,
        }
        await conn.send_text(json.dumps(data))
        return True

    async def broadcast(self, message: str):
        for userid, connection in self.active_connections.items():
            print(f"Broadcasting message to {userid}")
            await connection.send_text(message)


manager = ConnectionManager()


@app.websocket("/dms/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: int):
    await manager.connect(websocket)
    try:
        while 1:
            data = await websocket.receive_text()
            text, recipient = data.split(":")
            await manager.send_message_by_id({"message": text, "uid": recipient}, user_id=recipient)
    except WebSocketDisconnect:
        manager.disconnect(websocket)
