module.exports = function SQSResultsPublisher({sqs, queue, requestId}) {
	if (!sqs || !queue || !requestId) {
		throw new Error('invalid args');
	}
	this.publish = async function (pollId, results) {
		await sqs.sendMessage({
			QueueUrl: queue,
			MessageBody: JSON.stringify(results),
			MessageGroupId: pollId,
			MessageDeduplicationId: pollId + requestId
		}).promise();
	};
};
