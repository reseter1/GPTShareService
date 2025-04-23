const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const passwordMiddleware = require('../middleware/passwordMiddleware');
const emailMiddleware = require('../middleware/emailMiddleware');

router.post('/register', emailMiddleware.validateEmail, passwordMiddleware.validateStrongPassword, authController.register);

router.post('/login', authController.login);

router.post('/verify-email', authController.verifyEmail);

router.post('/change-password', authMiddleware.authenticate, passwordMiddleware.validateStrongPassword, authController.changePassword);

router.get('/profile', authMiddleware.authenticate, authController.getProfile);

router.post('/forgot-password', emailMiddleware.validateEmail, authController.requestPasswordReset);

router.post('/reset-password', passwordMiddleware.validateStrongPassword, authController.resetPassword);

module.exports = router; 