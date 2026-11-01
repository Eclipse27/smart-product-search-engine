// ============================================================
// Product Routes — /api/products
// ============================================================
// The backend serves as the COMMUNICATION LAYER.
// All complex logic (ranking, window functions, search, filtering,
// recommendations) is executed inside MySQL.
// ============================================================

const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { authenticateToken, optionalAuth } = require('../middleware/auth');

// ============================================================
// GET /api/products
// List all products with pagination and dynamic sorting
// Uses the vw_product_details VIEW
// ============================================================
router.get('/', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = Math.min(parseInt(req.query.per_page) || 20, 50);
    const offset = (page - 1) * perPage;
    const sortBy = req.query.sort_by || 'newest';
    const minPrice = req.query.min_price ? parseFloat(req.query.min_price) : null;
    const maxPrice = req.query.max_price ? parseFloat(req.query.max_price) : null;
    const categorySlug = req.query.category || null;

    let orderClause = 'created_at DESC';
    switch (sortBy) {
      case 'price_asc': orderClause = 'price ASC'; break;
      case 'price_desc': orderClause = 'price DESC'; break;
      case 'rating': orderClause = 'avg_rating DESC, review_count DESC'; break;
      case 'popularity': orderClause = 'view_count DESC, avg_rating DESC'; break;
      case 'newest': orderClause = 'created_at DESC'; break;
    }

    let countSql = 'SELECT COUNT(*) AS total FROM vw_product_details WHERE is_active = TRUE';
    const countParams = [];
    if (categorySlug && categorySlug !== 'all') {
      countSql += ' AND category_slug = ?';
      countParams.push(categorySlug);
    }
    if (minPrice !== null) { countSql += ' AND price >= ?'; countParams.push(minPrice); }
    if (maxPrice !== null) { countSql += ' AND price <= ?'; countParams.push(maxPrice); }

    let dataSql = `SELECT * FROM vw_product_details WHERE is_active = TRUE`;
    const dataParams = [];
    if (categorySlug && categorySlug !== 'all') {
      dataSql += ' AND category_slug = ?';
      dataParams.push(categorySlug);
    }
    if (minPrice !== null) { dataSql += ' AND price >= ?'; dataParams.push(minPrice); }
    if (maxPrice !== null) { dataSql += ' AND price <= ?'; dataParams.push(maxPrice); }
    dataSql += ` ORDER BY ${orderClause} LIMIT ? OFFSET ?`;
    dataParams.push(perPage, offset);

    const [[countResult], [products]] = await Promise.all([
      pool.query(countSql, countParams),
      pool.query(dataSql, dataParams),
    ]);

    HEAD
    // Parse JSON attributes

    3f19677(Enhance smart product search engine)
    products.forEach(p => {
      if (p.attributes && typeof p.attributes === 'string') {
        try { p.attributes = JSON.parse(p.attributes); } catch (e) { }
      }
    });

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
// GET /api/products/trending
// Module 4: Top trending products computed from MySQL
// ============================================================
router.get('/trending', async (req, res, next) => {
  try {
    const categoryId = req.query.category_id ? parseInt(req.query.category_id) : null;
    const limit = Math.min(parseInt(req.query.limit) || 8, 20);

    const [results] = await pool.query('CALL get_trending_products(?, ?)', [categoryId, limit]);
    const products = results[0] || [];

    res.json({ products });
  } catch (err) {
    next(err);
  }
});


// ============================================================
// GET /api/products/bestsellers
// Module 4: Best-selling products using vw_best_sellers
// ============================================================
router.get('/bestsellers', async (req, res, next) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 8, 20);
    const [results] = await pool.query('CALL get_best_sellers(?)', [limit]);
    const products = results[0] || [];

    res.json({ products });
  } catch (err) {
    next(err);
  }
});


// ============================================================
// GET /api/products/ranking
// Module 5: Advanced Ranking with Window Functions
// Calls get_ranked_products (ROW_NUMBER, RANK, DENSE_RANK)
// ============================================================
router.get('/ranking', async (req, res, next) => {
  try {
    const categoryId = req.query.category_id ? parseInt(req.query.category_id) : null;
    const sortBy = req.query.sort_by || 'rating';
    const page = parseInt(req.query.page) || 1;
    const perPage = Math.min(parseInt(req.query.per_page) || 12, 50);

    const [results] = await pool.query(
      'CALL get_ranked_products(?, ?, ?, ?)',
      [categoryId, sortBy, page, perPage]
    );

    const products = results[0] || [];

    res.json({ products, page, perPage });
  } catch (err) {
    next(err);
  }
});


// ============================================================
// GET /api/products/recommendations
// Module 3: Personalized Recommendations based on user history
// ============================================================
router.get('/recommendations', optionalAuth, async (req, res, next) => {
  try {
    const customerId = req.customer ? req.customer.customerId : null;
    const limit = Math.min(parseInt(req.query.limit) || 8, 20);

    const [results] = await pool.query(
      'CALL get_personalized_recommendations(?, ?)',
      [customerId, limit]
    );

    const recommendations = results[0] || [];

    res.json({
      recommendations,
      isPersonalized: !!customerId,
    });
  } catch (err) {
    next(err);
  }
});


// ============================================================
// GET /api/products/category/:categorySlug
// Module 2: Category Products with Dynamic JSON Filtering
// Calls get_filtered_products STORED PROCEDURE
// ============================================================
router.get('/category/:categorySlug', async (req, res, next) => {
  try {
    const { categorySlug } = req.params;
    const page = parseInt(req.query.page) || 1;
    const perPage = Math.min(parseInt(req.query.per_page) || 20, 50);
    const sortBy = req.query.sort_by || 'newest';
    const minPrice = req.query.min_price ? parseFloat(req.query.min_price) : null;
    const maxPrice = req.query.max_price ? parseFloat(req.query.max_price) : null;
    const filters = req.query.filters || null;

    const [results] = await pool.query(
      'CALL get_filtered_products(?, ?, ?, ?, ?, ?, ?)',
      [categorySlug, filters, minPrice, maxPrice, sortBy, page, perPage]
    );

<<<<<<< HEAD
    // The stored procedure returns:
    // results[0] = products array
    // results[1] = [{total_count: N}]
    const products = results[0] || [];
    const totalCount = results[1]?.[0]?.total_count || 0;

    // Parse JSON attributes if string
=======
    const products = results[0] || [];
    const totalCount = results[1]?.[0]?.total_count || 0;

>>>>>>> 3f19677 (Enhance smart product search engine)
    products.forEach(p => {
      if (p.attributes && typeof p.attributes === 'string') {
        try { p.attributes = JSON.parse(p.attributes); } catch (e) { }
      }
    });

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
// POST /api/products/filter
// Module 2: Alternate POST endpoint for complex JSON filters
// ============================================================
router.post('/filter', async (req, res, next) => {
  try {
    const { categorySlug, filters, minPrice, maxPrice, sortBy, page, perPage } = req.body;

    const [results] = await pool.query(
      'CALL get_filtered_products(?, ?, ?, ?, ?, ?, ?)',
      [
        categorySlug || 'all',
        filters ? JSON.stringify(filters) : null,
        minPrice || null,
        maxPrice || null,
        sortBy || 'newest',
        page || 1,
        perPage || 20,
      ]
    );

    const products = results[0] || [];
    const totalCount = results[1]?.[0]?.total_count || 0;

    products.forEach(p => {
      if (p.attributes && typeof p.attributes === 'string') {
        try { p.attributes = JSON.parse(p.attributes); } catch (e) { }
      }
    });

    res.json({
      products,
      totalCount,
      page: page || 1,
      perPage: perPage || 20,
      totalPages: Math.ceil(totalCount / (perPage || 20)),
    });
  } catch (err) {
    next(err);
  }
});


// ============================================================
// GET /api/products/:slug
// Product detail with reviews & review summary
// Calls get_product_detail STORED PROCEDURE
// ============================================================
router.get('/:slug', async (req, res, next) => {
  try {
    const { slug } = req.params;

    const [results] = await pool.query('CALL get_product_detail(?)', [slug]);

    const product = results[0]?.[0] || null;
    const reviews = results[1] || [];
    const reviewSummary = results[2]?.[0] || null;

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (product.attributes && typeof product.attributes === 'string') {
      try { product.attributes = JSON.parse(product.attributes); } catch (e) { }
    }
    if (product.category_filters && typeof product.category_filters === 'string') {
      try { product.category_filters = JSON.parse(product.category_filters); } catch (e) { }
    }

    res.json({ product, reviews, reviewSummary });
  } catch (err) {
    next(err);
  }
});


// ============================================================
// GET /api/products/:id/related
// Module 3: Recommendations for Product Page:
// - Frequently Bought Together
// - Customers Also Viewed
// - Similar Products
// ============================================================
router.get('/:id/related', async (req, res, next) => {
  try {
    const productId = parseInt(req.params.id);
    const limit = Math.min(parseInt(req.query.limit) || 4, 8);

    const [
      [fbtResults],
      [cavResults],
      [simResults],
    ] = await Promise.all([
      pool.query('CALL get_frequently_bought_together(?, ?)', [productId, limit]),
      pool.query('CALL get_customers_also_viewed(?, ?)', [productId, limit]),
      pool.query('CALL get_similar_products(?, ?)', [productId, limit]),
    ]);

    res.json({
      frequentlyBoughtTogether: fbtResults[0] || [],
      customersAlsoViewed: cavResults[0] || [],
      similarProducts: simResults[0] || [],
    });
  } catch (err) {
    next(err);
  }
});


// ============================================================
// POST /api/products/:id/view
// Logs product view (MySQL trigger automatically updates view_count)
// ============================================================
router.post('/:id/view', optionalAuth, async (req, res, next) => {
  try {
    const productId = parseInt(req.params.id);
    const customerId = req.customer ? req.customer.customerId : (req.body.customerId || null);

    await pool.query('CALL log_product_view(?, ?)', [productId, customerId]);

    res.json({ success: true, message: 'View recorded' });
  } catch (err) {
    next(err);
  }
});


// ============================================================
// GET /api/products/:id/reviews
// Fetches reviews for a given product
// ============================================================
router.get('/:id/reviews', async (req, res, next) => {
  try {
    const productId = parseInt(req.params.id);

    const [reviews] = await pool.query(
      `SELECT r.review_id, r.product_id, r.rating, r.comment, r.created_at,
              cu.customer_id, cu.name AS customer_name
       FROM reviews r
       JOIN customers cu ON r.customer_id = cu.customer_id
       WHERE r.product_id = ?
       ORDER BY r.created_at DESC`,
      [productId]
    );

    res.json({ reviews });
  } catch (err) {
    next(err);
  }
});


// ============================================================
// POST /api/products/:id/reviews
// Submits a customer review (Protected route)
// Recalculates average rating via MySQL trigger
// ============================================================
router.post('/:id/reviews', authenticateToken, async (req, res, next) => {
  try {
    const productId = parseInt(req.params.id);
    const customerId = req.customer.customerId;
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5 stars.' });
    }

    const [results] = await pool.query(
      'CALL submit_product_review(?, ?, ?, ?)',
      [productId, customerId, parseInt(rating), comment || '']
    );

    res.status(201).json({
      message: 'Review submitted successfully!',
      review: results[0]?.[0] || null,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
