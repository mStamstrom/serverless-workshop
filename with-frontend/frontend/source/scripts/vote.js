const searchParams = new URLSearchParams(window.location.search.slice(1)),
	pollId = searchParams.get('pollId'),
	resultsUrl = '/view.html?pollId=' + encodeURIComponent(pollId);
const start = function () {
	const apiUrl = document.querySelector('meta[name=APIURL]').getAttribute('content'),
		answerTemplate = document.querySelector('[data-role=answer-template]'),
		alertDiv = document.querySelector('[role=alert]'),
		buttons = document.querySelector('[data-role=buttons]'),
		questionDiv = document.querySelector('[data-role=question]'),
		resultsLink = document.querySelector('[data-role=results-link]'),
		getJSON = async function(url = '') {
			const response = await fetch(url, {
				method: 'GET',
				cache: 'no-cache',
				headers: {
					'Content-Type': 'application/json'
				},
				referrerPolicy: 'no-referrer'
			});
			return response.json();
		},
		postJSON = async function(url = '', data = {}) {
			const response = await fetch(url, {
				method: 'POST',
				cache: 'no-cache',
				headers: {
					'Content-Type': 'application/json'
				},
				referrerPolicy: 'no-referrer',
				body: JSON.stringify(data)
			});
			return response.json();
		},
		appendAnswer = (text, index) => {
			const next = answerTemplate.cloneNode(true),
				nextId = `answer${index}`,
				input = next.querySelector('input'),
				label = next.querySelector('label');
			input.setAttribute('id', nextId);
			input.setAttribute('value', text);
			label.setAttribute('for', nextId);
			label.innerText = text;
			buttons.insertAdjacentElement('beforebegin', next);
		},
		tryLoading = async () => {
			alertDiv.classList.add('invisible');
			try {
				const {question, answers} = await getJSON(apiUrl + '/polls/' + pollId);
				questionDiv.innerText = question;
				answers.forEach(appendAnswer);
				buttons.classList.remove('invisible');
			} catch (err) {
				alertDiv.classList.remove('invisible');
				alertDiv.innerHTML = 'could not load: ' + String(err);
				console.error(err);
			}
		},
		restoreButtons = () => {
			Array.from(buttons.querySelectorAll('button[type=submit]')).forEach(b => {
				b.removeAttribute('disabled');
				b.classList.toggle('progress-bar-striped');
				b.classList.toggle('progress-bar-animated');
			});
		},
		blockButtons = () => {
			Array.from(buttons.querySelectorAll('button[type=submit]')).forEach(b => {
				b.setAttribute('disabled', 'true');
				b.classList.toggle('progress-bar-striped');
				b.classList.toggle('progress-bar-animated');
			});
		},
		trySubmitting = async (e) => {
			e.preventDefault();
			blockButtons();
			alertDiv.classList.add('invisible');
			try {
				const selected = Array.from(document.querySelectorAll('input[type=radio]')).find(t => t.checked);
				if (!selected) {
					throw 'Please select an option';
				}
				await postJSON(apiUrl + '/polls/' + pollId, {answer: selected.value});
				window.location.replace(resultsLink);
			} catch (err) {
				alertDiv.classList.remove('invisible');
				alertDiv.innerHTML = 'could not send: ' + String(err);
				console.error(err);
			}
			restoreButtons();
		};


	answerTemplate.remove();
	tryLoading();
	resultsLink.setAttribute('href', resultsUrl);
	document.querySelector('form').addEventListener('submit', trySubmitting);
};
window.addEventListener('DOMContentLoaded', start);
