from backend.models import User


async def test_users_list(client):
    user1 = await User.create(name="u1", email="em1@mail.com")
    await user1.set_password("pass")
    user2 = await User.create(name="u2", email="em2@mail.com")
    await user2.set_password("pass")
    user3 = await User.create(name="u3", email="em3@mail.com")
    await user3.set_password("pass")

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
