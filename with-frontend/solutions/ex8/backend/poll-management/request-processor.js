module.exports = function RequestProcessor ({pollRepository, logger}) {
	if (!pollRepository) {
		throw new Error('invalid args');
	}
	this.processRequest = async function (request) {
		if (request.requestType === 'create') {
			const {question, answers} = request.body;
			if (!question || !Array.isArray(answers) || answers.length < 1) {
				throw 'question or answers missing';
			} else {
				const pollId = request.requestId;
				logger?.log({action: 'create', pollId});
				await pollRepository.create({pollId, answers, question});
				return {pollId};
			}
		}
		if (request.requestType === 'read' && request.pollId) {
			const fromDb = pollRepository.findById(request.pollId);
			if (fromDb) {
				logger?.log({action: 'view', pollId: request.pollId});
				return fromDb;
			}
		}
		if (request.requestType === 'vote' && request.pollId && request.body.answer) {
			await pollRepository.incrementCount(request.pollId, request.body.answer);
			logger?.log({action: 'vote', pollId: request.pollId});
			return {pollId: request.pollId};
		}
		throw 'invalid-request';
	};
};
