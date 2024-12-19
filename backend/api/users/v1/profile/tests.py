from marshmallow import ValidationError

from backend.models import User, Friends


async def test_my_profile(app, client):
    res = client.get(
        '/api/users/v1/profile/me',
        headers={"Authorization": "Bearer SOME_TOKEN"}
    )
    assert res.status_code == 401

    user = await User.create(
        name="Джон Малкович",
        email="john@gmail.com",
    )
    await user.set_password("pass1234")

    res = client.get(
        '/api/users/v1/profile/me',
        headers={"Authorization": f"Bearer {user.token}"}
    )
    assert res.status_code == 200


async def test_my_profile_edit(app, client):
    user = await User.create(
        email="john@gmail.com",
    )
    await user.set_password("pass1234")

    res = client.get(
        '/api/users/v1/profile/me',
        headers={"Authorization": f"Bearer {user.token}"}
    )
    assert res.status_code == 200
    json = res.json()
    assert json["success"] == True
    assert json["data"]["email"] == "john@gmail.com"
    assert json["data"]["name"] is None
    assert json["data"]["age"] is None

    res = client.post(
        '/api/users/v1/profile/me',
        headers={"Authorization": f"Bearer {user.token}"},
        json={"email": "john@gmail.com", "name": "Малкович", "age": 55}
    )
    json = res.json()
    assert json["success"] == True
    assert json["data"]["email"] == "john@gmail.com"
    assert json["data"]["name"] == "Малкович"
    assert json["data"]["age"] == 55

    assert await User.select().count() == 1
    user = await User.select().first()
    assert user.email == "john@gmail.com"
    assert user.name == "Малкович"
    assert user.age == 55


async def test_profile_schema():
    from .schemas import ProfileSchema
    schema = ProfileSchema()

    user = await User.create(
        email="john@gmail.com",
    )

    data = schema.dump(user)
    assert data == {
        "id": user.id,
        "email": user.email,
        "name": user.name,
        "age": user.age,
    }

    try:
        schema.load(data)
    except ValidationError as err:
        assert "id" in err.messages

    data.pop("id")
    data["name"] = "Малкович"
    data = schema.load(data)
    assert isinstance(data, User)
    assert data.id is None
    assert data.email == "john@gmail.com"
    assert data.name == "Малкович"
    assert data.age is None


async def test_my_profile_edit_with_wrong_data(app, client):
    user = await User.create(
        email="john@gmail.com",
    )
    await user.set_password("pass1234")

    res = client.post(
        '/api/users/v1/profile/me',
        headers={"Authorization": f"Bearer {user.token}"},
        json={"email": "john@gmail.com", "name": "Малкович", "age": 55, "id": 2}
    )
    assert res.status_code == 400


async def test_get_profile_by_id(client):
    user1 = await User.create(
        email="john@gmail.com",
    )
    user2 = await User.create(
        email="tom@gmail.com",
    )
    friends = await Friends.create(
        user=user1,
        friend=user2
    )

    res = client.get(
        '/api/users/v1/profile',
        headers={"Authorization": f"Bearer {user1.token}"}
    )
    assert res.status_code == 404

    res = client.get(
        '/api/users/v1/profile?profile_id=2',
        headers={"Authorization": f"Bearer {user1.token}"}
    )
    assert res.status_code == 200
    json = res.json()
    assert json["success"]
    assert json['data']["id"] == 2
    assert json["data"]["email"] == "tom@gmail.com"
    assert json["data"]["name"] is None
    assert json["data"]["age"] is None
    assert json['data']["friend"]
