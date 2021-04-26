const searchParams = new URLSearchParams(window.location.search.slice(1)),
	pollId = searchParams.get('pollId');
const start = function () {
	const apiUrl = document.querySelector('meta[name=APIURL]').getAttribute('content'),
		websocketUrl = document.querySelector('meta[name=WEBSOCKETURL]')?.getAttribute('content'),
		answerTemplate = document.querySelector('[data-role=answer-template]'),
		alertDiv = document.querySelector('[role=alert]'),
		questionDiv = document.querySelector('[data-role=question]'),
		totalVotesField = document.querySelector('[data-role=total-votes]'),
		container = answerTemplate.parentElement,
		votingLink = document.querySelector('[data-role=voting-link]'),
		getJSON = async function(url = '') {
			const response = await fetch(url, {
				method: 'GET',
				cache: 'no-cache',
				headers: {
					'Content-Type': 'application/json'
				},
				referrerPolicy: 'no-referrer'
			});
			return response.json(); // parses JSON response into native JavaScript objects
		},
		appendAnswer = (text, count = 0, total = 0) => {
			const next = answerTemplate.cloneNode(true),
				title = next.querySelector('[data-role=answer]'),
				votes = next.querySelector('[data-role=votes]');
			next.setAttribute('for', text);
			title.innerText = text;
			if (count > 0) {
				const percent = (count * 100 / total),
					percentAsText = percent.toFixed(2) + '%';
				votes.style.width = percentAsText;
				votes.setAttribute('aria-valuenow', percent);
				votes.innerHTML = percentAsText;
			}
			container.insertAdjacentElement('beforeEnd', next);
		},
		connectToWebSocket = async () => {
			if (!websocketUrl) {
				console.log('websocket URL not configured');
				return;
			}
			const socket = new WebSocket(websocketUrl + '?pollId=' + pollId);
			socket.addEventListener('open', function () {
				console.log('connected to websocket');
			});

			socket.addEventListener('message', function (evt) {
				console.log('Message from server ', evt.data);
				const {counts, totalVotes} = JSON.parse(event.data);
				if (totalVotes) {
					totalVotesField.value = totalVotes;
				}
				Object.keys(counts).forEach(answer => {
					const count = counts[answer];
					if (count > 0) {
						const percent = (count * 100 / totalVotes),
							percentAsText = percent.toFixed(2) + '%',
							votes = document.querySelector(`[data-role=answer-template][for="${answer}"] [data-role=votes]`);
						votes.style.width = percentAsText;
						votes.setAttribute('aria-valuenow', percent);
						votes.innerHTML = percentAsText;
					}
				});
			});
		},
		tryLoading = async () => {
			alertDiv.classList.add('invisible');
			try {
				const {question, answers, counts, totalVotes} = await getJSON(apiUrl + '/polls/' + pollId);
				questionDiv.innerText = question;
				answers.forEach(a => appendAnswer(a, counts[a], totalVotes));
				if (totalVotes) {
					totalVotesField.value = totalVotes;
				}
				votingLink.classList.remove('invisible');
				await connectToWebSocket();
			} catch (err) {
				alertDiv.classList.remove('invisible');
				alertDiv.innerHTML = 'could not load: ' + String(err);
				console.error(err);
			}
		};

	answerTemplate.remove();
	tryLoading();
	votingLink.setAttribute('href', '/vote.html?pollId=' + encodeURIComponent(pollId));

};
window.addEventListener('DOMContentLoaded', start);
