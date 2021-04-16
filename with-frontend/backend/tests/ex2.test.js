const putJSON = require('./put-json');
describe('exercise 2', () => {
	beforeEach(() => {
		jest.setTimeout(30000);
		if (!process.env.APIURL) {
			throw 'APIURL not set, edit env.json';
		}
	});
	test('api responds with invalid-request if no body', async () => {
		await expect(putJSON(process.env.APIURL + '/polls')).rejects.toMatchObject({
			statusCode: 400,
			body: 'invalid request'
		});
	});
	test('api responds with error message if no question', async () => {
		const body =  {
			answers: ['42', 'Something else']
		};
		await expect(putJSON(process.env.APIURL + '/polls', body)).rejects.toMatchObject({
			statusCode: 400,
			body: 'question or answers missing'
		});
	});
	test('api responds with error message if no answers', async () => {
		const body = {
			question: 'What is the meaning of life?'
		};
		await expect(putJSON(process.env.APIURL + '/polls', body)).rejects.toMatchObject({
			statusCode: 400,
			body: 'question or answers missing'
		});
	});
});
