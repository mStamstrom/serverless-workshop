const requestTypes = {
	'PUT': 'create',
	'GET': 'read',
	'POST': 'vote'
};
module.exports = function parseRequest(event, context) {
	const requestType = requestTypes[event.httpMethod],
		requestId = context.awsRequestId,
		pollId = event.pathParameters?.pollId,
		body = (event.body && JSON.parse(event.body));
	if (event.httpMethod !== 'GET' && !body) {
		throw 'invalid request';
	}
	return {requestType, requestId, body, pollId};
};
