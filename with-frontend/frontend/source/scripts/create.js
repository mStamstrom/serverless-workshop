const initialAnswers = 2;
const start = function () {
	const apiUrl = document.querySelector('meta[name=APIURL]').getAttribute('content'),
		answerTemplate = document.querySelector('[data-role=answer-template]'),
		buttons = document.querySelector('[data-role=buttons]'),
		alertDiv = document.querySelector('[role=alert]'),
		putJSON = async function(url = '', data = {}) {
			// Default options are marked with *
			const response = await fetch(url, {
				method: 'PUT',
				cache: 'no-cache',
				headers: {
					'Content-Type': 'application/json'
				},
				referrerPolicy: 'no-referrer',
				body: JSON.stringify(data)
			});
			return response.json(); // parses JSON response into native JavaScript objects
		},
		appendAnswer = (required) => {
			const currentCount = document.querySelectorAll('[data-role=answer]').length,
				nextIndex = currentCount + 1,
				nextId = `answer${nextIndex}`,
				next = answerTemplate.cloneNode(true);
			next.setAttribute('data-role', 'answer');
			next.querySelector('input').setAttribute('id', nextId);
			if (required) {
				next.querySelector('input').setAttribute('required', 'true');
			}
			next.querySelector('label').setAttribute('for', nextId);
			next.querySelector('label').innerHTML = `Choice ${nextIndex}`;

			buttons.insertAdjacentElement('beforebegin', next);
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
				const question = document.querySelector('[data-role=question] input').value,
					answers = Array.from(document.querySelectorAll('[data-role=answer] input')).map(t => t.value?.trim()).filter(t => t),
					{pollId} = await putJSON(apiUrl + '/polls', {question, answers});
				window.location.replace('view.html?pollId=' + encodeURIComponent(pollId));
			} catch (err) {
				alertDiv.classList.remove('invisible');
				alertDiv.innerHTML = 'could not send: ' + String(err);
				console.error(err);
			}
			restoreButtons();
		};

	document.querySelector('form').addEventListener('submit', trySubmitting);
	document.querySelector('[data-role=add-more]').addEventListener('click', () => appendAnswer());
	answerTemplate.remove();
	for (let i = 0; i < initialAnswers; i++) {
		appendAnswer(true);
	}
};
window.addEventListener('DOMContentLoaded', start);
