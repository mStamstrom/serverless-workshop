'use strict';
module.exports = function WebSocketMessageSender({apiGatewayManagementApi}) {
	if (!apiGatewayManagementApi) {
		throw new Error('invalid-args');
	}
	this.sendMessage = async function (connectionId, messageObject) {
		try {
			await apiGatewayManagementApi.postToConnection({
				Data: JSON.stringify(messageObject),
				ConnectionId: connectionId
			}).promise();
		} catch (e) {
			if (e.code === 'GoneException') {
				return;
			} else {
				throw e;
			}
		}
	};
};
