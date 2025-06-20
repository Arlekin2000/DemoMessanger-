import pytest
from fastapi.testclient import TestClient


@pytest.fixture(scope="session")
def app():
    from backend import app
    yield app


@pytest.fixture(scope="session")
def client(app):
    yield TestClient(app)


@pytest.fixture(autouse=True)
async def setup_tests(app):
    """Rollback the database between tests."""
    from backend.models import db, User, Friends, Messages, LastReadMessage

    async with db.transaction() as trans:
        await User.create_table()
        await Friends.create_table()
        await Messages.create_table()
        await LastReadMessage.create_table()
        yield db
        await trans.rollback()
