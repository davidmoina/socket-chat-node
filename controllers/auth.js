const { request, response } = require('express');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const { generateJWT } = require('../helpers/generate-jwt');
const { googleVerify } = require('../helpers/google-verify');

const login = async (req = request, res = response) => {
	const { email, password } = req.body;

	try {
		//verificar si el email existe
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(400).json({
				msg: 'El usuario o contraseña no son correctos - email',
			});
		}
		// verificar si el usuario esta activo en la DB
		if (!user.status) {
			return res.status(400).json({
				msg: 'El usuario o contraseña no son correctos - status: false',
			});
		}
		// verificar la contraseña
		const validatePass = bcrypt.compareSync(password, user.password);
		if (!validatePass) {
			return res.status(400).json({
				msg: 'El usuario o contraseña no son correctos - password',
			});
		}

		// generar el JWT
		const token = await generateJWT(user.id);

		res.json({
			user,
			token,
		});
	} catch (error) {
		return res.status(500).json({
			msg: 'Algo salió mal',
		});
	}
};

const googleSingIn = async (req = request, res = response) => {
	const { id_token } = req.body;

	try {
		const { name, email, picture } = await googleVerify(id_token);

		//verificar si el correo ya existe
		let user = await User.findOne({ email });

		if (!user) {
			// si no existe se crea el usuario
			const data = {
				name,
				email,
				password: '',
				picture,
				google: true,
				role: 'USER_ROLE',
			};

			user = new User(data);
			await user.save();
		}

		// si el usuario en DB
		if (!user.status) {
			res.status(401).json({
				msg: 'Hable con el administrador, usuario bloqueado',
			});
		}

		// generar el JWT
		const token = await generateJWT(user.id);

		res.json({
			user,
			token,
		});
	} catch (error) {
		console.log(error);
		return res.status(400).json({
			msg: 'El token no se pudo verificar',
		});
	}
};

const renewToken = async (req = request, res = response) => {
	const { user } = req;

	// generar el JWT
	const token = await generateJWT(user.id);

	res.json({
		user,
		token,
	});
};

module.exports = {
	login,
	googleSingIn,
	renewToken,
};
