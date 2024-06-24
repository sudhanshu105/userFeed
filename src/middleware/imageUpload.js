const multer = require('multer');
const multerS3 = require('multer-s3');
const s3 = require('../controllers/awsConfig');
require('dotenv').config();

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_S3_BUCKET_NAME,
    // acl: 'public-read',
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      cb(null, `profileImages/${Date.now().toString()}_${file.originalname}`);
    },
  }),
});

module.exports = upload;
