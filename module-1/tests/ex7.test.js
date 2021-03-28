/*
const getJSON = require('./get-json'),
	putJSON = require('./put-json');
describe('exercise 7', () => {
	beforeEach(() => {
		jest.setTimeout(30000);
	});
	test('GET /polls/id reads a poll from the API', async () => {
		const creationResponse = await putJSON(process.env.APIURL + '/polls', {
				question: 'What is the meaning of life?',
				answers: ['42', 'Something else']
			}),
			{pollId} = JSON.parse(creationResponse.body),
			itemFromApi = await getJSON(process.env.APIURL + '/polls/' + pollId);
		expect(itemFromApi.pollId).toEqual(pollId);
		expect(itemFromApi.question).toEqual('What is the meaning of life?');
		expect(itemFromApi.answers).toEqual(['42', 'Something else']);
		expect(itemFromApi.counts).toEqual({});
	});
});
*/
