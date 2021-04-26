module.exports = function DynamoDBPollRepository({dynamoDbClient}) {
	if (!dynamoDbClient) {
		throw new Error('invalid args');
	}
	this.create = async (connectionId, attributes) => {
		if (!connectionId) {
			throw new Error('invalid-args');
		}
		const item = Object.assign({}, attributes, {connectionId});
		await dynamoDbClient.put({Item: item}).promise();
	};
	this.delete = async (connectionId) => {
		await dynamoDbClient.delete({Key: {connectionId}}).promise();
	};
};
