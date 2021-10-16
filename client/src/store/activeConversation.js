const SET_ACTIVE_CHAT = 'SET_ACTIVE_CHAT';

export const setActiveChat = (username, conversationID) => {
	return {
		type: SET_ACTIVE_CHAT,
		payload: {
			username,
			conversationID
		}
	};
};

const reducer = (state = { username: '', conversationID: null }, action) => {
	switch (action.type) {
		case SET_ACTIVE_CHAT: {
			const { username, conversationID } = action.payload;
			return { username, conversationID };
		}
		default:
			return state;
	}
};

export default reducer;
