const express = require('express');
const cors = require('cors');
require('dotenv').config();
const logger = require('./utils/logger');
const pinoHttp = require('pino-http');
const pool = require('./config/db'); // Database connection import kar rahe hain taake server start hote hi check ho jaye

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Pino HTTP logger middleware (har incoming request ko log karega)
app.use(pinoHttp({ logger }));

// Test Route (Health Check)
app.get('/', (req, res) => {
  logger.info('Root route accessed');
  res.json({ message: 'Notes App Backend is up and running successfully!' });
});

// Server Listen
app.listen(PORT, () => {
  logger.info(`Server is running smoothly on port ${PORT}`);
});

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);