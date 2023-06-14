const { Router } = require('express');
const { check } = require('express-validator');

const {
	validateFields,
	validateJWT,
	isAdminRole,
	hasRole,
} = require('../middlewares');

const {
	isValidRole,
	emailExists,
	userIdExists,
} = require('../helpers/db-validators');

const {
	usersGet,
	usersPut,
	usersPost,
	usersDelete,
	usersPatch,
} = require('../controllers/users');

const router = Router();

router.get('/', usersGet);

router.put(
	'/:id',
	[
		check('id', 'No es un id valido').isMongoId(),
		check('id').custom(userIdExists),
		check('role').custom(isValidRole),
		validateFields,
	],
	usersPut
);

router.post(
	'/',
	[
		check('name', 'El nombre es obligatorio').not().isEmpty(),
		check(
			'password',
			'La contraseña debe ser mas larga de 6 caracteres'
		).isLength({ min: 6 }),
		check('email', 'El correo no es valido').isEmail(),
		check('email').custom(emailExists),
		// check('role', 'El rol no es valido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
		check('role').custom(isValidRole),
		validateFields,
	],
	usersPost
);

router.delete(
	'/:id',
	[
		validateJWT,
		// isAdminRole,
		hasRole('ADMIN_ROLE', 'USER_ROLE'),
		check('id', 'No es un id valido').isMongoId(),
		check('id').custom(userIdExists),
		validateFields,
	],
	usersDelete
);

router.patch('/', usersPatch);

module.exports = router;
