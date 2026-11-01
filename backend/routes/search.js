// ============================================================
// Search Routes — /api/search
// ============================================================
// Primary showcase of Module 1: Smart Product Search
// Uses FULLTEXT MATCH() AGAINST(), typo-tolerant Soundex/Levenshtein
// fallback, relevance scoring, and query logging.
// ============================================================

const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { optionalAuth } = require('../middleware/auth');

// ============================================================
// GET /api/search?q=...
// Multi-Stage Typo-Tolerant Product Search
// ============================================================
router.get('/', optionalAuth, async (req, res, next) => {
  try {
    const rawQuery = (req.query.q || '').trim();
    const categoryId = req.query.category_id ? parseInt(req.query.category_id) : null;
    const minPrice = req.query.min_price ? parseFloat(req.query.min_price) : null;
    const maxPrice = req.query.max_price ? parseFloat(req.query.max_price) : null;
    const sortBy = req.query.sort_by || null;
    const page = parseInt(req.query.page) || 1;
    const perPage = Math.min(parseInt(req.query.per_page) || 20, 50);
    const customerId = req.customer ? req.customer.customerId : null;

    if (!rawQuery) {
      return res.json({
        products: [],
        totalCount: 0,
        page: 1,
        perPage,
        totalPages: 0,
        query: '',
        searchMethod: 'none',
      });
    }

    // Call search_products stored procedure
    const [results] = await pool.query(
      'CALL search_products(?, ?, ?, ?, ?, ?, ?)',
      [rawQuery, categoryId, minPrice, maxPrice, sortBy, page, perPage]
    );

    const products = results[0] || [];
    const totalCount = results[1]?.[0]?.total_count || 0;
    const matchStage = products[0]?.match_stage || 'fulltext';

    // Log the search query in MySQL search_history table
    pool.query('CALL log_search_query(?, ?, ?)', [customerId, rawQuery, totalCount]).catch(() => {});

    // Parse JSON attributes
    products.forEach(p => {
      if (p.attributes && typeof p.attributes === 'string') {
        try { p.attributes = JSON.parse(p.attributes); } catch (e) {}
      }
    });

    res.json({
      products,
      totalCount,
      page,
      perPage,
      totalPages: Math.ceil(totalCount / perPage),
      query: rawQuery,
      matchStage,
      isTypoCorrected: matchStage === 'fuzzy_soundex' || matchStage === 'like_fallback',
    });
  } catch (err) {
    next(err);
  }
});


// ============================================================
// GET /api/search/suggestions?q=...
// Search autocomplete suggestions (FULLTEXT Boolean prefix)
// ============================================================
router.get('/suggestions', async (req, res, next) => {
  try {
    const query = (req.query.q || '').trim();
    const limit = Math.min(parseInt(req.query.limit) || 8, 15);

    const [results] = await pool.query(
      'CALL get_product_suggestions(?, ?)',
      [query, limit]
    );

    const suggestions = results[0] || [];

    res.json({ suggestions });
  } catch (err) {
    next(err);
  }
});


// ============================================================
// GET /api/search/history
// Returns recent searches for analytics / search bar history
// ============================================================
router.get('/history', optionalAuth, async (req, res, next) => {
  try {
    const customerId = req.customer ? req.customer.customerId : null;
    let historySql;
    let params;

    if (customerId) {
      historySql = `SELECT DISTINCT search_query, searched_at 
                    FROM search_history 
                    WHERE customer_id = ? 
                    ORDER BY searched_at DESC 
                    LIMIT 8`;
      params = [customerId];
    } else {
      historySql = `SELECT search_query, COUNT(*) AS frequency 
                    FROM search_history 
                    GROUP BY search_query 
                    ORDER BY frequency DESC, MAX(searched_at) DESC 
                    LIMIT 8`;
      params = [];
    }

    const [rows] = await pool.query(historySql, params);
    res.json({ history: rows.map(r => r.search_query) });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
