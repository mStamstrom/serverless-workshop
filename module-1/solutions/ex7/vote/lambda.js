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
	apiSuccess = body => ({
		'statusCode': 200,
		'body': JSON.stringify(body),
		'headers': {
			'Content-Type': 'application/json'
		}
	});

exports.handler = async (event) => {
	const // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html
		dynamoDbClient = new aws.DynamoDB.DocumentClient({
			params: {TableName: dbName}
		});
	if (event.httpMethod === 'PUT' && event.pathParameters && event.body) {
		const {pollId} = event.pathParameters,
			{answer} = JSON.parse(event.body);
		await dynamoDbClient.update({
			Key: {pollId},
			UpdateExpression: 'SET #counts.#answer = if_not_exists(#counts.#answer, :zero) + :inc',
			ExpressionAttributeNames: {
				'#counts': 'counts',
				'#answer': answer,
			},
			ExpressionAttributeValues: {
				':inc': 1,
				':zero': 0
			}
		}).promise();
		console.log({action: 'vote', pollId, anwser: event.body});
		return apiSuccess({pollId});

	}
	console.error(event);
	return apiError('invalid request');
};
