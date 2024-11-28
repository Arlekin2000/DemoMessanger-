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
    from backend.models import db, User

    async with db.transaction() as trans:
        await User.create_table()
        yield db
        await trans.rollback()
