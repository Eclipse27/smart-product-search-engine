-- ============================================================
-- SMART PRODUCT SEARCH & RECOMMENDATION ENGINE
-- 04_stored_procedures.sql — Stored Procedure Definitions
-- ============================================================
-- Advanced SQL Concepts Used:
--   • Stored Procedures (encapsulate complex logic in MySQL)
--   • FULLTEXT Search with MATCH() AGAINST()
--   • Natural Language Mode & Boolean Mode search
--   • JSON Functions (JSON_KEYS, JSON_EXTRACT, JSON_UNQUOTE)
--   • Prepared Statements (dynamic SQL within procedures)
--   • CASE expressions (dynamic sorting)
--   • Subqueries (count queries)
--   • Aggregate Functions (COUNT)
--   • Variables & Control Flow (IF, WHILE, DECLARE)
-- ============================================================

USE smart_product_engine;

-- ============================================================
-- PROCEDURE 1: search_products
-- Primary smart search using MySQL FULLTEXT with MATCH/AGAINST
-- Falls back to LIKE-based partial matching for short queries
-- or when FULLTEXT returns no results.
-- ============================================================
DELIMITER //
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
    DECLARE v_offset    INT DEFAULT 0;
    DECLARE v_per_page  INT DEFAULT 20;
    DECLARE v_ft_count  INT DEFAULT 0;
    DECLARE v_total     INT DEFAULT 0;

    -- Sanitize pagination parameters
    SET v_per_page = COALESCE(p_per_page, 20);
    SET v_offset   = (GREATEST(COALESCE(p_page, 1), 1) - 1) * v_per_page;

    -- --------------------------------------------------------
    -- Strategy: Try FULLTEXT search first (query >= 3 chars)
    -- If FULLTEXT yields results, use them with relevance scores.
    -- Otherwise, fall back to LIKE-based partial matching.
    -- FULLTEXT in InnoDB has a default minimum word length of 3.
    -- --------------------------------------------------------

    IF p_query IS NOT NULL AND CHAR_LENGTH(TRIM(p_query)) >= 3 THEN
        -- Check how many FULLTEXT matches exist
        SELECT COUNT(*) INTO v_ft_count
        FROM products p
        WHERE p.is_active = TRUE
            AND MATCH(p.name, p.description) AGAINST(p_query IN NATURAL LANGUAGE MODE)
            AND (p_category_id IS NULL OR p.category_id = p_category_id)
            AND (p_min_price IS NULL OR p.price >= p_min_price)
            AND (p_max_price IS NULL OR p.price <= p_max_price);
    END IF;

    IF v_ft_count > 0 THEN
        -- ====================================================
        -- FULLTEXT SEARCH PATH (Primary)
        -- Uses MATCH() AGAINST() in Natural Language Mode
        -- Returns relevance_score for ranking
        -- ====================================================
        SET v_total = v_ft_count;

        SELECT
            p.product_id, p.name, p.slug, p.description,
            p.price, p.original_price, p.stock_quantity,
            p.avg_rating, p.review_count, p.view_count,
            p.image_url, p.attributes, p.brand_generated AS brand,
            c.name AS category_name, c.slug AS category_slug,
            -- MATCH() AGAINST() returns a relevance score (higher = more relevant)
            MATCH(p.name, p.description) AGAINST(p_query IN NATURAL LANGUAGE MODE) AS relevance_score,
            CASE
                WHEN p.stock_quantity = 0 THEN 'out_of_stock'
                WHEN p.stock_quantity < 5 THEN 'low_stock'
                ELSE 'in_stock'
            END AS stock_status,
            CASE
                WHEN p.original_price IS NOT NULL AND p.original_price > p.price
                THEN ROUND(((p.original_price - p.price) / p.original_price) * 100)
                ELSE 0
            END AS discount_percentage
        FROM products p
        INNER JOIN categories c ON p.category_id = c.category_id
        WHERE p.is_active = TRUE
            AND MATCH(p.name, p.description) AGAINST(p_query IN NATURAL LANGUAGE MODE)
            AND (p_category_id IS NULL OR p.category_id = p_category_id)
            AND (p_min_price IS NULL OR p.price >= p_min_price)
            AND (p_max_price IS NULL OR p.price <= p_max_price)
        ORDER BY
            -- Dynamic sorting with CASE expressions
            CASE WHEN p_sort_by = 'price_asc'  THEN p.price END ASC,
            CASE WHEN p_sort_by = 'price_desc' THEN p.price END DESC,
            CASE WHEN p_sort_by = 'rating'     THEN p.avg_rating END DESC,
            CASE WHEN p_sort_by = 'newest'     THEN p.created_at END DESC,
            CASE WHEN p_sort_by = 'popularity' THEN p.view_count END DESC,
            -- Default: sort by relevance (FULLTEXT score)
            MATCH(p.name, p.description) AGAINST(p_query IN NATURAL LANGUAGE MODE) DESC
        LIMIT v_per_page OFFSET v_offset;

    ELSE
        -- ====================================================
        -- LIKE FALLBACK PATH
        -- Used when query is too short for FULLTEXT or
        -- FULLTEXT returned no matches.
        -- This is a partial-match fallback, NOT typo correction.
        -- ====================================================
        IF p_query IS NOT NULL AND CHAR_LENGTH(TRIM(p_query)) > 0 THEN
            SELECT COUNT(*) INTO v_total
            FROM products p
            WHERE p.is_active = TRUE
                AND (p.name LIKE CONCAT('%', p_query, '%')
                     OR p.description LIKE CONCAT('%', p_query, '%')
                     OR p.brand_generated LIKE CONCAT('%', p_query, '%'))
                AND (p_category_id IS NULL OR p.category_id = p_category_id)
                AND (p_min_price IS NULL OR p.price >= p_min_price)
                AND (p_max_price IS NULL OR p.price <= p_max_price);

            SELECT
                p.product_id, p.name, p.slug, p.description,
                p.price, p.original_price, p.stock_quantity,
                p.avg_rating, p.review_count, p.view_count,
                p.image_url, p.attributes, p.brand_generated AS brand,
                c.name AS category_name, c.slug AS category_slug,
                -- LIKE does not produce a relevance score; use name-match heuristic
                CASE
                    WHEN p.name LIKE CONCAT(p_query, '%') THEN 100
                    WHEN p.name LIKE CONCAT('%', p_query, '%') THEN 50
                    WHEN p.brand_generated LIKE CONCAT('%', p_query, '%') THEN 30
                    ELSE 1
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
                END AS discount_percentage
            FROM products p
            INNER JOIN categories c ON p.category_id = c.category_id
            WHERE p.is_active = TRUE
                AND (p.name LIKE CONCAT('%', p_query, '%')
                     OR p.description LIKE CONCAT('%', p_query, '%')
                     OR p.brand_generated LIKE CONCAT('%', p_query, '%'))
                AND (p_category_id IS NULL OR p.category_id = p_category_id)
                AND (p_min_price IS NULL OR p.price >= p_min_price)
                AND (p_max_price IS NULL OR p.price <= p_max_price)
            ORDER BY
                CASE WHEN p_sort_by = 'price_asc'  THEN p.price END ASC,
                CASE WHEN p_sort_by = 'price_desc' THEN p.price END DESC,
                CASE WHEN p_sort_by = 'rating'     THEN p.avg_rating END DESC,
                CASE WHEN p_sort_by = 'newest'     THEN p.created_at END DESC,
                CASE WHEN p_sort_by = 'popularity' THEN p.view_count END DESC,
                -- Default for LIKE: name-match priority then rating
                CASE WHEN p.name LIKE CONCAT(p_query, '%') THEN 0
                     WHEN p.name LIKE CONCAT('%', p_query, '%') THEN 1
                     ELSE 2
                END ASC,
                p.avg_rating DESC
            LIMIT v_per_page OFFSET v_offset;
        ELSE
            -- No query: return all products
            SELECT COUNT(*) INTO v_total
            FROM products p
            WHERE p.is_active = TRUE
                AND (p_category_id IS NULL OR p.category_id = p_category_id)
                AND (p_min_price IS NULL OR p.price >= p_min_price)
                AND (p_max_price IS NULL OR p.price <= p_max_price);

            SELECT
                p.product_id, p.name, p.slug, p.description,
                p.price, p.original_price, p.stock_quantity,
                p.avg_rating, p.review_count, p.view_count,
                p.image_url, p.attributes, p.brand_generated AS brand,
                c.name AS category_name, c.slug AS category_slug,
                0 AS relevance_score,
                CASE
                    WHEN p.stock_quantity = 0 THEN 'out_of_stock'
                    WHEN p.stock_quantity < 5 THEN 'low_stock'
                    ELSE 'in_stock'
                END AS stock_status,
                CASE
                    WHEN p.original_price IS NOT NULL AND p.original_price > p.price
                    THEN ROUND(((p.original_price - p.price) / p.original_price) * 100)
                    ELSE 0
                END AS discount_percentage
            FROM products p
            INNER JOIN categories c ON p.category_id = c.category_id
            WHERE p.is_active = TRUE
                AND (p_category_id IS NULL OR p.category_id = p_category_id)
                AND (p_min_price IS NULL OR p.price >= p_min_price)
                AND (p_max_price IS NULL OR p.price <= p_max_price)
            ORDER BY
                CASE WHEN p_sort_by = 'price_asc'  THEN p.price END ASC,
                CASE WHEN p_sort_by = 'price_desc' THEN p.price END DESC,
                CASE WHEN p_sort_by = 'rating'     THEN p.avg_rating END DESC,
                CASE WHEN p_sort_by = 'newest'     THEN p.created_at END DESC,
                CASE WHEN p_sort_by = 'popularity' THEN p.view_count END DESC,
                p.created_at DESC
            LIMIT v_per_page OFFSET v_offset;
        END IF;
    END IF;

    -- Second result set: total count for pagination
    SELECT v_total AS total_count;
END //
DELIMITER ;


-- ============================================================
-- PROCEDURE 2: get_product_suggestions
-- Autocomplete suggestions using FULLTEXT Boolean Mode (query*)
-- Falls back to LIKE for short queries (< 3 chars)
-- ============================================================
DELIMITER //
CREATE PROCEDURE get_product_suggestions(
    IN p_query VARCHAR(255),
    IN p_limit INT
)
BEGIN
    DECLARE v_limit INT DEFAULT 8;
    SET v_limit = COALESCE(p_limit, 8);

    IF p_query IS NULL OR CHAR_LENGTH(TRIM(p_query)) = 0 THEN
        -- Empty query: return popular products as suggestions
        SELECT
            p.product_id, p.name, p.slug, p.price,
            p.image_url, p.avg_rating,
            c.name AS category_name
        FROM products p
        INNER JOIN categories c ON p.category_id = c.category_id
        WHERE p.is_active = TRUE
        ORDER BY p.view_count DESC, p.avg_rating DESC
        LIMIT v_limit;

    ELSEIF CHAR_LENGTH(TRIM(p_query)) >= 3 THEN
        -- *** FULLTEXT Boolean Mode with wildcard ***
        -- The asterisk (*) acts as a wildcard: "wire*" matches "wireless"
        SELECT
            p.product_id, p.name, p.slug, p.price,
            p.image_url, p.avg_rating,
            c.name AS category_name,
            MATCH(p.name, p.description) AGAINST(CONCAT(p_query, '*') IN BOOLEAN MODE) AS relevance
        FROM products p
        INNER JOIN categories c ON p.category_id = c.category_id
        WHERE p.is_active = TRUE
            AND MATCH(p.name, p.description) AGAINST(CONCAT(p_query, '*') IN BOOLEAN MODE)
        ORDER BY
            -- Prioritize: name starts with query > name contains query > description match
            CASE
                WHEN p.name LIKE CONCAT(p_query, '%') THEN 0
                WHEN p.name LIKE CONCAT('% ', p_query, '%') THEN 1
                WHEN p.name LIKE CONCAT('%', p_query, '%') THEN 2
                ELSE 3
            END ASC,
            relevance DESC,
            p.view_count DESC
        LIMIT v_limit;

    ELSE
        -- Short query (1-2 chars): use LIKE partial matching
        SELECT
            p.product_id, p.name, p.slug, p.price,
            p.image_url, p.avg_rating,
            c.name AS category_name,
            0 AS relevance
        FROM products p
        INNER JOIN categories c ON p.category_id = c.category_id
        WHERE p.is_active = TRUE
            AND (p.name LIKE CONCAT('%', p_query, '%')
                 OR p.brand_generated LIKE CONCAT('%', p_query, '%'))
        ORDER BY
            CASE WHEN p.name LIKE CONCAT(p_query, '%') THEN 0 ELSE 1 END ASC,
            p.view_count DESC
        LIMIT v_limit;
    END IF;
END //
DELIMITER ;


-- ============================================================
-- PROCEDURE 3: get_filtered_products
-- Dynamic JSON-based filtering using prepared statements
-- Iterates over filter keys from JSON input and builds
-- WHERE clauses using JSON_EXTRACT / JSON_UNQUOTE
-- Uses generated column index for brand filtering
-- ============================================================
DELIMITER //
CREATE PROCEDURE get_filtered_products(
    IN p_category_slug VARCHAR(100),
    IN p_filter_json   VARCHAR(4000),
    IN p_min_price     DECIMAL(10,2),
    IN p_max_price     DECIMAL(10,2),
    IN p_sort_by       VARCHAR(50),
    IN p_page          INT,
    IN p_per_page      INT
)
BEGIN
    DECLARE v_offset       INT DEFAULT 0;
    DECLARE v_per_page     INT DEFAULT 20;
    DECLARE v_filter_count INT DEFAULT 0;
    DECLARE v_i            INT DEFAULT 0;
    DECLARE v_key          VARCHAR(100);
    DECLARE v_value        VARCHAR(255);
    DECLARE v_keys         JSON;
    DECLARE v_sort_clause  VARCHAR(200);

    SET v_per_page = COALESCE(p_per_page, 20);
    SET v_offset   = (GREATEST(COALESCE(p_page, 1), 1) - 1) * v_per_page;

    -- Build sort clause using CASE
    SET v_sort_clause = CASE p_sort_by
        WHEN 'price_asc'  THEN 'p.price ASC'
        WHEN 'price_desc' THEN 'p.price DESC'
        WHEN 'rating'     THEN 'p.avg_rating DESC, p.review_count DESC'
        WHEN 'newest'     THEN 'p.created_at DESC'
        WHEN 'popularity' THEN 'p.view_count DESC, p.avg_rating DESC'
        ELSE 'p.created_at DESC'
    END;

    -- ====================================================
    -- Build the base query dynamically
    -- ====================================================
    SET @data_query = CONCAT(
        'SELECT ',
        'p.product_id, p.name, p.slug, p.description, p.price, p.original_price, ',
        'p.stock_quantity, p.avg_rating, p.review_count, p.view_count, ',
        'p.image_url, p.attributes, p.brand_generated AS brand, ',
        'c.name AS category_name, c.slug AS category_slug, ',
        'CASE WHEN p.stock_quantity = 0 THEN ''out_of_stock'' ',
        'WHEN p.stock_quantity < 5 THEN ''low_stock'' ',
        'ELSE ''in_stock'' END AS stock_status, ',
        'CASE WHEN p.original_price IS NOT NULL AND p.original_price > p.price ',
        'THEN ROUND(((p.original_price - p.price) / p.original_price) * 100) ',
        'ELSE 0 END AS discount_percentage ',
        'FROM products p ',
        'INNER JOIN categories c ON p.category_id = c.category_id ',
        'WHERE p.is_active = TRUE'
    );

    SET @count_query = CONCAT(
        'SELECT COUNT(*) INTO @total_count ',
        'FROM products p ',
        'INNER JOIN categories c ON p.category_id = c.category_id ',
        'WHERE p.is_active = TRUE'
    );

    -- Add category filter
    IF p_category_slug IS NOT NULL AND p_category_slug != '' THEN
        SET @cat_condition = CONCAT(' AND c.slug = ', QUOTE(p_category_slug));
        SET @data_query  = CONCAT(@data_query, @cat_condition);
        SET @count_query = CONCAT(@count_query, @cat_condition);
    END IF;

    -- Add price range filters
    IF p_min_price IS NOT NULL THEN
        SET @price_min_cond = CONCAT(' AND p.price >= ', p_min_price);
        SET @data_query  = CONCAT(@data_query, @price_min_cond);
        SET @count_query = CONCAT(@count_query, @price_min_cond);
    END IF;
    IF p_max_price IS NOT NULL THEN
        SET @price_max_cond = CONCAT(' AND p.price <= ', p_max_price);
        SET @data_query  = CONCAT(@data_query, @price_max_cond);
        SET @count_query = CONCAT(@count_query, @price_max_cond);
    END IF;

    -- ====================================================
    -- Dynamic JSON attribute filtering
    -- Iterates over keys in the filter JSON object and adds
    -- WHERE conditions using JSON_EXTRACT / JSON_UNQUOTE
    -- ====================================================
    IF p_filter_json IS NOT NULL
       AND p_filter_json != '{}'
       AND p_filter_json != ''
       AND p_filter_json != 'null' THEN

        SET v_keys = JSON_KEYS(p_filter_json);
        IF v_keys IS NOT NULL THEN
            SET v_filter_count = JSON_LENGTH(v_keys);
            SET v_i = 0;

            WHILE v_i < v_filter_count DO
                -- Extract filter key and value from JSON
                SET v_key   = JSON_UNQUOTE(JSON_EXTRACT(v_keys, CONCAT('$[', v_i, ']')));
                SET v_value = JSON_UNQUOTE(JSON_EXTRACT(p_filter_json, CONCAT('$."', v_key, '"')));

                IF v_value IS NOT NULL AND v_value != 'null' AND v_value != '' THEN
                    -- *** Optimization: use generated column index for 'brand' ***
                    IF v_key = 'brand' THEN
                        SET @filter_cond = CONCAT(' AND p.brand_generated = ', QUOTE(v_value));
                    ELSE
                        -- *** JSON_EXTRACT + JSON_UNQUOTE for other attributes ***
                        SET @filter_cond = CONCAT(
                            ' AND JSON_UNQUOTE(JSON_EXTRACT(p.attributes, ''$.',
                            v_key,
                            ''')) = ',
                            QUOTE(v_value)
                        );
                    END IF;

                    SET @data_query  = CONCAT(@data_query, @filter_cond);
                    SET @count_query = CONCAT(@count_query, @filter_cond);
                END IF;

                SET v_i = v_i + 1;
            END WHILE;
        END IF;
    END IF;

    -- Add ORDER BY and pagination to data query
    SET @data_query = CONCAT(@data_query, ' ORDER BY ', v_sort_clause,
                             ' LIMIT ', v_per_page, ' OFFSET ', v_offset);

    -- Execute count query
    PREPARE count_stmt FROM @count_query;
    EXECUTE count_stmt;
    DEALLOCATE PREPARE count_stmt;

    -- Execute data query (first result set: products)
    PREPARE data_stmt FROM @data_query;
    EXECUTE data_stmt;
    DEALLOCATE PREPARE data_stmt;

    -- Second result set: total count
    SELECT @total_count AS total_count;
END //
DELIMITER ;


-- ============================================================
-- PROCEDURE 4: get_product_detail
-- Returns a single product with full details including reviews
-- ============================================================
DELIMITER //
CREATE PROCEDURE get_product_detail(
    IN p_slug VARCHAR(255)
)
BEGIN
    -- Product details via the view (uses INNER JOIN internally)
    SELECT *
    FROM vw_product_details
    WHERE slug = p_slug AND is_active = TRUE;

    -- Product reviews with customer names (INNER JOIN)
    SELECT
        r.review_id,
        r.rating,
        r.comment,
        r.created_at,
        cu.name AS customer_name
    FROM reviews r
    INNER JOIN customers cu ON r.customer_id = cu.customer_id
    INNER JOIN products p   ON r.product_id  = p.product_id
    WHERE p.slug = p_slug
    ORDER BY r.created_at DESC;

    -- Review summary (uses the aggregate view)
    SELECT
        total_reviews,
        calculated_avg_rating,
        five_star, four_star, three_star, two_star, one_star
    FROM vw_product_reviews_summary vrs
    INNER JOIN products p ON vrs.product_id = p.product_id
    WHERE p.slug = p_slug;
END //
DELIMITER ;


-- ============================================================
-- PROCEDURE 5: get_filter_values
-- Returns unique values for a specific JSON attribute within a category
-- Used to populate dynamic filter dropdowns in the UI
-- ============================================================
DELIMITER //
CREATE PROCEDURE get_filter_values(
    IN p_category_slug  VARCHAR(100),
    IN p_attribute_key  VARCHAR(100)
)
BEGIN
    -- Use JSON_UNQUOTE(JSON_EXTRACT()) to extract attribute values
    -- GROUP BY to get unique values with product counts
    SELECT
        JSON_UNQUOTE(JSON_EXTRACT(p.attributes, CONCAT('$.', p_attribute_key))) AS attribute_value,
        COUNT(*) AS product_count
    FROM products p
    INNER JOIN categories c ON p.category_id = c.category_id
    WHERE c.slug = p_category_slug
        AND p.is_active = TRUE
        AND JSON_EXTRACT(p.attributes, CONCAT('$.', p_attribute_key)) IS NOT NULL
    GROUP BY attribute_value
    HAVING attribute_value IS NOT NULL
    ORDER BY product_count DESC, attribute_value ASC;
END //
DELIMITER ;


-- ============================================================
-- PROCEDURE 6: log_product_view
-- Logs a product view and the trigger handles view_count update
-- ============================================================
DELIMITER //
CREATE PROCEDURE log_product_view(
    IN p_product_id INT,
    IN p_customer_id INT
)
BEGIN
    INSERT INTO product_views (product_id, customer_id)
    VALUES (p_product_id, p_customer_id);
END //
DELIMITER ;


-- ============================================================
-- PROCEDURE 7: log_search_query
-- Logs a search query with result count for analytics
-- ============================================================
DELIMITER //
CREATE PROCEDURE log_search_query(
    IN p_customer_id  INT,
    IN p_query        VARCHAR(255),
    IN p_result_count INT
)
BEGIN
    INSERT INTO search_history (customer_id, search_query, result_count)
    VALUES (p_customer_id, p_query, COALESCE(p_result_count, 0));
END //
DELIMITER ;


-- ============================================================
-- Verify stored procedures
-- ============================================================
SELECT ROUTINE_NAME, ROUTINE_TYPE
FROM INFORMATION_SCHEMA.ROUTINES
WHERE ROUTINE_SCHEMA = 'smart_product_engine'
ORDER BY ROUTINE_NAME;
