-- ============================================================
-- SMART PRODUCT SEARCH & RECOMMENDATION ENGINE
-- 05_triggers.sql — Trigger Definitions
-- ============================================================
-- Advanced SQL Concepts Used:
--   • AFTER INSERT Trigger (auto-update view_count)
--   • NEW keyword (referencing inserted row)
--   • UPDATE within trigger body
-- 
-- Phase 1 Trigger:
--   • trg_after_product_view — increments products.view_count
--
-- Phase 3 Triggers (to be added):
--   • trg_after_review_insert — recalculate avg_rating
--   • trg_after_review_update — recalculate avg_rating
--   • trg_after_review_delete — recalculate avg_rating
--   • trg_after_order_item_insert — reduce stock
-- ============================================================

USE smart_product_engine;

-- ============================================================
-- TRIGGER: trg_after_product_view
-- Automatically increments the view_count in products table
-- whenever a new row is inserted into product_views.
-- This keeps view_count in sync without manual updates.
-- ============================================================
DELIMITER //
CREATE TRIGGER trg_after_product_view
AFTER INSERT ON product_views
FOR EACH ROW
BEGIN
    -- Update the view_count for the viewed product
    -- NEW.product_id refers to the product_id of the newly inserted view
    UPDATE products
    SET view_count = view_count + 1
    WHERE product_id = NEW.product_id;
END //
DELIMITER ;


-- ============================================================
-- Verify triggers
-- ============================================================
SELECT TRIGGER_NAME, EVENT_MANIPULATION, EVENT_OBJECT_TABLE, ACTION_TIMING
FROM INFORMATION_SCHEMA.TRIGGERS
WHERE TRIGGER_SCHEMA = 'smart_product_engine'
ORDER BY TRIGGER_NAME;
