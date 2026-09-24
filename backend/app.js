const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
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

// Centralized error handling
app.use(errorHandler);

module.exports = app;
