module.exports = function apiSuccess (response, origin) {
	return {
		'statusCode': 200,
		'body': JSON.stringify(response),
		'headers': {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': origin
		}
	};
};
