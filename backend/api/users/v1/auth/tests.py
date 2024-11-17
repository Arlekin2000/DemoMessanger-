from backend.models import User


async def test_auth(app, client):
    assert await User.select().count() == 0

    res = client.post(
        '/api/users/v1/login',
        json={"email": "dokvor63@mail.ru", "password": "123"}
    )
    assert res.status_code == 404

    res = client.post(
        '/api/users/v1/register',
        json={"email": "dokvor63@mail.ru", "password": "123"}
    )
    assert res.status_code == 200
    json = res.json()
    assert json["success"]
    assert json["token"]
    # assert json["id"] == 1

    assert await User.select().count() == 1

    res = client.post(
        '/api/users/v1/login',
        json={"email": "dokvor63@mail.ru", "password": "123"}
    )
    assert res.status_code == 200
    json = res.json()
    assert json["success"]
    assert json["token"]
    # assert json["id"] == 1

    assert await User.select().count() == 1
