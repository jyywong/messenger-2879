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

    def user_is_part_of_conversation(self, user_id):
        return user_id == self.user1.id or user_id == self.user2.id

    def get_current_unread_messages(self, readerId):
        """
        In this case we are looking for messages sent by the other user
        that has not been read by the current user/reader.
        If a message's sender is the same as the current user/reader we do not want it
        because the current user/reader does not need to read their own message.
        This is why we exclude messages where senderID = readerID.

        """
        unread_messages = self.messages.filter(
            isRead=False).exclude(senderId=readerId)
        return unread_messages

    def get_unread_messages_count(self, readerId):

        unread_messages_count = self.get_current_unread_messages(
            readerId).count()
        return unread_messages_count

    def get_last_read_message(self, readerId):
        """
        Given the user, we find the messages that are read, that are sent
        by the OTHER user, and we find the last one to get the last read
        message.
        """

        last_read_message = self.messages.filter(
            isRead=True).exclude(senderId=readerId).last()

        return last_read_message

    def mark_all_current_unread_messages_as_read(self, readerId):
        """
        Given the user/reader, we find all unread messages sent by the other user.
        Then we mark all of them as read. 
        We make sure to set the previous last read message's isLastRead property to 
        false because we have a NEW last read message. 
        When we are at the final unread message, we set its isLastRead 
        to True to help keep track of the last read message.
        """
        unread_messages = self.get_current_unread_messages(readerId)
        last_read_message = self.get_last_read_message(readerId)

        if last_read_message:
            last_read_message.isLastRead = False

        unread_messages.update(isRead=True)

        new_last_read_message = unread_messages.last()
        if new_last_read_message:
            new_last_read_message.isLastRead = True
