// server.js - entry point for the Lovely Gas Company API
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorHandler');

// Route modules
const authRoutes = require('./routes/authRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const userRoutes = require('./routes/userRoutes');
const inquiryRoutes = require('./routes/inquiryRoutes');
const statsRoutes = require('./routes/statsRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

// Connect to MongoDB
connectDB();

const app = express();

// Core middleware
app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL || '*',
    credentials: true,
  })
);
app.use(morgan('dev'));

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'ok', name: 'Lovely Gas Company API' });
});

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/users', userRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/upload', uploadRoutes);

// 404 + centralized error handling (must be last)
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Lovely Gas Company API running on http://localhost:${PORT}`);
});

module.exports = app;
