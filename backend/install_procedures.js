const fs = require('fs');
const path = require('path');
require('dotenv').config();
const mysql = require('mysql2/promise');

async function installProcedures() {
  const filePath = path.join(__dirname, '../database/04_stored_procedures.sql');
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
    const parts = sql.split(/DELIMITER\s+/i);
    console.log(`Found ${parts.length} delimiter sections`);

    // Part 0: Standard SQL before DELIMITER //
    const part0Lines = parts[0].split('\n').filter(l => !l.trim().startsWith('--')).join('\n');
    const part0Stmts = part0Lines.split(';').map(s => s.trim()).filter(s => s.length > 0);
    for (const stmt of part0Stmts) {
      await connection.query(stmt);
    }
    console.log('Executed initial DROP / USE statements');

    // Section 1: DELIMITER //
    const section1 = parts[1];
    const delimMatch = section1.match(/^(\S+)/);
    const delim = delimMatch ? delimMatch[1] : '//';
    const body = section1.substring(delim.length);

    const rawStmts = body.split(delim);
    for (let raw of rawStmts) {
      const lines = raw.split('\n');
      const cleanLines = lines.filter(l => !l.trim().startsWith('--'));
      const cleanSql = cleanLines.join('\n').trim();

      if (!cleanSql || cleanSql.length < 10) continue;

      const nameMatch = cleanSql.match(/CREATE\s+PROCEDURE\s+([a-zA-Z0-9_]+)/i);
      const name = nameMatch ? nameMatch[1] : 'unnamed';
      try {
        await connection.query(cleanSql);
        console.log(`✅ Created procedure: ${name}`);
      } catch (procErr) {
        console.error(`❌ Failed procedure ${name}:`, procErr.message);
      }
    }
  } finally {
    await connection.end();
  }
}

installProcedures().catch(console.error);
