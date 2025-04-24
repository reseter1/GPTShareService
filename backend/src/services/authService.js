const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, PendingRequest } = require('../models');
const { Op } = require('sequelize');
const crypto = require('crypto');
const { sendEmail } = require('./emailService');
const APP_NAME = process.env.APP_NAME || 'GPT Share';
const APP_URL = process.env.FRONTEND_URL || 'https://gptshare.reseter.space';

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const JWT_EXPIRES_IN = '24h';
const PASSWORD_RESET_EXPIRES = 60 * 60 * 1000;
const EMAIL_VERIFICATION_EXPIRES = 24 * 60 * 60 * 1000;

const register = async (userData) => {
    try {
        if (!userData.username || userData.username.length < 5) {
            throw new Error('Username must be at least 5 characters');
        }

        if (!/^[a-z]+$/.test(userData.username)) {
            throw new Error('Username must contain only lowercase letters (a-z)');
        }

        const existingUser = await User.findOne({
            where: {
                [Op.or]: [
                    { username: userData.username },
                    { email: userData.email }
                ]
            }
        });

        if (existingUser) {
            if (existingUser.username === userData.username) {
                throw new Error('Username already exists');
            }
            if (existingUser.email === userData.email) {
                throw new Error('Email already exists');
            }
        }

        const hashedPassword = await bcrypt.hash(userData.password, SALT_ROUNDS);

        const newUser = await User.create({
            ...userData,
            password: hashedPassword,
            active: false
        });

        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + EMAIL_VERIFICATION_EXPIRES);

        await PendingRequest.create({
            user_id: newUser.id,
            request_type: 'email_verification',
            token,
            status: 'pending',
            expires_at: expiresAt
        });

        const verificationLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?userId=${newUser.id}&token=${token}`;

        await sendEmail(
            newUser.email,
            `${APP_NAME} - Verify your account`,
            'emailVerification',
            {
                username: newUser.username,
                verificationLink,
                appName: APP_NAME,
                appUrl: APP_URL
            }
        );

        const { password, ...userWithoutPassword } = newUser.toJSON();

        return {
            user: userWithoutPassword,
            message: 'Account created successfully. Please check your email to verify your account.'
        };
    } catch (error) {
        throw error;
    }
};

const verifyEmail = async (userId, token) => {
    try {
        const user = await User.findByPk(userId);

        if (!user) {
            throw new Error('User not found');
        }

        if (user.active) {
            return { message: 'Account already verified' };
        }

        const verificationRequest = await PendingRequest.findOne({
            where: {
                user_id: userId,
                token,
                request_type: 'email_verification',
                status: 'pending',
                expires_at: {
                    [Op.gt]: new Date()
                }
            }
        });

        if (!verificationRequest) {
            throw new Error('Invalid or expired verification link');
        }

        await user.update({ active: true });

        await verificationRequest.update({ status: 'confirmed' });

        return { message: 'Account verified successfully. You can now login.' };
    } catch (error) {
        throw error;
    }
};

const login = async (email, password) => {
    try {
        const user = await User.findOne({
            where: { email }
        });

        if (!user) {
            throw new Error('Email or password is incorrect');
        }

        if (!user.active) {
            throw new Error('Account is not active. Please check your email to verify your account.');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new Error('Email or password is incorrect');
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        const { password: _, ...userWithoutPassword } = user.toJSON();

        return {
            user: userWithoutPassword,
            token
        };
    } catch (error) {
        throw error;
    }
};

const changePassword = async (userId, oldPassword, newPassword) => {
    try {
        const user = await User.findByPk(userId);

        if (!user) {
            throw new Error('User not found');
        }

        const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

        if (!isPasswordValid) {
            throw new Error('Old password is incorrect');
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

        await user.update({ password: hashedNewPassword });

        return { message: 'Password changed successfully' };
    } catch (error) {
        throw error;
    }
};

const getUserProfile = async (userId) => {
    try {
        const user = await User.findByPk(userId, {
            attributes: { exclude: ['password'] }
        });

        if (!user) {
            throw new Error('User not found');
        }

        return user;
    } catch (error) {
        throw error;
    }
};

const requestPasswordReset = async (email) => {
    try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            throw new Error('Email không tồn tại trong hệ thống');
        }

        const token = crypto.randomBytes(32).toString('hex');

        const expiresAt = new Date(Date.now() + PASSWORD_RESET_EXPIRES);

        await PendingRequest.create({
            user_id: user.id,
            request_type: 'reset_password',
            token,
            status: 'pending',
            expires_at: expiresAt
        });

        const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${token}&userId=${user.id}`;

        await sendEmail(
            user.email,
            `${APP_NAME} - Reset Password`,
            'resetPasswordEmail',
            { resetLink, appName: APP_NAME, appUrl: APP_URL, username: user.username }
        );

        return { message: 'Reset password email has been sent' };
    } catch (error) {
        throw error;
    }
};

const resetPassword = async (userId, token, newPassword) => {
    try {
        const user = await User.findByPk(userId);

        if (!user) {
            throw new Error('User not found');
        }

        const resetRequest = await PendingRequest.findOne({
            where: {
                user_id: userId,
                token,
                request_type: 'reset_password',
                status: 'pending',
                expires_at: {
                    [Op.gt]: new Date()
                }
            }
        });

        if (!resetRequest) {
            throw new Error('Invalid or expired token');
        }

        const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

        await user.update({ password: hashedPassword });

        await resetRequest.update({ status: 'confirmed' });

        return { message: 'Password has been reset successfully' };
    } catch (error) {
        throw error;
    }
};

module.exports = {
    register,
    login,
    changePassword,
    getUserProfile,
    requestPasswordReset,
    resetPassword,
    verifyEmail
}; 