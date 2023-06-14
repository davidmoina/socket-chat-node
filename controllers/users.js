const { response, request } = require('express');
const bcrypt = require('bcryptjs');

const User = require('../models/user');

const usersGet = async (req = request, res = response) => {
	const { limit = 5, from = 0 } = req.query;
	const query = { status: true };

	// Primero espera que se resuelva una promesa y luego ejecuta la siguiente
	// const users = await User.find(query).skip(Number(from)).limit(Number(limit));
	// const total = await User.countDocuments();

	// Ejecuta las dos promesas de manera simultanea y espero a que las dos se resuelvan
	const [users, total] = await Promise.all([
		User.find(query).skip(Number(from)).limit(Number(limit)),
		User.countDocuments(query),
	]);

	res.json({ total, users });
};

const usersPost = async (req, res = response) => {
	const { name, email, password, role } = req.body;
	const user = new User({ name, email, password, role });

	//encriptar la contraseña
	const salt = bcrypt.genSaltSync();
	user.password = bcrypt.hashSync(password, salt);

	//guardar en la base de datos
	await user.save();

	res.json({
		user,
	});
};

const usersPut = async (req, res = response) => {
	const { id } = req.params;
	const { _id, password, google, email, ...rest } = req.body;

	if (password) {
		//encriptar la contraseña
		const salt = bcrypt.genSaltSync();
		rest.password = bcrypt.hashSync(password, salt);
	}

	const user = await User.findByIdAndUpdate(id, rest);

	res.json(user);
};

const usersPatch = (req, res = response) => {
	res.json({
		msg: 'patch API - usersPatch',
	});
};

const usersDelete = async (req, res = response) => {
	const { id } = req.params;

	// Físicamente lo borramos
	// const user = await User.findByIdAndDelete(id);

	const user = await User.findByIdAndUpdate(id, { status: false });

	res.json(user);
};

module.exports = {
	usersGet,
	usersPost,
	usersPut,
	usersPatch,
	usersDelete,
};
