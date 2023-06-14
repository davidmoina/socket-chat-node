const { request, response } = require('express');
const { uploadFile } = require('../helpers/');
const { User, Product } = require('../models/');
const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const loadFile = async (req = request, res = response) => {
	try {
		// si no se desea mandar extensiones poner undefined en el parámetro del medio
		const name = await uploadFile(req.files, ['txt', 'md'], 'textos');
		res.json({
			name,
		});
	} catch (error) {
		res.status(400).json({
			error,
		});
	}
};

const updateImg = async (req = request, res = response) => {
	const { collection, id } = req.params;

	let model;

	switch (collection) {
		case 'users':
			model = await User.findById(id);

			if (!model) {
				return res.status(400).json({
					msg: `No existe un usuario con el id: ${id}`,
				});
			}
			break;
		case 'products':
			model = await Product.findById(id);

			if (!model) {
				return res.status(400).json({
					msg: `No existe un producto con el id: ${id}`,
				});
			}
			break;

		default:
			return res
				.status(500)
				.json({ msg: 'Todavía no se ha validado esta colección' });
	}

	// Borrar imágenes previas en el servidor (carpeta uploads)
	if (model.img) {
		// hay que borrar la imagen del servidor
		const pathImg = path.join(__dirname, '../uploads', collection, model.img);
		if (fs.existsSync(pathImg)) {
			fs.unlinkSync(pathImg);
		}
	}

	const name = await uploadFile(req.files, undefined, collection);
	model.img = name;

	await model.save();

	res.json(model);
};

const showImage = async (req = request, res = response) => {
	const { collection, id } = req.params;

	let model;

	switch (collection) {
		case 'users':
			model = await User.findById(id);

			if (!model) {
				return res.status(400).json({
					msg: `No existe un usuario con el id: ${id}`,
				});
			}
			break;
		case 'products':
			model = await Product.findById(id);

			if (!model) {
				return res.status(400).json({
					msg: `No existe un producto con el id: ${id}`,
				});
			}
			break;

		default:
			return res
				.status(500)
				.json({ msg: 'Todavía no se ha validado esta colección' });
	}

	// Borrar imágenes previas en el servidor (carpeta uploads)
	if (model.img) {
		// hay que borrar la imagen del servidor
		const pathImg = path.join(__dirname, '../uploads', collection, model.img);
		if (fs.existsSync(pathImg)) {
			return res.sendFile(pathImg);
		}
	}

	const defaultImg = path.join(__dirname, '../assets/no-image.jpg');
	res.sendFile(defaultImg);
};

const updateCloudinaryImg = async (req = request, res = response) => {
	const { collection, id } = req.params;

	let model;

	switch (collection) {
		case 'users':
			model = await User.findById(id);

			if (!model) {
				return res.status(400).json({
					msg: `No existe un usuario con el id: ${id}`,
				});
			}
			break;
		case 'products':
			model = await Product.findById(id);

			if (!model) {
				return res.status(400).json({
					msg: `No existe un producto con el id: ${id}`,
				});
			}
			break;

		default:
			return res
				.status(500)
				.json({ msg: 'Todavía no se ha validado esta colección' });
	}

	// Borrar imágenes previas
	if (model.img) {
		const nameArr = model.img.split('/');
		const name = nameArr[nameArr.length - 1];
		const [public_id] = name.split('.');

		cloudinary.uploader.destroy(public_id);
	}

	const { tempFilePath } = req.files.file;
	const { secure_url } = await cloudinary.uploader.upload(tempFilePath);
	model.img = secure_url;

	await model.save();

	res.json(model);
};

module.exports = {
	loadFile,
	updateImg,
	showImage,
	updateCloudinaryImg,
};
