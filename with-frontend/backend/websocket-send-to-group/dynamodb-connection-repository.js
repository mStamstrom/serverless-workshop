const PAGE_SIZE = 200;
module.exports = function DynamoDBPollRepository({dynamoDbClient, groupIndexName, groupName}) {
	if (!dynamoDbClient || !groupIndexName || !groupName) {
		throw new Error('invalid args');
	}
	const findMatchingConnections = async (message, fromPageKey) => {
		const response = await dynamoDbClient.query({
				KeyConditionExpression: '#GroupName = :GroupName',
				IndexName: groupIndexName,
				ExpressionAttributeNames: {
					'#GroupName': groupName,
				},
				ExpressionAttributeValues: {
					':GroupName': message[groupName]
				},
				Limit: PAGE_SIZE,
				ExclusiveStartKey: fromPageKey
			}).promise(),
			connectionIds = response.Items.map(i => i.connectionId),
			nextPagingKey = response.LastEvaluatedKey;
		if (nextPagingKey) {
			const nextPage = await findMatchingConnections(message, nextPagingKey);
			return connectionIds.concat(nextPage);
		} else {
			return connectionIds;
		}
	};
	this.findMatchingConnections = findMatchingConnections;
};
