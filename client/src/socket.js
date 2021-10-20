import io from 'socket.io-client';
import store from './store';
import {
	setNewMessage,
	removeOfflineUser,
	addOnlineUser,
	setNewLastRead,
	incrementUnreadCount
} from './store/conversations';
import { updateReadStatus } from './store/utils/readReceiptFunctions';

const socket = io(window.location.origin);

socket.on('connect', () => {
	console.log('connected to server');

	socket.on('add-online-user', (id) => {
		store.dispatch(addOnlineUser(id));
	});

	socket.on('remove-offline-user', (id) => {
		store.dispatch(removeOfflineUser(id));
	});
	socket.on('new-message', (data) => {
		const activeConvoId = store.getState().activeConversation.conversationID;
		const currentUserId = store.getState().user.id;

		const incomingMessageConversationId = data.message.conversationId;

		store.dispatch(setNewMessage(data.message, data.sender));

		// This variable is defined here AFTER the dispatch so we can get the conversation
		// array with the new conversation of the new message added
		const userConversations = store.getState().conversations;

		// If the conversation that the new message belongs to is not the active
		// conversation, then we can increment the unread count of that convo by 1.
		userConversations.forEach((conversation) => {
			if (conversation.id === incomingMessageConversationId && activeConvoId !== incomingMessageConversationId) {
				store.dispatch(incrementUnreadCount(incomingMessageConversationId));
			}
		});
		// We update the read status of the conversation whenever we get a new message
		// in the active conversation. This makes it so that whenever a new message is
		// sent to the active conversation, the new last read message is the latest
		// message.
		if (incomingMessageConversationId === activeConvoId) {
			updateReadStatus({ conversation: activeConvoId, reader: currentUserId });
		}
	});
	socket.on('new-last-read', (data) => {
		store.dispatch(setNewLastRead(data.targetConversation, data.newLastReadMessageID));
	});
});

export default socket;
