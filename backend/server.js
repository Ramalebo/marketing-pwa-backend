const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const { sequelize, testConnection } = require('./config/database');
const models = require('./models');

dotenv.config();

const app = express();

// Connect to database and sync models
(async () => {
  try {
    await testConnection();
    // Sync database: creates tables if missing; alter: true adds missing columns to existing tables (e.g. ads.reach, engagement, spend, channel)
    const alter = process.env.NODE_ENV !== 'production' || process.env.DB_ALTER === '1';
    await sequelize.sync({ alter });
    console.log('Database models synchronized' + (alter ? ' (alter applied)' : ''));
  } catch (error) {
    console.error('Database sync error:', error);
    process.exit(1);
  }
})();

// Middleware
// CORS configuration - allow development and production (Render: set FRONTEND_URL=https://dominantlogic.tech)
const allowedOrigins = [
  'https://dominantlogic.tech',
  'https://www.dominantlogic.tech',
  'http://localhost:8080',
  'http://localhost:3000',
  'http://127.0.0.1:8080',
  'http://127.0.0.1:3000'
];

if (process.env.FRONTEND_URL) {
  const url = process.env.FRONTEND_URL.replace(/\/$/, '');
  if (!allowedOrigins.includes(url)) allowedOrigins.push(url);
  const withWww = url.replace(/^(https?:\/\/)([^/]+)/, '$1www.$2');
  if (withWww !== url && !allowedOrigins.includes(withWww)) allowedOrigins.push(withWww);
}

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      // In development, be more permissive
      if (process.env.NODE_ENV !== 'production') {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check for Render (no auth, no DB required)
app.get('/health', (req, res) => {
  res.status(200).json({ ok: true, service: 'marketing-pwa-backend' });
});

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/clients', require('./routes/clients'));
app.use('/api/notes', require('./routes/notes'));
app.use('/api/ads', require('./routes/ads'));
app.use('/api/display', require('./routes/displayTracking'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/insights', require('./routes/insights'));
app.use('/api/chatbot', require('./routes/chatbot'));
app.use('/api/sms', require('./routes/sms'));
app.use('/api/email', require('./routes/email'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/social-media', require('./routes/social-media'));
app.use('/api/hashtags', require('./routes/hashtags'));
app.use('/api/templates', require('./routes/templates'));
app.use('/api/post-history', require('./routes/post-history'));
app.use('/api/scheduled-posts', require('./routes/scheduled-posts'));
app.use('/api/customer-contacts', require('./routes/customer-contacts'));
app.use('/api/meta', require('./routes/meta-compliance'));
app.use('/api/optimization', require('./routes/optimization'));
app.use('/api/beacons', require('./routes/beacons'));

// Frontend is served separately on cPanel, so we don't serve it here
// This backend only handles API requests

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';
app.listen(Number(PORT), HOST, () => {
  console.log(`Server running on ${HOST}:${PORT}`);
});

