# 📘 Final Project Summary: Smart Product Search & Recommendation Engine

**Project Title:** Smart Product Search & Recommendation Engine for E-Commerce Using Advanced SQL Techniques  
**Academic Course:** Advance SQL (Semester 7)  
**Institution:** SRM Institute of Science and Technology — School of Computing  
**Supervisor / Mentor:** Dr. B. Prakash  
**Project Team Members:**
- Kintali Nikhilesh — `RA2311028010002`
- S Rajat Pandey — `RA2311028010006`
- Padala Rohit — `RA2311028010183`
- G. L. Keerthana — `RA2311028010094`

---

## 📑 Table of Contents
1. [Executive Summary & Problem Statement](#1-executive-summary--problem-statement)
2. [Architectural Philosophy (Flipping the Traditional Model)](#2-architectural-philosophy-flipping-the-traditional-model)
3. [End-to-End System Architecture & Data Flow](#3-end-to-end-system-architecture--data-flow)
4. [Database Design & Relational Schema (ER Model)](#4-database-design--relational-schema-er-model)
5. [In-Depth Advanced SQL Techniques Implemented](#5-in-depth-advanced-sql-techniques-implemented)
6. [Backend Communication Layer (Express + Node.js)](#6-backend-communication-layer-express--nodejs)
7. [Frontend Presentation Layer (React + Vite + Tailwind CSS)](#7-frontend-presentation-layer-react--vite--tailwind-css)
8. [Product Catalog & Seeded Datasets](#8-product-catalog--seeded-datasets)
9. [Key Engineering Fixes & Optimizations](#9-key-engineering-fixes--optimizations)
10. [Step-by-Step Guide to Run & Verify the Project](#10-step-by-step-guide-to-run--verify-the-project)
11. [Slide-by-Slide Presentation (PPT) Blueprint](#11-slide-by-slide-presentation-ppt-blueprint)
12. [Frequently Asked Questions (Viva / Evaluation Defense)](#12-frequently-asked-questions-viva--evaluation-defense)

---

## 1. Executive Summary & Problem Statement

### 1.1 The Problem
In standard e-commerce platforms, database management systems (DBMS) are often treated as passive storage utilities ("dumb databases"). Search functionality frequently relies on naive `LIKE '%keyword%'` queries that:
1. Cannot rank results by semantic relevance or match quality.
2. Cause full table scans that degrade performance drastically as inventory scales.
3. Require cumbersome schema alterations whenever new product categories with custom attributes (e.g., RAM for laptops vs. Fabric for clothing) are introduced.
4. Push all sorting, analytical metrics, and filter evaluation into heavy backend application logic.

### 1.2 The Solution
This project implements **MySQL 8+ as the Core Intelligence Layer**. Rather than outsourcing search and analytics to external microservices or bloated backend code:
- **MySQL FULLTEXT Indexing (`MATCH() ... AGAINST()`)** handles relevance scoring and natural language ranking natively.
- **Dynamic JSON Attributes & STORED Generated Columns** permit flexible, schema-less category specifications with zero-cost B-tree indexing.
- **Parameterized Stored Procedures** execute complex filtering, dynamic query assembly via Prepared Statements, and autocomplete prefix matching.
- **Database Views and Triggers** calculate business metrics, review distributions, and asynchronous view counters with zero application-side overhead.

---

## 2. Architectural Philosophy (Flipping the Traditional Model)

```
========================================================================================
TRADITIONAL DUMB-DATABASE MODEL (INEFFICIENT)
Browser  ───>  Heavy Node.js Backend (Logic, Filtering, Sorting)  ───>  Basic MySQL (Storage Only)
========================================================================================

OUR SMART ENGINE MODEL (INTELLIGENT & SCALABLE)
┌─────────────────────────────────┐
│     PRESENTATION LAYER          │  React 18 + Vite + Tailwind CSS
│  (UI, State, Micro-Animations)  │  • Real-time Debounced Search
└────────────────┬────────────────┘  • Schema-Driven Dynamic Sidebar Filters
                 │ HTTP REST (JSON)
┌────────────────┴────────────────┐
│    COMMUNICATION LAYER          │  Node.js + Express
│   (Thin Router & Dispatcher)    │  • Validates query parameters
└────────────────┬────────────────┘  • Issues `CALL procedure(?)` and VIEW queries
                 │ mysql2 Connection Pool
┌────────────────┴────────────────┐
│    CORE INTELLIGENCE LAYER      │  MySQL 8+ Enterprise Engine
│   (Search, Math, Aggregations)  │  • MATCH() AGAINST() Relevance Ranking
└─────────────────────────────────┘  • Dynamic JSON Extraction & B-tree Indexing
                                     • Views, Triggers, Constraints & Stored Procs
```

- **Frontend = Presentation Layer:** Responsible only for rendering, user event handling, debounce timers, and state presentation.
- **Backend = Communication Layer:** Ultra-lightweight Express API. Does not loop through arrays or sort records in memory; simply dispatches requests to MySQL and formats responses.
- **MySQL = Core Intelligence Layer:** Executes query parsing, natural language weighting, JSON key extraction, aggregate reporting, and relational integrity.

---

## 3. End-to-End System Architecture & Data Flow

### 3.1 Search Workflow
```
[User Types "wireless" in SearchBar]
       │
       ▼ (250ms debounce)
[GET /api/search/suggestions?q=wire]
       │
       ▼
[Backend calls: CALL get_product_suggestions('wire', 8)]
       │
       ▼
[MySQL executes: MATCH(name, description) AGAINST('wire*' IN BOOLEAN MODE)]
       │
       ▼
[Instant suggestions dropdown renders: "Wireless Magnetic Charging Pad", etc.]
```

### 3.2 Full Search & Relevance Ranking Workflow
```
[User presses Enter or clicks Search]
       │
       ▼
[GET /api/search?q=samsung+galaxy]
       │
       ▼
[Backend calls: CALL search_products('samsung galaxy', ...)]
       │
       ├─► IF length >= 3:
       │     MySQL runs: MATCH(name, description) AGAINST('samsung galaxy' IN NATURAL LANGUAGE MODE)
       │     Computes relevance_score (e.g., 6.41, 5.45)
       │     Sorts results by relevance DESC
       │
       └─► IF length < 3 OR 0 matches:
             Falls back to partial LIKE heuristics
       │
       ▼
[Frontend renders SearchResultsPage with relevance badge (⚡ 6.41) & DB indicator]
```

---

## 4. Database Design & Relational Schema (ER Model)

The database `smart_product_engine` comprises **9 interconnected, 3NF normalized tables** with strict constraints and cascade rules:

```
    ┌──────────────┐
    │  categories  │
    └──────┬───────┘
           │ 1
           │ has
           │ N
    ┌──────┴───────┐           ┌──────────────────┐
    │   products   │───────────┤ trending_products│
    └──────┬───────┘ 1       1 └──────────────────┘
           │
           ├────────────────────────┬────────────────────────┐
           │ 1                      │ 1                      │ 1
           │ receives               │ receives               │ is included in
           │ N                      │ N                      │ N
    ┌──────┴───────┐         ┌──────┴───────┐         ┌──────┴───────┐
    │product_views │         │   reviews    │         │ order_items  │
    └──────┬───────┘         └──────┬───────┘         └──────┬───────┘
           │ N                      │ N                      │ N
           │ by                     │ by                     │ belongs to
           │ 1                      │ 1                      │ 1
    ┌──────┴────────────────────────┴───────┐         ┌──────┴───────┐
    │              customers                │─────────┤    orders    │
    └──────────────────┬────────────────────┘ 1     N └──────────────┘
                       │ 1
                       │ logs
                       │ N
               ┌───────┴────────┐
               │ search_history │
               └────────────────┘
```

### 4.1 Detailed Table Definitions

1. **`categories`**:
   - `category_id` (PK, INT AUTO_INCREMENT)
   - `name` (VARCHAR(100), UNIQUE, NOT NULL)
   - `slug` (VARCHAR(100), UNIQUE, NOT NULL)
   - `description` (TEXT)
   - `image_url` (VARCHAR(500))
   - `filter_attributes` (JSON): Schema definition for the category's filters (e.g., `[{"key":"brand","label":"Brand","type":"select"}, {"key":"ram","label":"RAM","type":"select"}]`).

2. **`products`**:
   - `product_id` (PK, INT AUTO_INCREMENT)
   - `category_id` (FK -> `categories.category_id`, ON DELETE RESTRICT ON UPDATE CASCADE)
   - `name` (VARCHAR(255), NOT NULL)
   - `slug` (VARCHAR(255), UNIQUE, NOT NULL)
   - `description` (TEXT)
   - `price` (DECIMAL(10,2), CHECK `price > 0`)
   - `original_price` (DECIMAL(10,2), CHECK `original_price > 0`)
   - `stock_quantity` (INT, CHECK `stock_quantity >= 0`)
   - `avg_rating` (DECIMAL(3,2), CHECK `avg_rating BETWEEN 0 AND 5`)
   - `review_count` (INT, CHECK `review_count >= 0`)
   - `view_count` (INT, CHECK `view_count >= 0`)
   - `image_url` (VARCHAR(500))
   - `attributes` (JSON): Dynamic attributes (e.g., `{"brand":"Apple","storage":"256GB","processor":"M3"}`)
   - `brand_generated` (VARCHAR(100) GENERATED ALWAYS AS (`JSON_UNQUOTE(JSON_EXTRACT(attributes, '$.brand'))`) STORED)
   - `is_active` (BOOLEAN, DEFAULT TRUE)

3. **`customers`**:
   - `customer_id` (PK, INT AUTO_INCREMENT)
   - `name` (VARCHAR(100), NOT NULL), `email` (VARCHAR(255), UNIQUE, NOT NULL), `password_hash` (VARCHAR(255))

4. **`orders`**:
   - `order_id` (PK, INT AUTO_INCREMENT)
   - `customer_id` (FK -> `customers.customer_id`, ON DELETE RESTRICT)
   - `total_amount` (DECIMAL(12,2), CHECK `total_amount >= 0`)
   - `status` (ENUM('pending','processing','shipped','delivered','cancelled'))

5. **`order_items`**:
   - `order_item_id` (PK, INT AUTO_INCREMENT)
   - `order_id` (FK -> `orders.order_id`, ON DELETE CASCADE)
   - `product_id` (FK -> `products.product_id`, ON DELETE RESTRICT)
   - `quantity` (INT, CHECK `quantity > 0`), `unit_price` (DECIMAL(10,2), CHECK `unit_price > 0`)

6. **`reviews`**:
   - `review_id` (PK, INT AUTO_INCREMENT)
   - `product_id` (FK -> `products.product_id`, ON DELETE CASCADE)
   - `customer_id` (FK -> `customers.customer_id`, ON DELETE CASCADE)
   - `rating` (TINYINT, CHECK `rating BETWEEN 1 AND 5`)
   - `comment` (TEXT)
   - `CONSTRAINT uq_product_customer_review UNIQUE(product_id, customer_id)` (prevents duplicate reviews)

7. **`product_views`**:
   - `view_id` (PK, INT AUTO_INCREMENT)
   - `product_id` (FK -> `products.product_id`, ON DELETE CASCADE)
   - `customer_id` (FK -> `customers.customer_id`, ON DELETE SET NULL)
   - `viewed_at` (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)

8. **`search_history`**:
   - `search_id` (PK, INT AUTO_INCREMENT), `search_query` (VARCHAR(255)), `result_count` (INT)

9. **`trending_products`**:
   - `trending_id` (PK, INT AUTO_INCREMENT), `product_id` (FK), `trending_score` (DECIMAL(10,4)), period views/orders/revenue.

---

## 5. In-Depth Advanced SQL Techniques Implemented

### 5.1 MySQL FULLTEXT Index & Relevance Search
- **Definition:** `CREATE FULLTEXT INDEX idx_ft_product_search ON products(name, description);`
- **Natural Language Scoring:**
  ```sql
  SELECT p.*, MATCH(p.name, p.description) AGAINST('samsung galaxy' IN NATURAL LANGUAGE MODE) AS relevance_score
  FROM products p
  WHERE MATCH(p.name, p.description) AGAINST('samsung galaxy' IN NATURAL LANGUAGE MODE)
  ORDER BY relevance_score DESC;
  ```
- **Why it matters:** Standard SQL cannot calculate relevance. `MATCH() ... AGAINST()` computes TF-IDF-based term weights, rewarding exact and repeated matches in product titles over descriptions.

### 5.2 Autocomplete Wildcard Search (Boolean Mode)
- **Prefix Wildcard:**
  ```sql
  SELECT name, price FROM products
  WHERE MATCH(name, description) AGAINST(CONCAT('wire', '*') IN BOOLEAN MODE)
  LIMIT 8;
  ```
- **Why it matters:** Typing `"wire"` immediately matches `"wireless"`, `"wired"`, etc., in real-time without expensive leading wildcards (`LIKE '%wire%'`).

### 5.3 Stored Generated Column on JSON Data
- **Implementation:**
  ```sql
  brand_generated VARCHAR(100) GENERATED ALWAYS AS (
      JSON_UNQUOTE(JSON_EXTRACT(attributes, '$.brand'))
  ) STORED;
  CREATE INDEX idx_products_brand ON products(brand_generated);
  ```
- **Why it matters:** Querying deeply nested JSON attributes usually forces full-table scans. By materializing `brand` as a `STORED` generated column, MySQL maintains a physical B-tree index, making brand filters run in sub-millisecond time.

### 5.4 Dynamic JSON Filtering with Stored Procedures
- **Procedure:** `get_filtered_products(category_slug, filter_json, min_price, max_price, sort_by, page, per_page)`
- **Dynamic Assembly:** Uses MySQL `PREPARE` and `EXECUTE` with JSON iteration:
  ```sql
  SET v_keys = JSON_KEYS(p_filter_json);
  WHILE v_i < v_filter_count DO
      SET v_key = JSON_UNQUOTE(JSON_EXTRACT(v_keys, CONCAT('$[', v_i, ']')));
      SET v_value = JSON_UNQUOTE(JSON_EXTRACT(p_filter_json, CONCAT('$."', v_key, '"')));
      -- Dynamically attaches: AND JSON_UNQUOTE(JSON_EXTRACT(p.attributes, '$.key')) = 'value'
  END WHILE;
  ```

### 5.5 Analytical Views
1. **`vw_product_details`:** Computes `discount_percentage` via `CASE WHEN original_price > price` and sets stock indicators (`in_stock`, `low_stock`, `out_of_stock`).
2. **`vw_category_stats`:** Uses `LEFT JOIN` and `GROUP BY` to calculate `product_count`, `avg_price`, `min_price`, `max_price`, and `avg_rating` per category.
3. **`vw_product_reviews_summary`:** Uses conditional aggregation (`SUM(CASE WHEN r.rating = 5 THEN 1 ELSE 0 END)`) to generate 1-to-5 star breakdowns for each product.

### 5.6 Automated Event Triggers
- **Implementation:**
  ```sql
  CREATE TRIGGER trg_after_product_view
  AFTER INSERT ON product_views
  FOR EACH ROW
  BEGIN
      UPDATE products
      SET view_count = view_count + 1
      WHERE product_id = NEW.product_id;
  END;
  ```
- **Why it matters:** The backend simply logs a view into `product_views`; MySQL automatically guarantees transactional atomicity and updates `products.view_count`.

---

## 6. Backend Communication Layer (Express + Node.js)

The backend code is situated in `backend/`:
- **`server.js`:** Mounts CORS, express body parsers, routes, and global error middleware.
- **`config/db.js`:** Configures an asynchronous connection pool with `multipleStatements: true` for stored procedure compatibility.
- **`routes/products.js`:**
  - `GET /api/products`: Queries `vw_product_details`.
  - `GET /api/products/category/:slug`: Executes `CALL get_filtered_products(...)`.
  - `GET /api/products/:slug`: Executes `CALL get_product_detail(...)`.
  - `POST /api/products/:id/view`: Executes `CALL log_product_view(...)` (invoking trigger).
- **`routes/categories.js`:**
  - `GET /api/categories`: Queries `vw_category_stats`.
  - `GET /api/categories/:slug/filters`: Executes `CALL get_filter_values(...)` for every attribute key.
- **`routes/search.js`:**
  - `GET /api/search?q=...`: Calls `CALL search_products(...)`.
  - `GET /api/search/suggestions?q=...`: Calls `CALL get_product_suggestions(...)`.

---

## 7. Frontend Presentation Layer (React + Vite + Tailwind CSS)

Located in `frontend/src/`:
- **Glassmorphism & Aesthetics:** Tailwind gradients, custom shadow tokens, slate/brand palette.
- **`SearchBar.jsx`:** Debounced 250ms input querying Boolean Mode suggestions with keyboard navigation and instant route transition.
- **`FilterSidebar.jsx`:** Dynamically iterates over category filters received from MySQL, supporting multiple selections and price bounds.
- **`ProductDetailPage.jsx`:** Displays specifications table directly from JSON attributes, star ratings distribution from `vw_product_reviews_summary`, and dispatches view events to trigger view counter increments.
- **`SearchResultsPage.jsx`:** Highlights whether MySQL utilized Natural Language FULLTEXT search or LIKE fallback, displaying exact relevance scores on product cards.

---

## 8. Product Catalog & Seeded Datasets

The project is populated with **115 unique, realistically configured products**:

| Category ID | Category Name | Total Products | Highlighted Brands & Specifications |
|:-----------:|:--------------|:--------------:|:------------------------------------|
| **1** | Smartphones | **15** | Samsung, Apple, Google, ASUS, Sony, Motorola, OnePlus, Xiaomi |
| **2** | Laptops | **15** | Apple M3 Max, Dell XPS, ASUS ROG, ThinkPad X1, HP Spectre, Razer |
| **3** | Headphones | **15** | Sony XM5, AirPods Pro, Bose QC Ultra, Sennheiser, Bang & Olufsen |
| **4** | Clothing | **18** | Essentials, Selvedge Denim, Wool Blazers, Tech Joggers, Linen |
| **5** | Accessories | **15** | Italian Leather Bags, Aviator Sunglasses, Swiss Watches, USB-C Hubs |
| **6** | Cameras | **14** | Sony A7 IV, Canon R6 II, Fujifilm X-T5, DJI Pocket 3, Leica Q3 |
| **7** | Tablets | **11** | iPad Pro M4, Galaxy Tab S9 Ultra, Surface Pro 10, OnePlus Pad 2 |
| **8** | Smartwatches | **12** | Apple Watch Ultra 2, Galaxy Watch 6, Garmin Fenix 7, Withings |
| **Total** | **8 Categories** | **115 Products** | **77 Reviews · 246 Views · 35 Orders** |

---

## 9. Key Engineering Fixes & Optimizations

During our verification, we resolved a subtle database-to-API contract bug:
1. **The Issue:** `CALL get_filtered_products` prepares an internal count using `SELECT COUNT(*) INTO @total_count` and executes the query statement. MySQL returns the main dataset at `results[0]` and `@total_count` at `results[1]`.
2. **The Bug:** `backend/routes/products.js` was previously mapping `results[1]` to `products` and looking for `results[2]` for `totalCount`. This caused the category pages to treat total count as 0 and display empty product states.
3. **The Resolution:** Fixed the result indexing in `routes/products.js`, added attribute JSON parsing, and created an automated verification suite [`backend/test_engine.js`](file:///d:/COLLEGE/SEMESTER%207/Advance%20SQL/ADV%20PROJECT/backend/test_engine.js) that validates all views, procedures, and triggers.

---

## 10. Step-by-Step Guide to Run & Verify the Project

### Prerequisites
- MySQL 8.0+ running on port 3306.
- Node.js 18+ and npm.

### Step 1: Database Setup
```bash
cd database
mysql -u root -p < 00_create_database.sql
mysql -u root -p smart_product_engine < 01_schema.sql
mysql -u root -p smart_product_engine < 02_indexes.sql
mysql -u root -p smart_product_engine < 03_views.sql
mysql -u root -p smart_product_engine < 04_stored_procedures.sql
mysql -u root -p smart_product_engine < 05_triggers.sql
mysql -u root -p smart_product_engine < 06_events.sql
mysql -u root -p smart_product_engine < 07_sample_data.sql
mysql -u root -p smart_product_engine < 08_additional_products.sql
```

### Step 2: Start Backend
```bash
cd ../backend
# Ensure .env contains:
# MYSQL_HOST=localhost
# MYSQL_PORT=3306
# MYSQL_USER=root
# MYSQL_PASSWORD=your_password
# MYSQL_DATABASE=smart_product_engine
# PORT=5000

npm install
npm run dev
```
*Backend runs on `http://localhost:5000`*

### Step 3: Run Verification Suite
```bash
node test_engine.js
```
*(Executes automated integration tests verifying database connectivity, views, stored procedures, FULLTEXT search, and triggers)*

### Step 4: Start Frontend
```bash
cd ../frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:5173`*

---

## 11. Slide-by-Slide Presentation (PPT) Blueprint

Use this section to construct your project presentation slides:

- **Slide 1: Title & Team**
  - **Heading:** Smart Product Search & Recommendation Engine Using Advanced SQL
  - **Subtext:** Academic Course: Advance SQL | SRM Institute of Science & Technology
  - **Members:** Kintali Nikhilesh, S Rajat Pandey, Padala Rohit, G. L. Keerthana
  - **Supervisor:** Dr. B. Prakash

- **Slide 2: Motivation & Problem Statement**
  - Traditional search uses `LIKE '%query%'` (inefficient, zero relevance ranking).
  - Traditional relational models struggle with diverse product attributes (forcing rigid schemas or empty columns).
  - Web apps overload backend code with business logic, treating databases as dumb storage.

- **Slide 3: Project Objectives**
  - Flip the architecture: Make MySQL 8+ the Core Intelligence Layer.
  - Implement full-text relevance search (`MATCH ... AGAINST`).
  - Implement dynamic category specifications using native JSON attributes.
  - Build stored procedures for dynamic query generation and autocomplete.

- **Slide 4: Three-Tier System Architecture**
  - *Diagram:* React Presentation Layer ↔ Express Communication Layer ↔ MySQL Intelligence Layer.
  - Explanation of how business logic is delegated strictly to the database.

- **Slide 5: Database Design & Schema**
  - 9 normalized tables (3NF): `categories`, `products`, `customers`, `orders`, `order_items`, `reviews`, `product_views`, `search_history`, `trending_products`.
  - Referential integrity (`RESTRICT`, `CASCADE`, `SET NULL`).

- **Slide 6: Core SQL Technique 1 — FULLTEXT Search & Ranking**
  - `FULLTEXT INDEX` on `products(name, description)`.
  - Natural Language Mode ranking with calculated `relevance_score`.
  - Graceful fallback to `LIKE` for queries < 3 characters.

- **Slide 7: Core SQL Technique 2 — Dynamic Schema-Less JSON**
  - Storing category-specific attributes in native MySQL `JSON` column.
  - Dynamic filtering via `JSON_EXTRACT()` and `JSON_UNQUOTE()`.
  - Indexing acceleration: `STORED` generated column `brand_generated` indexed via standard B-tree.

- **Slide 8: Core SQL Technique 3 — Stored Procedures & Dynamic SQL**
  - Overview of 7 Stored Procedures (`search_products`, `get_filtered_products`, `get_product_suggestions`, etc.).
  - Use of `PREPARE`, `EXECUTE`, and `DEALLOCATE` statements inside stored procedures.

- **Slide 9: Core SQL Technique 4 — Views & Triggers**
  - Analytical Views: `vw_product_details`, `vw_category_stats`, `vw_product_reviews_summary`.
  - Event-Driven Trigger: `trg_after_product_view` automatically updates `view_count`.

- **Slide 10: Working Prototype & Catalog Overview**
  - Live screenshots of Search, Autocomplete, Dynamic Category Filters, and Product Detail specs.
  - 115 products, 77 reviews, 246 product views loaded and functioning.

- **Slide 11: Summary & Future Roadmap**
  - Phase 1 Accomplishments: Smart Search, Dynamic JSON Filters, Stored Procedures, Views, Triggers.
  - Phase 2/3 Roadmap: Recommendations Engine (Frequently Bought Together via Self-Joins), Window Functions (`RANK()`, `DENSE_RANK()`), and Scheduled Events.

- **Slide 12: Q&A / Conclusion**
  - Thank you note, repository link, and supervisor acknowledgment.

---

## 12. Frequently Asked Questions (Viva / Evaluation Defense)

**Q1: Why use MySQL FULLTEXT instead of ElasticSearch or backend JavaScript filtering?**  
*Answer:* In medium-to-large e-commerce stores, maintaining a separate Elasticsearch cluster introduces synchronization overhead, data duplication, and operational cost. MySQL 8+ FULLTEXT search leverages InnoDB inverted indexes directly inside the primary database with sub-second response times, transactional consistency, and native relevance scoring.

**Q2: What is the benefit of a `STORED` generated column over a `VIRTUAL` generated column?**  
*Answer:* A `VIRTUAL` column is computed on-the-fly during read operations and cannot be efficiently indexed for rapid B-tree lookups in MySQL without secondary index constraints. A `STORED` column physically writes the extracted JSON attribute (`brand`) to disk, allowing a standard B-tree index to provide fast lookup performance during filtering.

**Q3: How does autocomplete handle partial queries without lagging?**  
*Answer:* Autocomplete uses MySQL FULLTEXT Boolean Mode with prefix operators (e.g., `MATCH(...) AGAINST('sams*' IN BOOLEAN MODE)`). The frontend also implements a 250ms debounce timer so database queries are only triggered after the user pauses typing.

**Q4: How does the dynamic JSON filtering work when each category has different specifications?**  
*Answer:* The `categories` table stores a JSON array (`filter_attributes`) that dictates which filter controls appear on the frontend. When selected, the frontend sends a key-value JSON string to `get_filtered_products()`. Inside MySQL, the stored procedure dynamically loops through the keys using `JSON_KEYS()` and builds parameterized conditions using `JSON_EXTRACT()`.
