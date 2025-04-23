const express = require('express');
require('dotenv').config({ path: './src/.env' });
const db = require('./models');
const authRoutes = require('./routes/authRoutes');
const mainRoutes = require('./routes/mainRoutes');
const supportRoutes = require('./routes/supportRoutes');
const corsMiddleware = require('./middleware/corsMiddleware');
const app = express();

app.use(corsMiddleware);
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/gpt-fetcher', mainRoutes);
app.use('/api/support', supportRoutes);
app.get('/', (req, res) => {
    res.json({ success: true, message: 'API is running' });
});

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
        error: 'Route not found'
    });
});


const PORT = process.env.PORT || 3000;

db.sequelize.sync({ alter: false })
    .then(() => {
        console.log('Database synchronized');
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('Error synchronizing database:', err);
    });