const dbName = process.env.POLLINGTABLE,
	resultsQueue = process.env.RESULTSQUEUE,
	aws = require('aws-sdk');
describe('exercise 7', () => {
	let dynamoDbClient, sqs;
	beforeEach(() => {
		jest.setTimeout(30000);
		dynamoDbClient = new aws.DynamoDB.DocumentClient({
			params: {TableName: dbName}
		});
		sqs = new aws.SQS();
	});
	const saveItem = (itemToSave) => {
			return dynamoDbClient.put({Item: itemToSave}).promise();
		},
		waitOnQueue = async () => {
			const receipt = await sqs.receiveMessage({
				QueueUrl: resultsQueue,
				WaitTimeSeconds: 1,
				AttributeNames: ['MessageGroupId'],
				MaxNumberOfMessages: 1
			}).promise();
			return receipt.Messages && receipt.Messages[0];
		},
		waitForPollId = async (pollId) => {
			const oneMessage = await waitOnQueue();
			if (!oneMessage) {
				return waitForPollId(pollId);
			}
			if (oneMessage.Attributes.MessageGroupId !== pollId) {
				return waitForPollId(pollId);
			}
			return oneMessage;
		};
	test('saving a poll to dynamo causes it to be sent to the SQS queue', async () => {
		if (!resultsQueue) {
			throw 'RESULTSQUEUE not set in env.json, please set it';
		}
		const pollId = 'test-' + Date.now(),
			itemToSave = {pollId, question: 'Is this OK?', answers: ['Yes', 'No'], counts: {} };
		await saveItem(itemToSave);
		const result = await waitForPollId(pollId);
		expect(result.Attributes.MessageGroupId).toEqual(pollId);
		expect(JSON.parse(result.Body)).toEqual(itemToSave);
	});
});
