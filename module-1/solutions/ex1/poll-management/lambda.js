'use strict';
const apiSuccess = response => ({
	'statusCode': 200,
	'body': JSON.stringify(response),
	'headers': {
		'Content-Type': 'application/json'
	}
});
exports.handler = async () => {
	return apiSuccess('ok');
};
