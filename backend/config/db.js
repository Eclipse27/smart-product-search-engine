// ============================================================
// MySQL Connection Pool Configuration
// ============================================================
// Uses mysql2/promise for async/await support.
// Connection pool reuses connections efficiently.
// All credentials come from environment variables.
// ============================================================

const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'localhost',
  port: parseInt(process.env.MYSQL_PORT) || 3306,
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'smart_product_engine',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // Enable multiple statements for stored procedures that return multiple result sets
  multipleStatements: true,
});

module.exports = pool;
