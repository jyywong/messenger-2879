export const addMessageToStore = (state, payload) => {
	const { message, sender } = payload;
	// if sender isn't null, that means the message needs to be put in a brand new convo
	if (sender !== null) {
		const newConvo = {
			id: message.conversationId,
			otherUser: sender,
			messages: [ message ]
		};
		newConvo.latestMessageText = message.text;
		return [ newConvo, ...state ];
	}

	return state.map((convo) => {
		if (convo.id === message.conversationId) {
			const convoCopy = { ...convo };
			convoCopy.messages.push(message);
			convoCopy.latestMessageText = message.text;
			return convoCopy;
		} else {
			return convo;
		}
	});
};

export const setNewLastReadToStore = (state, payload) => {
	const { targetConversationID, newLastReadMessageID } = payload;
	return state.map((convo) => {
		if (convo.id === targetConversationID) {
			const convoCopy = { ...convo };

			convoCopy.messages.forEach((message) => {
				if (message.isLastRead) {
					message.isLastRead = false;
				}
				if (message.id === newLastReadMessageID) {
					message.isLastRead = true;
				}
			});
			return convoCopy;
		} else {
			return convo;
		}
	});
};

export const resetUnreadCountToStore = (state, payload) => {
	const { targetConversationID } = payload;
	return state.map((convo) => {
		if (convo.id === targetConversationID) {
			const convoCopy = { ...convo };
			convoCopy.unreadMessages = 0;
			return convoCopy;
		} else {
			return convo;
		}
	});
};

export const incrementUnreadCountToStore = (state, payload) => {
	const { targetConversationID } = payload;
	return state.map((convo) => {
		if (convo.id === targetConversationID) {
			const convoCopy = { ...convo };
			convoCopy.unreadMessages = (convoCopy.unreadMessages ?? 0) + 1
			return convoCopy;
		} else {
			return convo;
		}
	});
};

export const addOnlineUserToStore = (state, id) => {
	return state.map((convo) => {
		if (convo.otherUser.id === id) {
			const convoCopy = { ...convo };
			convoCopy.otherUser.online = true;
			return convoCopy;
		} else {
			return convo;
		}
	});
};

export const removeOfflineUserFromStore = (state, id) => {
	return state.map((convo) => {
		if (convo.otherUser.id === id) {
			const convoCopy = { ...convo };
			convoCopy.otherUser.online = false;
			return convoCopy;
		} else {
			return convo;
		}
	});
};

export const addSearchedUsersToStore = (state, users) => {
	const currentUsers = {};

	// make table of current users so we can lookup faster
	state.forEach((convo) => {
		currentUsers[convo.otherUser.id] = true;
	});

	const newState = [ ...state ];
	users.forEach((user) => {
		// only create a fake convo if we don't already have a convo with this user
		if (!currentUsers[user.id]) {
			let fakeConvo = { otherUser: user, messages: [] };
			newState.push(fakeConvo);
		}
	});

	return newState;
};

export const addNewConvoToStore = (state, recipientId, message) => {
	return state.map((convo) => {
		if (convo.otherUser.id === recipientId) {
			const convoCopy = { ...convo };
			convoCopy.id = message.conversationId;
			convoCopy.messages.push(message);
			convoCopy.latestMessageText = message.text;
			return convoCopy;
		} else {
			return convo;
		}
	});
};
