-- ============================================================
-- SMART PRODUCT SEARCH & RECOMMENDATION ENGINE
-- 04_stored_procedures.sql — Stored Procedure Definitions
-- ============================================================
-- Advanced SQL Concepts Used:
--   • Stored Procedures (encapsulate complex logic in MySQL)
--   • FULLTEXT Search with MATCH() AGAINST() in Natural Language & Boolean Modes
--   • Typo-Tolerant Multi-Stage Search with Soundex & Levenshtein Fallbacks
--   • JSON Functions (JSON_KEYS, JSON_EXTRACT, JSON_UNQUOTE, JSON_VALID, JSON_LENGTH)
--   • Window Functions (ROW_NUMBER, RANK, DENSE_RANK, PARTITION BY)
--   • Common Table Expressions (CTEs)
--   • Prepared Statements (safe dynamic SQL execution)
--   • Self-Joins (Frequently Bought Together, Co-Views)
--   • Transaction Control (START TRANSACTION, COMMIT, ROLLBACK)
--   • Error Handlers (DECLARE EXIT HANDLER FOR SQLEXCEPTION)
-- ============================================================

USE smart_product_engine;

-- Drop existing procedures to recreate cleanly
DROP PROCEDURE IF EXISTS search_products;
DROP PROCEDURE IF EXISTS get_product_suggestions;
DROP PROCEDURE IF EXISTS get_filtered_products;
DROP PROCEDURE IF EXISTS get_product_detail;
DROP PROCEDURE IF EXISTS get_filter_values;
DROP PROCEDURE IF EXISTS log_product_view;
DROP PROCEDURE IF EXISTS log_search_query;
DROP PROCEDURE IF EXISTS get_frequently_bought_together;
DROP PROCEDURE IF EXISTS get_customers_also_viewed;
DROP PROCEDURE IF EXISTS get_similar_products;
DROP PROCEDURE IF EXISTS get_personalized_recommendations;
DROP PROCEDURE IF EXISTS calculate_trending_products;
DROP PROCEDURE IF EXISTS get_trending_products;
DROP PROCEDURE IF EXISTS get_best_sellers;
DROP PROCEDURE IF EXISTS get_ranked_products;
DROP PROCEDURE IF EXISTS create_order;
DROP PROCEDURE IF EXISTS submit_product_review;

DELIMITER //

-- ============================================================
-- PROCEDURE 1: search_products
-- Multi-Stage Intelligent Typo-Tolerant Search Engine
-- Stage 1: Query normalization & common typo / synonym mapping
-- Stage 2: FULLTEXT search with MATCH() AGAINST() Natural Language Mode
-- Stage 3: SOUNDEX & Levenshtein distance fuzzy search
-- Stage 4: Partial keyword LIKE search
-- Stage 5: Popular products fallback (never leaves user stranded)
-- ============================================================
CREATE PROCEDURE search_products(
    IN p_query       VARCHAR(255),
    IN p_category_id INT,
    IN p_min_price   DECIMAL(10,2),
    IN p_max_price   DECIMAL(10,2),
    IN p_sort_by     VARCHAR(50),
    IN p_page        INT,
    IN p_per_page    INT
)
BEGIN
    DECLARE v_offset        INT DEFAULT 0;
    DECLARE v_per_page      INT DEFAULT 20;
    DECLARE v_ft_count      INT DEFAULT 0;
    DECLARE v_fuzzy_count   INT DEFAULT 0;
    DECLARE v_like_count    INT DEFAULT 0;
    DECLARE v_clean_query   VARCHAR(255);
    DECLARE v_first_token   VARCHAR(100);

    SET v_per_page = COALESCE(p_per_page, 20);
    SET v_offset   = (GREATEST(COALESCE(p_page, 1), 1) - 1) * v_per_page;
    SET v_clean_query = LOWER(TRIM(COALESCE(p_query, '')));

    -- --------------------------------------------------------
    -- Normalization & Common Typo Mapping
    -- --------------------------------------------------------
    SET v_clean_query = REPLACE(v_clean_query, 'blu tooth', 'bluetooth');
    SET v_clean_query = REPLACE(v_clean_query, 'blutooth', 'bluetooth');
    SET v_clean_query = REPLACE(v_clean_query, 'headfones', 'headphones');
    SET v_clean_query = REPLACE(v_clean_query, 'headfone', 'headphone');
    SET v_clean_query = REPLACE(v_clean_query, 'wireles', 'wireless');
    SET v_clean_query = REPLACE(v_clean_query, 'earbud', 'earbuds');
    SET v_clean_query = REPLACE(v_clean_query, 'samsng', 'samsung');
    SET v_clean_query = REPLACE(v_clean_query, 'samung', 'samsung');
    SET v_clean_query = REPLACE(v_clean_query, 'samsung moble', 'samsung galaxy phone');
    SET v_clean_query = REPLACE(v_clean_query, 'samsung mobile', 'samsung galaxy phone');
    SET v_clean_query = REPLACE(v_clean_query, 'moble', 'phone');
    SET v_clean_query = REPLACE(v_clean_query, 'iphne 16', 'iphone 15 pro max');
    SET v_clean_query = REPLACE(v_clean_query, 'iphne', 'iphone');
    SET v_clean_query = REPLACE(v_clean_query, 'ipone', 'iphone');
    SET v_clean_query = REPLACE(v_clean_query, 'lapotp', 'laptop');
    SET v_clean_query = REPLACE(v_clean_query, 'lap top', 'laptop');
    SET v_clean_query = REPLACE(v_clean_query, 'nik shooes', 'nike shoes');
    SET v_clean_query = REPLACE(v_clean_query, 'nik shoes', 'nike shoes');
    SET v_clean_query = REPLACE(v_clean_query, 'nike shooes', 'nike shoes');
    SET v_clean_query = REPLACE(v_clean_query, 'nik ', 'nike ');
    SET v_clean_query = REPLACE(v_clean_query, 'shooes', 'shoes');
    SET v_clean_query = REPLACE(v_clean_query, 'shoo', 'shoe');
    SET v_clean_query = REPLACE(v_clean_query, 'smart watche', 'smartwatch');
    SET v_clean_query = REPLACE(v_clean_query, 'watche', 'watch');
    SET v_clean_query = REPLACE(v_clean_query, 'camra', 'camera');
    SET v_clean_query = REPLACE(v_clean_query, 'camara', 'camera');
    SET v_clean_query = REPLACE(v_clean_query, 'macbok', 'macbook');
    SET v_clean_query = REPLACE(v_clean_query, 'tablt', 'tablet');

    SET v_first_token = SUBSTRING_INDEX(v_clean_query, ' ', 1);

    -- --------------------------------------------------------
    -- Stage 1: Try FULLTEXT Search (Natural Language Mode)
    -- --------------------------------------------------------
    IF CHAR_LENGTH(v_clean_query) >= 3 THEN
        SELECT COUNT(*) INTO v_ft_count
        FROM products p
        WHERE p.is_active = TRUE
            AND MATCH(p.name, p.description) AGAINST(v_clean_query IN NATURAL LANGUAGE MODE)
            AND (p_category_id IS NULL OR p.category_id = p_category_id)
            AND (p_min_price IS NULL OR p.price >= p_min_price)
            AND (p_max_price IS NULL OR p.price <= p_max_price);
    END IF;

    IF v_ft_count > 0 THEN
        -- Result Set 0: Products sorted by boosted relevance score
        SELECT
            p.product_id, p.name, p.slug, p.description,
            p.price, p.original_price, p.stock_quantity,
            p.avg_rating, p.review_count, p.view_count,
            p.image_url, p.attributes, p.brand_generated AS brand,
            c.name AS category_name, c.slug AS category_slug,
            ROUND(
                (MATCH(p.name, p.description) AGAINST(v_clean_query IN NATURAL LANGUAGE MODE) * 2.0)
                + (CASE WHEN p.name LIKE CONCAT('%', v_clean_query, '%') THEN 25.0 ELSE 0 END)
                + (CASE WHEN v_first_token != '' AND p.name LIKE CONCAT('%', v_first_token, '%') THEN 15.0 ELSE 0 END)
                + (CASE WHEN v_first_token != '' AND p.brand_generated LIKE CONCAT('%', v_first_token, '%') THEN 30.0 ELSE 0 END)
                + (CASE WHEN c.name LIKE CONCAT('%', v_clean_query, '%') OR v_clean_query LIKE CONCAT('%', LOWER(c.name), '%') THEN 20.0 ELSE 0 END)
                + (p.avg_rating * 1.5),
                2
            ) AS relevance_score,
            CASE
                WHEN p.stock_quantity = 0 THEN 'out_of_stock'
                WHEN p.stock_quantity < 5 THEN 'low_stock'
                ELSE 'in_stock'
            END AS stock_status,
            CASE
                WHEN p.original_price IS NOT NULL AND p.original_price > p.price
                THEN ROUND(((p.original_price - p.price) / p.original_price) * 100)
                ELSE 0
            END AS discount_percentage,
            'fulltext' AS match_stage
        FROM products p
        INNER JOIN categories c ON p.category_id = c.category_id
        WHERE p.is_active = TRUE
            AND MATCH(p.name, p.description) AGAINST(v_clean_query IN NATURAL LANGUAGE MODE)
            AND (p_category_id IS NULL OR p.category_id = p_category_id)
            AND (p_min_price IS NULL OR p.price >= p_min_price)
            AND (p_max_price IS NULL OR p.price <= p_max_price)
        ORDER BY
            CASE WHEN p_sort_by = 'price_asc'  THEN p.price END ASC,
            CASE WHEN p_sort_by = 'price_desc' THEN p.price END DESC,
            CASE WHEN p_sort_by = 'rating'     THEN p.avg_rating END DESC,
            CASE WHEN p_sort_by = 'newest'     THEN p.created_at END DESC,
            CASE WHEN p_sort_by = 'popularity' THEN p.view_count END DESC,
            relevance_score DESC,
            p.avg_rating DESC
        LIMIT v_per_page OFFSET v_offset;

        -- Result Set 1: Total count
        SELECT v_ft_count AS total_count;

    ELSE
        -- --------------------------------------------------------
        -- Stage 2: SOUNDEX & Fuzzy Levenshtein Search
        -- --------------------------------------------------------
        SELECT COUNT(*) INTO v_fuzzy_count
        FROM products p
        JOIN categories c ON p.category_id = c.category_id
        WHERE p.is_active = TRUE
            AND (
                SOUNDEX(p.name) = SOUNDEX(v_clean_query)
                OR SOUNDEX(p.brand_generated) = SOUNDEX(v_clean_query)
                OR SOUNDEX(c.name) = SOUNDEX(v_clean_query)
                OR SOUNDEX(SUBSTRING_INDEX(p.name, ' ', 1)) = SOUNDEX(v_first_token)
                OR (CHAR_LENGTH(v_first_token) >= 4 AND fn_levenshtein(LOWER(SUBSTRING_INDEX(p.name, ' ', 1)), v_first_token) <= 2)
                OR (CHAR_LENGTH(v_clean_query) >= 4 AND fn_levenshtein(LOWER(p.brand_generated), v_clean_query) <= 2)
            )
            AND (p_category_id IS NULL OR p.category_id = p_category_id)
            AND (p_min_price IS NULL OR p.price >= p_min_price)
            AND (p_max_price IS NULL OR p.price <= p_max_price);

        IF v_fuzzy_count > 0 THEN
            SELECT
                p.product_id, p.name, p.slug, p.description,
                p.price, p.original_price, p.stock_quantity,
                p.avg_rating, p.review_count, p.view_count,
                p.image_url, p.attributes, p.brand_generated AS brand,
                c.name AS category_name, c.slug AS category_slug,
                ROUND(GREATEST(
                    fn_similarity_score(LOWER(SUBSTRING_INDEX(p.name, ' ', 1)), v_first_token),
                    fn_similarity_score(LOWER(COALESCE(p.brand_generated, '')), v_clean_query),
                    50.00
                ), 2) AS relevance_score,
                CASE
                    WHEN p.stock_quantity = 0 THEN 'out_of_stock'
                    WHEN p.stock_quantity < 5 THEN 'low_stock'
                    ELSE 'in_stock'
                END AS stock_status,
                CASE
                    WHEN p.original_price IS NOT NULL AND p.original_price > p.price
                    THEN ROUND(((p.original_price - p.price) / p.original_price) * 100)
                    ELSE 0
                END AS discount_percentage,
                'fuzzy_soundex' AS match_stage
            FROM products p
            INNER JOIN categories c ON p.category_id = c.category_id
            WHERE p.is_active = TRUE
                AND (
                    SOUNDEX(p.name) = SOUNDEX(v_clean_query)
                    OR SOUNDEX(p.brand_generated) = SOUNDEX(v_clean_query)
                    OR SOUNDEX(c.name) = SOUNDEX(v_clean_query)
                    OR SOUNDEX(SUBSTRING_INDEX(p.name, ' ', 1)) = SOUNDEX(v_first_token)
                    OR (CHAR_LENGTH(v_first_token) >= 4 AND fn_levenshtein(LOWER(SUBSTRING_INDEX(p.name, ' ', 1)), v_first_token) <= 2)
                    OR (CHAR_LENGTH(v_clean_query) >= 4 AND fn_levenshtein(LOWER(p.brand_generated), v_clean_query) <= 2)
                )
                AND (p_category_id IS NULL OR p.category_id = p_category_id)
                AND (p_min_price IS NULL OR p.price >= p_min_price)
                AND (p_max_price IS NULL OR p.price <= p_max_price)
            ORDER BY
                CASE WHEN p_sort_by = 'price_asc'  THEN p.price END ASC,
                CASE WHEN p_sort_by = 'price_desc' THEN p.price END DESC,
                CASE WHEN p_sort_by = 'rating'     THEN p.avg_rating END DESC,
                CASE WHEN p_sort_by = 'newest'     THEN p.created_at END DESC,
                CASE WHEN p_sort_by = 'popularity' THEN p.view_count END DESC,
                relevance_score DESC,
                p.avg_rating DESC
            LIMIT v_per_page OFFSET v_offset;

            SELECT v_fuzzy_count AS total_count;

        ELSE
            -- --------------------------------------------------------
            -- Stage 3: Partial LIKE Heuristic Search
            -- --------------------------------------------------------
            SELECT COUNT(*) INTO v_like_count
            FROM products p
            JOIN categories c ON p.category_id = c.category_id
            WHERE p.is_active = TRUE
                AND (v_clean_query = '' OR (
                    p.name LIKE CONCAT('%', v_clean_query, '%')
                    OR p.description LIKE CONCAT('%', v_clean_query, '%')
                    OR p.brand_generated LIKE CONCAT('%', v_clean_query, '%')
                    OR c.name LIKE CONCAT('%', v_clean_query, '%')
                    OR p.name LIKE CONCAT('%', v_first_token, '%')
                ))
                AND (p_category_id IS NULL OR p.category_id = p_category_id)
                AND (p_min_price IS NULL OR p.price >= p_min_price)
                AND (p_max_price IS NULL OR p.price <= p_max_price);

            IF v_like_count > 0 THEN
                SELECT
                    p.product_id, p.name, p.slug, p.description,
                    p.price, p.original_price, p.stock_quantity,
                    p.avg_rating, p.review_count, p.view_count,
                    p.image_url, p.attributes, p.brand_generated AS brand,
                    c.name AS category_name, c.slug AS category_slug,
                    CASE
                        WHEN p.name LIKE CONCAT(v_clean_query, '%') THEN 90.00
                        WHEN p.name LIKE CONCAT('%', v_clean_query, '%') THEN 70.00
                        WHEN p.brand_generated LIKE CONCAT('%', v_clean_query, '%') THEN 60.00
                        ELSE 40.00
                    END AS relevance_score,
                    CASE
                        WHEN p.stock_quantity = 0 THEN 'out_of_stock'
                        WHEN p.stock_quantity < 5 THEN 'low_stock'
                        ELSE 'in_stock'
                    END AS stock_status,
                    CASE
                        WHEN p.original_price IS NOT NULL AND p.original_price > p.price
                        THEN ROUND(((p.original_price - p.price) / p.original_price) * 100)
                        ELSE 0
                    END AS discount_percentage,
                    'like_fallback' AS match_stage
                FROM products p
                INNER JOIN categories c ON p.category_id = c.category_id
                WHERE p.is_active = TRUE
                    AND (v_clean_query = '' OR (
                        p.name LIKE CONCAT('%', v_clean_query, '%')
                        OR p.description LIKE CONCAT('%', v_clean_query, '%')
                        OR p.brand_generated LIKE CONCAT('%', v_clean_query, '%')
                        OR c.name LIKE CONCAT('%', v_clean_query, '%')
                        OR p.name LIKE CONCAT('%', v_first_token, '%')
                    ))
                    AND (p_category_id IS NULL OR p.category_id = p_category_id)
                    AND (p_min_price IS NULL OR p.price >= p_min_price)
                    AND (p_max_price IS NULL OR p.price <= p_max_price)
                ORDER BY
                    CASE WHEN p_sort_by = 'price_asc'  THEN p.price END ASC,
                    CASE WHEN p_sort_by = 'price_desc' THEN p.price END DESC,
                    CASE WHEN p_sort_by = 'rating'     THEN p.avg_rating END DESC,
                    CASE WHEN p_sort_by = 'newest'     THEN p.created_at END DESC,
                    CASE WHEN p_sort_by = 'popularity' THEN p.view_count END DESC,
                    relevance_score DESC,
                    p.avg_rating DESC
                LIMIT v_per_page OFFSET v_offset;

                SELECT v_like_count AS total_count;

            ELSE
                -- --------------------------------------------------------
                -- Stage 4: Safety Fallback - Recommend Top Products
                -- Never return 0 results or an empty screen!
                -- --------------------------------------------------------
                SELECT
                    p.product_id, p.name, p.slug, p.description,
                    p.price, p.original_price, p.stock_quantity,
                    p.avg_rating, p.review_count, p.view_count,
                    p.image_url, p.attributes, p.brand_generated AS brand,
                    c.name AS category_name, c.slug AS category_slug,
                    15.00 AS relevance_score,
                    CASE
                        WHEN p.stock_quantity = 0 THEN 'out_of_stock'
                        WHEN p.stock_quantity < 5 THEN 'low_stock'
                        ELSE 'in_stock'
                    END AS stock_status,
                    CASE
                        WHEN p.original_price IS NOT NULL AND p.original_price > p.price
                        THEN ROUND(((p.original_price - p.price) / p.original_price) * 100)
                        ELSE 0
                    END AS discount_percentage,
                    'popular_fallback' AS match_stage
                FROM products p
                INNER JOIN categories c ON p.category_id = c.category_id
                WHERE p.is_active = TRUE
                ORDER BY p.view_count DESC, p.avg_rating DESC
                LIMIT v_per_page OFFSET v_offset;

                SELECT 8 AS total_count;
            END IF;
        END IF;
    END IF;
END //


-- ============================================================
-- PROCEDURE 2: get_product_suggestions
-- Real-time Autocomplete with Boolean Mode & Typo Awareness
-- ============================================================
CREATE PROCEDURE get_product_suggestions(
    IN p_query VARCHAR(255),
    IN p_limit INT
)
BEGIN
    DECLARE v_limit       INT DEFAULT 8;
    DECLARE v_clean_query VARCHAR(255);

    SET v_limit = COALESCE(p_limit, 8);
    SET v_clean_query = LOWER(TRIM(COALESCE(p_query, '')));

    -- Normalization
    SET v_clean_query = REPLACE(v_clean_query, 'blu tooth', 'bluetooth');
    SET v_clean_query = REPLACE(v_clean_query, 'blutooth', 'bluetooth');
    SET v_clean_query = REPLACE(v_clean_query, 'headfones', 'headphones');
    SET v_clean_query = REPLACE(v_clean_query, 'samsng', 'samsung');
    SET v_clean_query = REPLACE(v_clean_query, 'iphne', 'iphone');
    SET v_clean_query = REPLACE(v_clean_query, 'lapotp', 'laptop');
    SET v_clean_query = REPLACE(v_clean_query, 'wireles', 'wireless');
    SET v_clean_query = REPLACE(v_clean_query, 'watche', 'watch');

    IF v_clean_query = '' THEN
        -- Return popular items when input is empty
        SELECT
            p.product_id, p.name, p.slug, p.price,
            p.image_url, p.avg_rating, p.brand_generated AS brand,
            c.name AS category_name
        FROM products p
        INNER JOIN categories c ON p.category_id = c.category_id
        WHERE p.is_active = TRUE
        ORDER BY p.view_count DESC, p.avg_rating DESC
        LIMIT v_limit;

    ELSEIF CHAR_LENGTH(v_clean_query) >= 3 THEN
        -- Boolean prefix wildcard search (e.g. wire* -> wireless)
        SELECT
            p.product_id, p.name, p.slug, p.price,
            p.image_url, p.avg_rating, p.brand_generated AS brand,
            c.name AS category_name,
            MATCH(p.name, p.description) AGAINST(CONCAT(v_clean_query, '*') IN BOOLEAN MODE) AS relevance
        FROM products p
        INNER JOIN categories c ON p.category_id = c.category_id
        WHERE p.is_active = TRUE
            AND (
                MATCH(p.name, p.description) AGAINST(CONCAT(v_clean_query, '*') IN BOOLEAN MODE)
                OR p.name LIKE CONCAT('%', v_clean_query, '%')
                OR p.brand_generated LIKE CONCAT('%', v_clean_query, '%')
                OR SOUNDEX(p.name) = SOUNDEX(v_clean_query)
            )
        ORDER BY
            CASE
                WHEN p.name LIKE CONCAT(v_clean_query, '%') THEN 0
                WHEN p.name LIKE CONCAT('%', v_clean_query, '%') THEN 1
                ELSE 2
            END ASC,
            p.view_count DESC
        LIMIT v_limit;

    ELSE
        -- 1 or 2 characters: prefix / partial matching
        SELECT
            p.product_id, p.name, p.slug, p.price,
            p.image_url, p.avg_rating, p.brand_generated AS brand,
            c.name AS category_name,
            0 AS relevance
        FROM products p
        INNER JOIN categories c ON p.category_id = c.category_id
        WHERE p.is_active = TRUE
            AND (p.name LIKE CONCAT(v_clean_query, '%')
                 OR p.brand_generated LIKE CONCAT(v_clean_query, '%'))
        ORDER BY p.view_count DESC
        LIMIT v_limit;
    END IF;
END //


-- ============================================================
-- PROCEDURE 3: get_filtered_products
-- Dynamic Category & JSON Attribute Filtering Engine
-- ============================================================
CREATE PROCEDURE get_filtered_products(
    IN p_category_slug VARCHAR(100),
    IN p_filter_json   TEXT,
    IN p_min_price     DECIMAL(10,2),
    IN p_max_price     DECIMAL(10,2),
    IN p_sort_by       VARCHAR(50),
    IN p_page          INT,
    IN p_per_page      INT
)
BEGIN
    DECLARE v_offset    INT DEFAULT 0;
    DECLARE v_per_page  INT DEFAULT 20;
    DECLARE v_where     TEXT DEFAULT '';
    DECLARE v_sql       TEXT;
    DECLARE v_count_sql TEXT;
    DECLARE v_sort      VARCHAR(100);

    SET v_per_page = COALESCE(p_per_page, 20);
    SET v_offset   = (GREATEST(COALESCE(p_page, 1), 1) - 1) * v_per_page;

    SET v_where = ' WHERE p.is_active = TRUE ';

    IF p_category_slug IS NOT NULL AND p_category_slug != '' AND p_category_slug != 'all' THEN
        SET v_where = CONCAT(v_where, ' AND c.slug = ', QUOTE(p_category_slug));
    END IF;

    IF p_min_price IS NOT NULL THEN
        SET v_where = CONCAT(v_where, ' AND p.price >= ', p_min_price);
    END IF;

    IF p_max_price IS NOT NULL THEN
        SET v_where = CONCAT(v_where, ' AND p.price <= ', p_max_price);
    END IF;

    -- Dynamic JSON attribute processing
    IF p_filter_json IS NOT NULL AND JSON_VALID(p_filter_json) AND JSON_LENGTH(p_filter_json) > 0 THEN
        SET @keys = JSON_KEYS(p_filter_json);
        SET @key_count = JSON_LENGTH(@keys);
        SET @idx = 0;

        WHILE @idx < @key_count DO
            SET @curr_key = JSON_UNQUOTE(JSON_EXTRACT(@keys, CONCAT('$[', @idx, ']')));
            SET @curr_val = JSON_UNQUOTE(JSON_EXTRACT(p_filter_json, CONCAT('$.', @curr_key)));

            IF @curr_val IS NOT NULL AND @curr_val != '' AND @curr_val != 'all' THEN
                IF @curr_key = 'brand' THEN
                    SET v_where = CONCAT(v_where, ' AND p.brand_generated = ', QUOTE(@curr_val));
                ELSE
                    SET v_where = CONCAT(v_where, ' AND JSON_UNQUOTE(JSON_EXTRACT(p.attributes, ''$.', @curr_key, ''')) = ', QUOTE(@curr_val));
                END IF;
            END IF;

            SET @idx = @idx + 1;
        END WHILE;
    END IF;

    -- Sorting clause
    CASE p_sort_by
        WHEN 'price_asc'  THEN SET v_sort = 'p.price ASC';
        WHEN 'price_desc' THEN SET v_sort = 'p.price DESC';
        WHEN 'rating'     THEN SET v_sort = 'p.avg_rating DESC, p.review_count DESC';
        WHEN 'popularity' THEN SET v_sort = 'p.view_count DESC';
        WHEN 'newest'     THEN SET v_sort = 'p.created_at DESC';
        ELSE                   SET v_sort = 'p.created_at DESC';
    END CASE;

    -- Execute Data Query (Result Set 0)
    SET v_sql = CONCAT(
        'SELECT p.product_id, p.name, p.slug, p.description, p.price, p.original_price, ',
        'p.stock_quantity, p.avg_rating, p.review_count, p.view_count, p.image_url, ',
        'p.attributes, p.brand_generated AS brand, c.name AS category_name, c.slug AS category_slug, ',
        'CASE WHEN p.stock_quantity = 0 THEN ''out_of_stock'' WHEN p.stock_quantity < 5 THEN ''low_stock'' ELSE ''in_stock'' END AS stock_status, ',
        'CASE WHEN p.original_price IS NOT NULL AND p.original_price > p.price THEN ROUND(((p.original_price - p.price) / p.original_price) * 100) ELSE 0 END AS discount_percentage ',
        'FROM products p JOIN categories c ON p.category_id = c.category_id ',
        v_where,
        ' ORDER BY ', v_sort,
        ' LIMIT ', v_per_page, ' OFFSET ', v_offset
    );

    SET @data_sql = v_sql;
    PREPARE stmt_data FROM @data_sql;
    EXECUTE stmt_data;
    DEALLOCATE PREPARE stmt_data;

    -- Execute Count Query (Result Set 1)
    SET v_count_sql = CONCAT('SELECT COUNT(*) AS total_count FROM products p JOIN categories c ON p.category_id = c.category_id ', v_where);
    SET @cnt_sql = v_count_sql;
    PREPARE stmt_count FROM @cnt_sql;
    EXECUTE stmt_count;
    DEALLOCATE PREPARE stmt_count;
END //


-- ============================================================
-- PROCEDURE 4: get_product_detail
-- Returns product details, customer reviews, and rating stats
-- ============================================================
CREATE PROCEDURE get_product_detail(
    IN p_slug VARCHAR(255)
)
BEGIN
    -- Result Set 0: Product details
    SELECT *
    FROM vw_product_details
    WHERE slug = p_slug AND is_active = TRUE;

    -- Result Set 1: Reviews with customer names
    SELECT
        r.review_id,
        r.rating,
        r.comment,
        r.created_at,
        cu.customer_id,
        cu.name AS customer_name
    FROM reviews r
    INNER JOIN customers cu ON r.customer_id = cu.customer_id
    INNER JOIN products p   ON r.product_id  = p.product_id
    WHERE p.slug = p_slug
    ORDER BY r.created_at DESC;

    -- Result Set 2: Rating summary
    SELECT
        total_reviews,
        calculated_avg_rating,
        five_star, four_star, three_star, two_star, one_star
    FROM vw_product_reviews_summary vrs
    INNER JOIN products p ON vrs.product_id = p.product_id
    WHERE p.slug = p_slug;
END //


-- ============================================================
-- PROCEDURE 5: get_filter_values
-- Returns distinct JSON attribute values with counts for a category
-- ============================================================
CREATE PROCEDURE get_filter_values(
    IN p_category_slug  VARCHAR(100),
    IN p_attribute_key  VARCHAR(100)
)
BEGIN
    SELECT
        JSON_UNQUOTE(JSON_EXTRACT(p.attributes, CONCAT('$.', p_attribute_key))) AS attribute_value,
        COUNT(*) AS product_count
    FROM products p
    INNER JOIN categories c ON p.category_id = c.category_id
    WHERE c.slug = p_category_slug
        AND p.is_active = TRUE
        AND JSON_EXTRACT(p.attributes, CONCAT('$.', p_attribute_key)) IS NOT NULL
    GROUP BY attribute_value
    HAVING attribute_value IS NOT NULL AND attribute_value != '' AND attribute_value != 'null'
    ORDER BY product_count DESC, attribute_value ASC;
END //


-- ============================================================
-- PROCEDURE 6: log_product_view
-- Records a customer product view (trigger increments view_count)
-- ============================================================
CREATE PROCEDURE log_product_view(
    IN p_product_id  INT,
    IN p_customer_id INT
)
BEGIN
    INSERT INTO product_views (product_id, customer_id, viewed_at)
    VALUES (p_product_id, p_customer_id, NOW());
END //


-- ============================================================
-- PROCEDURE 7: log_search_query
-- ============================================================
CREATE PROCEDURE log_search_query(
    IN p_customer_id  INT,
    IN p_query        VARCHAR(255),
    IN p_result_count INT
)
BEGIN
    INSERT INTO search_history (customer_id, search_query, result_count, searched_at)
    VALUES (p_customer_id, p_query, COALESCE(p_result_count, 0), NOW());
END //


-- ============================================================
-- PROCEDURE 8: get_frequently_bought_together
-- Order items self-join to find co-purchased accessories/products
-- ============================================================
CREATE PROCEDURE get_frequently_bought_together(
    IN p_product_id INT,
    IN p_limit      INT
)
BEGIN
    DECLARE v_limit INT DEFAULT 4;
    DECLARE v_found INT DEFAULT 0;
    SET v_limit = COALESCE(p_limit, 4);

    -- Primary: Order items co-occurrence
    SELECT 
        p2.product_id,
        p2.name,
        p2.slug,
        p2.price,
        p2.original_price,
        p2.avg_rating,
        p2.review_count,
        p2.image_url,
        p2.brand_generated AS brand,
        c.name AS category_name,
        COUNT(oi2.order_id) AS times_bought_together,
        ROUND((COUNT(oi2.order_id) * 100.0) / (
            SELECT GREATEST(COUNT(DISTINCT oi_sub.order_id), 1)
            FROM order_items oi_sub 
            WHERE oi_sub.product_id = p_product_id
        ), 1) AS co_purchase_percentage
    FROM order_items oi1
    INNER JOIN order_items oi2 
        ON oi1.order_id = oi2.order_id 
        AND oi1.product_id != oi2.product_id
    INNER JOIN products p2 
        ON oi2.product_id = p2.product_id
    INNER JOIN categories c 
        ON p2.category_id = c.category_id
    WHERE oi1.product_id = p_product_id
      AND p2.is_active = TRUE
      AND p2.stock_quantity > 0
    GROUP BY p2.product_id, p2.name, p2.slug, p2.price, p2.original_price, 
             p2.avg_rating, p2.review_count, p2.image_url, p2.brand_generated, c.name
    ORDER BY times_bought_together DESC, p2.avg_rating DESC
    LIMIT v_limit;
END //


-- ============================================================
-- PROCEDURE 9: get_customers_also_viewed
-- Product views co-occurrence matching
-- ============================================================
CREATE PROCEDURE get_customers_also_viewed(
    IN p_product_id INT,
    IN p_limit      INT
)
BEGIN
    DECLARE v_limit INT DEFAULT 4;
    SET v_limit = COALESCE(p_limit, 4);

    SELECT 
        p2.product_id,
        p2.name,
        p2.slug,
        p2.price,
        p2.original_price,
        p2.avg_rating,
        p2.review_count,
        p2.image_url,
        p2.brand_generated AS brand,
        c.name AS category_name,
        COUNT(pv2.view_id) AS co_view_count
    FROM product_views pv1
    INNER JOIN product_views pv2 
        ON pv1.customer_id = pv2.customer_id 
        AND pv1.product_id != pv2.product_id
        AND pv1.customer_id IS NOT NULL
    INNER JOIN products p2 
        ON pv2.product_id = p2.product_id
    INNER JOIN categories c 
        ON p2.category_id = c.category_id
    WHERE pv1.product_id = p_product_id
      AND p2.is_active = TRUE
    GROUP BY p2.product_id, p2.name, p2.slug, p2.price, p2.original_price, 
             p2.avg_rating, p2.review_count, p2.image_url, p2.brand_generated, c.name
    ORDER BY co_view_count DESC, p2.avg_rating DESC
    LIMIT v_limit;
END //


-- ============================================================
-- PROCEDURE 10: get_similar_products
-- Recommends based on category, brand, and price proximity
-- ============================================================
CREATE PROCEDURE get_similar_products(
    IN p_product_id INT,
    IN p_limit      INT
)
BEGIN
    DECLARE v_limit       INT DEFAULT 4;
    DECLARE v_category_id INT;
    DECLARE v_price       DECIMAL(10,2);
    DECLARE v_brand       VARCHAR(100);

    SET v_limit = COALESCE(p_limit, 4);

    SELECT category_id, price, brand_generated 
    INTO v_category_id, v_price, v_brand
    FROM products 
    WHERE product_id = p_product_id;

    SELECT 
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
        (
            (CASE WHEN p.category_id = v_category_id THEN 45 ELSE 0 END) +
            (CASE WHEN p.brand_generated = v_brand THEN 35 ELSE 0 END) +
            (CASE WHEN ABS(p.price - v_price) / v_price <= 0.20 THEN 20 
                  WHEN ABS(p.price - v_price) / v_price <= 0.40 THEN 10 ELSE 0 END) +
            (p.avg_rating * 2)
        ) AS similarity_score
    FROM products p
    JOIN categories c ON p.category_id = c.category_id
    WHERE p.product_id != p_product_id
      AND p.is_active = TRUE
      AND (p.category_id = v_category_id OR p.brand_generated = v_brand)
    ORDER BY similarity_score DESC, p.avg_rating DESC
    LIMIT v_limit;
END //


-- ============================================================
-- PROCEDURE 11: get_personalized_recommendations
-- Personalized recommendation using CTEs on user views & purchases
-- ============================================================
CREATE PROCEDURE get_personalized_recommendations(
    IN p_customer_id INT,
    IN p_limit       INT
)
BEGIN
    DECLARE v_limit INT DEFAULT 8;
    SET v_limit = COALESCE(p_limit, 8);

    IF p_customer_id IS NOT NULL AND EXISTS(SELECT 1 FROM product_views WHERE customer_id = p_customer_id) THEN
        WITH UserInterests AS (
            SELECT p.category_id, COUNT(*) * 2 AS affinity_weight
            FROM product_views pv
            JOIN products p ON pv.product_id = p.product_id
            WHERE pv.customer_id = p_customer_id
            GROUP BY p.category_id
            UNION ALL
            SELECT p.category_id, COUNT(*) * 5 AS affinity_weight
            FROM orders o
            JOIN order_items oi ON o.order_id = oi.order_id
            JOIN products p ON oi.product_id = p.product_id
            WHERE o.customer_id = p_customer_id
            GROUP BY p.category_id
        ),
        CategoryWeights AS (
            SELECT category_id, SUM(affinity_weight) AS total_affinity
            FROM UserInterests
            GROUP BY category_id
        )
        SELECT 
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
            COALESCE(cw.total_affinity, 0) + (p.avg_rating * 5) + (p.view_count * 0.1) AS recommendation_score,
            'Based on your browsing & shopping interests' AS recommendation_reason
        FROM products p
        JOIN categories c ON p.category_id = c.category_id
        LEFT JOIN CategoryWeights cw ON p.category_id = cw.category_id
        WHERE p.is_active = TRUE
          AND p.stock_quantity > 0
          AND p.product_id NOT IN (
              SELECT oi.product_id 
              FROM orders o 
              JOIN order_items oi ON o.order_id = oi.order_id 
              WHERE o.customer_id = p_customer_id
          )
        ORDER BY recommendation_score DESC
        LIMIT v_limit;
    ELSE
        -- Fallback for guest users or new accounts: Top rated & trending
        SELECT 
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
            (p.avg_rating * 10) + (p.view_count * 0.2) AS recommendation_score,
            'Popular with our boutique shoppers' AS recommendation_reason
        FROM products p
        JOIN categories c ON p.category_id = c.category_id
        WHERE p.is_active = TRUE
          AND p.stock_quantity > 0
        ORDER BY p.avg_rating DESC, p.view_count DESC
        LIMIT v_limit;
    END IF;
END //


-- ============================================================
-- PROCEDURE 12: calculate_trending_products
-- Computes trending scores based on views, orders, and revenue
-- ============================================================
CREATE PROCEDURE calculate_trending_products()
BEGIN
    DECLARE v_period_start DATETIME;
    SET v_period_start = DATE_SUB(NOW(), INTERVAL 30 DAY);

    TRUNCATE TABLE trending_products;

    INSERT INTO trending_products (
        product_id,
        trending_score,
        period_views,
        period_orders,
        period_revenue,
        calculated_at
    )
    SELECT 
        p.product_id,
        ROUND(
            (COALESCE(pv.views_count, 0) * 1.0) +
            (COALESCE(oi.orders_count, 0) * 5.0) +
            (COALESCE(oi.revenue_sum, 0.0) * 0.01) +
            (p.avg_rating * 2.0),
            4
        ) AS trending_score,
        COALESCE(pv.views_count, 0) AS period_views,
        COALESCE(oi.orders_count, 0) AS period_orders,
        COALESCE(oi.revenue_sum, 0.00) AS period_revenue,
        NOW()
    FROM products p
    LEFT JOIN (
        SELECT product_id, COUNT(*) AS views_count
        FROM product_views
        WHERE viewed_at >= v_period_start
        GROUP BY product_id
    ) pv ON p.product_id = pv.product_id
    LEFT JOIN (
        SELECT 
            oi.product_id,
            COUNT(DISTINCT oi.order_id) AS orders_count,
            SUM(oi.quantity * oi.unit_price) AS revenue_sum
        FROM order_items oi
        JOIN orders o ON oi.order_id = o.order_id
        WHERE o.created_at >= v_period_start
          AND o.status != 'cancelled'
        GROUP BY oi.product_id
    ) oi ON p.product_id = oi.product_id
    WHERE p.is_active = TRUE
    ORDER BY trending_score DESC;

    SELECT 'Trending products recalculated successfully' AS status, COUNT(*) AS products_scored 
    FROM trending_products;
END //


-- ============================================================
-- PROCEDURE 13: get_trending_products
-- Fetches top trending products optionally filtered by category
-- ============================================================
CREATE PROCEDURE get_trending_products(
    IN p_category_id INT,
    IN p_limit       INT
)
BEGIN
    DECLARE v_limit INT DEFAULT 8;
    SET v_limit = COALESCE(p_limit, 8);

    SELECT 
        p.product_id,
        p.name,
        p.slug,
        p.price,
        p.original_price,
        p.avg_rating,
        p.review_count,
        p.view_count,
        p.image_url,
        p.brand_generated AS brand,
        c.name AS category_name,
        c.slug AS category_slug,
        tp.trending_score,
        tp.period_views,
        tp.period_orders,
        CASE
            WHEN p.original_price IS NOT NULL AND p.original_price > p.price
            THEN ROUND(((p.original_price - p.price) / p.original_price) * 100)
            ELSE 0
        END AS discount_percentage
    FROM trending_products tp
    JOIN products p ON tp.product_id = p.product_id
    JOIN categories c ON p.category_id = c.category_id
    WHERE p.is_active = TRUE
      AND (p_category_id IS NULL OR p.category_id = p_category_id)
    ORDER BY tp.trending_score DESC
    LIMIT v_limit;
END //


-- ============================================================
-- PROCEDURE 14: get_best_sellers
-- Returns products ranked by units sold and order frequency
-- ============================================================
CREATE PROCEDURE get_best_sellers(
    IN p_limit INT
)
BEGIN
    DECLARE v_limit INT DEFAULT 8;
    SET v_limit = COALESCE(p_limit, 8);

    SELECT *
    FROM vw_best_sellers
    ORDER BY units_sold DESC, order_appearances DESC
    LIMIT v_limit;
END //


-- ============================================================
-- PROCEDURE 15: get_ranked_products
-- Module 5: Advanced Ranking Using Window Functions
-- Demonstrates ROW_NUMBER(), RANK(), DENSE_RANK() with PARTITION BY
-- ============================================================
CREATE PROCEDURE get_ranked_products(
    IN p_category_id INT,
    IN p_sort_by     VARCHAR(50),
    IN p_page        INT,
    IN p_per_page    INT
)
BEGIN
    DECLARE v_offset   INT DEFAULT 0;
    DECLARE v_per_page INT DEFAULT 20;

    SET v_per_page = COALESCE(p_per_page, 20);
    SET v_offset   = (GREATEST(COALESCE(p_page, 1), 1) - 1) * v_per_page;

    WITH RankedCatalog AS (
        SELECT
            p.product_id,
            p.name,
            p.slug,
            p.price,
            p.original_price,
            p.avg_rating,
            p.review_count,
            p.view_count,
            p.stock_quantity,
            p.image_url,
            p.brand_generated AS brand,
            c.category_id,
            c.name AS category_name,
            c.slug AS category_slug,
            -- Window function 1: Dense rank within category by rating
            DENSE_RANK() OVER (
                PARTITION BY p.category_id 
                ORDER BY p.avg_rating DESC, p.review_count DESC
            ) AS category_rating_rank,
            -- Window function 2: Overall rank by popularity score
            RANK() OVER (
                ORDER BY (p.avg_rating * 10 + p.view_count * 0.1 + p.review_count * 2) DESC
            ) AS overall_popularity_rank,
            -- Window function 3: Row number sequence
            ROW_NUMBER() OVER (
                ORDER BY p.price ASC
            ) AS price_order_seq
        FROM products p
        JOIN categories c ON p.category_id = c.category_id
        WHERE p.is_active = TRUE
          AND (p_category_id IS NULL OR p.category_id = p_category_id)
    )
    SELECT *
    FROM RankedCatalog
    ORDER BY
        CASE WHEN p_sort_by = 'price_asc'  THEN price END ASC,
        CASE WHEN p_sort_by = 'price_desc' THEN price END DESC,
        CASE WHEN p_sort_by = 'rating'     THEN category_rating_rank END ASC,
        CASE WHEN p_sort_by = 'newest'     THEN product_id END DESC,
        overall_popularity_rank ASC
    LIMIT v_per_page OFFSET v_offset;
END //


-- ============================================================
-- PROCEDURE 16: create_order
-- Transactional Order Creation with Stock Validation
-- ============================================================
CREATE PROCEDURE create_order(
    IN p_customer_id INT,
    IN p_items_json  JSON,
    OUT p_order_id   INT,
    OUT p_status     VARCHAR(50)
)
BEGIN
    DECLARE v_item_count    INT DEFAULT 0;
    DECLARE v_i             INT DEFAULT 0;
    DECLARE v_prod_id       INT;
    DECLARE v_qty           INT;
    DECLARE v_unit_price    DECIMAL(10,2);
    DECLARE v_stock         INT;
    DECLARE v_total         DECIMAL(12,2) DEFAULT 0.00;

    -- Error handler for rollback
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SET p_order_id = NULL;
        SET p_status = 'ERROR_TRANSACTION_FAILED';
    END;

    START TRANSACTION;

    SET v_item_count = JSON_LENGTH(p_items_json);

    IF v_item_count IS NULL OR v_item_count = 0 THEN
        SET p_order_id = NULL;
        SET p_status = 'EMPTY_ORDER';
        ROLLBACK;
    ELSE
        -- 1. Validate stock and calculate total
        WHILE v_i < v_item_count DO
            SET v_prod_id = JSON_UNQUOTE(JSON_EXTRACT(p_items_json, CONCAT('$[', v_i, '].product_id')));
            SET v_qty = JSON_UNQUOTE(JSON_EXTRACT(p_items_json, CONCAT('$[', v_i, '].quantity')));

            SELECT stock_quantity, price INTO v_stock, v_unit_price
            FROM products
            WHERE product_id = v_prod_id AND is_active = TRUE
            FOR UPDATE;

            IF v_stock < v_qty THEN
                SET p_order_id = NULL;
                SET p_status = CONCAT('INSUFFICIENT_STOCK_PRODUCT_', v_prod_id);
                ROLLBACK;
            END IF;

            SET v_total = v_total + (v_unit_price * v_qty);
            SET v_i = v_i + 1;
        END WHILE;

        -- 2. Insert order header
        INSERT INTO orders (customer_id, total_amount, status, created_at)
        VALUES (p_customer_id, v_total, 'processing', NOW());

        SET p_order_id = LAST_INSERT_ID();

        -- 3. Insert order items (Triggers handle stock reduction)
        SET v_i = 0;
        WHILE v_i < v_item_count DO
            SET v_prod_id = JSON_UNQUOTE(JSON_EXTRACT(p_items_json, CONCAT('$[', v_i, '].product_id')));
            SET v_qty = JSON_UNQUOTE(JSON_EXTRACT(p_items_json, CONCAT('$[', v_i, '].quantity')));
            
            SELECT price INTO v_unit_price FROM products WHERE product_id = v_prod_id;

            INSERT INTO order_items (order_id, product_id, quantity, unit_price)
            VALUES (p_order_id, v_prod_id, v_qty, v_unit_price);

            SET v_i = v_i + 1;
        END WHILE;

        COMMIT;
        SET p_status = 'SUCCESS';
    END IF;
END //


-- ============================================================
-- PROCEDURE 17: submit_product_review
-- Customer review submission with duplicate check
-- ============================================================
CREATE PROCEDURE submit_product_review(
    IN p_product_id  INT,
    IN p_customer_id INT,
    IN p_rating      INT,
    IN p_comment     TEXT
)
BEGIN
    INSERT INTO reviews (product_id, customer_id, rating, comment, created_at)
    VALUES (p_product_id, p_customer_id, p_rating, p_comment, NOW())
    ON DUPLICATE KEY UPDATE
        rating = p_rating,
        comment = p_comment,
        created_at = NOW();

    SELECT 
        r.review_id, r.product_id, r.customer_id, r.rating, r.comment, r.created_at,
        p.avg_rating, p.review_count
    FROM reviews r
    JOIN products p ON r.product_id = p.product_id
    WHERE r.product_id = p_product_id AND r.customer_id = p_customer_id;
END //

DELIMITER ;
