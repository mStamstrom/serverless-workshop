'use strict';
const dbName = process.env.POLLINGTABLE,
	metricsGroup = process.env.METRICS_GROUP,
	verboseLogging = process.env.DEBUG,
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
	}),
	{ metricScope, Unit } = require('aws-embedded-metrics');


exports.handler = metricScope(metrics => async (event, context) => {
	if (verboseLogging) {
		console.log(event);
	}
	const logger = verboseLogging ? console: false,
		dynamoDbClient = new aws.DynamoDB.DocumentClient({
			params: {TableName: dbName},
			logger
		});
	metrics.setNamespace(metricsGroup);
	if (event.httpMethod === 'PUT' && event.body) {
		const body = JSON.parse(event.body);
		if (!body.question || !Array.isArray(body.answers) || body.answers.length < 1) {
			return apiError('question or answers missing');
		} else {
			const pollId = context.awsRequestId,
				{question, answers} = body;
			await dynamoDbClient.put({Item: {pollId, question, answers, counts: {} }}).promise();
			console.log({action: 'create', pollId});
			metrics.putMetric('Polls Created', 1, Unit.Count);
			metrics.putMetric('Success', 1, Unit.Count);
			return apiSuccess({pollId});
		}
	}
	if (event.httpMethod === 'GET' && event.pathParameters) {
		const {pollId} = event.pathParameters,
			response = await dynamoDbClient.get({Key: {pollId}}).promise();
		if (response.Item) {
			console.log({action: 'view', pollId});
			metrics.putMetric('Polls Viewed', 1, Unit.Count);
			metrics.putMetric('Success', 1, Unit.Count);
			return apiSuccess(response.Item);
		}
	}
	metrics.putMetric('Error', 1, Unit.Count);
	console.error(event);
	return apiError('invalid request');
});
