const express = require('express');
const router = express.Router();
const accountGPTController = require('../controllers/accountGPTController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/fetch-gpt-account', authMiddleware.authenticate, accountGPTController.getAccountInfo);
router.post('/fetch-2fa-code', authMiddleware.authenticate, accountGPTController.get2FACode);

module.exports = router;