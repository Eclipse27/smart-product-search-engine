// ============================================================
// Category Routes — /api/categories
// ============================================================

const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// ============================================================
// GET /api/categories
// List all categories with product statistics
// Uses the vw_category_stats VIEW (LEFT JOIN + GROUP BY + Aggregates)
// ============================================================
router.get('/', async (req, res, next) => {
  try {
    const [categories] = await pool.query(
      'SELECT * FROM vw_category_stats ORDER BY product_count DESC'
    );

    // Parse filter_attributes JSON for each category
    categories.forEach(cat => {
      if (cat.filter_attributes && typeof cat.filter_attributes === 'string') {
        cat.filter_attributes = JSON.parse(cat.filter_attributes);
      }
    });

    res.json({ categories });
  } catch (err) {
    next(err);
  }
});


// ============================================================
// GET /api/categories/:slug
// Single category detail with filter definitions
// ============================================================
router.get('/:slug', async (req, res, next) => {
  try {
    const { slug } = req.params;

    const [rows] = await pool.query(
      'SELECT * FROM vw_category_stats WHERE slug = ?',
      [slug]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }

    const category = rows[0];
    if (category.filter_attributes && typeof category.filter_attributes === 'string') {
      category.filter_attributes = JSON.parse(category.filter_attributes);
    }

    res.json({ category });
  } catch (err) {
    next(err);
  }
});


// ============================================================
// GET /api/categories/:slug/filters
// Returns available filter values for each attribute in a category
// Calls the get_filter_values STORED PROCEDURE for each attribute
// Uses JSON_EXTRACT and JSON_UNQUOTE inside MySQL
// ============================================================
router.get('/:slug/filters', async (req, res, next) => {
  try {
    const { slug } = req.params;

    // First, get the category's filter_attributes definition
    const [catRows] = await pool.query(
      'SELECT filter_attributes FROM categories WHERE slug = ?',
      [slug]
    );

    if (catRows.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }

    let filterAttributes = catRows[0].filter_attributes;
    if (typeof filterAttributes === 'string') {
      filterAttributes = JSON.parse(filterAttributes);
    }

    if (!filterAttributes || !Array.isArray(filterAttributes)) {
      return res.json({ filters: {} });
    }

    // For each attribute, call the stored procedure to get unique values
    // The stored procedure uses JSON_EXTRACT + JSON_UNQUOTE + GROUP BY
    const filters = {};

    await Promise.all(
      filterAttributes.map(async (attr) => {
        const [results] = await pool.query(
          'CALL get_filter_values(?, ?)',
          [slug, attr.key]
        );
        // results[0] is the actual data, results[1] is OkPacket
        filters[attr.key] = {
          label: attr.label,
          type: attr.type,
          values: (results[0] || []).filter(v => v.attribute_value && v.attribute_value !== 'null'),
        };
      })
    );

    res.json({ filters });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
