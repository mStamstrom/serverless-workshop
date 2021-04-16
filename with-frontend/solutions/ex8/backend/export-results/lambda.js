'use strict';
const resultsQueue = process.env.RESULTSQUEUE,
	aws = require('aws-sdk'),
	SQSResultsPublisher = require('./sqs-results-publisher'),
	RequestHandler = require('./request-handler'),
	parseEvent = require('./parse-event'),
	logger = process.env.DEBUG ? console : null;

exports.handler = async function (event, context) {
	logger?.log(JSON.stringify({event, params: process.env}));
	const sqs = new aws.SQS({logger}),
		resultsPublisher = new SQSResultsPublisher({sqs, queue: resultsQueue, requestId: context.awsRequestId}),
		requestHandler = new RequestHandler({resultsPublisher}),
		records = parseEvent(event);
	return requestHandler.processRecords(records);
};
