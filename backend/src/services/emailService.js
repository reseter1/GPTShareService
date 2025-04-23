const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');
require('dotenv').config({ path: './src/.env' });

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    tls: {
        rejectUnauthorized: false
    }
});

const sendEmail = async (to, subject, templateName, context) => {
    try {
        const html = await ejs.renderFile(path.join(__dirname, '..', 'views', `${templateName}.ejs`), context);

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            html,
        };

        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully to:', to);
        return true;
    } catch (error) {
        console.error('Error sending email to', to, ':', error.message, 'Stack:', error.stack);
        throw error;
    }
};

module.exports = { sendEmail }; 