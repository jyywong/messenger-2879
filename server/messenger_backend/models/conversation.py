from django.db import models
from django.db.models import Q

from . import utils
from .user import User


class Conversation(utils.CustomModel):

    user1 = models.ForeignKey(
        User, on_delete=models.CASCADE, db_column="user1Id", related_name="+"
    )
    user2 = models.ForeignKey(
        User, on_delete=models.CASCADE, db_column="user2Id", related_name="+",
    )
    createdAt = models.DateTimeField(auto_now_add=True, db_index=True)
    updatedAt = models.DateTimeField(auto_now=True)

    # find conversation given two user Ids
    def find_conversation(user1Id, user2Id):
        # return conversation or None if it doesn't exist
        try:
            return Conversation.objects.get(
                (Q(user1__id=user1Id) | Q(user1__id=user2Id)),
                (Q(user2__id=user1Id) | Q(user2__id=user2Id)),
            )
        except Conversation.DoesNotExist:
            return None

    def get_current_unread_messages(self, readerId):
        """
        In this case we are looking for messages sent by the other user
        that has not been read by the current user.
        If a message's sender is the same as the current user we do not want it,
        because the current user does not need to read their own message.
        This is why we exclude messages where senderID = readerID

        """
        unread_messages = self.messages.filter(
            isRead=False).exclude(senderId=readerId)
        return unread_messages

    def get_unread_messages_count(self, userId):
        # unread_messages_count = self.messages.filter(
        #     isRead=False).exclude(senderId=userId).count()
        unread_messages_count = self.get_current_unread_messages(
            userId).count()
        return unread_messages_count

    def get_last_read_message(self, userId):
        last_read_message = self.messages.filter(
            isRead=True).exclude(senderId=userId).last()
        return last_read_message

    def mark_all_current_unread_messages_as_read(self, readerId):
        unread_messages = self.get_current_unread_messages(readerId)
        for index, unread_message in enumerate(unread_messages):
            unread_message.isRead = True
            if index == len(unread_messages) - 1:
                print('lastloop')
                last_read_message = self.get_last_read_message(readerId)
                last_read_message.isLastRead = False
                last_read_message.save()

                unread_message.isLastRead = True
            unread_message.save()
