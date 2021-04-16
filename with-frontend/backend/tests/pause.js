module.exports = function pause(duration) {
	return new Promise(resolve => {
		setTimeout(() => resolve(duration), duration);
	});
};
