const { fetchAccountInfo, fetch2FACode } = require('../services/fetchAccountInfoService');

const getAccountInfo = async (req, res) => {
    try {
        const accountInfo = await fetchAccountInfo();

        res.status(200).json({
            success: true,
            message: 'Account info fetched successfully',
            data: accountInfo
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const get2FACode = async (req, res) => {
    try {
        const { account, nonce } = req.body;
        if (!account || !nonce) {
            throw new Error('Account and nonce are required');
        }

        let action = null;
        if (account === '1') {
            action = 'get_totp_code_account1';
        } else if (account === '2') {
            action = 'get_chatgpt_code_account2';
        } else if (account === '3') {
            action = 'get_totp_code_account3';
        }

        const code = await fetch2FACode(action, nonce);

        res.status(200).json({
            success: true,
            message: '2FA code fetched successfully',
            data: code
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

module.exports = { getAccountInfo, get2FACode  };