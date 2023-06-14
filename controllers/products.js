const { request, response } = require('express');
const { Product } = require('../models');

// obtener todos los productos de manera paginada
const getProducts = async (req = request, res = response) => {
	const { limit = 5, from = 0 } = req.query;
	const query = { status: true };
	try {
		const [products, total] = await Promise.all([
			Product.find(query)
				.populate('user', 'name')
				.populate('category', 'name')
				.skip(Number(from))
				.limit(Number(limit)),
			Product.countDocuments(query),
		]);

		res.status(200).json({ total, products });
	} catch (error) {
		console.log(error);
		return res.status(400).json({
			msg: 'Error al obtener los productos',
		});
	}
};

// obtener producto por id
const getProduct = async (req = request, res = response) => {
	const { id } = req.params;

	try {
		const product = await Product.findById(id)
			.populate('user', 'name')
			.populate('category', 'name');

		res.status(200).json(product);
	} catch (error) {
		console.log(error);
		return res.status(400).json({
			msg: 'Error al obtener el producto',
		});
	}
};

// añadir un producto en la BD
const addProduct = async (req = request, res = response) => {
	const { status, user, ...rest } = req.body;

	const productDB = await Product.findOne({ name: rest.name });

	if (productDB) {
		return res.status(400).json({
			msg: `El producto ${productDB.name} ya existe`,
		});
	}

	//generar la data a guardar
	const data = {
		...rest,
		name: req.body.name.toUpperCase(),
		user: req.user._id,
	};

	const product = await new Product(data);

	// guardar DB
	await product.save();

	res.status(201).json(product);
};

// actualizar producto
const updateProduct = async (req = request, res = response) => {
	const { id } = req.params;
	const { status, user, ...data } = req.body;

	if (data.name) {
		data.name = data.name.toUpperCase();
	}
	data.user = req.user._id;

	try {
		const product = await Product.findByIdAndUpdate(id, data, { new: true });

		res.status(200).json(product);
	} catch (error) {
		console.log(error);
		return res.status(400).json({
			msg: 'Error al actualizar el producto',
		});
	}
};

// eliminar producto (no físicamente)
const removeProduct = async (req = request, res = response) => {
	const { id } = req.params;

	try {
		const product = await Product.findByIdAndUpdate(
			id,
			{ status: false },
			{ new: true }
		);

		res.json(product);
	} catch (error) {
		console.log(error);
		return res.status(400).json({
			msg: 'Error al eliminar el producto',
		});
	}
};

module.exports = {
	addProduct,
	getProduct,
	getProducts,
	updateProduct,
	removeProduct,
};
