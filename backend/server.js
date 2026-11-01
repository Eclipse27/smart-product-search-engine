// ============================================================
// Smart Product Search & Recommendation Engine — Express Server
// ============================================================
// The backend serves as the COMMUNICATION LAYER between the
// React frontend and the MySQL intelligence layer.
// It receives API requests, validates input, calls MySQL
// stored procedures/queries, and returns JSON responses.
// ============================================================

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');
const searchRoutes = require('./routes/search');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');
const wishlistRoutes = require('./routes/wishlist');
const { errorHandler } = require('./middleware/errorHandler');
const pool = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/wishlist', wishlistRoutes);

// Health check
app.get('/api/health', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 AS ok, DATABASE() AS database_name');
    res.json({
      status: 'healthy',
      database: 'connected',
      databaseName: rows[0].database_name,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    res.status(500).json({ status: 'unhealthy', database: 'disconnected', error: err.message });
  }
});

// Fallback periodic trending recalculator (every 30 mins)
async function triggerTrendingRefresh() {
  try {
    await pool.query('CALL calculate_trending_products()');
    console.log('⚡ [Scheduler] Periodic trending products recalculated successfully in MySQL.');
  } catch (err) {
    console.warn('⚠️ [Scheduler] Trending recalculation note:', err.message);
  }
}

// Initial refresh on start
triggerTrendingRefresh();
// Recurring refresh
setInterval(triggerTrendingRefresh, 30 * 60 * 1000);

// Centralized error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 Smart Product Engine API running on http://localhost:${PORT}`);
  console.log(`📦 Health check:     http://localhost:${PORT}/api/health`);
  console.log(`🔍 Search API:       http://localhost:${PORT}/api/search?q=samsng`);
  console.log(`📂 Products:         http://localhost:${PORT}/api/products`);
  console.log(`📁 Categories:       http://localhost:${PORT}/api/categories`);
  console.log(`🔥 Trending:         http://localhost:${PORT}/api/products/trending`);
  console.log(`👑 Best Sellers:     http://localhost:${PORT}/api/products/bestsellers`);
  console.log(`⭐ Ranked Window:    http://localhost:${PORT}/api/products/ranking`);
  console.log(`👤 Auth API:         http://localhost:${PORT}/api/auth/login`);
  console.log(`🛒 Cart API:         http://localhost:${PORT}/api/cart`);
  console.log(`📋 Orders API:       http://localhost:${PORT}/api/orders`);
  console.log(`💖 Wishlist API:     http://localhost:${PORT}/api/wishlist`);
  console.log(`======================================================\n`);
});
