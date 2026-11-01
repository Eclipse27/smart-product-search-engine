const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const pool = require('./config/db');

async function testTypos() {
  console.log('=== TESTING TYPO-TOLERANT SEARCH ===\n');
  const queries = [
    'blu tooth headfones',
    'samsng moble',
    'iphne 16',
    'lapotp',
    'wireles earbuds',
    'nik shooes',
    'smart watche'
  ];

  for (const q of queries) {
    const [results] = await pool.query('CALL search_products(?, null, null, null, null, 1, 3)', [q]);
    const products = results[0] || [];
    const totalCount = results[1]?.[0]?.total_count || 0;
    console.log(`🔍 Query: "${q}"`);
    console.log(`   Count: ${totalCount}`);
    console.log(`   Stage: ${products[0]?.match_stage || 'none'}`);
    console.log(`   Top 1: ${products[0]?.name} (Score: ${products[0]?.relevance_score}, Brand: ${products[0]?.brand})`);
    if (products[1]) console.log(`   Top 2: ${products[1]?.name}`);
    console.log('');
  }

  process.exit(0);
}

testTypos().catch(err => {
  console.error('Typo test error:', err);
  process.exit(1);
});
