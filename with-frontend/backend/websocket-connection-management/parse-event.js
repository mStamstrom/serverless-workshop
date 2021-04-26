'use strict';
module.exports = function parseEvent (event) {
	const {routeKey, connectionId} = event.requestContext;
	if (routeKey === '$connect') {
		return {
			type: 'create',
			params: event.queryStringParameters,
			connectionId
		};
	}
	if (routeKey === '$disconnect') {
		return {
			type: 'delete',
			connectionId
		};
	}
	return {
		type: routeKey,
		connectionId
	};
};
