const form = document.querySelector('.form');
const fields = [...form.querySelectorAll('.field__control')];
const submitButton = form.querySelector('.form__submit');
const failure = form.querySelector('.form__status');
const success = document.querySelector('.inquiry__success');
let sending = false;

const messages = {
	name: {
		required: 'Please enter your name.',
		short: 'Please enter at least 2 characters.',
		invalid: 'Names cannot contain numbers.',
	},
	email: {
		required: 'Please enter your email address.',
		invalid: 'Enter a valid email address, like name@example.com.',
	},
	phone: {
		invalid: 'Enter a valid phone number, without the country code.',
	},
	message: {
		required: 'Please tell us about the piece you have in mind.',
		short: 'Please write at least 10 characters so we can help.',
	},
};

function errorFor(field) {
	const text = messages[field.name];
	const value = field.value.trim();
	if (!value) return field.required ? text.required : '';
	if (value.length < field.minLength) return text.short;
	if (!field.validity.valid) return text.invalid;
	return '';
}

// Shows or clears the field's error and returns whether the field is valid
function validate(field) {
	const message = errorFor(field);
	const wrapper = field.closest('.field');
	const error = wrapper.querySelector('.field__error span');

	if (message) {
		error.textContent = message;
		field.setAttribute('aria-describedby', error.id);
	} else {
		field.removeAttribute('aria-describedby');
	}
	wrapper.classList.toggle('is-invalid', message !== '');
	field.setAttribute('aria-invalid', message !== '');
	return message === '';
}

// Empty fields stay quiet until the form is submitted; filled ones are checked on leaving
form.addEventListener('focusout', (event) => {
	const field = event.target;
	if (!fields.includes(field) || !field.value) return;
	field.value = field.value.trim();
	validate(field);
});

// Once a field shows an error it re-checks as the person types, so the error clears as soon as it is fixed
form.addEventListener('input', (event) => {
	const field = event.target;
	if (field.closest('.field').classList.contains('is-invalid')) validate(field);
});

async function sendInquiry(data) {
	const endpoint = form.getAttribute('action');

	// No form service is connected yet, so this pretends to send. Give the form an
	// action URL (Formspree, Netlify Forms, your own server) to send for real.
	if (!endpoint) {
		await new Promise((resolve) => setTimeout(resolve, 1500));
		return;
	}

	const response = await fetch(endpoint, {
		method: 'POST',
		body: data,
		headers: { Accept: 'application/json' },
	});
	if (!response.ok) throw new Error(`Inquiry failed with status ${response.status}`);
}

function setSending(isSending) {
	sending = isSending;
	submitButton.classList.toggle('is-loading', isSending);
	submitButton.setAttribute('aria-busy', isSending);
}

form.addEventListener('submit', async (event) => {
	event.preventDefault();
	if (sending) return;

	const invalidFields = fields.filter((field) => !validate(field));
	if (invalidFields.length > 0) {
		invalidFields[0].focus();
		return;
	}

	failure.hidden = true;
	setSending(true);
	try {
		const data = new FormData(form);
		if (!data.get('phone')) data.delete('phoneCountry');
		await sendInquiry(data);
		const firstName = form.elements.name.value.trim().split(/\s+/)[0];
		success.querySelector('.inquiry__success-title').textContent = `Thank you, ${firstName}.`;
		form.hidden = true;
		success.hidden = false;
		success.focus();
	} catch {
		failure.hidden = false;
	} finally {
		setSending(false);
	}
});
