const path = require('path');
const { v4: uuidv4 } = require('uuid');

// extensiones validas por defecto
const allowedExtensionsDefault = ['png', 'jpg', 'jpeg', 'gif'];

const uploadFile = (
	files,
	allowedExtensions = allowedExtensionsDefault,
	folder = ''
) => {
	return new Promise((resolve, reject) => {
		const { file } = files;
		const cutName = file.name.split('.');
		const fileExtension = cutName[cutName.length - 1];

		if (!allowedExtensions.includes(fileExtension)) {
			return reject(
				`La extension .${fileExtension} no es permitida. Permitidas: ${allowedExtensions}`
			);
		}

		const tempName = uuidv4() + '.' + fileExtension;
		const uploadPath = path.join(__dirname, '../uploads/', folder, tempName);

		file.mv(uploadPath, err => {
			if (err) {
				reject(err);
			}

			resolve(tempName);
		});
	});
};

module.exports = {
	uploadFile,
};
