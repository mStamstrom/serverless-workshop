const dbName = process.env.POLLINGTABLE,
	apiUrl = process.env.APIURL,
	putJSON = require('./put-json'),
	getJSON = require('./get-json'),
	aws = require('aws-sdk');
describe('exercise 7', () => {
	let dynamoDbClient, readFromPrimaryPartition;
	beforeEach(() => {
		jest.setTimeout(30000);
		readFromPrimaryPartition = true;
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
		},
		incrementCount = async (pollId, votedOption) => {
			await dynamoDbClient.update({
				Key: {pollId},
				UpdateExpression: 'SET #counts.#answer = if_not_exists(#counts.#answer, :zero) + :inc',
				ExpressionAttributeNames: {
					'#counts': 'counts',
					'#answer': votedOption,
				},
				ExpressionAttributeValues: {
					':inc': 1,
					':zero': 0
				}
			}).promise();
		};
	test('save and read from dynamo', async () => {
		const pollId = 'test-' + Date.now(),
			itemToSave = {pollId, question: 'Is this OK?', answers: ['Yes', 'No'], counts: {} };
		await saveItem(itemToSave);
		await incrementCount(pollId, 'Yes');
		const itemFromDb = await readItem({pollId});
		expect(itemFromDb.pollId).toEqual(pollId);
		expect(itemFromDb.question).toEqual('Is this OK?');
		expect(itemFromDb.answers).toEqual(['Yes', 'No']);
		expect(itemFromDb.counts).toEqual({'Yes': 1});
	});
	test('increment counter on a new vote using the /votes/pollId endpoint', async () => {
		const creationResponse = await putJSON(apiUrl + '/polls', {
				question: 'What is the meaning of life?',
				answers: ['42', 'Something else']
			}),
			{pollId} = JSON.parse(creationResponse.body);
		await putJSON(apiUrl + '/votes/' + pollId, {answer: '42'});
		const itemFromApi = await getJSON(apiUrl + '/polls/' + pollId);
		expect(itemFromApi.pollId).toEqual(pollId);
		expect(itemFromApi.question).toEqual('What is the meaning of life?');
		expect(itemFromApi.answers).toEqual(['42', 'Something else']);
		expect(itemFromApi.counts).toEqual({'42': 1});
	});
	test('increment counter on an existing vote using the /votes/pollId endpoint', async () => {
		const creationResponse = await putJSON(apiUrl + '/polls', {
				question: 'What is the meaning of life?',
				answers: ['42', 'Something else']
			}),
			{pollId} = JSON.parse(creationResponse.body);
		await putJSON(apiUrl + '/votes/' + pollId, {answer: '42'});
		await putJSON(apiUrl + '/votes/' + pollId, {answer: '42'});
		await putJSON(apiUrl + '/votes/' + pollId, {answer: '42'});
		const itemFromApi = await getJSON(apiUrl + '/polls/' + pollId);
		expect(itemFromApi.pollId).toEqual(pollId);
		expect(itemFromApi.question).toEqual('What is the meaning of life?');
		expect(itemFromApi.answers).toEqual(['42', 'Something else']);
		expect(itemFromApi.counts).toEqual({'42': 3});
	});
});
