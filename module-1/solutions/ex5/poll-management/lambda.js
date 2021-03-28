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
	const
		// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html
		dynamoDbClient = new aws.DynamoDB.DocumentClient({
			params: {TableName: dbName}
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
	console.error(event);
	return apiError('invalid request');
};
