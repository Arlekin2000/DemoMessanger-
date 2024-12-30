from backend.models import User, Friends


async def test_users_list(client):
    user1 = await User.create(name="u1", email="em1@mail.com")
    user2 = await User.create(name="u2", email="em2@mail.com")
    user3 = await User.create(name="u3", email="em3@mail.com")

    assert await User.select().count() == 3

    res = client.get(
        "/api/users/v1/all",
        headers={"Authorization": f"Bearer {user1.token}"}
    )
    assert res.status_code == 200
    json = res.json()
    data = json["data"]
    assert len(data) == 2
    assert data[0]["id"] == user2.id
    assert data[1]["id"] == user3.id


async def test_users_list_with_friends(client):
    user1 = await User.create(name="u1", email="em1@mail.com")
    user2 = await User.create(name="u2", email="em2@mail.com")
    user3 = await User.create(name="u3", email="em3@mail.com")
    user4 = await User.create(name="u4", email="em4@mail.com")

    assert await User.select().count() == 4

    await Friends.create(user=user1, friend=user2)
    await Friends.create(user=user1, friend=user3)

    res = client.get(
        "/api/users/v1/all",
        headers={"Authorization": f"Bearer {user1.token}"}
    )
    assert res.status_code == 200
    json = res.json()
    data = json["data"]
    assert len(data) == 3

    assert data[0]["id"] == user2.id
    assert data[0]["friend"]

    assert data[1]["id"] == user3.id
    assert data[1]["friend"]

    assert data[2]["id"] == user4.id
    assert not data[2]["friend"]
