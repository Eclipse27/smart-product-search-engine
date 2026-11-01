-- ============================================================
-- SMART PRODUCT SEARCH & RECOMMENDATION ENGINE
-- 01_schema.sql — Table Definitions
-- ============================================================
-- Advanced SQL Concepts Used:
--   • Primary Keys, Foreign Keys, Referential Integrity
--   • NOT NULL, UNIQUE, CHECK constraints
--   • JSON datatype (products.attributes, categories.filter_attributes)
--   • Generated Columns (products.brand_generated from JSON)
--   • ENUM types (orders.status)
--   • CASCADE / RESTRICT / SET NULL referential actions
--   • Proper normalization (3NF)
-- ============================================================

USE smart_product_engine;

-- ============================================================
-- TABLE 1: categories
-- Stores product categories with dynamic filter definitions
-- ============================================================
CREATE TABLE categories (
    category_id    INT AUTO_INCREMENT PRIMARY KEY,
    name           VARCHAR(100)  NOT NULL,
    slug           VARCHAR(100)  NOT NULL,
    description    TEXT,
    image_url      VARCHAR(500),
    -- JSON column: defines which attributes can be filtered for this category
    -- Example: [{"key":"brand","label":"Brand","type":"select"}, ...]
    filter_attributes JSON,
    created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Constraints
    CONSTRAINT uq_category_name UNIQUE (name),
    CONSTRAINT uq_category_slug UNIQUE (slug)
) ENGINE=InnoDB;


-- ============================================================
-- TABLE 2: products
-- Core product table with JSON attributes and generated columns
-- ============================================================
CREATE TABLE products (
    product_id     INT AUTO_INCREMENT PRIMARY KEY,
    category_id    INT           NOT NULL,
    name           VARCHAR(255)  NOT NULL,
    slug           VARCHAR(255)  NOT NULL,
    description    TEXT,
    price          DECIMAL(10,2) NOT NULL,
    original_price DECIMAL(10,2) DEFAULT NULL,
    stock_quantity INT           NOT NULL DEFAULT 0,
    avg_rating     DECIMAL(3,2)  DEFAULT 0.00,
    review_count   INT           DEFAULT 0,
    view_count     INT           DEFAULT 0,
    image_url      VARCHAR(500),

    -- JSON column: stores category-specific attributes
    -- Example for phone: {"brand":"Samsung","ram":"8GB","storage":"256GB","battery":"5000mAh"}
    -- Example for clothing: {"brand":"Nike","size":"M","fabric":"Cotton","color":"Black"}
    attributes     JSON,

    -- Generated Column: extracts 'brand' from JSON for indexing
    -- STORED means the value is physically stored on disk (not computed on read)
    -- This enables creating a normal B-tree index on the brand value
    brand_generated VARCHAR(100) GENERATED ALWAYS AS (
        JSON_UNQUOTE(JSON_EXTRACT(attributes, '$.brand'))
    ) STORED,

    is_active      BOOLEAN       DEFAULT TRUE,
    created_at     TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    updated_at     TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    -- Foreign Key with RESTRICT: cannot delete a category that has products
    CONSTRAINT fk_product_category
        FOREIGN KEY (category_id) REFERENCES categories(category_id)
        ON DELETE RESTRICT ON UPDATE CASCADE,

    -- Unique constraint on slug for clean URLs
    CONSTRAINT uq_product_slug UNIQUE (slug),

    -- CHECK constraints (MySQL 8.0.16+)
    CONSTRAINT chk_price_positive       CHECK (price > 0),
    CONSTRAINT chk_original_price       CHECK (original_price IS NULL OR original_price > 0),
    CONSTRAINT chk_stock_non_negative   CHECK (stock_quantity >= 0),
    CONSTRAINT chk_rating_range         CHECK (avg_rating >= 0 AND avg_rating <= 5),
    CONSTRAINT chk_review_count         CHECK (review_count >= 0),
    CONSTRAINT chk_view_count           CHECK (view_count >= 0)
) ENGINE=InnoDB;


-- ============================================================
-- TABLE 3: customers
-- Stores customer information
-- ============================================================
CREATE TABLE customers (
    customer_id    INT AUTO_INCREMENT PRIMARY KEY,
    name           VARCHAR(100)  NOT NULL,
    email          VARCHAR(255)  NOT NULL,
    password_hash  VARCHAR(255)  NOT NULL,
    created_at     TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uq_customer_email UNIQUE (email)
) ENGINE=InnoDB;


-- ============================================================
-- TABLE 4: orders
-- Stores order headers
-- ============================================================
CREATE TABLE orders (
    order_id       INT AUTO_INCREMENT PRIMARY KEY,
    customer_id    INT           NOT NULL,
    total_amount   DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    status         ENUM('pending','processing','shipped','delivered','cancelled')
                                 DEFAULT 'pending',
    created_at     TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_order_customer
        FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
        ON DELETE RESTRICT ON UPDATE CASCADE,

    CONSTRAINT chk_total_non_negative CHECK (total_amount >= 0)
) ENGINE=InnoDB;


-- ============================================================
-- TABLE 5: order_items
-- Stores individual items within an order
-- ============================================================
CREATE TABLE order_items (
    order_item_id  INT AUTO_INCREMENT PRIMARY KEY,
    order_id       INT           NOT NULL,
    product_id     INT           NOT NULL,
    quantity       INT           NOT NULL DEFAULT 1,
    unit_price     DECIMAL(10,2) NOT NULL,

    -- CASCADE: deleting an order removes its items
    CONSTRAINT fk_item_order
        FOREIGN KEY (order_id) REFERENCES orders(order_id)
        ON DELETE CASCADE ON UPDATE CASCADE,

    -- RESTRICT: cannot delete a product that has been ordered
    CONSTRAINT fk_item_product
        FOREIGN KEY (product_id) REFERENCES products(product_id)
        ON DELETE RESTRICT ON UPDATE CASCADE,

    CONSTRAINT chk_quantity_positive    CHECK (quantity > 0),
    CONSTRAINT chk_unit_price_positive  CHECK (unit_price > 0)
) ENGINE=InnoDB;


-- ============================================================
-- TABLE 6: reviews
-- Stores product reviews with ratings
-- ============================================================
CREATE TABLE reviews (
    review_id      INT AUTO_INCREMENT PRIMARY KEY,
    product_id     INT           NOT NULL,
    customer_id    INT           NOT NULL,
    rating         TINYINT       NOT NULL,
    comment        TEXT,
    created_at     TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_review_product
        FOREIGN KEY (product_id) REFERENCES products(product_id)
        ON DELETE CASCADE ON UPDATE CASCADE,

    CONSTRAINT fk_review_customer
        FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
        ON DELETE CASCADE ON UPDATE CASCADE,

    -- Each customer can review a product only once
    CONSTRAINT uq_product_customer_review UNIQUE (product_id, customer_id),

    -- Rating must be between 1 and 5
    CONSTRAINT chk_rating_valid CHECK (rating >= 1 AND rating <= 5)
) ENGINE=InnoDB;


-- ============================================================
-- TABLE 7: product_views
-- Tracks which products users view (for recommendations)
-- ============================================================
CREATE TABLE product_views (
    view_id        INT AUTO_INCREMENT PRIMARY KEY,
    product_id     INT           NOT NULL,
    customer_id    INT           DEFAULT NULL,
    viewed_at      TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_view_product
        FOREIGN KEY (product_id) REFERENCES products(product_id)
        ON DELETE CASCADE ON UPDATE CASCADE,

    -- SET NULL: if customer is deleted, keep the view record
    CONSTRAINT fk_view_customer
        FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
        ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;


-- ============================================================
-- TABLE 8: search_history
-- Logs user search queries for analytics and recommendations
-- ============================================================
CREATE TABLE search_history (
    search_id      INT AUTO_INCREMENT PRIMARY KEY,
    customer_id    INT           DEFAULT NULL,
    search_query   VARCHAR(255)  NOT NULL,
    result_count   INT           DEFAULT 0,
    searched_at    TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_search_customer
        FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
        ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;


-- ============================================================
-- TABLE 9: trending_products
-- Pre-computed trending product scores (updated by scheduled events)
-- ============================================================
CREATE TABLE trending_products (
    trending_id    INT AUTO_INCREMENT PRIMARY KEY,
    product_id     INT           NOT NULL,
    trending_score DECIMAL(10,4) DEFAULT 0.0000,
    period_views   INT           DEFAULT 0,
    period_orders  INT           DEFAULT 0,
    period_revenue DECIMAL(12,2) DEFAULT 0.00,
    calculated_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_trending_product
        FOREIGN KEY (product_id) REFERENCES products(product_id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;


-- ============================================================
-- TABLE 10: cart_items
-- Persistent cart storage for authenticated customers
-- ============================================================
CREATE TABLE IF NOT EXISTS cart_items (
    cart_item_id  INT AUTO_INCREMENT PRIMARY KEY,
    customer_id   INT NOT NULL,
    product_id    INT NOT NULL,
    quantity      INT NOT NULL DEFAULT 1,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_cart_customer
        FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_cart_product
        FOREIGN KEY (product_id) REFERENCES products(product_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT uq_customer_cart_product UNIQUE (customer_id, product_id),
    CONSTRAINT chk_cart_quantity_positive CHECK (quantity > 0)
) ENGINE=InnoDB;


-- ============================================================
-- TABLE 11: wishlist
-- Wishlist saved products for authenticated customers
-- ============================================================
CREATE TABLE IF NOT EXISTS wishlist (
    wishlist_id   INT AUTO_INCREMENT PRIMARY KEY,
    customer_id   INT NOT NULL,
    product_id    INT NOT NULL,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_wishlist_customer
        FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_wishlist_product
        FOREIGN KEY (product_id) REFERENCES products(product_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT uq_customer_product_wishlist UNIQUE (customer_id, product_id)
) ENGINE=InnoDB;


-- Verify all tables created
SELECT TABLE_NAME, ENGINE, TABLE_ROWS
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_SCHEMA = 'smart_product_engine'
ORDER BY TABLE_NAME;
