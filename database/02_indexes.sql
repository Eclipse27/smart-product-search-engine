-- ============================================================
-- SMART PRODUCT SEARCH & RECOMMENDATION ENGINE
-- 02_indexes.sql — Index Definitions
-- ============================================================
-- Advanced SQL Concepts Used:
--   • Normal B-tree Indexes (for filtering, sorting, joins)
--   • FULLTEXT Index (for smart product search with MATCH/AGAINST)
--   • Index on Generated Column (brand_generated from JSON)
--   • Composite Indexes (for common query patterns)
-- ============================================================

USE smart_product_engine;

-- ============================================================
-- PRODUCTS TABLE INDEXES
-- ============================================================

-- B-tree index on category for JOIN performance
CREATE INDEX idx_products_category    ON products(category_id);

-- B-tree index on price for range filtering and sorting
CREATE INDEX idx_products_price       ON products(price);

-- B-tree index on active status for filtering active products
CREATE INDEX idx_products_active      ON products(is_active);

-- B-tree index on stock for inventory queries
CREATE INDEX idx_products_stock       ON products(stock_quantity);

-- B-tree index on rating for sorting by rating
CREATE INDEX idx_products_rating      ON products(avg_rating);

-- B-tree index on view_count for popularity sorting
CREATE INDEX idx_products_views       ON products(view_count);

-- B-tree index on created_at for "newest" sorting
CREATE INDEX idx_products_created     ON products(created_at);

-- *** INDEX ON GENERATED COLUMN ***
-- This indexes the 'brand' value extracted from JSON attributes
-- Enables fast brand-based filtering without scanning JSON on every query
-- The brand_generated column is STORED, so this is a standard B-tree index
CREATE INDEX idx_products_brand       ON products(brand_generated);

-- Composite index for common query pattern: active + category + price
CREATE INDEX idx_products_active_cat_price ON products(is_active, category_id, price);

-- *** FULLTEXT INDEX ***
-- This is the core of the smart search system
-- Enables MATCH() AGAINST() full-text search across name and description
-- MySQL InnoDB supports FULLTEXT indexes since MySQL 5.6+
CREATE FULLTEXT INDEX ft_products_search ON products(name, description);


-- ============================================================
-- ORDERS TABLE INDEXES
-- ============================================================

CREATE INDEX idx_orders_customer      ON orders(customer_id);
CREATE INDEX idx_orders_status        ON orders(status);
CREATE INDEX idx_orders_created       ON orders(created_at);

-- Composite: customer + status (common query: "my pending orders")
CREATE INDEX idx_orders_cust_status   ON orders(customer_id, status);


-- ============================================================
-- ORDER_ITEMS TABLE INDEXES
-- ============================================================

CREATE INDEX idx_items_order           ON order_items(order_id);
CREATE INDEX idx_items_product         ON order_items(product_id);

-- Composite: product + order (for "frequently bought together" queries)
CREATE INDEX idx_items_product_order   ON order_items(product_id, order_id);


-- ============================================================
-- REVIEWS TABLE INDEXES
-- ============================================================

CREATE INDEX idx_reviews_product       ON reviews(product_id);
CREATE INDEX idx_reviews_customer      ON reviews(customer_id);
CREATE INDEX idx_reviews_rating        ON reviews(rating);


-- ============================================================
-- PRODUCT_VIEWS TABLE INDEXES
-- ============================================================

CREATE INDEX idx_views_product         ON product_views(product_id);
CREATE INDEX idx_views_customer        ON product_views(customer_id);
CREATE INDEX idx_views_date            ON product_views(viewed_at);

-- Composite: product + customer (for "customers also viewed" queries)
CREATE INDEX idx_views_prod_cust       ON product_views(product_id, customer_id);


-- ============================================================
-- SEARCH_HISTORY TABLE INDEXES
-- ============================================================

CREATE INDEX idx_search_customer       ON search_history(customer_id);
CREATE INDEX idx_search_query          ON search_history(search_query);
CREATE INDEX idx_search_date           ON search_history(searched_at);


-- ============================================================
-- TRENDING_PRODUCTS TABLE INDEXES
-- ============================================================

CREATE INDEX idx_trending_product      ON trending_products(product_id);
CREATE INDEX idx_trending_score        ON trending_products(trending_score DESC);
CREATE INDEX idx_trending_calculated   ON trending_products(calculated_at);


-- ============================================================
-- Verify indexes
-- ============================================================
SELECT
    TABLE_NAME,
    INDEX_NAME,
    INDEX_TYPE,
    GROUP_CONCAT(COLUMN_NAME ORDER BY SEQ_IN_INDEX) AS columns
FROM INFORMATION_SCHEMA.STATISTICS
WHERE TABLE_SCHEMA = 'smart_product_engine'
GROUP BY TABLE_NAME, INDEX_NAME, INDEX_TYPE
ORDER BY TABLE_NAME, INDEX_NAME;
