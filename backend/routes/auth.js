const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const { authenticateToken, JWT_SECRET } = require('../middleware/auth');

// ============================================================
// POST /api/auth/register
// Customer registration with bcrypt password hashing
// ============================================================
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    // Check if customer already exists
    const [existing] = await pool.query('SELECT customer_id FROM customers WHERE email = ?', [email.trim().toLowerCase()]);
    if (existing.length > 0) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Insert customer
    const [result] = await pool.query(
      'INSERT INTO customers (name, email, password_hash) VALUES (?, ?, ?)',
      [name.trim(), email.trim().toLowerCase(), passwordHash]
    );

    const customerId = result.insertId;

    // Generate JWT
    const token = jwt.sign(
      { customerId, email: email.trim().toLowerCase(), name: name.trim() },
      JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.status(201).json({
      message: 'Registration successful!',
      token,
      customer: {
        customerId,
        name: name.trim(),
        email: email.trim().toLowerCase(),
      },
    });
  } catch (err) {
    next(err);
  }
});

// ============================================================
// POST /api/auth/login
// Customer login with JWT authentication
// ============================================================
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const [rows] = await pool.query(
      'SELECT customer_id, name, email, password_hash FROM customers WHERE email = ?',
      [email.trim().toLowerCase()]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const customer = rows[0];

    // Verify password with bcrypt
    const isMatch = await bcrypt.compare(password, customer.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Generate JWT
    const token = jwt.sign(
      { customerId: customer.customer_id, email: customer.email, name: customer.name },
      JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      message: 'Login successful!',
      token,
      customer: {
        customerId: customer.customer_id,
        name: customer.name,
        email: customer.email,
      },
    });
  } catch (err) {
    next(err);
  }
});

// ============================================================
// GET /api/auth/me
// Returns current authenticated customer profile and statistics
// ============================================================
router.get('/me', authenticateToken, async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT cu.customer_id, cu.name, cu.email, cu.created_at,
              COALESCE(s.total_orders, 0) AS total_orders,
              COALESCE(s.lifetime_spend, 0.00) AS lifetime_spend
       FROM customers cu
       LEFT JOIN vw_customer_order_summary s ON cu.customer_id = s.customer_id
       WHERE cu.customer_id = ?`,
      [req.customer.customerId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Customer profile not found.' });
    }

    res.json({ customer: rows[0] });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

