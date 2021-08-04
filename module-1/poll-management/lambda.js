'use strict';
const dbName = process.env.POLLINGTABLE,
	aws = require('aws-sdk');
const apiError = err => ({
		statusCode: 400,
		body: String(err),
		headers: {
			'Content-Type': 'text/plain'
		}
	}),
	notFoundError = err =>  ({
		statusCode: 404,
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
	console.log(event);
	const dynamoDbClient = new aws.DynamoDB.DocumentClient({
		params: {TableName: dbName}
	});
	if (event.httpMethod === 'PUT' && event.body) {
		const body = JSON.parse(event.body);
		if (!body.question || !Array.isArray(body.answers) || body.answers.length < 1) {
			return apiError('question or answers missing');
		} else {
			
			const pollId = context.awsRequestId;
			const {question, answers, counts = {}} = body;
			const itemToSave = {pollId, question, answers, counts };

			console.log({action: 'create', itemToSave});
			

			await dynamoDbClient.put({Item: itemToSave}).promise();

			return apiSuccess({pollId});
		}
	} else if (event.httpMethod === 'GET') {
		const {pollId} = event.pathParameters;

		const response = await dynamoDbClient.get({Key: {pollId}, ConsistentRead: true}).promise();
		return response?.Item ? apiSuccess(response?.Item) : notFoundError('No poll found for pollId');
	}
	return apiError('invalid request');
};
