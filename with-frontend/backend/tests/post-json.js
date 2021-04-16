const request = require('minimal-request-promise');
module.exports = function putJSON (url, body) {
	return request.post(url, {
		body: body && JSON.stringify(body),
		headers: {
			'Content-Type': 'application/json'
		}
	});
};
