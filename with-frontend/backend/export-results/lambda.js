'use strict';
const RequestHandler = require('./request-handler'),
	parseEvent = require('./parse-event'),
	resultsQueue = process.env.RESULTSQUEUE,
	aws = require('aws-sdk'),
	SQSResultsPublisher = require('./sqs-results-publisher'),
	logger = process.env.DEBUG ? console : null;

exports.handler = async function (event, context) {
	const
		sqs = new aws.SQS({logger}),
		resultsPublisher = new SQSResultsPublisher({sqs, queue: resultsQueue, requestId: context.awsRequestId}),
		requestHandler = new RequestHandler({resultsPublisher}),
		records = parseEvent(event);
	return requestHandler.processRecords(records);
};
