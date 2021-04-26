'use strict';
const verboseLog = process.env.DEBUG,
	dbName = process.env.CONNECTION_TABLE,
	parseEvent = require('./parse-event'),
	RequestProcessor = require('./request-processor'),
	DynamoDBConnectionRepository = require('./dynamodb-connection-repository'),
	aws = require('aws-sdk'),
	logger = verboseLog ? console: null;
exports.handler = async (event) => {
	logger?.log(JSON.stringify(event));
	const parsed = parseEvent(event),
		dynamoDbClient = new aws.DynamoDB.DocumentClient({
			params: {TableName: dbName},
			logger
		}),
		connectionRepository = new DynamoDBConnectionRepository({dynamoDbClient}),
		requestProcessor = new RequestProcessor({logger, connectionRepository});
	await requestProcessor.processRequest(parsed);
	return { statusCode: 200, body: JSON.stringify(parsed) };
};
