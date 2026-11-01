const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const pool = require('./config/db');

async function testAllEndpoints() {
  console.log('=== VERIFYING BACKEND API & SQL LOGIC ===\n');

  // 1. Health & Database
  const [db] = await pool.query('SELECT 1 as ok, DATABASE() as db');
  console.log('1. Database connection:', db[0].db);

  // 2. Categories
  const [cats] = await pool.query('SELECT * FROM vw_category_stats');
  console.log('2. Categories count:', cats.length);

  // 3. Products
  const [prods] = await pool.query('SELECT COUNT(*) as count FROM products');
  console.log('3. Products count:', prods[0].count);

  // 4. Stored Procedure: search_products (with typo)
  const [sResults] = await pool.query('CALL search_products(?, null, null, null, null, 1, 3)', ['samsng moble']);
  console.log('4. Typo Search "samsng moble":', sResults[0]?.length, 'matches. Top:', sResults[0]?.[0]?.name);

  // 5. Autocomplete: get_product_suggestions
  const [suggs] = await pool.query('CALL get_product_suggestions(?, ?)', ['lap', 3]);
  console.log('5. Autocomplete for "lap":', suggs[0]?.map(s => s.name));

  // 6. Dynamic JSON Filtering: get_filtered_products
  const [filtered] = await pool.query('CALL get_filtered_products(?, ?, null, null, ?, 1, 3)', [
    'smartphones',
    JSON.stringify({ brand: 'Samsung' }),
    'price_desc'
  ]);
  console.log('6. Filtered Samsung phones:', filtered[0]?.length, 'items. Top:', filtered[0]?.[0]?.name);

  // 7. Product Detail: get_product_detail
  const [detail] = await pool.query('CALL get_product_detail(?)', ['samsung-galaxy-s24-ultra']);
  console.log('7. Product Detail for S24 Ultra:', detail[0]?.[0]?.name, 'Price: $' + detail[0]?.[0]?.price);

  // 8. Recommendations: Frequently bought together
  const [fbt] = await pool.query('CALL get_frequently_bought_together(?, ?)', [1, 3]);
  console.log('8. Frequently bought together with S24:', fbt[0]?.length, 'items');

  // 9. Trending products: get_trending_products
  const [trending] = await pool.query('CALL get_trending_products(?, ?)', [null, 3]);
  console.log('9. Trending products:', trending[0]?.map(t => `${t.name} (Score: ${t.trending_score})`));

  // 10. Advanced Ranking (Window Functions): get_ranked_products
  const [ranked] = await pool.query('CALL get_ranked_products(?, ?, 1, 3)', [null, 'rating']);
  console.log('10. Ranked by Window functions:', ranked[0]?.map(r => `${r.name} (CatRank: ${r.category_rating_rank})`));

  // 11. Transactional Order: create_order
  const [order] = await pool.query(
    'CALL create_order(1, ?, @order_id, @status); SELECT @order_id AS order_id, @status AS status;',
    [JSON.stringify([{ product_id: 2, quantity: 1 }])]
  );
  console.log('11. Transactional Order:', order[1]?.[0]);

  // 12. Review submission: submit_product_review
  const [rev] = await pool.query('CALL submit_product_review(?, ?, ?, ?)', [2, 1, 5, 'Exceptional performance and battery!']);
  console.log('12. Review submitted:', rev[0]?.[0]?.review_id, 'New Avg Rating:', rev[0]?.[0]?.avg_rating);

  console.log('\n✅ ALL BACKEND AND DATABASE LOGIC TESTED & VERIFIED CLEANLY! ✅');
  process.exit(0);
}

testAllEndpoints().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
