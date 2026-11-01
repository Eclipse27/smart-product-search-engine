const fs = require('fs');
const path = require('path');
require('dotenv').config();
const mysql = require('mysql2/promise');

async function runSQLFile(relativePath) {
  const filePath = path.join(__dirname, '..', relativePath);
  console.log(`Running SQL script: ${relativePath}`);
  const sql = fs.readFileSync(filePath, 'utf8');

  const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST || 'localhost',
    port: parseInt(process.env.MYSQL_PORT) || 3306,
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || 'smart_product_engine',
    multipleStatements: true,
  });

  try {
    // Check if file uses DELIMITER
    if (sql.includes('DELIMITER')) {
      // Split into sections by DELIMITER
      const delimiterBlocks = [];
      let currentDelimiter = ';';
      const lines = sql.split(/\r?\n/);
      let currentBlock = [];

      for (let line of lines) {
        const trimmed = line.trim();
        if (trimmed.toUpperCase().startsWith('DELIMITER')) {
          if (currentBlock.length > 0) {
            delimiterBlocks.push({ delimiter: currentDelimiter, sql: currentBlock.join('\n') });
            currentBlock = [];
          }
          currentDelimiter = trimmed.split(/\s+/)[1] || ';';
        } else {
          currentBlock.push(line);
        }
      }
      if (currentBlock.length > 0) {
        delimiterBlocks.push({ delimiter: currentDelimiter, sql: currentBlock.join('\n') });
      }

      for (const block of delimiterBlocks) {
        const statements = block.sql
          .split(block.delimiter)
          .map(s => s.trim())
          .filter(s => s.length > 0 && !s.startsWith('--') && s !== ';');

        for (const stmt of statements) {
          if (stmt.trim()) {
            await connection.query(stmt);
          }
        }
      }
    } else {
      await connection.query(sql);
    }
    console.log(`✅ Finished executing: ${relativePath}`);
  } catch (err) {
    console.error(`❌ Error in ${relativePath}:`, err.message);
    throw err;
  } finally {
    await connection.end();
  }
}

const fileToRun = process.argv[2];
if (fileToRun) {
  runSQLFile(fileToRun)
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
} else {
  module.exports = { runSQLFile };
}

