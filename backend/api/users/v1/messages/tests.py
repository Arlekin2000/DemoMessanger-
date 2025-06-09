from backend.models import User, Messages, LastReadMessage


async def test_message_create(client):
    author = await User.create(email="trivolta@mail.sru")
    user2 = await User.create(email="nikodim@mail.pisay")

    assert await Messages.select().count() == 0

    res = client.post(
        f"/api/users/v1/messages/{user2.id}",
        headers={"Authorization": f'Bearer {author.token}'},
        json = {"message": "test message"}
    )
    assert res.status_code == 200
    json = res.json()
    assert json['success']
    assert json['message']['id'] == '1'
    assert json['message']['chat_id'] == '12'
    assert json['message']['user'] == '1'
    assert json['message']['companion'] == '2'
    assert json['message']['text'] == 'test message'
    assert json['message']['message_id'] == 1

    assert await Messages.select().count() == 1
    message = await Messages.select().first()
    assert message.text == 'test message'
    last_message = await LastReadMessage.select().first()
    assert await last_message.user == author
    assert last_message.chat_id == "12"
    assert last_message.message_id == 1

    user3 = await User.create(email="nikotin@mail.kuru")
    res = client.post(
        f"/api/users/v1/messages/{user3.id}",
        headers={"Authorization": f'Bearer {author.token}'},
        json={"message": "test message"}
    )
    assert res.status_code == 200
    json = res.json()
    assert json['success']
    assert json['message']['id'] == '2'
    assert json['message']['chat_id'] == '13'
    assert json['message']['user'] == '1'
    assert json['message']['companion'] == '3'
    assert json['message']['message_id'] == 1


async def test_get_messages(client):
    author = await User.create(email="trivolta@mail.sru")
    user2 = await User.create(email="nikodim@mail.pisay")

    for i in range(35):
        await Messages.insert(
            user=author,
            companion=user2,
            text="text",
            chat_id="12",
            message_id=i+1
        )
    await LastReadMessage.insert(
        user_id=user2.id,
        chat_id="12",
        message_id=18
    )

    res = client.get(
        f"/api/users/v1/messages/{author.id}",
        headers={"Authorization": f'Bearer {user2.token}'}
    )
    assert res.status_code == 200
    json = res.json()
    messages = json["messages"]
    assert len(messages) == 30
    assert messages[0]["message_id"] == 4
    assert messages[-1]["message_id"] == 33


async def test_load_more_messages(client):
    author = await User.create(email="trivolta@mail.sru")
    user2 = await User.create(email="nikodim@mail.pisay")

    for i in range(50):
        await Messages.insert(
            user=author,
            companion=user2,
            text="text",
            chat_id="12",
            message_id=i+1
        )
    res = client.get(
        f"/api/users/v1/messages/{author.id}/load_more_from/{25}",
        headers={"Authorization": f'Bearer {user2.token}'}
        )
    json = res.json()
    messages = json["messages"]
    assert len(messages) == 30
    assert messages[0]["message_id"] == 11
    assert messages[-1]["message_id"] == 40


async def test_rewrite_last_read_messages(client):
    author = await User.create(email="trivolta@mail.sru")
    user2 = await User.create(email="nikodim@mail.pisay")

    for i in range(50):
        await Messages.insert(
            user=author,
            companion=user2,
            text="text",
            chat_id="12",
            message_id=i + 1
        )

    await LastReadMessage.insert(
        user=user2,
        chat_id="12",
        message_id=25
    )

    res = client.get(
        f"/api/users/v1/messages/{author.id}/load_more_from/{25}",
        headers={"Authorization": f'Bearer {user2.token}'}
    )
    json = res.json()
    messages = json["messages"]
    assert len(messages) == 30
    assert messages[-1]["message_id"] == 40

    answer = await LastReadMessage.select().first()
    assert answer.message_id == 40

    res = client.get(
        f"/api/users/v1/messages/{author.id}/load_more_from/{15}",
        headers={"Authorization": f'Bearer {user2.token}'}
    )
    json = res.json()
    messages = json["messages"]
    assert messages[-1]["message_id"] == 30

    answer = await LastReadMessage.select().first()
    assert answer.message_id == 40


async def test_delete_message(client):
    author = await User.create(
        email="john@gmail.com",
    )
    user2 = await User.create(
        email="john2@gmail.com",
    )

    for i in range(2):
        await Messages.create(
            user=author,
            companion=user2,
            text="test message",
            chat_id="12",
            message_id=i+1,
        )

    res = client.get(
        f'/api/users/v1/messages/{author.id}',
        headers={"Authorization": f"Bearer {user2.token}"},
    )
    assert res.status_code == 200
    json = res.json()
    assert json["success"]
    assert len(json["messages"]) == 2

    messages = await Messages.select()
    assert len(messages) == 2
    assert not messages[0].is_hidden
    assert not messages[1].is_hidden

    res = client.delete(
        f'/api/users/v1/messages/{messages[1].message_id}/{user2.id}',
        headers={"Authorization": f"Bearer {author.token}"},
    )
    assert res.status_code == 200
    json = res.json()
    assert json == {"success": True}

    messages = await Messages.select()
    assert len(messages) == 2
    assert not messages[0].is_hidden
    assert messages[1].is_hidden

    # Check for first chat member
    res = client.get(
        f'/api/users/v1/messages/{author.id}',
        headers={"Authorization": f"Bearer {user2.token}"},
    )
    assert res.status_code == 200
    json = res.json()
    assert json["success"]
    assert len(json["messages"]) == 1
    assert json["messages"][0]["message_id"] == messages[0].message_id

    # Check for second chat member
    res = client.get(
        f'/api/users/v1/messages/{user2.id}',
        headers={"Authorization": f"Bearer {author.token}"},
    )
    assert res.status_code == 200
    json = res.json()
    assert json["success"]
    assert len(json["messages"]) == 1
    assert json["messages"][0]["message_id"] == messages[0].message_id
