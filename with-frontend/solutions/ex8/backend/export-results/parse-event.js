'use strict';
const aws = require('aws-sdk');
module.exports = function parseEvent(event) {
	return event.Records.map(r => aws.DynamoDB.Converter.unmarshall(r.dynamodb.NewImage));
};
