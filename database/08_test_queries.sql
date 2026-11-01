-- ============================================================
-- SMART PRODUCT SEARCH & RECOMMENDATION ENGINE
-- 08_test_queries.sql — Verification & Demonstration Queries
-- ============================================================
-- Demonstrates:
--   1. FULLTEXT search with MATCH() AGAINST() & relevance scores
--   2. Typo-tolerant search with Levenshtein & Soundex
--   3. Search autocomplete suggestions with Boolean prefix
--   4. Dynamic JSON attribute filtering
--   5. Recommendation engine (Frequently Bought Together, Co-Views, Similar, Personalized)
--   6. Trending products score calculation
--   7. Advanced ranking with Window functions (ROW_NUMBER, RANK, DENSE_RANK, PARTITION BY)
--   8. Trigger-based stock reduction & review rating recalculation
-- ============================================================

USE smart_product_engine;

-- ------------------------------------------------------------
-- 1. SMART FULLTEXT SEARCH WITH RELEVANCE SCORING
-- ------------------------------------------------------------
CALL search_products('wireless noise cancelling', NULL, NULL, NULL, 'popularity', 1, 5);

-- ------------------------------------------------------------
-- 2. TYPO-TOLERANT SEARCH (CRITICAL REQUIREMENT)
-- Handles common spelling mistakes without returning empty results
-- ------------------------------------------------------------
-- "blu tooth headfones" -> Bluetooth headphones
CALL search_products('blu tooth headfones', NULL, NULL, NULL, NULL, 1, 5);

-- "samsng moble" -> Samsung mobile phones
CALL search_products('samsng moble', NULL, NULL, NULL, NULL, 1, 5);

-- "iphne 16" -> iPhone
CALL search_products('iphne 16', NULL, NULL, NULL, NULL, 1, 5);

-- "lapotp" -> Laptop
CALL search_products('lapotp', NULL, NULL, NULL, NULL, 1, 5);

-- "wireles earbuds" -> Wireless earbuds
CALL search_products('wireles earbuds', NULL, NULL, NULL, NULL, 1, 5);

-- "nik shooes" -> Nike shoes
CALL search_products('nik shooes', NULL, NULL, NULL, NULL, 1, 5);

-- "smart watche" -> Smartwatches
CALL search_products('smart watche', NULL, NULL, NULL, NULL, 1, 5);

-- ------------------------------------------------------------
-- 3. SEARCH AUTOCOMPLETE SUGGESTIONS (BOOLEAN MODE WILDCARD)
-- ------------------------------------------------------------
CALL get_product_suggestions('wire', 5);
CALL get_product_suggestions('sams', 5);
CALL get_product_suggestions('iph', 5);

-- ------------------------------------------------------------
-- 4. DYNAMIC JSON ATTRIBUTE FILTERING
-- ------------------------------------------------------------
-- Filter smartphones by brand = 'Samsung' and ram = '12GB'
CALL get_filtered_products('smartphones', '{"brand":"Samsung","ram":"12GB"}', NULL, NULL, 'price_desc', 1, 10);

-- Extract available attribute filter options for laptops (e.g. processor)
CALL get_filter_values('laptops', 'processor');

-- ------------------------------------------------------------
-- 5. RECOMMENDATION ENGINE
-- ------------------------------------------------------------
-- A. Frequently Bought Together (Order Items Self-Join)
CALL get_frequently_bought_together(1, 4);

-- B. Customers Also Viewed (Product Views Co-occurrence)
CALL get_customers_also_viewed(1, 4);

-- C. Similar Products (Category + Brand + Price proximity)
CALL get_similar_products(1, 4);

-- D. Personalized Recommendations (User Interests CTE)
CALL get_personalized_recommendations(1, 6);

-- ------------------------------------------------------------
-- 6. TRENDING PRODUCTS & BEST SELLERS
-- ------------------------------------------------------------
CALL calculate_trending_products();
CALL get_trending_products(NULL, 6);
CALL get_best_sellers(6);

-- ------------------------------------------------------------
-- 7. ADVANCED RANKING WITH WINDOW FUNCTIONS (MODULE 5)
-- Demonstrates DENSE_RANK() PARTITION BY category, RANK() OVER popularity, ROW_NUMBER()
-- ------------------------------------------------------------
CALL get_ranked_products(NULL, 'rating', 1, 10);

-- ------------------------------------------------------------
-- 8. TRANSACTIONAL ORDER CREATION
-- Validates stock, inserts order + items, decrements stock atomically
-- ------------------------------------------------------------
SET @test_order_id = NULL;
SET @test_status = NULL;
CALL create_order(1, '[{"product_id": 1, "quantity": 1}]', @test_order_id, @test_status);
SELECT @test_order_id AS order_id, @test_status AS status;

-- ------------------------------------------------------------
-- 9. ANALYTICAL VIEWS
-- ------------------------------------------------------------
SELECT * FROM vw_category_stats;
SELECT * FROM vw_trending_dashboard LIMIT 5;
SELECT * FROM vw_best_sellers LIMIT 5;
SELECT * FROM vw_customer_order_summary LIMIT 5;

