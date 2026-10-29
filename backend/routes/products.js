// ============================================================
// Product Routes — /api/products
// ============================================================
// The backend is the COMMUNICATION LAYER.
// It calls MySQL stored procedures and views for data retrieval.
// Complex logic (search, filtering, ranking) lives in MySQL.
// ============================================================

const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// ============================================================
// GET /api/products
// List all products with pagination and sorting
// Uses the vw_product_details VIEW (which uses INNER JOIN)
// ============================================================
router.get('/', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = Math.min(parseInt(req.query.per_page) || 20, 50);
    const offset = (page - 1) * perPage;
    const sortBy = req.query.sort_by || 'newest';
    const minPrice = req.query.min_price ? parseFloat(req.query.min_price) : null;
    const maxPrice = req.query.max_price ? parseFloat(req.query.max_price) : null;

    // Build sort clause
    let orderClause = 'created_at DESC';
    switch (sortBy) {
      case 'price_asc': orderClause = 'price ASC'; break;
      case 'price_desc': orderClause = 'price DESC'; break;
      case 'rating': orderClause = 'avg_rating DESC, review_count DESC'; break;
      case 'popularity': orderClause = 'view_count DESC'; break;
      case 'newest': orderClause = 'created_at DESC'; break;
    }

    // Count query
    let countSql = 'SELECT COUNT(*) AS total FROM vw_product_details WHERE is_active = TRUE';
    const countParams = [];
    if (minPrice !== null) { countSql += ' AND price >= ?'; countParams.push(minPrice); }
    if (maxPrice !== null) { countSql += ' AND price <= ?'; countParams.push(maxPrice); }

    // Data query using the VIEW
    let dataSql = `SELECT * FROM vw_product_details WHERE is_active = TRUE`;
    const dataParams = [];
    if (minPrice !== null) { dataSql += ' AND price >= ?'; dataParams.push(minPrice); }
    if (maxPrice !== null) { dataSql += ' AND price <= ?'; dataParams.push(maxPrice); }
    dataSql += ` ORDER BY ${orderClause} LIMIT ? OFFSET ?`;
    dataParams.push(perPage, offset);

    const [[countResult], [products]] = await Promise.all([
      pool.query(countSql, countParams),
      pool.query(dataSql, dataParams),
    ]);

    res.json({
      products,
      totalCount: countResult[0].total,
      page,
      perPage,
      totalPages: Math.ceil(countResult[0].total / perPage),
    });
  } catch (err) {
    next(err);
  }
});


// ============================================================
// GET /api/products/category/:categorySlug
// Products by category with dynamic JSON filtering
// Calls the get_filtered_products STORED PROCEDURE
// ============================================================
router.get('/category/:categorySlug', async (req, res, next) => {
  try {
    const { categorySlug } = req.params;
    const page = parseInt(req.query.page) || 1;
    const perPage = Math.min(parseInt(req.query.per_page) || 20, 50);
    const sortBy = req.query.sort_by || 'newest';
    const minPrice = req.query.min_price ? parseFloat(req.query.min_price) : null;
    const maxPrice = req.query.max_price ? parseFloat(req.query.max_price) : null;
    const filters = req.query.filters || null; // JSON string like {"brand":"Samsung","ram":"8GB"}

    // Call the MySQL stored procedure for dynamic JSON filtering
    const [results] = await pool.query(
      'CALL get_filtered_products(?, ?, ?, ?, ?, ?, ?)',
      [categorySlug, filters, minPrice, maxPrice, sortBy, page, perPage]
    );

    // The stored procedure returns 3 result sets:
    // results[0] = (empty from count INTO)
    // results[1] = products array
    // results[2] = [{total_count: N}]
    const products = results[1] || [];
    const totalCount = results[2]?.[0]?.total_count || 0;

    res.json({
      products,
      totalCount,
      page,
      perPage,
      totalPages: Math.ceil(totalCount / perPage),
    });
  } catch (err) {
    next(err);
  }
});


// ============================================================
// GET /api/products/:slug
// Single product detail with reviews
// Calls the get_product_detail STORED PROCEDURE
// ============================================================
router.get('/:slug', async (req, res, next) => {
  try {
    const { slug } = req.params;

    // Call the MySQL stored procedure
    const [results] = await pool.query('CALL get_product_detail(?)', [slug]);

    // The stored procedure returns 3 result sets:
    // results[0] = product details (from vw_product_details view)
    // results[1] = reviews (with customer names via INNER JOIN)
    // results[2] = review summary (from vw_product_reviews_summary view)
    const product = results[0]?.[0] || null;
    const reviews = results[1] || [];
    const reviewSummary = results[2]?.[0] || null;

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Parse JSON attributes if they're strings
    if (product.attributes && typeof product.attributes === 'string') {
      product.attributes = JSON.parse(product.attributes);
    }
    if (product.category_filters && typeof product.category_filters === 'string') {
      product.category_filters = JSON.parse(product.category_filters);
    }

    res.json({ product, reviews, reviewSummary });
  } catch (err) {
    next(err);
  }
});


// ============================================================
// POST /api/products/:id/view
// Log a product view (triggers view_count update via MySQL trigger)
// ============================================================
router.post('/:id/view', async (req, res, next) => {
  try {
    const productId = parseInt(req.params.id);
    const customerId = req.body.customerId || null;

    // Call the stored procedure which inserts into product_views
    // The MySQL TRIGGER trg_after_product_view automatically
    // increments products.view_count
    await pool.query('CALL log_product_view(?, ?)', [productId, customerId]);

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
