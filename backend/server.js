import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

console.log('🚀 Server starting...');

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// ✅ ADD THIS TEST ROUTE
app.post('/api/auth/send-otp', (req, res) => {
  console.log('✅ ROUTE WORKS!');
  res.json({ 
    success: true, 
    message: 'OTP sent!',
    otp: '123456'
  });
});

// Import auth routes
import authRoutes from './src/routes/auth.routes.js';
app.use('/api/auth', authRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false,
    message: `Route not found: ${req.method} ${req.url}`
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  res.status(500).json({ 
    success: false,
    message: err.message 
  });
});

// MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/disaster_db';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ DB error:', err.message);
    process.exit(1);
  });