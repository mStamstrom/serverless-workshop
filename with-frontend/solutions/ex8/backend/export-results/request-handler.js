'use strict';
module.exports = function RequestHandler({resultsPublisher}) {
	if (!resultsPublisher) {
		throw new Error('invalid args');
	}
	this.processRecords = async function (records) {
		const finalStates = {};
		for (const record of records) {
			finalStates[record.pollId] = record;
		}
		for (const record of Object.values(finalStates)) {
			await resultsPublisher.publish(record.pollId, record);
		}
	};
};
