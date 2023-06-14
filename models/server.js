const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');
const fileUpload = require('express-fileupload');
const { createServer } = require('http');
const { socketController } = require('../sockets/controller');

class Server {
	constructor() {
		this.app = express();
		this.port = process.env.PORT;
		this.server = createServer(this.app);
		this.io = require('socket.io')(this.server);

		this.paths = {
			users: '/api/users',
			auth: '/api/auth',
			categories: '/api/categories',
			products: '/api/products',
			search: '/api/search',
			uploads: '/api/uploads',
		};

		//conectar a base de datos
		this.connectDB();

		// Middlewares
		this.middlewares();

		// Rutas de mi aplicación
		this.routes();

		// Sockets
		this.sockets();
	}

	async connectDB() {
		await dbConnection();
	}

	middlewares() {
		// CORS
		this.app.use(cors());

		// Lectura y parseo del body
		this.app.use(express.json());

		// Directorio Público
		this.app.use(express.static('public'));

		//manejar carga de archivos
		this.app.use(
			fileUpload({
				useTempFiles: true,
				tempFileDir: '/tmp/',
				createParentPath: true,
			})
		);
	}

	routes() {
		this.app.use(this.paths.auth, require('../routes/auth'));
		this.app.use(this.paths.users, require('../routes/users'));
		this.app.use(this.paths.categories, require('../routes/categories'));
		this.app.use(this.paths.products, require('../routes/products'));
		this.app.use(this.paths.search, require('../routes/search'));
		this.app.use(this.paths.uploads, require('../routes/uploads'));
	}

	sockets() {
		this.io.on('connection', socket => socketController(socket, this.io));
	}

	listen() {
		this.server.listen(this.port, () => {
			console.log('Servidor corriendo en puerto', this.port);
		});
	}
}

module.exports = Server;
