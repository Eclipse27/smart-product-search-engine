// ============================================================
// Error Handler Middleware
// ============================================================

function errorHandler(err, req, res, next) {
  console.error('API Error:', err.message);
  console.error(err.stack);

  // MySQL-specific errors
  if (err.code === 'ER_NO_SUCH_TABLE') {
    return res.status(500).json({
      error: 'Database table not found. Please ensure the database is properly set up.',
      code: err.code,
    });
  }

  if (err.code === 'ECONNREFUSED') {
    return res.status(503).json({
      error: 'Database connection refused. Please ensure MySQL is running.',
      code: err.code,
    });
  }

  if (err.code === 'ER_ACCESS_DENIED_ERROR') {
    return res.status(503).json({
      error: 'Database access denied. Please check MySQL credentials.',
      code: err.code,
    });
  }

  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
}

module.exports = { errorHandler };
