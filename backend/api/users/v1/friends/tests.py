from backend.models import Friends, User


async def test_friends_list(app, client):
    user = await User.create(
        email="john@gmail.com",
    )
    res = client.get(
        '/api/users/v1/friends',
        headers={"Authorization": f"Bearer {user.token}"}
    )
    assert res.status_code == 200
    json = res.json()
    assert json["success"]
    assert not json['data']

    friend = await User.create(name="Гвидон", email="john1@gmail.com")
    await Friends.create(user=user, friend=friend)
    friend2 = await User.create(name="Ляпис", email="john2@gmail.com")
    await Friends.create(user=user, friend=friend2)

    res = client.get(
        '/api/users/v1/friends/',
        headers={"Authorization": f"Bearer {user.token}"}
    )
    assert res.status_code == 200
    json = res.json()
    assert json["success"]
    assert json["data"]
    assert len(json["data"]) == 2
    assert json["data"][0]["id"] == friend.id
    assert json["data"][0]["name"] == friend.name
    assert json["data"][1]["id"] == friend2.id
    assert json["data"][1]["name"] == friend2.name


async def test_add_friend(client):
    user = await User.create(
        email="john@gmail.com",
    )

    assert await user.friends.count() == 0

    friend = await User.create(
        name="Гвидон",
        email="john1@gmail.com"
    )

    res = client.post(
        f'/api/users/v1/friends/{friend.id}',
        headers={"Authorization": f"Bearer {user.token}"}
    )
    assert res.status_code == 200
    json = res.json()
    assert json["success"]
    assert json["data"] == {"id": friend.id, "name": friend.name, "age": friend.age}

    assert await user.friends.count() == 1
