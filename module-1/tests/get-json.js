const request = require('minimal-request-promise');
module.exports = async function getJSON (url) {
	const result = await request.get(url),
		contentType = result.headers['content-type'];
	if (contentType !== 'application/json') {
		throw `content type from ${url} is not JSON but ${contentType}`;
	}
	try {
		return JSON.parse(result.body);
	} catch (e) {
		console.error(e);
		console.error(result.body);
		throw `response body is not JSON`;
	}
};
