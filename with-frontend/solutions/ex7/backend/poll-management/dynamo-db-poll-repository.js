module.exports = function DynamoDBPollRepository({dynamoDbClient}) {
	if (!dynamoDbClient) {
		throw new Error('invalid args');
	}
	this.incrementCount = async (pollId, votedOption) => {
		try {
			await dynamoDbClient.update({
				Key: {pollId},
				UpdateExpression:
				'SET totalVotes =  if_not_exists(totalVotes, :zero) + :inc, ' +
				' counts.#answer = if_not_exists(counts.#answer, :zero) + :inc',
				ConditionExpression: 'attribute_exists(pollId)',
				ExpressionAttributeNames: {
					'#answer': votedOption
				},
				ExpressionAttributeValues: {
					':inc': 1,
					':zero': 0
				}
			}).promise();
		} catch (e) {
			if (e.code === 'ConditionalCheckFailedException') {
				throw 'poll does not exist';
			}
			throw e;
		}
	};
	this.create = async ({pollId, question, answers}) => {
		await dynamoDbClient.put({Item: {pollId, question, answers, counts: {} }}).promise();
	};
	this.findById = async (pollId) => {
		const response = await dynamoDbClient.get({Key: {pollId}}).promise();
		return response?.Item;
	};
};
