const multer = require('multer');
const path = require('path');
const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Samo slike su dozvoljene (JPG, PNG)'), false);
  }
};
const upload = multer({
  storage: storage,
  limits: {
    fileSize: process.env.MAX_FILE_SIZE || 5 * 1024 * 1024
  },
  fileFilter: fileFilter
});
module.exports = upload;
