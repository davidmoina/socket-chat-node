const { request, response } = require('express');
const { Category } = require('../models');

// getCategories - paginado - total - populate

const getCategories = async (req = request, res = response) => {
	const { limit = 5, from = 0 } = req.query;
	const query = { status: true };
	try {
		const [categories, total] = await Promise.all([
			Category.find(query)
				.populate('user', 'name')
				.skip(Number(from))
				.limit(Number(limit)),
			Category.countDocuments(query),
		]);

		res.status(200).json({ total, categories });
	} catch (error) {
		console.log(error);
		return res.status(400).json({
			msg: 'Error al obtener la categoría',
		});
	}
};

// getCAtegory - populate
const getCategory = async (req = request, res = response) => {
	const { id } = req.params;

	try {
		const category = await Category.findById(id).populate('user', 'name');

		res.status(200).json(category);
	} catch (error) {
		console.log(error);
		return res.status(400).json({
			msg: 'Error al obtener la categoría',
		});
	}
};

const addCategory = async (req = request, res = response) => {
	const name = req.body.name.toUpperCase();

	const categoryDB = await Category.findOne({ name });

	if (categoryDB) {
		return res.status(400).json({
			msg: `La categoría ${categoryDB.name} ya existe`,
		});
	}

	//generar la data a guardar
	const data = {
		name,
		user: req.user._id,
	};

	const category = await new Category(data);

	// guardar DB
	await category.save();

	res.status(201).json(category);
};

//updateCategory - recibe nombre
const updateCategory = async (req = request, res = response) => {
	const { id } = req.params;
	const { status, user, ...data } = req.body;

	data.name = data.name.toUpperCase();
	data.user = req.user._id;

	try {
		const category = await Category.findByIdAndUpdate(id, data, { new: true });

		res.status(200).json(category);
	} catch (error) {
		console.log(error);
		return res.status(400).json({
			msg: 'Error al actualizar la categoría',
		});
	}
};

// removeCategory - status: false - recibe id
const removeCategory = async (req = request, res = response) => {
	const { id } = req.params;

	try {
		const category = await Category.findByIdAndUpdate(
			id,
			{ status: false },
			{ new: true }
		);

		res.json(category);
	} catch (error) {
		console.log(error);
		return res.status(400).json({
			msg: 'Error al eliminar la categoría',
		});
	}
};

module.exports = {
	addCategory,
	getCategory,
	getCategories,
	updateCategory,
	removeCategory,
};
