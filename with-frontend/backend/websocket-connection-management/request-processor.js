'use strict';
module.exports = function RequestProcessor({logger, connectionRepository}) {
	if (!logger || !connectionRepository) {
		throw new Error('invalid-args');
	}
	this.processRequest = async (request) => {
		logger?.log(request);
		const {connectionId} = request;
		if (request.type === 'create') {
			await connectionRepository.create(connectionId, request.params);
		} else if (request.type === 'delete') {
			await connectionRepository.delete(connectionId);
		} else {
			throw new Error('unsupported request type', request.type);
		}
	};
};
