const SET_ACTIVE_CHAT = 'SET_ACTIVE_CHAT';
const UPDATE_ACTIVE_CHAT_ID = 'UPDATE_ACTIVE_CHAT_ID';

export const setActiveChat = (username, conversationID) => {
	return {
		type: SET_ACTIVE_CHAT,
		payload: {
			username,
			conversationID
		}
	};
};

export const updateActiveChatIDAfterNewConversationCreation = (newConversationID) => {
	return {
		type: UPDATE_ACTIVE_CHAT_ID,
		payload: {
			newConversationID
		}
	};
};

const reducer = (state = { username: '', conversationID: null }, action) => {
	switch (action.type) {
		case SET_ACTIVE_CHAT: {
			const { username, conversationID } = action.payload;
			return { username, conversationID };
		}
		case UPDATE_ACTIVE_CHAT_ID: {
			const { newConversationID } = action.payload;
			return { ...state, conversationID: newConversationID };
		}
		default:
			return state;
	}
};

export default reducer;
