exports.handler = async (/*event*/) => {
	//console.log(JSON.stringify(event, null, 2));
	return {
		'statusCode': 200,
		'body': 'hello world',
		'headers': {
			'Content-Type': 'text/plain'
		}
	};
};
