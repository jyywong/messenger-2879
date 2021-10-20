import axios from 'axios';
import socket from '../../socket';
import { updateActiveChatIDAfterNewConversationCreation } from '../activeConversation';
import { gotConversations, addConversation, setNewMessage, setSearchedUsers } from '../conversations';
import { gotUser, setFetchingStatus } from '../user';

axios.interceptors.request.use(async function(config) {
	const token = await localStorage.getItem('messenger-token');
	config.headers['x-access-token'] = token;

	return config;
});

// USER THUNK CREATORS

export const fetchUser = () => async (dispatch) => {
	dispatch(setFetchingStatus(true));
	try {
		const { data } = await axios.get('/auth/user');
		dispatch(gotUser(data));
		if (data.id) {
			socket.emit('go-online', data.id);
		}
	} catch (error) {
		console.error(error);
	} finally {
		dispatch(setFetchingStatus(false));
	}
};

export const register = (credentials) => async (dispatch) => {
	try {
		const { data } = await axios.post('/auth/register', credentials);
		await localStorage.setItem('messenger-token', data.token);
		dispatch(gotUser(data));
		socket.emit('go-online', data.id);
	} catch (error) {
		console.error(error);
		dispatch(gotUser({ error: error.response.data.error || 'Server Error' }));
	}
};

export const login = (credentials) => async (dispatch) => {
	try {
		const { data } = await axios.post('/auth/login', credentials);
		await localStorage.setItem('messenger-token', data.token);
		dispatch(gotUser(data));
		socket.emit('go-online', data.id);
	} catch (error) {
		console.error(error);
		dispatch(gotUser({ error: error.response.data.error || 'Server Error' }));
	}
};

export const logout = (id) => async (dispatch) => {
	try {
		await axios.delete('/auth/logout');
		await localStorage.removeItem('messenger-token');
		dispatch(gotUser({}));
		socket.emit('logout', id);
	} catch (error) {
		console.error(error);
	}
};

// CONVERSATIONS THUNK CREATORS

export const fetchConversations = () => async (dispatch) => {
	try {
		const { data } = await axios.get('/api/conversations');
		dispatch(gotConversations(data));
	} catch (error) {
		console.error(error);
	}
};

const saveMessage = async (body) => {
	const { data } = await axios.post('/api/messages', body);
	return data;
};

const sendMessage = (data, body) => {
	socket.emit('new-message', {
		message: data.message,
		recipientId: body.recipientId,
		sender: data.sender
	});
};

// message format to send: {recipientId, text, conversationId}
// conversationId will be set to null if its a brand new conversation
export const postMessage = (body) => async (dispatch) => {
	try {
		const data = await saveMessage(body);
		const { message } = data;
		if (!body.conversationId) {
			dispatch(addConversation(body.recipientId, message));
			// Why do we need to update the activeChatID?
			// 	1. The read status is updated if there is a new message incoming
			// 		and the message conversation ID matches the active conversation ID
			// 	2. If the user sends a message in a completely new conversation
			// 		our state only knows the otherUser.username property of the active conversation,
			// 		until a refresh of the page.
			// 		This means we cannot compare any new messages' conversation ID to the missing
			// 		active conversation ID and thus cannot update read status properly until the
			// 		next refresh.
			// 		Eg.
			// 			state looks like this -> activeConversation = {username: 'some username'}
			// 			but we need this -> activeConversation = {username: 'some username', conversationID: 10}
			//
			// 	3. By updating the active conversation ID in the state with the new conversation
			// 		ID, we can now properly compare IDs to properly update read status without refresh.
			dispatch(updateActiveChatIDAfterNewConversationCreation(message.conversationId));
		} else {
			dispatch(setNewMessage(message));
		}

		sendMessage(data, body);
	} catch (error) {
		console.error(error);
	}
};

export const searchUsers = (searchTerm) => async (dispatch) => {
	try {
		const { data } = await axios.get(`/api/users/${searchTerm}`);
		dispatch(setSearchedUsers(data));
	} catch (error) {
		console.error(error);
	}
};
