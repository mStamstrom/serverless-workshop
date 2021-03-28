/*
const putJSON = require('./put-json'),
	dbName = process.env.POLLINGTABLE,
	aws = require('aws-sdk');
describe('exercise 5', () => {
	let dynamoDbClient, readFromPrimaryPartition;
	const readItem = async (key) => {
		const response = await dynamoDbClient.get({Key: key, ConsistentRead: readFromPrimaryPartition}).promise();
		return response?.Item;
	};
	beforeEach(() => {
		jest.setTimeout(30000);
		readFromPrimaryPartition = true;
		dynamoDbClient = new aws.DynamoDB.DocumentClient({
			params: {TableName: dbName}
		});
	});
	test('PUT /polls saves the poll to Dynamo', async () => {
		const response = await putJSON(process.env.APIURL + '/polls', {
				question: 'What is the meaning of life?',
				answers: ['42', 'Something else']
			}),
			{pollId} = JSON.parse(response.body),
			itemFromDb = await readItem({pollId});
		expect(itemFromDb.pollId).toEqual(pollId);
		expect(itemFromDb.question).toEqual('What is the meaning of life?');
		expect(itemFromDb.answers).toEqual(['42', 'Something else']);
		expect(itemFromDb.counts).toEqual({});
	});
});
*/
