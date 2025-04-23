const validateEmail = (req, res, next) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Email is not valid'
            });
        }

        if (!email.endsWith('@gmail.com')) {
            return res.status(400).json({
                success: false,
                message: 'System only accept email with @gmail.com'
            });
        }

        next();
    } catch (error) {
        console.error('Error checking email:', error.message);
        return res.status(500).json({
            success: false,
            message: 'An error occurred while checking email',
            error: error.message
        });
    }
};

module.exports = {
    validateEmail
}; 