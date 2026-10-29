-- ============================================================
-- SMART PRODUCT SEARCH & RECOMMENDATION ENGINE
-- 00_create_database.sql — Database Creation
-- ============================================================
-- Advanced SQL Project
-- This file creates the main database with proper character set
-- and collation for full Unicode support (including emoji).
-- ============================================================

-- Drop existing database if it exists (for clean re-creation)
DROP DATABASE IF EXISTS smart_product_engine;

-- Create the database with UTF8MB4 character set
-- utf8mb4_unicode_ci provides proper Unicode sorting and comparison
CREATE DATABASE smart_product_engine
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

-- Switch to the newly created database
USE smart_product_engine;

-- Verify creation
SELECT 'Database smart_product_engine created successfully!' AS status;
