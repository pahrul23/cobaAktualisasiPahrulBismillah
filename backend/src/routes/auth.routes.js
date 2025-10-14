const express = require('express');
const authController = require('../controllers/auth.controller');
const { authGuard } = require('../middlewares/authGuard');
const router = express.Router();

// Route yang sudah ada
router.post('/login', authController.login);
router.get('/me', authGuard, authController.getMe);

// Route BARU untuk forgot password
router.post('/check-email', authController.checkEmail);
router.post('/reset-password', authController.resetPassword);

module.exports = router;