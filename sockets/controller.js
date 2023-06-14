const { checkJWT } = require('../helpers');
const { ChatInfo } = require('../models');

const chatInfo = new ChatInfo();

const socketController = async (socket, io) => {
	const token = socket.handshake.headers['x-token'];
	const user = await checkJWT(token);

	if (!user) {
		return socket.disconnect();
	}

	// agregar el usuario conectado
	chatInfo.connectUser(user);
	io.emit('online-users', chatInfo.usersArr);
	socket.emit('receive-messages', chatInfo.last10);

	// conectar a una sala especial (salas: global, socket id, usuario)
	socket.join(user.id);

	// limpiar cuando alguien se desconecta
	socket.on('disconnect', () => {
		chatInfo.disconnectUser(user.id);
		io.emit('online-users', chatInfo.usersArr);
	});

	socket.on('send-message', ({ message, uid }) => {
		if (uid) {
			// mensaje privado
			socket.to(uid).emit('private-message', { from: user.name, message });
			return;
		}

		chatInfo.sendMessage(user.id, user.name, message);
		io.emit('receive-messages', chatInfo.last10);
	});
};

module.exports = {
	socketController,
};
