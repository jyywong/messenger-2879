import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box } from '@material-ui/core';
import { Input, Header, Messages } from './index';
import { connect } from 'react-redux';
import { updateReadStatus } from '../../store/utils/readReceiptFunctions';
import { resetUnreadCount } from '../../store/conversations';

const useStyles = makeStyles(() => ({
	root: {
		display: 'flex',
		flexGrow: 8,
		flexDirection: 'column'
	},
	chatContainer: {
		marginLeft: 41,
		marginRight: 41,
		display: 'flex',
		flexDirection: 'column',
		flexGrow: 1,
		justifyContent: 'space-between'
	}
}));

const ActiveChat = (props) => {
	const classes = useStyles();
	const { user, activeConversationID, zeroUnreadCount } = props;
	const conversation = props.conversation || {};

	// Everytime a new active conversation is selected (I consider this as opening a chat
	// and thus reading all messages) I update the read status which lets both the database
	// and the other user know of the newly read messages. I also reset the unread count of this
	// conversation to 0.
	useEffect(
		() => {
			const activeConversationHasMessagesNotSentByUser =
				typeof conversation.messages !== 'undefined'
					? conversation.messages.some((message) => {
							return message.senderId !== user.id;
						})
					: false;
			// We only need to update the read status and unread count if there IS an active conversation
			// AND the conversation has any messages not sent by the current user. There would be no point
			// in updating the read status, if the conversation only had messages sent by the current user.
			if (activeConversationID !== null && activeConversationHasMessagesNotSentByUser) {
				updateReadStatus({ conversation: activeConversationID, reader: user.id });
				zeroUnreadCount(activeConversationID);
			}
		},
		[ activeConversationID ]
	);

	return (
		<Box className={classes.root}>
			{conversation.otherUser && (
				<React.Fragment>
					<Header
						username={conversation.otherUser.username}
						online={conversation.otherUser.online || false}
					/>
					<Box className={classes.chatContainer}>
						<Messages
							messages={conversation.messages}
							otherUser={conversation.otherUser}
							userId={user.id}
						/>
						<Input otherUser={conversation.otherUser} conversationId={conversation.id} user={user} />
					</Box>
				</React.Fragment>
			)}
		</Box>
	);
};

const mapStateToProps = (state) => {
	return {
		user: state.user,
		activeConversationID: state.activeConversation.conversationID,
		conversation:
			state.conversations &&
			state.conversations.find(
				(conversation) => conversation.otherUser.username === state.activeConversation.username
			)
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		zeroUnreadCount: (targetConversationID) => {
			dispatch(resetUnreadCount(targetConversationID));
		}
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(ActiveChat);
