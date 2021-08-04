const dbName = process.env.POLLINGTABLE,
	aws = require('aws-sdk');
describe('exercise 4', () => {
	let pollId, dynamoDbClient, readFromPrimaryPartition;
	beforeEach(() => {
		jest.setTimeout(30000);
		readFromPrimaryPartition = true;
		pollId = 'poll-' + Date.now();
		
		// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html
		dynamoDbClient = new aws.DynamoDB.DocumentClient({
			params: {TableName: dbName}
		});
	});
	const saveItem = (itemToSave) => {
			return dynamoDbClient.put({Item: itemToSave}).promise();
		},
		readItem = async (key) => {
			const response = await dynamoDbClient.get({Key: key, ConsistentRead: readFromPrimaryPartition}).promise();
			return response?.Item;
		};
	test('save and read from dynamo', async () => {
		if (!dbName) {
			throw 'POLLINGTABLE not set in env.json';
		}
		const itemToSave = {pollId, question: 'Is this OK?', answers: ['Yes', 'No'], counts: {'Yes': 20, 'No': 50} };
		await saveItem(itemToSave);
		const itemFromDb = await readItem({pollId});
		expect(itemFromDb.pollId).toEqual(pollId);
		expect(itemFromDb.question).toEqual('Is this OK?');
		expect(itemFromDb.answers).toEqual(['Yes', 'No']);
		expect(itemFromDb.counts).toEqual({'Yes': 20, 'No': 50});
	});
});
