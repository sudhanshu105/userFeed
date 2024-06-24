const multer = require('multer');
const multerS3 = require('multer-s3');
const s3 = require('../controllers/awsConfig');
require('dotenv').config();

const upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: process.env.AWS_S3_BUCKET_NAME,
    //   acl: 'public-read',
      contentType: multerS3.AUTO_CONTENT_TYPE,
      metadata: (req, file, cb) => {
        cb(null, { fieldName: file.fieldname });
      },
      key: (req, file, cb) => {
        cb(null, `posts/${Date.now().toString()}_${file.originalname}`);
      },
    }),
  });

module.exports = upload;
