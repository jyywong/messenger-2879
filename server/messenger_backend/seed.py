from django.db import migrations
from messenger_backend.models import User, Conversation, Message


def seed():
    print("db synced!")
    User.objects.all().delete()
    Conversation.objects.all().delete()
    Message.objects.all().delete()

    thomas = User(
        username="thomas",
        email="thomas@email.com",
        password="123456",
        photoUrl="https://res.cloudinary.com/dmlvthmqr/image/upload/v1607914467/messenger/thomas_kwzerk.png",
    )

    thomas.save()

    santiago = User(
        username="santiago",
        email="santiago@email.com",
        password="123456",
        photoUrl="https://res.cloudinary.com/dmlvthmqr/image/upload/v1607914466/messenger/775db5e79c5294846949f1f55059b53317f51e30_s3back.png",
    )

    santiago.save()

    santiagoConvo = Conversation(user1=thomas, user2=santiago)
    santiagoConvo.save()

    messages = Message(
        conversation=santiagoConvo, senderId=santiago.id, text="Where are you from?"
    )
    messages.save()

    messages = Message(
        conversation=santiagoConvo, senderId=thomas.id, text="I'm from New York"
    )
    messages.save()

    messages = Message(
        conversation=santiagoConvo,
        senderId=santiago.id,
        text="Share photo of your city, please",
    )
    messages.save()

    chiumbo = User(
        username="chiumbo",
        email="chiumbo@email.com",
        password="123456",
        photoUrl="https://res.cloudinary.com/dmlvthmqr/image/upload/v1607914468/messenger/8bc2e13b8ab74765fd57f0880f318eed1c3fb001_fownwt.png",
    )
    chiumbo.save()

    chiumboConvo = Conversation(user1=chiumbo, user2=thomas)
    chiumboConvo.save()

    messages = Message(
        conversation=chiumboConvo, senderId=chiumbo.id, text="Sure! What time?"
    )
    messages.save()

    hualing = User(
        username="hualing",
        email="hualing@email.com",
        password="123456",
        photoUrl="https://res.cloudinary.com/dmlvthmqr/image/upload/v1607914466/messenger/6c4faa7d65bc24221c3d369a8889928158daede4_vk5tyg.png",
    )
    hualing.save()

    hualingConvo = Conversation(user1=hualing, user2=thomas)
    hualingConvo.save()

    for i in range(10):
        messages = Message(
            conversation=hualingConvo, senderId=hualing.id, text="a test message"
        )
        messages.save()

    messages = Message(conversation=hualingConvo, senderId=hualing.id, text="😂 😂 😂")
    messages.save()

    user = User(
        username="ashanti",
        email="ashanti@email.com",
        password="123456",
        photoUrl="https://res.cloudinary.com/dmlvthmqr/image/upload/v1607914466/messenger/68f55f7799df6c8078a874cfe0a61a5e6e9e1687_e3kxp2.png",
    )
    user.save()

    user = User(
        username="julia",
        email="julia@email.com",
        password="123456",
        photoUrl="https://res.cloudinary.com/dmlvthmqr/image/upload/v1607914468/messenger/d9fc84a0d1d545d77e78aaad39c20c11d3355074_ed5gvz.png",
    )
    user.save()

    user = User(
        username="cheng",
        email="cheng@email.com",
        password="123456",
        photoUrl="https://res.cloudinary.com/dmlvthmqr/image/upload/v1607914466/messenger/9e2972c07afac45a8b03f5be3d0a796abe2e566e_ttq23y.png",
    )
    user.save()


print("Importing seed...")
