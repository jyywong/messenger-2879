import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Typography, Avatar } from '@material-ui/core';

const useStyles = makeStyles(() => ({
	root: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'flex-end'
	},
	date: {
		fontSize: 11,
		color: '#BECCE2',
		fontWeight: 'bold',
		marginBottom: 5
	},
	text: {
		fontSize: 14,
		color: '#91A3C0',
		letterSpacing: -0.2,
		padding: 8,
		fontWeight: 'bold'
	},
	bubble: {
		background: '#F4F6FA',
		borderRadius: '10px 10px 0 10px'
	},
	avatar: {
		margin: '0.2rem',
		height: '1rem',
		width: '1rem'
	}
}));

const SenderBubble = (props) => {
	const classes = useStyles();
	const { time, text, isLastRead, otherUser } = props;
	return (
		<Box className={classes.root}>
			<Typography className={classes.date}>{time}</Typography>
			<Box className={classes.bubble}>
				<Typography className={classes.text}>{text}</Typography>
			</Box>
			{isLastRead && <Avatar className={classes.avatar} />}
		</Box>
	);
};

export default SenderBubble;
