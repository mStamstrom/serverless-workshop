const request = require('minimal-request-promise'),
	pause = require('./pause'),
	downloadFile = async function (url, retriesLeft) {
		try {
			const result = await request.get(url);
			return result;
		} catch (e) {
			if (e.statusCode === 403 && retriesLeft > 0) {
				await pause(500);
				return downloadFile(url, retriesLeft - 1);
			}
			throw e;
		}
	};
module.exports = async function getJSON (url, retryErrors) {
	const retriesLeft = retryErrors ? 5 : 0,
		result = await downloadFile(url, retriesLeft),
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
