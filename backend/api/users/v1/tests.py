from backend.models import User, Friends, City


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


async def test_city_list(client):
    city1 = await City.create(
        name="Moscow", search_name="moscow", lat="55.3441", lon="34.1234"
    )
    city2 = await City.create(
        name="St. Petersburg", search_name="st. petersburg", lat="45.3441", lon="30.4321"
    )

    res = client.get("/api/users/v1/cities")
    assert res.status_code == 200
    json = res.json()
    assert len(json) == 2
    assert json[0]["id"] == city1.id
    assert json[0]["name"] == city1.name
    assert json[1]["id"] == city2.id
    assert json[1]["name"] == city2.name


async def test_city_list_with_filter(client):
    await City.create(
        name="Нижневартовск", search_name="нижневартовск", lat="55.3441", lon="34.1234"
    )
    await City.create(
        name="Нижний Новгород", search_name="нижний новгород", lat="45.3441", lon="30.4321"
    )
    await City.create(
        name="Калинин", search_name="калинин", lat="45.3441", lon="30.4321"
    )

    res = client.get("/api/users/v1/cities")
    assert res.status_code == 200
    json = res.json()
    assert len(json) == 3

    res = client.get("/api/users/v1/cities?where=Н")
    assert res.status_code == 200
    json = res.json()
    assert len(json) == 2

    res = client.get("/api/users/v1/cities?where=н")
    assert res.status_code == 200
    json = res.json()
    assert len(json) == 2

    res = client.get("/api/users/v1/cities?where=нижне")
    assert res.status_code == 200
    json = res.json()
    assert len(json) == 1

    res = client.get("/api/users/v1/cities?where=нежно")
    assert res.status_code == 200
    json = res.json()
    assert len(json) == 0
