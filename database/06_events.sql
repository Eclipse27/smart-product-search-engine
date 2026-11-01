-- ============================================================
-- SMART PRODUCT SEARCH & RECOMMENDATION ENGINE
-- 06_events.sql — MySQL Scheduled Events
-- ============================================================
-- Advanced SQL Concepts Used:
--   • Scheduled Events (cron-like periodic DB jobs)
--   • Event Scheduler configuration
--   • Periodic materialized summary recalculation
-- ============================================================

USE smart_product_engine;

-- Turn on MySQL event scheduler if user has SUPER / EVENT privilege
SET GLOBAL event_scheduler = ON;

DROP EVENT IF EXISTS evt_refresh_trending_products;

DELIMITER //

CREATE EVENT evt_refresh_trending_products
ON SCHEDULE EVERY 6 HOUR
STARTS CURRENT_TIMESTAMP
ON COMPLETION PRESERVE
ENABLE
COMMENT 'Recalculates trending product scores every 6 hours based on views, orders and revenue'
DO
BEGIN
    CALL calculate_trending_products();
END //

DELIMITER ;
