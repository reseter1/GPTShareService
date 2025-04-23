const validateStrongPassword = (req, res, next) => {
    try {
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({
                success: false,
                message: 'Password is required'
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 8 characters long'
            });
        }

        if (!/[A-Z]/.test(password)) {
            return res.status(400).json({
                success: false,
                message: 'Password must contain at least one uppercase letter'
            });
        }

        if (!/[a-z]/.test(password)) {
            return res.status(400).json({
                success: false,
                message: 'Password must contain at least one lowercase letter'
            });
        }

        if (!/[0-9]/.test(password)) {
            return res.status(400).json({
                success: false,
                message: 'Password must contain at least one number'
            });
        }

        // Kiểm tra ký tự đặc biệt
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            return res.status(400).json({
                success: false,
                message: 'Password must contain at least one special character (!@#$%^&*(),.?":{}|<>)'
            });
        }

        next();
    } catch (error) {
        console.error('Error checking strong password:', error.message);
        return res.status(500).json({
            success: false,
            message: 'An error occurred while checking the password',
            error: error.message
        });
    }
};

module.exports = {
    validateStrongPassword
}; 