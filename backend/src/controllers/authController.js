const authService = require('../services/authService');

const register = async (req, res) => {
    try {
        const { username, email, password, displayName } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required information: username, email, and password'
            });
        }

        const registrationResult = await authService.register({
            username,
            email,
            password,
            displayName: displayName || username
        });

        return res.status(201).json({
            success: true,
            message: 'Account created successfully, please verify your email',
            data: registrationResult.user
        });
    } catch (error) {
        console.error('Register error:', error.message);

        if (error.message.includes('exists')) {
            return res.status(409).json({
                success: false,
                message: error.message
            });
        }

        if (error.message.includes('Username must be at least 5 characters')) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        if (error.message.includes('Username must contain only lowercase letters (a-z)')) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        return res.status(500).json({
            success: false,
            message: 'An error occurred while creating an account',
            error: error.message
        });
    }
};

const verifyEmail = async (req, res) => {
    try {
        const { userId, token } = req.body;

        if (!userId || !token) {
            return res.status(400).json({
                success: false,
                message: 'Missing required information to verify account'
            });
        }

        const result = await authService.verifyEmail(userId, token);

        return res.status(200).json({
            success: true,
            message: result.message
        });
    } catch (error) {
        console.error('Email verification error:', error.message);

        if (error.message.includes('invalid') || error.message.includes('expired')) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        if (error.message.includes('not found')) {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }

        return res.status(500).json({
            success: false,
            message: 'An error occurred while verifying email',
            error: error.message
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required information: email and password'
            });
        }

        const { user, token } = await authService.login(email, password);

        return res.status(200).json({
            success: true,
            message: 'Login successful',
            data: { user, token }
        });
    } catch (error) {
        console.error('Login error:', error.message);

        if (error.message.includes('incorrect') || error.message.includes('disabled')) {
            return res.status(401).json({
                success: false,
                message: error.message
            });
        }

        return res.status(500).json({
            success: false,
            message: 'An error occurred while logging in',
            error: error.message
        });
    }
};

const changePassword = async (req, res) => {
    try {
        const userId = req.user.id;
        const { oldPassword, password } = req.body;

        if (!oldPassword || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required information: old password and new password'
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: 'New password must be at least 8 characters long'
            });
        }

        const result = await authService.changePassword(userId, oldPassword, password);

        return res.status(200).json({
            success: true,
            message: result.message
        });
    } catch (error) {
        console.error('Change password error:', error.message);

        if (error.message.includes('incorrect')) {
            return res.status(401).json({
                success: false,
                message: error.message
            });
        }

        if (error.message.includes('not found')) {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }

        return res.status(500).json({
            success: false,
            message: 'An error occurred while changing password',
            error: error.message
        });
    }
};

const getProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await authService.getUserProfile(userId);

        return res.status(200).json({
            success: true,
            message: 'User profile retrieved successfully',
            data: user
        });
    } catch (error) {
        console.error('Get profile error:', error.message);

        if (error.message.includes('not found')) {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }

        return res.status(500).json({
            success: false,
            message: 'An error occurred while retrieving user profile',
            error: error.message
        });
    }
};

const requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Please provide the email address'
            });
        }

        const result = await authService.requestPasswordReset(email);

        return res.status(200).json({
            success: true,
            message: result.message
        });
    } catch (error) {
        console.error('Request password reset error:', error.message);

        if (error.message.includes('not found')) {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }

        return res.status(500).json({
            success: false,
            message: 'An error occurred while sending a password reset request',
            error: error.message
        });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { userId, token, password } = req.body;

        if (!userId || !token || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required information: userId, token and password'
            });
        }

        const result = await authService.resetPassword(userId, token, password);

        return res.status(200).json({
            success: true,
            message: result.message
        });
    } catch (error) {
        console.error('Reset password error:', error.message);
        if (error.message.includes('invalid') || error.message.includes('expired')) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        if (error.message.includes('not found')) {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }

        return res.status(500).json({
            success: false,
            message: 'An error occurred while resetting password',
            error: error.message
        });
    }
};

module.exports = {
    register,
    login,
    changePassword,
    getProfile,
    requestPasswordReset,
    resetPassword,
    verifyEmail
}; 