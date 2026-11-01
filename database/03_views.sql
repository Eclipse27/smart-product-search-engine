-- ============================================================
-- SMART PRODUCT SEARCH & RECOMMENDATION ENGINE
-- 03_views.sql — View Definitions
-- ============================================================
-- Advanced SQL Concepts Used:
--   • Views (reusable virtual tables)
--   • INNER JOIN (products ↔ categories)
--   • LEFT JOIN (categories with optional products)
--   • CASE expressions (stock status, discount calculation)
--   • Aggregate Functions (COUNT, AVG, MIN, MAX, SUM)
--   • GROUP BY (category-level statistics)
--   • Window Functions (ranking within views)
--   • Subqueries (recent review data)
-- ============================================================

USE smart_product_engine;

-- ============================================================
-- VIEW 1: vw_product_details
-- Combines product data with category info and computed fields
-- Used for product listings and detail pages
-- ============================================================
CREATE OR REPLACE VIEW vw_product_details AS
SELECT
    p.product_id,
    p.name,
    p.slug,
    p.description,
    p.price,
    p.original_price,
    p.stock_quantity,
    p.avg_rating,
    p.review_count,
    p.view_count,
    p.image_url,
    p.attributes,
    p.brand_generated AS brand,
    p.is_active,
    p.created_at,
    p.updated_at,

    -- Category information via INNER JOIN
    c.category_id,
    c.name           AS category_name,
    c.slug           AS category_slug,
    c.filter_attributes AS category_filters,

    -- Computed: stock status using CASE expression
    CASE
        WHEN p.stock_quantity = 0 THEN 'out_of_stock'
        WHEN p.stock_quantity < 5 THEN 'low_stock'
        ELSE 'in_stock'
    END AS stock_status,

    -- Computed: discount percentage using CASE expression
    CASE
        WHEN p.original_price IS NOT NULL AND p.original_price > p.price
        THEN ROUND(((p.original_price - p.price) / p.original_price) * 100)
        ELSE 0
    END AS discount_percentage

FROM products p
INNER JOIN categories c ON p.category_id = c.category_id;


-- ============================================================
-- VIEW 2: vw_category_stats
-- Category information with aggregated product statistics
-- Uses LEFT JOIN so categories with zero products are included
-- ============================================================
CREATE OR REPLACE VIEW vw_category_stats AS
SELECT
    c.category_id,
    c.name,
    c.slug,
    c.description,
    c.image_url,
    c.filter_attributes,

    -- Aggregate functions with LEFT JOIN
    COUNT(p.product_id)                    AS product_count,
    COALESCE(ROUND(AVG(p.price), 2), 0)    AS avg_price,
    COALESCE(MIN(p.price), 0)              AS min_price,
    COALESCE(MAX(p.price), 0)              AS max_price,
    COALESCE(ROUND(AVG(p.avg_rating), 2), 0) AS avg_rating,
    COALESCE(SUM(p.view_count), 0)         AS total_views

FROM categories c
LEFT JOIN products p
    ON c.category_id = p.category_id
    AND p.is_active = TRUE
GROUP BY
    c.category_id, c.name, c.slug, c.description,
    c.image_url, c.filter_attributes;


-- ============================================================
-- VIEW 3: vw_product_reviews_summary
-- Product-level review aggregation with rating distribution
-- ============================================================
CREATE OR REPLACE VIEW vw_product_reviews_summary AS
SELECT
    p.product_id,
    p.name AS product_name,
    COUNT(r.review_id)            AS total_reviews,
    COALESCE(ROUND(AVG(r.rating), 2), 0) AS calculated_avg_rating,
    -- Rating distribution using conditional aggregation
    SUM(CASE WHEN r.rating = 5 THEN 1 ELSE 0 END) AS five_star,
    SUM(CASE WHEN r.rating = 4 THEN 1 ELSE 0 END) AS four_star,
    SUM(CASE WHEN r.rating = 3 THEN 1 ELSE 0 END) AS three_star,
    SUM(CASE WHEN r.rating = 2 THEN 1 ELSE 0 END) AS two_star,
    SUM(CASE WHEN r.rating = 1 THEN 1 ELSE 0 END) AS one_star
FROM products p
LEFT JOIN reviews r ON p.product_id = r.product_id
GROUP BY p.product_id, p.name;


-- ============================================================
-- VIEW 4: vw_trending_dashboard
-- Combines trending scores with product catalog details
-- ============================================================
CREATE OR REPLACE VIEW vw_trending_dashboard AS
SELECT
    tp.trending_id,
    tp.trending_score,
    tp.period_views,
    tp.period_orders,
    tp.period_revenue,
    tp.calculated_at,
    p.product_id,
    p.name,
    p.slug,
    p.price,
    p.original_price,
    p.avg_rating,
    p.review_count,
    p.image_url,
    p.brand_generated AS brand,
    c.name AS category_name,
    c.slug AS category_slug,
    CASE
        WHEN p.original_price IS NOT NULL AND p.original_price > p.price
        THEN ROUND(((p.original_price - p.price) / p.original_price) * 100)
        ELSE 0
    END AS discount_percentage
FROM trending_products tp
INNER JOIN products p ON tp.product_id = p.product_id
INNER JOIN categories c ON p.category_id = c.category_id
WHERE p.is_active = TRUE;


-- ============================================================
-- VIEW 5: vw_best_sellers
-- Products ranked by order item frequency and revenue
-- ============================================================
CREATE OR REPLACE VIEW vw_best_sellers AS
SELECT
    p.product_id,
    p.name,
    p.slug,
    p.price,
    p.image_url,
    p.brand_generated AS brand,
    c.name AS category_name,
    c.slug AS category_slug,
    COALESCE(SUM(oi.quantity), 0) AS units_sold,
    COALESCE(SUM(oi.quantity * oi.unit_price), 0.00) AS total_revenue,
    COUNT(DISTINCT oi.order_id) AS order_appearances,
    DENSE_RANK() OVER (ORDER BY COALESCE(SUM(oi.quantity), 0) DESC) AS sales_rank
FROM products p
INNER JOIN categories c ON p.category_id = c.category_id
LEFT JOIN order_items oi ON p.product_id = oi.product_id
WHERE p.is_active = TRUE
GROUP BY p.product_id, p.name, p.slug, p.price, p.image_url, p.brand_generated, c.name, c.slug;


-- ============================================================
-- VIEW 6: vw_customer_order_summary
-- Customer purchase metrics for personalization
-- ============================================================
CREATE OR REPLACE VIEW vw_customer_order_summary AS
SELECT
    cu.customer_id,
    cu.name AS customer_name,
    cu.email,
    COUNT(DISTINCT o.order_id) AS total_orders,
    COALESCE(SUM(o.total_amount), 0.00) AS lifetime_spend,
    MAX(o.created_at) AS last_order_date
FROM customers cu
LEFT JOIN orders o ON cu.customer_id = o.customer_id
GROUP BY cu.customer_id, cu.name, cu.email;
