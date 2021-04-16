'use strict';
const aws = require('aws-sdk'),
	dbName = process.env.POLLINGTABLE,
	RequestProcessor = require('./request-processor'),
	DynamoDBPollRepository = require('./dynamo-db-poll-repository'),
	parseRequest = require('./parse-request'),
	apiError = require('./api-error'),
	apiSuccess = require('./api-success'),
	logger = process.env.DEBUG ? console : null;


exports.handler = async (event, context) => {
	logger?.log(JSON.stringify({event, parameters: process.env}));
	const dynamoDbClient = new aws.DynamoDB.DocumentClient({
			params: {TableName: dbName},
			logger
		}),
		pollRepository = new DynamoDBPollRepository({dynamoDbClient}),
		requestProcessor = new RequestProcessor({pollRepository, logger});
	try {
		const request = parseRequest(event, context),
			result = await requestProcessor.processRequest(request);
		return apiSuccess(result, event.headers.origin);
	} catch (e) {
		return apiError(e, event.headers.origin);
	}
};
