const verboseLog = process.env.DEBUG,
	dbName = process.env.CONNECTION_TABLE,
	parseEvent = require('./parse-event'),
	RequestProcessor = require('./request-processor'),
	DynamoDBConnectionRepository = require('./dynamodb-connection-repository'),
	groupName = process.env.GROUP_NAME,
	groupIndexName = process.env.GROUP_INDEX_NAME,
	endpoint = process.env.MESSAGE_ENDPOINT,
	WebSocketMessageSender = require('./web-socket-message-sender'),
	aws = require('aws-sdk'),
	logger = verboseLog ? console: null;
exports.handler = async (event) => {
	logger?.log(JSON.stringify(event));
	const batch = parseEvent(event),
		dynamoDbClient = new aws.DynamoDB.DocumentClient({
			params: {TableName: dbName},
			logger
		}),
		apiGatewayManagementApi = new aws.ApiGatewayManagementApi({endpoint}),
		messageSender = new WebSocketMessageSender({apiGatewayManagementApi}),
		connectionRepository = new DynamoDBConnectionRepository({dynamoDbClient, groupName, groupIndexName}),
		requestProcessor = new RequestProcessor({logger, connectionRepository, messageSender});
	await Promise.all(batch.map(requestProcessor.processRequest));
};

