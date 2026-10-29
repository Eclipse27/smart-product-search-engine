// ============================================================
// Smart Product Search & Recommendation Engine — Express Server
// ============================================================
// The backend serves as the COMMUNICATION LAYER between the
// React frontend and the MySQL intelligence layer.
// It receives API requests, validates input, calls MySQL
// stored procedures/queries, and returns JSON responses.
// ============================================================

require('dotenv').config();
const express = require('express');
const cors = require('cors');

const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');
const searchRoutes = require('./routes/search');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/search', searchRoutes);

// Health check
app.get('/api/health', async (req, res) => {
  const pool = require('./config/db');
  try {
    const [rows] = await pool.query('SELECT 1 AS ok');
    res.json({ status: 'healthy', database: 'connected', timestamp: new Date().toISOString() });
  } catch (err) {
    res.status(500).json({ status: 'unhealthy', database: 'disconnected', error: err.message });
  }
});

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Smart Product Engine API running on http://localhost:${PORT}`);
  console.log(`📦 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔍 Search API:   http://localhost:${PORT}/api/search?q=wireless`);
  console.log(`📂 Products:     http://localhost:${PORT}/api/products`);
  console.log(`📁 Categories:   http://localhost:${PORT}/api/categories\n`);
});
