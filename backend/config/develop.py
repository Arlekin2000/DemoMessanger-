from pathlib import Path

ROOT = Path(__file__).parent.parent.parent.absolute()

ENV = "develop"

PEEWEE_CONNECTION = f"aiosqlite:///{ROOT}/db.sqlite"
PEEWEE_CONNECTION_PARAMS = {
    "pragmas": [("foreign_keys", "ON"), ("journal_mode", "wal"), ("synchronous", "normal")]
}
