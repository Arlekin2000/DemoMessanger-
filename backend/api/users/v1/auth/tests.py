from backend.models import User


async def test_auth(app, client):
    assert await User.select().count() == 0

    res = client.post(
        "/api/users/v1/login",
        json={"email": "dokvor63@mail.ru", "password": "123"},
    )
    assert res.status_code == 200
