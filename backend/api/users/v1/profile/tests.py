from backend.models import User


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
