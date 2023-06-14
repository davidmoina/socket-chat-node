const { Router } = require('express');
const { check } = require('express-validator');
const { validateFields, validateFile } = require('../middlewares');
const {
	loadFile,
	updateImg,
	showImage,
	updateCloudinaryImg,
} = require('../controllers/uploads');
const { validateCollections } = require('../helpers');

const router = Router();

router.post('/', validateFile, loadFile);
router.put(
	'/:collection/:id',
	[
		validateFile,
		check('id', 'El id debe ser un id de mongoDB').isMongoId(),
		check('collection').custom(c =>
			validateCollections(c, ['users', 'products'])
		),
		validateFields,
	],
	updateCloudinaryImg
	// updateImg
);

router.get('/:collection/:id', [
	check('id', 'El id debe ser un id de mongoDB').isMongoId(),
	check('collection').custom(c =>
		validateCollections(c, ['users', 'products'])
	),
	showImage,
]);

module.exports = router;
