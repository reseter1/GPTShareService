const cors = require('cors');
require('dotenv').config({ path: './src/.env' });

const corsMiddleware = (req, res, next) => {
  const corsOptions = {
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200
  };

  cors(corsOptions)(req, res, next);
};

module.exports = corsMiddleware; 