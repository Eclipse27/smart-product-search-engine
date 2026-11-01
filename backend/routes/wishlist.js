const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { authenticateToken } = require('../middleware/auth');

router.use(authenticateToken);

// ============================================================
// GET /api/wishlist
// Retrieve customer wishlist items
// ============================================================
router.get('/', async (req, res, next) => {
  try {
    const customerId = req.customer.customerId;

    const [items] = await pool.query(
      `SELECT w.wishlist_id, w.created_at,
              p.product_id, p.name, p.slug, p.price, p.original_price,
              p.avg_rating, p.review_count, p.image_url,
              p.brand_generated AS brand, p.stock_quantity,
              c.name AS category_name, c.slug AS category_slug,
              CASE WHEN p.stock_quantity = 0 THEN 'out_of_stock'
                   WHEN p.stock_quantity < 5 THEN 'low_stock'
                   ELSE 'in_stock' END AS stock_status,
              CASE WHEN p.original_price IS NOT NULL AND p.original_price > p.price
                   THEN ROUND(((p.original_price - p.price) / p.original_price) * 100)
                   ELSE 0 END AS discount_percentage
       FROM wishlist w
       JOIN products p ON w.product_id = p.product_id
       JOIN categories c ON p.category_id = c.category_id
       WHERE w.customer_id = ? AND p.is_active = TRUE
       ORDER BY w.created_at DESC`,
      [customerId]
    );

    res.json({ wishlist: items });
  } catch (err) {
    next(err);
  }
});

// ============================================================
// POST /api/wishlist
// Add item to wishlist
// ============================================================
router.post('/', async (req, res, next) => {
  try {
    const customerId = req.customer.customerId;
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ error: 'productId is required.' });
    }

    await pool.query(
      'INSERT IGNORE INTO wishlist (customer_id, product_id) VALUES (?, ?)',
      [customerId, parseInt(productId)]
    );

    res.status(201).json({ success: true, message: 'Added to wishlist!' });
  } catch (err) {
    next(err);
  }
});

// ============================================================
// DELETE /api/wishlist/:productId
// Remove item from wishlist
// ============================================================
router.delete('/:productId', async (req, res, next) => {
  try {
    const customerId = req.customer.customerId;
    const productId = parseInt(req.params.productId);

    await pool.query(
      'DELETE FROM wishlist WHERE customer_id = ? AND product_id = ?',
      [customerId, productId]
    );

    res.json({ success: true, message: 'Removed from wishlist.' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

