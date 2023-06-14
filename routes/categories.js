const { Router } = require('express');
const { check } = require('express-validator');
const { validateJWT, validateFields, isAdminRole } = require('../middlewares');
const {
	addCategory,
	getCategory,
	getCategories,
	updateCategory,
	removeCategory,
} = require('../controllers/categories');
const { categoryExists } = require('../helpers/db-validators');

const router = Router();

//obtener todas las categorías - publico
router.get('/', getCategories);

//obtener una categoría - publico
router.get(
	'/:id',
	[
		check('id', 'No es un id valido').isMongoId(),
		check('id').custom(categoryExists),
		validateFields,
	],
	getCategory
);
// crear nueva categoría - privado - cualquier persona con un token valido
router.post(
	'/',
	[
		validateJWT,
		check('name', 'El nombre es obligatorio').not().isEmpty(),
		validateFields,
	],
	addCategory
);
// actualizar un registro por id - privado
router.put(
	'/:id',
	[
		validateJWT,
		check('name', 'El nombre es obligatorio').not().isEmpty(),
		check('id').custom(categoryExists),
		validateFields,
	],
	updateCategory
);
// borrar una categoría - admin
router.delete(
	'/:id',
	[
		validateJWT,
		isAdminRole,
		check('id', 'No es un id de mongoDB valido').isMongoId(),
		check('id').custom(categoryExists),
		validateFields,
	],
	removeCategory
);
module.exports = router;
