const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { authenticateToken } = require('../middleware/auth');

router.use(authenticateToken);

// ============================================================
// POST /api/orders
// Checkout: Create order atomically via MySQL Stored Procedure
// Validates stock, inserts order + items, decrements stock
// ============================================================
router.post('/', async (req, res, next) => {
  try {
    const customerId = req.customer.customerId;
    const { items, deliveryAddress, paymentMethod } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Order must contain at least one item.' });
    }

    // Format items as JSON array for stored procedure
    const formattedItems = items.map(item => ({
      product_id: parseInt(item.productId || item.product_id),
      quantity: parseInt(item.quantity) || 1,
    }));

    // Call create_order stored procedure with transaction handling
    const [callResult] = await pool.query(
      'CALL create_order(?, ?, @order_id, @status); SELECT @order_id AS order_id, @status AS status;',
      [customerId, JSON.stringify(formattedItems)]
    );

    const outResult = callResult[1]?.[0] || {};
    const { order_id, status } = outResult;

    if (!order_id || status !== 'SUCCESS') {
      if (status && status.startsWith('INSUFFICIENT_STOCK')) {
        return res.status(400).json({ error: 'One or more items in your cart exceeds available stock.' });
      }
      return res.status(500).json({ error: 'Failed to place order. Transaction was rolled back.' });
    }

    // Clear cart items for this customer upon successful order
    await pool.query('DELETE FROM cart_items WHERE customer_id = ?', [customerId]).catch(() => {});

    // Fetch newly created order details
    const [orderRows] = await pool.query(
      'SELECT order_id, total_amount, status, created_at FROM orders WHERE order_id = ?',
      [order_id]
    );

    const [itemRows] = await pool.query(
      `SELECT oi.order_item_id, oi.quantity, oi.unit_price,
              p.product_id, p.name, p.image_url, p.slug, p.brand_generated AS brand
       FROM order_items oi
       JOIN products p ON oi.product_id = p.product_id
       WHERE oi.order_id = ?`,
      [order_id]
    );

    res.status(201).json({
      message: 'Order placed successfully!',
      order: {
        ...orderRows[0],
        deliveryAddress: deliveryAddress || '123 Peach Blossom Way, Suite 4B',
        paymentMethod: paymentMethod || 'Demo Checkout (Cash on Delivery / Card)',
        items: itemRows,
      },
    });
  } catch (err) {
    next(err);
  }
});

// ============================================================
// GET /api/orders
// Customer Order History
// ============================================================
router.get('/', async (req, res, next) => {
  try {
    const customerId = req.customer.customerId;

    const [orders] = await pool.query(
      `SELECT o.order_id, o.total_amount, o.status, o.created_at,
              COUNT(oi.order_item_id) AS total_items,
              JSON_ARRAYAGG(
                JSON_OBJECT(
                  'product_id', p.product_id,
                  'name', p.name,
                  'image_url', p.image_url,
                  'quantity', oi.quantity,
                  'unit_price', oi.unit_price
                )
              ) AS items
       FROM orders o
       LEFT JOIN order_items oi ON o.order_id = oi.order_id
       LEFT JOIN products p ON oi.product_id = p.product_id
       WHERE o.customer_id = ?
       GROUP BY o.order_id
       ORDER BY o.created_at DESC`,
      [customerId]
    );

    orders.forEach(o => {
      if (typeof o.items === 'string') {
        try { o.items = JSON.parse(o.items); } catch (e) { o.items = []; }
      }
    });

    res.json({ orders });
  } catch (err) {
    next(err);
  }
});

// ============================================================
// GET /api/orders/:id
// Single order detail
// ============================================================
router.get('/:id', async (req, res, next) => {
  try {
    const customerId = req.customer.customerId;
    const orderId = parseInt(req.params.id);

    const [orders] = await pool.query(
      'SELECT order_id, total_amount, status, created_at FROM orders WHERE order_id = ? AND customer_id = ?',
      [orderId, customerId]
    );

    if (orders.length === 0) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    const [items] = await pool.query(
      `SELECT oi.order_item_id, oi.quantity, oi.unit_price,
              p.product_id, p.name, p.image_url, p.slug, p.brand_generated AS brand
       FROM order_items oi
       JOIN products p ON oi.product_id = p.product_id
       WHERE oi.order_id = ?`,
      [orderId]
    );

    res.json({
      order: {
        ...orders[0],
        items,
      },
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

