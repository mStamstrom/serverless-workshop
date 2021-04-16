const apiUrl = process.env.APIURL,
	putJSON = require('./put-json'),
	postJSON = require('./post-json'),
	getJSON = require('./get-json');
describe('exercise 7', () => {
	beforeEach(() => {
		jest.setTimeout(30000);
	});
	describe('access through the API', () => {
		test('increment counter on a new vote using the /polls/pollId endpoint', async () => {
			const creationResponse = await putJSON(apiUrl + '/polls', {
					question: 'What is the meaning of life?',
					answers: ['42', 'Something else']
				}),
				{pollId} = JSON.parse(creationResponse.body),
				pollApiUrl = apiUrl + '/polls/' + pollId;
			await postJSON(pollApiUrl, {answer: '42'});
			const itemFromApi = await getJSON(pollApiUrl);
			expect(itemFromApi.pollId).toEqual(pollId);
			expect(itemFromApi.question).toEqual('What is the meaning of life?');
			expect(itemFromApi.answers).toEqual(['42', 'Something else']);
			expect(itemFromApi.counts).toEqual({'42': 1});
			expect(itemFromApi.totalVotes).toEqual(1);
		});
		test('fails to increment non-existing polls', async () => {
			await expect(postJSON(apiUrl + '/polls/non-existing-poll-id', {answer: '42'})).rejects.toMatchObject({body: 'poll does not exist'});
		});
		test('increment counter on an existing vote using the /votes/pollId endpoint', async () => {
			const creationResponse = await putJSON(apiUrl + '/polls', {
					question: 'What is the meaning of life?',
					answers: ['42', 'Something else']
				}),
				{pollId} = JSON.parse(creationResponse.body),
				pollApiUrl = apiUrl + '/polls/' + pollId;
			await postJSON(pollApiUrl, {answer: '42'});
			await postJSON(pollApiUrl, {answer: '42'});
			await postJSON(pollApiUrl, {answer: 'Something else'});
			const itemFromApi = await getJSON(pollApiUrl);
			expect(itemFromApi.pollId).toEqual(pollId);
			expect(itemFromApi.question).toEqual('What is the meaning of life?');
			expect(itemFromApi.answers).toEqual(['42', 'Something else']);
			expect(itemFromApi.counts).toEqual({'42': 2, 'Something else': 1});
			expect(itemFromApi.totalVotes).toEqual(3);
		});
	});
});
