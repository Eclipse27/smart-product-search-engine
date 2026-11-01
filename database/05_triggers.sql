-- ============================================================
-- SMART PRODUCT SEARCH & RECOMMENDATION ENGINE
-- 05_triggers.sql — Trigger Definitions
-- ============================================================
-- Advanced SQL Concepts Used:
--   • AFTER INSERT Trigger (auto-update view_count)
--   • AFTER INSERT / UPDATE / DELETE Triggers on reviews
--   • AFTER INSERT Trigger on order_items (stock reduction)
--   • NEW and OLD pseudo-records
--   • Atomicity & Data Consistency
-- ============================================================

USE smart_product_engine;

DROP TRIGGER IF EXISTS trg_after_product_view;
DROP TRIGGER IF EXISTS trg_after_review_insert;
DROP TRIGGER IF EXISTS trg_after_review_update;
DROP TRIGGER IF EXISTS trg_after_review_delete;
DROP TRIGGER IF EXISTS trg_after_order_item_insert;

DELIMITER //

-- ============================================================
-- TRIGGER 1: trg_after_product_view
-- Auto-increments products.view_count whenever a view is logged
-- ============================================================
CREATE TRIGGER trg_after_product_view
AFTER INSERT ON product_views
FOR EACH ROW
BEGIN
    UPDATE products
    SET view_count = view_count + 1
    WHERE product_id = NEW.product_id;
END //


-- ============================================================
-- TRIGGER 2: trg_after_review_insert
-- Recalculates product avg_rating & review_count on new review
-- ============================================================
CREATE TRIGGER trg_after_review_insert
AFTER INSERT ON reviews
FOR EACH ROW
BEGIN
    UPDATE products
    SET 
        avg_rating = (
            SELECT COALESCE(ROUND(AVG(rating), 2), 0.00)
            FROM reviews
            WHERE product_id = NEW.product_id
        ),
        review_count = (
            SELECT COUNT(*)
            FROM reviews
            WHERE product_id = NEW.product_id
        )
    WHERE product_id = NEW.product_id;
END //


-- ============================================================
-- TRIGGER 3: trg_after_review_update
-- Recalculates product avg_rating on review edit
-- ============================================================
CREATE TRIGGER trg_after_review_update
AFTER UPDATE ON reviews
FOR EACH ROW
BEGIN
    UPDATE products
    SET avg_rating = (
        SELECT COALESCE(ROUND(AVG(rating), 2), 0.00)
        FROM reviews
        WHERE product_id = NEW.product_id
    )
    WHERE product_id = NEW.product_id;
END //


-- ============================================================
-- TRIGGER 4: trg_after_review_delete
-- Recalculates product avg_rating & review_count on review deletion
-- ============================================================
CREATE TRIGGER trg_after_review_delete
AFTER DELETE ON reviews
FOR EACH ROW
BEGIN
    UPDATE products
    SET 
        avg_rating = (
            SELECT COALESCE(ROUND(AVG(rating), 2), 0.00)
            FROM reviews
            WHERE product_id = OLD.product_id
        ),
        review_count = (
            SELECT COUNT(*)
            FROM reviews
            WHERE product_id = OLD.product_id
        )
    WHERE product_id = OLD.product_id;
END //


-- ============================================================
-- TRIGGER 5: trg_after_order_item_insert
-- Decrements stock_quantity when an item is ordered
-- (chk_stock_non_negative constraint prevents negative stock)
-- ============================================================
CREATE TRIGGER trg_after_order_item_insert
AFTER INSERT ON order_items
FOR EACH ROW
BEGIN
    UPDATE products
    SET stock_quantity = GREATEST(0, stock_quantity - NEW.quantity)
    WHERE product_id = NEW.product_id;
END //

DELIMITER ;
