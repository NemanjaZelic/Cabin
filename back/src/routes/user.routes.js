const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const multer = require('multer');
router.use(protect);
router.get('/me', userController.getMe);
router.put('/me', (req, res, next) => {
  upload.single('profileImage')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'UNEXPECTED_FIELD') {
        return res.status(400).json({
          success: false,
          message: 'Neočekivano polje u zahtevu. Koristite "profileImage" za sliku.'
        });
      }
      return res.status(400).json({
        success: false,
        message: `Greška pri upload-u: ${err.message}`
      });
    } else if (err) {
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }
    next();
  });
}, userController.updateProfile);
router.put('/change-password', userController.changePassword);
router.get('/:id', authorize('admin'), userController.getUserById);
module.exports = router;
