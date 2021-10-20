from online_users import online_users
from messenger_backend.models import Conversation
import socketio
import os
async_mode = None


basedir = os.path.dirname(os.path.realpath(__file__))
# This was blocking the websocket connection on my local pc
# sio = socketio.Server(async_mode=async_mode, logger=False)
sio = socketio.Server(async_mode=async_mode, logger=True,
                      cors_allowed_origins='*')

thread = None


@sio.event
def connect(sid, environ):
    sio.emit("my_response", {"data": "Connected", "count": 0}, room=sid)


@sio.on("go-online")
def go_online(sid, user_id):
    if user_id not in online_users:
        online_users.append(user_id)
    sio.emit("add-online-user", user_id, skip_sid=sid)


@sio.on("new-message")
def new_message(sid, message):
    sio.emit(
        "new-message",
        {"message": message["message"], "sender": message["sender"]},
        skip_sid=sid,
    )


@sio.on("logout")
def logout(sid, user_id):
    if user_id in online_users:
        online_users.remove(user_id)
    sio.emit("remove-offline-user", user_id, skip_sid=sid)


@sio.on("mark-as-read")
def mark_as_read(sid, data):
    target_conversation = Conversation.objects.get(id=data['conversation'])
    new_last_read_message = target_conversation.get_last_read_message(
        data['reader'])

    sio.emit("new-last-read", {
        "targetConversation": target_conversation.id,
        "newLastReadMessageID": new_last_read_message.id
    }, skip_sid=sid)
