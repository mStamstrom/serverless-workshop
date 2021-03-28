'use strict';
const apiError = err => ({
		statusCode: 400,
		body: String(err),
		headers: {
			'Content-Type': 'text/plain'
		}
	}),
	apiSuccess = response => ({
		'statusCode': 200,
		'body': JSON.stringify(response),
		'headers': {
			'Content-Type': 'application/json'
		}
	});
exports.handler = async (event) => {
	console.log(event);
	if (event.httpMethod === 'PUT' && event.body) {
		const body = JSON.parse(event.body);
		if (!body.question || !Array.isArray(body.answers) || body.answers.length < 1) {
			return apiError('question or answers missing');
		} else {
			return apiSuccess('ok');
		}
	}
	return apiError('invalid request');
};
