const mongoose = require('mongoose');
const logger = require('../utils/logger');

async function connectDB() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-feedback';
  try {
    await mongoose.connect(uri);
    logger.info('✅ MongoDB connected');
  } catch (error) {
    logger.error('❌ MongoDB connection failed:', error.message);
    throw error;
  }
}

module.exports = { connectDB };
