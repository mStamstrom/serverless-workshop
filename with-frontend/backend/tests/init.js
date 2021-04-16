module.exports = function init () {
	process.env.AWS_SDK_LOAD_CONFIG = true;
	try {
		const samLocalVars = require('./env.json');
		Object.assign(process.env, samLocalVars?.Parameters);
	} catch (e) {
		console.error('Could not find env.json, please create it');
	}
};
