const txtUid = document.querySelector('#txtUid');
const txtMessage = document.querySelector('#txtMessage');
const ulUsers = document.querySelector('#ulUsers');
const ulMessages = document.querySelector('#ulMessages');
const btnLogout = document.querySelector('#btnLogout');

let user, socket;
const url = 'http://localhost:8080/api/auth';

const validateJWT = async () => {
	const token = localStorage.getItem('token') || '';

	if (token.length <= 10) {
		window.location = 'index.html';
		throw new Error('No hay token en el servidor');
	}

	const response = await fetch(url, {
		headers: {
			'x-token': token,
		},
	});

	const { user: userDB, token: tokenDB } = await response.json();
	localStorage.setItem('token', tokenDB);
	user = userDB;

	document.title = user.name;

	await connectSocket();
};

const connectSocket = async () => {
	socket = io({
		extraHeaders: {
			'x-token': localStorage.getItem('token'),
		},
	});

	socket.on('connect', () => {
		console.log('Socket online');
	});

	socket.on('disconnect', () => {
		console.log('Socket offline');
	});

	socket.on('receive-messages', drawMessages);

	socket.on('online-users', drawUsers);

	socket.on('private-message', payload => {
		console.log('Privado: ', payload);
	});
};

const drawUsers = (users = []) => {
	let usersHtml = '';

	users.forEach(({ name, uid }) => {
		usersHtml += `
			<li>
				<p>
					<h5 class="text-success">${name}</h5>
					<span class="fs-6 text-muted">${uid}</span>
				</p>
			</li>
		`;
	});

	ulUsers.innerHTML = usersHtml;
};

const drawMessages = (messages = []) => {
	let messagesHtml = '';

	messages.forEach(({ name, message }) => {
		messagesHtml += `
			<li>
				<p>
					<span class="text-primary">${name}</span>
					<span >${message}</span>
				</p>
			</li>
		`;
	});

	ulMessages.innerHTML = messagesHtml;
};

txtMessage.addEventListener('keyup', ({ keyCode }) => {
	const message = txtMessage.value;
	const uid = txtUid.value;

	if (keyCode !== 13) return;
	if (keyCode.length === 0) return;

	socket.emit('send-message', { message, uid });

	txtMessage.value = '';
});

const main = async () => {
	await validateJWT();
};

main();
