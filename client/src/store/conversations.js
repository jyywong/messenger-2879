import {
	addNewConvoToStore,
	addOnlineUserToStore,
	addSearchedUsersToStore,
	removeOfflineUserFromStore,
	addMessageToStore,
	setNewLastReadToStore,
	resetUnreadCountToStore,
	incrementUnreadCountToStore
} from './utils/reducerFunctions';

// ACTIONS

const GET_CONVERSATIONS = 'GET_CONVERSATIONS';
const SET_MESSAGE = 'SET_MESSAGE';
const SET_NEW_LAST_READ = 'SET_NEW_LAST_READ';
const RESET_UNREAD_COUNT = 'RESET_UNREAD_COUNT';
const INCREMENT_UNREAD_COUNT = 'INCREMENT_UNREAD_COUNT';
const ADD_ONLINE_USER = 'ADD_ONLINE_USER';
const REMOVE_OFFLINE_USER = 'REMOVE_OFFLINE_USER';
const SET_SEARCHED_USERS = 'SET_SEARCHED_USERS';
const CLEAR_SEARCHED_USERS = 'CLEAR_SEARCHED_USERS';
const ADD_CONVERSATION = 'ADD_CONVERSATION';

// ACTION CREATORS

export const gotConversations = (conversations) => {
	return {
		type: GET_CONVERSATIONS,
		conversations
	};
};

export const setNewMessage = (message, sender) => {
	return {
		type: SET_MESSAGE,
		payload: { message, sender: sender || null }
	};
};
export const setNewLastRead = (targetConversationID, newLastReadMessageID) => {
	return {
		type: SET_NEW_LAST_READ,
		payload: { targetConversationID, newLastReadMessageID }
	};
};

export const addOnlineUser = (id) => {
	return {
		type: ADD_ONLINE_USER,
		id
	};
};

export const removeOfflineUser = (id) => {
	return {
		type: REMOVE_OFFLINE_USER,
		id
	};
};

export const setSearchedUsers = (users) => {
	return {
		type: SET_SEARCHED_USERS,
		users
	};
};

export const clearSearchedUsers = () => {
	return {
		type: CLEAR_SEARCHED_USERS
	};
};

// add new conversation when sending a new message
export const addConversation = (recipientId, newMessage) => {
	return {
		type: ADD_CONVERSATION,
		payload: { recipientId, newMessage }
	};
};

export const resetUnreadCount = (targetConversationID) => {
	return {
		type: RESET_UNREAD_COUNT,
		payload: { targetConversationID }
	};
};

export const incrementUnreadCount = (targetConversationID) => {
	return {
		type: INCREMENT_UNREAD_COUNT,
		payload: { targetConversationID }
	};
};

// REDUCER

const reducer = (state = [], action) => {
	switch (action.type) {
		case GET_CONVERSATIONS:
			return action.conversations;
		case SET_MESSAGE:
			return addMessageToStore(state, action.payload);
		case SET_NEW_LAST_READ:
			return setNewLastReadToStore(state, action.payload);
		case RESET_UNREAD_COUNT:
			return resetUnreadCountToStore(state, action.payload);
		case INCREMENT_UNREAD_COUNT:
			return incrementUnreadCountToStore(state, action.payload);
		case ADD_ONLINE_USER: {
			return addOnlineUserToStore(state, action.id);
		}
		case REMOVE_OFFLINE_USER: {
			return removeOfflineUserFromStore(state, action.id);
		}
		case SET_SEARCHED_USERS:
			return addSearchedUsersToStore(state, action.users);
		case CLEAR_SEARCHED_USERS:
			return state.filter((convo) => convo.id);
		case ADD_CONVERSATION:
			return addNewConvoToStore(state, action.payload.recipientId, action.payload.newMessage);
		default:
			return state;
	}
};

export default reducer;
