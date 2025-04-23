const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/feedback', authMiddleware.authenticate, feedbackController.sendFeedback);

module.exports = router;