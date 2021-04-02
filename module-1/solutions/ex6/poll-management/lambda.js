'use strict';
const dbName = process.env.POLLINGTABLE,
	aws = require('aws-sdk'),
	apiError = err => ({
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

exports.handler = async (event, context) => {
	const dynamoDbClient = new aws.DynamoDB.DocumentClient({
		params: {TableName: dbName},
	});
	if (event.httpMethod === 'PUT' && event.body) {
		const body = JSON.parse(event.body);
		if (!body.question || !Array.isArray(body.answers) || body.answers.length < 1) {
			return apiError('question or answers missing');
		} else {
			const pollId = context.awsRequestId,
				{question, answers} = body;
			await dynamoDbClient.put({Item: {pollId, question, answers, counts: {} }}).promise();
			return apiSuccess({pollId});
		}
	}
	if (event.httpMethod === 'GET' && event.pathParameters) {
		const {pollId} = event.pathParameters,
			response = await dynamoDbClient.get({Key: {pollId}}).promise();
		if (response.Item) {
			return apiSuccess(response.Item);
		}
	}
	console.error(event);
	return apiError('invalid request');
};
