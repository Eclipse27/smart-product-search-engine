// ============================================================
// Search Routes — /api/search
// ============================================================
// The search API is the primary showcase of MySQL FULLTEXT search.
// It calls stored procedures that use MATCH() AGAINST() for
// relevance-based ranking, with LIKE fallback for short queries.
// ============================================================

const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// ============================================================
// GET /api/search?q=...
// Smart product search using MySQL FULLTEXT Search
// Calls the search_products STORED PROCEDURE
// ============================================================
router.get('/', async (req, res, next) => {
  try {
    const query = (req.query.q || '').trim();
    const categoryId = req.query.category_id ? parseInt(req.query.category_id) : null;
    const minPrice = req.query.min_price ? parseFloat(req.query.min_price) : null;
    const maxPrice = req.query.max_price ? parseFloat(req.query.max_price) : null;
    const sortBy = req.query.sort_by || null; // null = relevance (default in procedure)
    const page = parseInt(req.query.page) || 1;
    const perPage = Math.min(parseInt(req.query.per_page) || 20, 50);

    if (!query) {
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

    // Call the MySQL stored procedure
    // This procedure uses FULLTEXT MATCH() AGAINST() as primary search
    // and falls back to LIKE for short queries or zero FULLTEXT results
    const [results] = await pool.query(
      'CALL search_products(?, ?, ?, ?, ?, ?, ?)',
      [query, categoryId, minPrice, maxPrice, sortBy, page, perPage]
    );

    // The stored procedure returns 2 result sets:
    // results[0] = products array (with relevance_score)
    // results[1] = [{total_count: N}]
    const products = results[0] || [];
    const totalCount = results[1]?.[0]?.total_count || 0;

    // Determine which search method was used based on relevance scores
    const hasFulltextScores = products.some(p => p.relevance_score > 0 && p.relevance_score < 100);
    const searchMethod = query.length >= 3 && hasFulltextScores ? 'fulltext' : 'like_fallback';

    // Log the search query (calls stored procedure)
    pool.query('CALL log_search_query(?, ?, ?)', [null, query, totalCount]).catch(() => {});

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
      query,
      searchMethod,
    });
  } catch (err) {
    next(err);
  }
});


// ============================================================
// GET /api/search/suggestions?q=...
// Search autocomplete suggestions
// Calls the get_product_suggestions STORED PROCEDURE
// Uses FULLTEXT Boolean Mode with wildcard for prefix matching
// ============================================================
router.get('/suggestions', async (req, res, next) => {
  try {
    const query = (req.query.q || '').trim();
    const limit = Math.min(parseInt(req.query.limit) || 8, 15);

    if (!query) {
      return res.json({ suggestions: [] });
    }

    // Call the MySQL stored procedure
    // This procedure uses MATCH() AGAINST(query* IN BOOLEAN MODE)
    // for prefix-matching autocomplete
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

module.exports = router;
