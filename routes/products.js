const { Router } = require('express');
const { check } = require('express-validator');
const { validateJWT, validateFields, isAdminRole } = require('../middlewares');
const {
	addProduct,
	getProduct,
	getProducts,
	updateProduct,
	removeProduct,
} = require('../controllers/products');
const { productExists, categoryExists } = require('../helpers/db-validators');

const router = Router();

//obtener todas las categorías - publico
router.get('/', getProducts);

//obtener una categoría - publico
router.get(
	'/:id',
	[
		check('id', 'No es un id valido').isMongoId(),
		check('id').custom(productExists),
		validateFields,
	],
	getProduct
);
// crear nueva categoría - privado - cualquier persona con un token valido
router.post(
	'/',
	[
		validateJWT,
		check('name', 'El nombre es obligatorio').not().isEmpty(),
		check('category', 'No es un id de mongoDB').isMongoId(),
		check('category').custom(categoryExists),
		validateFields,
	],
	addProduct
);
// actualizar un registro por id - privado
router.put(
	'/:id',
	[
		validateJWT,
		check('id').custom(productExists),
		// check('category', 'No es un id de mongoDB').isMongoId(),
		// check('category').custom(categoryExists),
		validateFields,
	],
	updateProduct
);
// borrar una categoría - admin
router.delete(
	'/:id',
	[
		validateJWT,
		isAdminRole,
		check('id', 'No es un id de mongoDB valido').isMongoId(),
		check('id').custom(productExists),
		validateFields,
	],
	removeProduct
);
module.exports = router;
