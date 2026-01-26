const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const { sequelize, testConnection } = require('./config/database');
const models = require('./models');

dotenv.config();

const app = express();

// Connect to MySQL and sync models
(async () => {
  try {
    await testConnection();
    // Sync database (creates tables if they don't exist)
    // Use { alter: true } for development, { force: true } to drop and recreate
    await sequelize.sync({ alter: false });
    console.log('Database models synchronized');
  } catch (error) {
    console.error('Database sync error:', error);
    process.exit(1);
  }
})();

// Middleware
// CORS configuration - allow frontend domain
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'https://dominantlogic.tech',
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/clients', require('./routes/clients'));
app.use('/api/notes', require('./routes/notes'));
app.use('/api/ads', require('./routes/ads'));
app.use('/api/insights', require('./routes/insights'));
app.use('/api/chatbot', require('./routes/chatbot'));
app.use('/api/sms', require('./routes/sms'));
app.use('/api/email', require('./routes/email'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/social-media', require('./routes/social-media'));
app.use('/api/hashtags', require('./routes/hashtags'));
app.use('/api/templates', require('./routes/templates'));
app.use('/api/post-history', require('./routes/post-history'));
app.use('/api/customer-contacts', require('./routes/customer-contacts'));

// Frontend is served separately on cPanel, so we don't serve it here
// This backend only handles API requests

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

