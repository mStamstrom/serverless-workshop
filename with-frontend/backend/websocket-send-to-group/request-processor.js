'use strict';
module.exports = function RequestProcessor({logger, connectionRepository, messageSender}) {
	if (!logger || !connectionRepository || !messageSender) {
		throw new Error('invalid-args');
	}
	this.processRequest = async (message) => {
		const connections = await connectionRepository.findMatchingConnections(message);
		logger?.log(JSON.stringify({message, connections}));
		await Promise.all(connections.map(connectionId => messageSender.sendMessage(connectionId, message)));
	};
};
