const path = require('path');
const multer = require('multer');

const createStorage = (uploadField = '') => {
    return multer.diskStorage({
        destination: (req, file, cb) => {
            if (file.mimetype.startsWith('image/')) {
                cb(null, `uploads/${uploadField}`);
            } else {
                cb(new Error('Invalid image type'), null);
            }
        },
        filename: (req, file, cb) => {
            if (file.mimetype.startsWith('image/')) {
                cb(null, `${(new Date()).getTime()}${path.extname(file.originalname)}`);
            } else {
                cb(new Error('Invalid image type'), null);
            }
        }
    });
}

const profileStorage = createStorage('profiles');

module.exports = {
    createStorage,
    profileStorage
};