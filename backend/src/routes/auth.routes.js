// Path: /backend/src/routes/auth.routes.js
const express = require('express');
const authController = require('../controllers/auth.controller');
const { authGuard } = require('../middlewares/authGuard');

const router = express.Router();

router.post('/login', authController.login);
router.get('/me', authGuard, authController.getMe);

module.exports = router;