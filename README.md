# Smart Product Search & Recommendation Engine for E-Commerce Using Advanced SQL Techniques

[![MySQL](https://img.shields.io/badge/MySQL-8.0+-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![React](https://img.shields.io/badge/React-18.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-4.18-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)

---

## 📖 Executive Summary

The **Smart Product Search & Recommendation Engine** is an end-to-end, production-grade e-commerce application where **MySQL serves as the core intelligence layer**. Rather than delegating computational search, recommendation, and analytical scoring logic to heavy application-level JavaScript or external black-box AI APIs, this architecture leverages the full power of **Advanced MySQL 8.0+ Techniques**:

- **FULLTEXT Search**: `MATCH() AGAINST()` in both Natural Language and Boolean modes with custom relevancy scoring.
- **Typo Tolerance & Edit Distance**: MySQL custom stored functions (`fn_levenshtein`, `fn_similarity_score`) and phonetic `SOUNDEX()` matching.
- **Dynamic JSON Attributes**: Extraction, indexing, and multi-faceted filtering on `JSON` columns (`JSON_EXTRACT`, `JSON_UNQUOTE`, `JSON_CONTAINS`).
- **Collaborative Recommendation Engine**: Self-joins, CTEs, and co-occurrence frequency matrices for *Frequently Bought Together*, *Customers Also Viewed*, and *Personalized Recommendations*.
- **Real-Time Trending Engine**: Time-decayed algorithmic scoring integrating views, order volume, and revenue via automated MySQL Scheduled Events (`EVENT`).
- **Advanced Product Ranking**: Window functions (`ROW_NUMBER()`, `RANK()`, `DENSE_RANK()`) with `PARTITION BY category_id`.
- **Atomic Triggers & Transactions**: ACID checkout transactions (`START TRANSACTION ... COMMIT`), atomic inventory decrements (`trg_after_order_item_insert`), and dynamic review aggregation triggers (`trg_after_review_insert/update/delete`).

The frontend is styled in a **Peachy Cream / Warm Beige / Soft Peach / Ivory** aesthetic (`#FFF8F0`, `#FCE9DE`, `#FAD8C8`, `#EAD5C5`, `#C77B61`, `#765344`, `#49352D`) paired with *Playfair Display*, *Dancing Script*, and *Outfit* typography.

---

## 🏛️ System Architecture

```mermaid
flowchart TD
    Client["Client Browser (React 18 + Vite + Tailwind CSS)"]
    API["Express.js REST API Server (Node.js)"]
    DB[("MySQL 8.0+ Intelligence Engine (smart_product_engine)")]

    Client -->|"HTTP / REST API (JWT Authenticated)"| API
    API -->|"Calls Stored Procedures & Views"| DB

    subgraph MySQL Intelligence Layer
        SP["17 Stored Procedures\n(search_products, get_filtered_products, get_ranked_products, create_order, etc.)"]
        FN["Custom Stored Functions\n(fn_levenshtein, fn_similarity_score)"]
        TRG["5 Database Triggers\n(Stock decrement, Rating recalculation, View logging)"]
        VW["6 Analytical Views\n(vw_product_details, vw_trending_dashboard, etc.)"]
        EVT["Scheduled Events\n(evt_refresh_trending_products)"]
    end

    DB --- SP
    DB --- FN
    DB --- TRG
    DB --- VW
    DB --- EVT
```

---

## 🗄️ Database Schema & Entities

The database contains **11 interconnected tables** in the `smart_product_engine` schema:

1. `categories` — Category catalog with dynamic `filter_attributes` (JSON).
2. `products` — Products with `price`, `stock_quantity`, `avg_rating`, `view_count`, `attributes` (JSON), and `brand_generated` (STORED generated column).
3. `customers` — Customer accounts with unique emails and bcrypt password hashes.
4. `orders` — Checkout orders with `total_amount` and `status`.
5. `order_items` — Line items linking orders and products with `unit_price` and `quantity`.
6. `reviews` — Customer product reviews with 1–5 star ratings and comments.
7. `product_views` — Customer browsing view history.
8. `search_history` — Search queries and result count logs.
9. `trending_products` — Calculated trending metrics (`trending_score`, `period_views`, `period_orders`, `period_revenue`).
10. `cart_items` — Persistent authenticated shopping cart storage.
11. `wishlist` — Saved favorites linked to customers.

---

## 🚀 Module-by-Module Implementation

### Module 1: Smart Product Search
- **Stored Procedure**: `search_products(p_query, p_category_slug, p_min_price, p_max_price, p_sort_by, p_page, p_per_page)`
- **Typo Tolerance**: Normalizer dictionary + phonetic Soundex + Levenshtein distance `fn_levenshtein(s1, s2)`.
- **Supported Typo Queries (100% Passing)**:
  - `"blu tooth headfones"` $\rightarrow$ Bose QuietComfort Ultra & Sony WH-1000XM5
  - `"samsng moble"` $\rightarrow$ Samsung Galaxy Z Fold 5
  - `"iphne 16"` $\rightarrow$ Apple iPhone 15 Pro Max
  - `"lapotp"` $\rightarrow$ Microsoft Surface Laptop 6
  - `"wireles earbuds"` $\rightarrow$ Sennheiser Momentum 4 Wireless
  - `"nik shooes"` $\rightarrow$ Nike Air Zoom Pegasus 40 Running Shoes
  - `"smart watche"` $\rightarrow$ Fitbit Sense 2 & Garmin Fenix 7 Pro

### Module 2: Dynamic Category JSON Filtering
- **Stored Procedure**: `get_filtered_products(p_category_slug, p_filters_json, ...)`
- **Implementation**: Uses `JSON_EXTRACT()` and `JSON_CONTAINS()` to dynamically filter by technical specs without requiring table schema alterations.

### Module 3: Recommendation Engine
- **Frequently Bought Together**: `get_frequently_bought_together(p_product_id, p_limit)` analyzes basket co-occurrence across `order_items`.
- **Customers Also Viewed**: `get_customers_also_viewed(p_product_id, p_limit)` traverses co-viewing patterns in `product_views`.
- **Personalized Recommendations**: `get_personalized_recommendations(p_customer_id, p_limit)` uses category affinity from view and purchase history.

### Module 4: Trending Products Engine
- **Stored Procedure**: `calculate_trending_products(p_days, p_view_weight, p_order_weight, p_revenue_weight)`
- **Formula**:
  $$\text{Score} = (V \times 0.2) + (O \times 0.5) + (R \times 0.3)$$
- **Scheduled Event**: `evt_refresh_trending_products` runs every 30 minutes.

### Module 5: Advanced Ranking & Optimization
- **Stored Procedure**: `get_ranked_products(p_metric, p_category_id)`
- **Implementation**: Executes `ROW_NUMBER() OVER(PARTITION BY category_id ORDER BY ...)`, `RANK()`, and `DENSE_RANK()`.
- **Frontend Dashboard**: Live interactive explorer at `/ranking` with SQL syntax inspector.

### Module 6: Full Application Integration
- **Authentication**: JWT token-based auth with bcrypt password hashing.
- **Cart & Wishlist**: Dual-mode (localStorage for guests + MySQL sync for authenticated users).
- **Checkout**: Stored procedure `create_order` executed inside an ACID transaction with atomic stock decrement triggers.
- **Reviews**: Atomic trigger `trg_after_review_insert` recalculates `products.avg_rating` and `review_count`.

---

## 💻 Quick Start & Installation

### 1. Prerequisites
- **Node.js** v18+
- **MySQL Server** 8.0+

### 2. Database Setup
Ensure MySQL is running on port 3306. Execute the database scripts in order:
```bash
mysql -u root -p < database/00_create_database.sql
mysql -u root -p smart_product_engine < database/01_schema.sql
mysql -u root -p smart_product_engine < database/02_indexes.sql
mysql -u root -p smart_product_engine < database/03_views.sql
mysql -u root -p smart_product_engine < database/04b_functions.sql
mysql -u root -p smart_product_engine < database/04_stored_procedures.sql
mysql -u root -p smart_product_engine < database/05_triggers.sql
mysql -u root -p smart_product_engine < database/06_events.sql
mysql -u root -p smart_product_engine < database/07_sample_data.sql
```

### 3. Backend Setup
```bash
cd backend
npm install
# Verify or create backend/.env with your MySQL credentials:
# PORT=5000
# DB_HOST=localhost
# DB_PORT=3306
# DB_USER=root
# DB_PASSWORD=your_password
# DB_NAME=smart_product_engine
# JWT_SECRET=your_secret_key

# Verify backend test suite
node test_all_endpoints.js
node test_typos.js

# Start backend server
npm start
```

### 4. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🔑 Demo & Grading Credentials

For quick evaluation and grading reviews, use the 1-click login buttons or the following credentials:

| Email | Password | Role / Details |
|---|---|---|
| `sophia.m@boutique.com` | `password123` | VIP Customer (Has orders, reviews, views) |
| `john.smith@email.com` | `password123` | Active Customer |
| `emma.w@example.com` | `password123` | Standard Customer |

---

## 🧪 Verification & Test Results

Run the verification suites directly:

```bash
# 1. Full Backend API & SQL Verification
node backend/test_all_endpoints.js

# 2. Typo Tolerance Relevancy Suite (7/7 Passing)
node backend/test_typos.js

# 3. Frontend Production Build
npm run build --prefix frontend
```
All suites execute with 0 errors.
