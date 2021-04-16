module.exports = function apiError (err, origin) {
	return {
		statusCode: 400,
		body: String(err),
		headers: {
			'Content-Type': 'text/plain',
			'Access-Control-Allow-Origin': origin
		}
	};
};
