from marshmallow import ValidationError

from backend.models import User, Friends, City


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


# этот тест был изменён
async def test_profile_schema():
    from .schemas import ProfileSchema
    schema = ProfileSchema()

    city = await City.create(name="Москва", search_name="москва", lat="55.2345", lon="45.44444")
    user = await User.create(
        email="john@gmail.com",
        city=city,
    )

    data = schema.dump(user)
    assert data == {
        "id": user.id,
        "email": user.email,
        "name": user.name,
        "age": user.age,
        "city": {"id": city.id, "name": city.name},
    }

    city2 = await City.create(name="Питер", search_name="питер", lat="56.2345", lon="40.44444")
    data["city"] = str(city2.id)
    data["name"] = "Малкович"
    try:
        schema.load(data.copy())
    except ValidationError as err:
        # в schema поле id помечено как only_dump, поэтому load должен выдать ошибку
        assert "id" in err.messages

    data.pop("id")
    res = schema.load(data.copy())
    assert isinstance(res, User)
    assert res.id is None
    assert res.email == "john@gmail.com"
    assert res.name == "Малкович"
    assert res.age is None



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


async def test_change_profile_city(client):
    user = await User.create(
        email="john@gmail.com",
    )
    await user.set_password("pass1234")

    city = await City.create(
        name="Москва", search_name="москва", lat="55.2345", lon="45.44444"
    )

    # check profile
    res = client.get(
        '/api/users/v1/profile/me',
        headers={"Authorization": f"Bearer {user.token}"}
    )
    assert res.status_code == 200
    json = res.json()
    assert json["success"] == True
    assert json["data"]["email"] == "john@gmail.com"
    assert not json["data"]["city"]

    # change profile
    res = client.post(
        '/api/users/v1/profile/me',
        headers={"Authorization": f"Bearer {user.token}"},
        json={"email": "john@gmail.com", "city": city.id}
    )
    assert res.status_code == 200
    json = res.json()
    assert json["success"] == True
    assert json["data"]["email"] == "john@gmail.com"
    assert json["data"]["city"] == {"id": city.id, "name": city.name}

    # check profile again
    res = client.get(
        '/api/users/v1/profile/me',
        headers={"Authorization": f"Bearer {user.token}"}
    )
    assert res.status_code == 200
    json = res.json()
    assert json["success"] == True
    assert json["data"]["email"] == "john@gmail.com"
    assert json["data"]["city"] == {"id": city.id, "name": city.name}
