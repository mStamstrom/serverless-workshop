'use strict';
module.exports = function parseEvent(event) {
	return event.Records.map(r => JSON.parse(r.body));
};
