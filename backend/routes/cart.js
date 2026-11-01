const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { authenticateToken } = require('../middleware/auth');

// All cart endpoints require user authentication (or can be used with guest localStorage)
router.use(authenticateToken);

// ============================================================
// GET /api/cart
// Fetch customer cart items with product details & stock validation
// ============================================================
router.get('/', async (req, res, next) => {
  try {
    const customerId = req.customer.customerId;

    const [items] = await pool.query(
      `SELECT ci.cart_item_id, ci.quantity, ci.created_at,
              p.product_id, p.name, p.slug, p.price, p.original_price,
              p.stock_quantity, p.image_url, p.brand_generated AS brand,
              c.name AS category_name,
              CASE WHEN p.stock_quantity = 0 THEN 'out_of_stock'
                   WHEN p.stock_quantity < ci.quantity THEN 'insufficient_stock'
                   ELSE 'in_stock' END AS stock_status,
              ROUND(ci.quantity * p.price, 2) AS subtotal
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.product_id
       JOIN categories c ON p.category_id = c.category_id
       WHERE ci.customer_id = ? AND p.is_active = TRUE
       ORDER BY ci.created_at DESC`,
      [customerId]
    );

    const totalAmount = items.reduce((sum, item) => sum + parseFloat(item.subtotal || 0), 0);

    res.json({
      items,
      itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
      totalAmount: parseFloat(totalAmount.toFixed(2)),
    });
  } catch (err) {
    next(err);
  }
});

// ============================================================
// POST /api/cart
// Add or increment item in cart
// ============================================================
router.post('/', async (req, res, next) => {
  try {
    const customerId = req.customer.customerId;
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ error: 'productId is required.' });
    }

    // Verify product exists and check stock
    const [prods] = await pool.query(
      'SELECT product_id, stock_quantity, is_active FROM products WHERE product_id = ?',
      [productId]
    );

    if (prods.length === 0 || !prods[0].is_active) {
      return res.status(404).json({ error: 'Product not found or unavailable.' });
    }

    const availableStock = prods[0].stock_quantity;
    if (availableStock <= 0) {
      return res.status(400).json({ error: 'Sorry, this product is currently out of stock.' });
    }

    const addQty = Math.max(1, parseInt(quantity));

    // Insert or update quantity in cart_items table
    await pool.query(
      `INSERT INTO cart_items (customer_id, product_id, quantity)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE quantity = LEAST(quantity + VALUES(quantity), ?)`,
      [customerId, productId, addQty, availableStock]
    );

    res.json({ success: true, message: 'Item added to cart!' });
  } catch (err) {
    next(err);
  }
});

// ============================================================
// PUT /api/cart/:productId
// Update specific item quantity
// ============================================================
router.put('/:productId', async (req, res, next) => {
  try {
    const customerId = req.customer.customerId;
    const productId = parseInt(req.params.productId);
    const { quantity } = req.body;

    const newQty = parseInt(quantity);
    if (isNaN(newQty) || newQty <= 0) {
      // Remove item if quantity <= 0
      await pool.query('DELETE FROM cart_items WHERE customer_id = ? AND product_id = ?', [customerId, productId]);
      return res.json({ success: true, message: 'Item removed from cart.' });
    }

    // Check stock
    const [prods] = await pool.query('SELECT stock_quantity FROM products WHERE product_id = ?', [productId]);
    if (prods.length === 0) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    const maxQty = Math.min(newQty, prods[0].stock_quantity);

    await pool.query(
      'UPDATE cart_items SET quantity = ? WHERE customer_id = ? AND product_id = ?',
      [maxQty, customerId, productId]
    );

    res.json({ success: true, message: 'Cart updated.', quantity: maxQty });
  } catch (err) {
    next(err);
  }
});

// ============================================================
// DELETE /api/cart/:productId
// Remove specific item from cart
// ============================================================
router.delete('/:productId', async (req, res, next) => {
  try {
    const customerId = req.customer.customerId;
    const productId = parseInt(req.params.productId);

    await pool.query('DELETE FROM cart_items WHERE customer_id = ? AND product_id = ?', [customerId, productId]);
    res.json({ success: true, message: 'Item removed from cart.' });
  } catch (err) {
    next(err);
  }
});

// ============================================================
// DELETE /api/cart
// Clear all items in cart
// ============================================================
router.delete('/', async (req, res, next) => {
  try {
    const customerId = req.customer.customerId;
    await pool.query('DELETE FROM cart_items WHERE customer_id = ?', [customerId]);
    res.json({ success: true, message: 'Cart cleared.' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

