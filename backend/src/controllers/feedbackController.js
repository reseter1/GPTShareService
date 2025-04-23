const feedbackService = require('../services/feedbackService');

const sendFeedback = async (req, res) => {
    try {
        if (!req.body.email || !req.body.feedback) {
            return res.status(400).json({
                success: false,
                message: 'Email and feedback are required'
            });
        }

        const { email, feedback } = req.body;
        await feedbackService.sendFeedback(email, feedback);
        res.status(200).json({ success: true, message: 'Feedback sent successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

module.exports = {
    sendFeedback
}