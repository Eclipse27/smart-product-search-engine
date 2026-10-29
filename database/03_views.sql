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
-- Product-level review aggregation with review details
-- ============================================================
CREATE OR REPLACE VIEW vw_product_reviews_summary AS
SELECT
    p.product_id,
    p.name AS product_name,
    COUNT(r.review_id)            AS total_reviews,
    COALESCE(AVG(r.rating), 0)    AS calculated_avg_rating,
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
-- Verify views
-- ============================================================
SELECT TABLE_NAME AS view_name, VIEW_DEFINITION IS NOT NULL AS is_valid
FROM INFORMATION_SCHEMA.VIEWS
WHERE TABLE_SCHEMA = 'smart_product_engine'
ORDER BY TABLE_NAME;
