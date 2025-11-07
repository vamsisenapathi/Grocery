const express = require('express');
const cors = require('cors');

console.log('🚀 Starting Minimal Mock Server...');

const app = express();
const PORT = 8081;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.path}`);
  next();
});

// Simple test endpoint
app.get('/api/v1/test', (req, res) => {
  console.log('✅ Test endpoint hit');
  res.json({ message: 'Test endpoint working!' });
});

// Health check
app.get('/api/v1/health', (req, res) => {
  console.log('✅ Health endpoint hit');
  res.json({ 
    status: 'OK', 
    message: 'Minimal Mock Server is running',
    timestamp: new Date().toISOString()
  });
});

// Simple electronics endpoint
app.get('/api/v1/categories/electronics', (req, res) => {
  console.log('✅ Electronics endpoint hit');
  res.json([
    { id: 1, name: 'Test Smartphone', category: 'Electronics', price: 299.99 },
    { id: 2, name: 'Test Headphones', category: 'Electronics', price: 89.99 }
  ]);
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('❌ Error:', error);
  res.status(500).json({
    timestamp: new Date().toISOString(),
    status: 500,
    error: 'Internal Server Error',
    message: error.message,
    path: req.path
  });
});

app.listen(PORT, () => {
  console.log(`🎉 Minimal Mock Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/v1/health`);
  console.log(`🧪 Test: http://localhost:${PORT}/api/v1/test`);
  console.log(`📱 Electronics: http://localhost:${PORT}/api/v1/categories/electronics`);
});