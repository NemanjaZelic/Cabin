const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const upload = require('../middleware/upload');
router.post('/register', upload.single('profileImage'), authController.register);
router.post('/login', authController.login);
router.post('/admin/login', authController.adminLogin);
module.exports = router;
