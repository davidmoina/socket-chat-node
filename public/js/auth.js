const form = document.querySelector('form');
const url = 'http://localhost:8080/api/auth';

form.addEventListener('submit', ev => {
	ev.preventDefault();

	const formData = {};

	for (let el of form.elements) {
		if (el.name.length > 0) {
			formData[el.name] = el.value;
		}
	}

	console.log(formData);
	fetch(url + '/login', {
		method: 'POST',
		body: JSON.stringify(formData),
		headers: {
			'Content-type': 'application/json',
		},
	})
		.then(resp => resp.json())
		.then(({ msg, token }) => {
			if (msg) {
				return console.log(msg);
			}

			localStorage.setItem('token', token);
			window.location = 'chat.html';
		})
		.catch(error => console.log(error));
});

function handleCredentialResponse(response) {
	// Google Token
	// console.log("ID token: ",response.credential);
	const body = { id_token: response.credential };

	fetch(url + '/google', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(body),
	})
		.then(resp => resp.json())
		.then(({ token }) => {
			localStorage.setItem('token', token);
		})
		.catch(console.warn);
}

const button = document.getElementById('google_signout');
button.onclick = () => {
	console.log(google.accounts.id);
	google.accounts.id.disableAutoSelect();

	google.accounts.id.revoke(localStorage.getItem('email'), done => {
		localStorage.clear();
		location.reload();
	});
};
