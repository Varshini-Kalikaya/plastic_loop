const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const fs = require('fs');
const errorHandler = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const plasticTypeRoutes = require('./routes/plasticTypeRoutes');
const pickupRoutes = require('./routes/pickupRoutes');
const collectorRoutes = require('./routes/collectorRoutes');
const recyclerRoutes = require('./routes/recyclerRoutes');
const rewardRoutes = require('./routes/rewardRoutes');
const adminRoutes = require('./routes/adminRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

const app = express();

// Trust reverse proxy (essential for Render / Heroku / Cloud hosting for HTTPS and IP detection)
app.set('trust proxy', 1);

// Security and Body parsers
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Path to frontend build (if deployed together or monolithic build)
const frontendDistPath = path.join(__dirname, '../frontend/dist');
const hasFrontendDist = fs.existsSync(frontendDistPath) && fs.existsSync(path.join(frontendDistPath, 'index.html'));

if (hasFrontendDist) {
  app.use(express.static(frontendDistPath));
}

// Root route handler
app.get('/', (req, res) => {
  if (hasFrontendDist) {
    return res.sendFile(path.join(frontendDistPath, 'index.html'));
  }
  res.status(200).json({
    success: true,
    service: 'PlasticLoop Backend REST API',
    status: 'Operational 🚀',
    version: '1.0.0',
    message: 'PlasticLoop backend API is live and operational!',
    healthCheck: '/api/health',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      user: '/api/user',
      plasticTypes: '/api/plastic-types',
      pickups: '/api/pickups',
      collector: '/api/collector',
      recycler: '/api/recycler',
      rewards: '/api/rewards',
      admin: '/api/admin',
      notifications: '/api/notifications',
      upload: '/api/upload',
    },
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'PlasticLoop REST API is operational 🚀',
    timestamp: new Date(),
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/plastic-types', plasticTypeRoutes);
app.use('/api/pickups', pickupRoutes);
app.use('/api/collector', collectorRoutes);
app.use('/api/recycler', recyclerRoutes);
app.use('/api/rewards', rewardRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/upload', uploadRoutes);

// SPA client-side routing fallback if frontend dist is served
if (hasFrontendDist) {
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return next();
    }
    res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
}

// Centralized error handling
app.use(errorHandler);

module.exports = app;
