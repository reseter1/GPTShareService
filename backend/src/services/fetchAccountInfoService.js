const cheerio = require('cheerio');
require('dotenv').config({ path: './src/.env' });
const axios = require('axios');
const { HttpsProxyAgent } = require('https-proxy-agent');

const proxy = {
    host: '191.101.127.46',
    port: 50100,
    auth: {
        username: 'fhXCTaPu',
        password: 'mSoA1bifsu'
    }
};

const agent = new HttpsProxyAgent(`http://${proxy.auth.username}:${proxy.auth.password}@${proxy.host}:${proxy.port}`);

const axiosInstance = axios.create({
    timeout: 60000,
    httpsAgent: agent,
    httpAgent: agent
});

const fetchAccountInfo = async () => {
    const cookie = process.env.MAIN_COOKIE;
    const { data: html } = await axiosInstance.get(process.env.FETCH_ACCOUNT_INFO_URL, {
        headers: {
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "cookie": cookie,
            "Referer": "https://evoto.vn/login/menu/"
        }
    });

    const $ = cheerio.load(html);
    const scriptElement = $('script#wc-blocks-middleware-js-before');
    let scriptContent = scriptElement.length > 0 ? scriptElement.html() : null;

    let storeApiNonce = null;
    let wcStoreApiNonceTimestamp = null;

    if (scriptContent) {
        const nonceMatch = scriptContent.match(/storeApiNonce: '([^']+)'/);
        const timestampMatch = scriptContent.match(/wcStoreApiNonceTimestamp: '([^']+)'/);

        storeApiNonce = nonceMatch?.[1] || null;
        wcStoreApiNonceTimestamp = timestampMatch?.[1] || null;
    }

    if (!storeApiNonce || !wcStoreApiNonceTimestamp) {
        throw new Error('Not found nonce and timestamp api');
    }

    const extractAccountInfo = (accountNum) => {
        const accountElement = $(`p:contains("Tài khoản ${accountNum}:")`);
        const passwordElement = $(`p:contains("Mật khẩu ${accountNum}:")`);
        
        let email = null;
        let password = null;

        if (passwordElement.length > 0) {
            const passwordMatch = passwordElement.html().match(new RegExp(`Mật khẩu ${accountNum}:<\\/strong>\\s*([^<\\s]+)`));
            password = passwordMatch?.[1]?.trim() || null;
        }

        if (accountElement.length > 0) {
            const emailMatch = accountElement.html().match(new RegExp(`Tài khoản ${accountNum}:<\\/strong>\\s*([^<\\s]+)`));
            email = emailMatch?.[1]?.trim() || null;
        }

        return { email, password };
    };

    const { email: email1, password: password1 } = extractAccountInfo(1);
    const { email: email2, password: password2 } = extractAccountInfo(2);
    const { email: email3, password: password3 } = extractAccountInfo(3);

    if (!email1 || !email2 || !email3 || !password1 || !password2 || !password3) {
        throw new Error('Not found email or password account');
    }

    return {
        email1, email2, email3,
        password1, password2, password3,
        storeApiNonce, wcStoreApiNonceTimestamp
    };
}

const fetch2FACode = async (action, nonce) => {
    const cookie = process.env.MAIN_COOKIE;
    const { data: response } = await axiosInstance.post(
        process.env.FETCH_2FA_CODE_URL,
        `action=${action}&nonce=${nonce}`,
        {
            headers: {
                "accept": "*/*",
                "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                "x-requested-with": "XMLHttpRequest",
                "cookie": cookie,
                "Referer": "https://evoto.vn/login/chatgpt/"
            }
        }
    );

    if (response.success && response.data?.code) {
        return response.data.code;
    }
    throw new Error('Failed to fetch 2FA code');
}

module.exports = {
    fetchAccountInfo,
    fetch2FACode
};