const { Schema, model } = require('mongoose');

const UserSchema = Schema({
	name: {
		type: String,
		required: [true, 'el nombre es obligatorio'],
	},
	email: {
		type: String,
		required: [true, 'el email es obligatorio'],
		unique: true,
	},
	password: {
		type: String,
		required: [true, 'la contraseña es obligatoria'],
	},
	email: String,
	role: {
		type: String,
		required: true,
		enum: ['ADMIN_ROLE', 'USER_ROLE'],
	},
	status: {
		type: Boolean,
		default: true,
	},
	google: {
		type: Boolean,
		default: false,
	},
	img: {
		type: String,
	},
});

UserSchema.methods.toJSON = function () {
	const { __v, password, _id, ...rest } = this.toObject();

	rest.uid = _id;

	return rest;
};

module.exports = model('User', UserSchema);
