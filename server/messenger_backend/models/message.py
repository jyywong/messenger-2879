from django.db import models
from . import utils
from .conversation import Conversation
from .user import User


class Message(utils.CustomModel):
    text = models.TextField(null=False)
    senderId = models.IntegerField(null=False)
    conversation = models.ForeignKey(
        Conversation,
        on_delete=models.CASCADE,
        db_column="conversationId",
        related_name="messages",
        related_query_name="message"
    )
    isReadBy = models.ManyToManyField(User, related_name="messages_is_read_by")
    isLastReadBy = models.ManyToManyField(
        User, related_name="messages_is_last_read_by")

    createdAt = models.DateTimeField(auto_now_add=True, db_index=True)
    updatedAt = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.text
