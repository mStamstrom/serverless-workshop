/*
const putJSON = require('./put-json');
describe('exercise 3', () => {
	beforeEach(() => {
		jest.setTimeout(30000);
	});
	test('api contains a pollId in the body of the response PUT /polls', async () => {
		const response = await putJSON(process.env.APIURL + '/polls', {
				question: 'What is the meaning of life?',
				answers: ['42', 'Something else']
			}),
			parsedBody = JSON.parse(response.body);
		expect(response.headers['content-type']).toEqual('application/json');
		expect(typeof parsedBody.pollId).toEqual('string');
	});
	test('api returns a unique ID for each created poll', async () => {
		const response1 = await putJSON(process.env.APIURL + '/polls', {
				question: 'What is the meaning of life?',
				answers: ['42', 'Something else']
			}),
			parsedBody1 = JSON.parse(response1.body),
			response2 = await putJSON(process.env.APIURL + '/polls', {
				question: 'What is the meaning of life?',
				answers: ['42', 'Something else']
			}),
			parsedBody2 = JSON.parse(response2.body);
		expect(parsedBody1.pollId).not.toEqual(parsedBody2.pollId);
	});
});
*/
