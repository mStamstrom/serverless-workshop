const putJSON = require('./put-json');
describe('exercise 1', () => {
	beforeEach(() => {
		jest.setTimeout(30000);
		if (!process.env.APIURL) {
			throw 'APIURL not set, edit env.json';
		}
	});
	test('api responds to PUT /polls if body contains question and answers', async () => {
		const response = await putJSON(process.env.APIURL + '/polls', {
			question: 'What is the meaning of life?',
			answers: ['42', 'Something else']
		});
		expect(response.statusCode).toEqual(200);
		expect(response.headers['content-type']).toEqual('application/json');
	});
});
