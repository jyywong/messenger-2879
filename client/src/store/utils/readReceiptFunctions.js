// Read Receipts
import axios from 'axios';
import socket from '../../socket';

// Initally thought I could put these files in thunkCreators.js, but I decided to make a new file
// for them because none of these functions affect the store directly.

export const saveNewMessagesAsRead = async (body) => {
	// If succesful, the API endpoint returns just an HTTP 200
	// so we don't need to capture the response.
	// await axios.patch('/api/conversations', body);
	await axios.patch('/api/conversations', body);
};

export const signalNewLastReadMessageToOtherUser = (data) => {
	const { conversation, reader } = data;
	socket.emit('mark-as-read', {
		conversation,
		reader
	});
};

export const updateReadStatus = async (data) => {
	try {
		await saveNewMessagesAsRead(data);
		signalNewLastReadMessageToOtherUser(data);
	} catch (error) {
		console.log(error);
	}
};
