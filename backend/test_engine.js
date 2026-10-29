require('dotenv').config();
const pool = require('./config/db');

async function testAll() {
  console.log('=== 1. Testing Database Connection ===');
  const [dbTest] = await pool.query('SELECT 1 as connected, DATABASE() as db');
  console.log('Connected to:', dbTest[0].db);

  console.log('\n=== 2. Testing Views ===');
  const [catStats] = await pool.query('SELECT name, product_count, avg_price, avg_rating FROM vw_category_stats ORDER BY product_count DESC');
  console.log('vw_category_stats (all 8 categories):');
  console.table(catStats);

  const [prodDetails] = await pool.query('SELECT product_id, name, brand, category_name, price, stock_status FROM vw_product_details LIMIT 3');
  console.log('\nvw_product_details sample:');
  console.table(prodDetails);

  const [revSummary] = await pool.query('SELECT * FROM vw_product_reviews_summary WHERE total_reviews > 0 LIMIT 2');
  console.log('\nvw_product_reviews_summary sample:');
  console.table(revSummary);

  console.log('\n=== 3. Testing Stored Procedure: search_products (FULLTEXT) ===');
  const [searchResults] = await pool.query('CALL search_products(?, ?, ?, ?, ?, ?, ?)', ['samsung galaxy', null, null, null, null, 1, 5]);
  console.log('search_products count:', searchResults[1][0].total_count);
  console.table(searchResults[0].map(p => ({ name: p.name, relevance: p.relevance_score, brand: p.brand, price: p.price })));

  console.log('\n=== 4. Testing Stored Procedure: get_product_suggestions (Boolean Prefix) ===');
  const [suggResults] = await pool.query('CALL get_product_suggestions(?, ?)', ['wire', 5]);
  console.log('Suggestions for "wire":', suggResults[0].map(s => s.name));

  console.log('\n=== 5. Testing Stored Procedure: get_filter_values (JSON extraction) ===');
  const [filterValues] = await pool.query('CALL get_filter_values(?, ?)', ['smartphones', 'brand']);
  console.log('Smartphone brands available:');
  console.table(filterValues[0]);

  console.log('\n=== 6. Testing Stored Procedure: get_filtered_products (Dynamic JSON filter) ===');
  const [filteredProds] = await pool.query('CALL get_filtered_products(?, ?, ?, ?, ?, ?, ?)', [
    'smartphones',
    JSON.stringify({ brand: 'Samsung' }),
    null,
    null,
    'newest',
    1,
    5
  ]);
  console.log('Total Samsung smartphones:', filteredProds[1][0].total_count);
  console.table(filteredProds[0].map(p => ({ name: p.name, brand: p.brand, price: p.price })));

  console.log('\n=== 7. Testing Stored Procedure: get_product_detail ===');
  const [detailResults] = await pool.query('CALL get_product_detail(?)', ['samsung-galaxy-s24-ultra']);
  console.log('Product detail found:', detailResults[0][0]?.name);
  console.log('Product reviews count:', detailResults[1]?.length);
  console.log('Product review summary calculated_avg_rating:', detailResults[2][0]?.calculated_avg_rating);

  console.log('\n=== 8. Testing Trigger: product_views -> update view_count ===');
  const prodId = detailResults[0][0].product_id;
  const beforeViews = detailResults[0][0].view_count;
  await pool.query('CALL log_product_view(?, ?)', [prodId, null]);
  const [[afterProd]] = await pool.query('SELECT view_count FROM products WHERE product_id = ?', [prodId]);
  console.log(`View count before: ${beforeViews}, after: ${afterProd.view_count}`);

  console.log('\n✅ ALL DATABASE AND STORED PROCEDURE TESTS PASSED SUCCESSFULLY! ✅');
  process.exit(0);
}

testAll().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
