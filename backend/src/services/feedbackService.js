require('dotenv').config({ path: './src/.env' });

const DISCORD_HOOK_URL = process.env.DISCORD_HOOK_URL;

const sendFeedback = async (email, feedback) => {
    const content = `Email: ${email}\nFeedback: ${feedback}`;
    const response = await fetch(DISCORD_HOOK_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content })
    });

    if (!response.ok) {
        throw new Error('Failed to send feedback');
    }

    return true;
}

module.exports = {
    sendFeedback
}