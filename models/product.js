const { Schema, model } = require('mongoose');

const ProductSchema = Schema({
	name: {
		type: String,
		required: [true, 'El nombre es obligatorio'],
		unique: true,
	},
	status: {
		type: Boolean,
		default: true,
		required: true,
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	price: {
		type: Number,
		default: 0,
	},
	category: {
		type: Schema.Types.ObjectId,
		ref: 'Category',
		required: true,
	},
	description: String,
	inStock: {
		type: Boolean,
		default: true,
	},
	img: String,
});

ProductSchema.methods.toJSON = function () {
	const { __v, status, ...rest } = this.toObject();

	return rest;
};

module.exports = model('Product', ProductSchema);
