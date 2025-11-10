const upload = require('../middleware/uploadImage'); // Multer-S3 middleware

const uploadFile = (req, res) => {
  res.send({
    message: 'Upload successful!',
    fileUrl: req.file.location,
  });
};

module.exports = { uploadFile };
