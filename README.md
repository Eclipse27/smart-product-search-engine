# 🛒 Smart Product Search & Recommendation Engine

> **A Next-Generation E-Commerce Intelligence Engine powered by Advanced MySQL 8+, Node.js/Express, and React (Vite + Tailwind CSS).**

[![MySQL 8+](https://img.shields.io/badge/MySQL-8.0%2B-00758F?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![React 18](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

---

## 📌 Architectural Philosophy

Traditional web architectures often treat relational databases as passive storage vaults ("dumb databases"), delegating search indexing, data formatting, and business logic to backend application code.

**This project flips the paradigm:**
- 🖥️ **Presentation Layer (React + Vite + Tailwind CSS):** Modern, interactive, glassmorphic UI handling state, user interactions, and micro-animations.
- 🔌 **Communication Layer (Node.js + Express):** Thin routing layer that strictly validates input and delegates query execution directly to MySQL.
- 🧠 **Core Intelligence Layer (MySQL 8+):** The brain of the application. Search ranking, dynamic JSON filtering, business metrics, and event-driven view tracking run entirely within MySQL via **FULLTEXT Indexes**, **Stored Procedures**, **JSON Functions**, **Generated Columns**, **Views**, and **Triggers**.

```
┌────────────────────────────────────────────────────────┐
│           React 18 + Vite + Tailwind CSS               │  ← Presentation Layer
│   (Search Bar, Dynamic Filters, Glassmorphic UI)       │
└───────────────────────────┬────────────────────────────┘
                            │ REST API (JSON)
┌───────────────────────────┴────────────────────────────┐
│                  Node.js + Express                     │  ← Communication Layer
│          (Thin Router & mysql2 Connection Pool)        │
└───────────────────────────┬────────────────────────────┘
                            │ SQL Queries & CALLs
┌───────────────────────────┴────────────────────────────┐
│                    MySQL 8+ Engine                     │  ← Core Intelligence Layer
│  • FULLTEXT Search (MATCH ... AGAINST + Relevance)     │
│  • JSON Attributes & Generated Columns                 │
│  • Stored Procedures (Parameterized Business Logic)     │
│  • Views & Aggregations (BI & Analytics)               │
│  • Triggers (Automated Async View Increments)          │
│  • Strict Referential Constraints & Data Integrity    │
└────────────────────────────────────────────────────────┘
```

---

## ✨ Key Features

- 🔍 **Full-Text Natural Language Search:**
  - Fast search powered by MySQL `FULLTEXT` index across product names and descriptions.
  - Relevance ranking based on MySQL's internal scoring algorithm.
  - Smart fallback to substring `LIKE` queries for short query strings (< 3 characters).

- ⚡ **Instant Autocomplete & Suggestions:**
  - Real-time debounced search bar executing `BOOLEAN MODE` queries with wildcard suffixes (`prefix*`).

- 🎛️ **Dynamic Schema-Less Attribute Filtering:**
  - Category-specific attributes stored in native `JSON` columns (e.g., RAM, Storage for Tech; Material, Fit for Clothing).
  - Dynamic filtering via MySQL `JSON_EXTRACT` and `JSON_UNQUOTE` inside parameterized Stored Procedures.
  - B-tree indexing on **Stored Generated Columns** (`brand_generated`) to preserve index speed on JSON data.

- 📊 **Database Views for Analytics & Abstraction:**
  - `vw_product_details`: Joins products with categories, review counts, average ratings, and discount calculations.
  - `vw_category_stats`: Summarizes total inventory, pricing ranges, and active product distributions.
  - `vw_product_reviews_summary`: Aggregates customer sentiment and star breakdowns per product.

- 🔄 **Real-Time Database Triggers:**
  - `AFTER INSERT` trigger on `product_views` that automatically and atomically increments product view counters in the `products` table.

- 🛍️ **E-Commerce Experience:**
  - Responsive product catalog with pagination, price range filters, brand selection, category navigation, and detailed product specification views.

---

## 🗄️ Database Architecture & Migrations

The database scripts in [`database/`](file:///database/) must be executed in order to establish schemas, constraints, routines, and sample data.

| Order | Migration File | Purpose | Advanced SQL Techniques |
|:-----:|:---------------|:--------|:------------------------|
| **00** | `00_create_database.sql` | Creates database with `utf8mb4` character set | UTF8MB4 Unicode Collation |
| **01** | `01_schema.sql` | 9 normalized tables with relational integrity | PK, FK, CHECK, UNIQUE, JSON, Generated Columns |
| **02** | `02_indexes.sql` | Performance optimization & search index | B-tree Indexes, FULLTEXT Index, Generated Column Index |
| **03** | `03_views.sql` | Reusable analytical abstractions | `INNER JOIN`, `LEFT JOIN`, `GROUP BY`, Aggregations |
| **04** | `04_stored_procedures.sql` | Encapsulated business routines | 7 Procedures (`search_products`, `get_filtered_products`, etc.) |
| **05** | `05_triggers.sql` | Event-driven automated data synchronization | `AFTER INSERT` Trigger, `NEW` keyword |
| **06** | `06_events.sql` | Event scheduler scaffolding | MySQL Scheduled Events (Phase 3 analytics) |
| **07** | `07_sample_data.sql` | Realistic seeded dataset | 50+ products, 8 categories, orders, reviews, and customer views |

---

## 🚀 Quick Start Guide

### Prerequisites
- **MySQL Server 8.0+** running locally (or remote instance)
- **Node.js 18+** & **npm**

---

### Step 1: Set Up MySQL Database

Run the SQL migration scripts in numerical sequence using your preferred MySQL CLI or MySQL Workbench:

```bash
# Navigate to database directory
cd database

# Execute scripts in order
mysql -u root -p < 00_create_database.sql
mysql -u root -p smart_product_engine < 01_schema.sql
mysql -u root -p smart_product_engine < 02_indexes.sql
mysql -u root -p smart_product_engine < 03_views.sql
mysql -u root -p smart_product_engine < 04_stored_procedures.sql
mysql -u root -p smart_product_engine < 05_triggers.sql
mysql -u root -p smart_product_engine < 06_events.sql
mysql -u root -p smart_product_engine < 07_sample_data.sql
```

---

### Step 2: Configure & Start Backend API

```bash
# Navigate to backend directory
cd ../backend

# Create your private environment file from the template
cp .env.example .env
```

Open `.env` in your editor and input your local MySQL credentials:

```env
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_mysql_password_here
MYSQL_DATABASE=smart_product_engine
PORT=5000
```

> 🔒 **Security Notice:** The `.env` file is configured in [`.gitignore`](file:///.gitignore) to protect your local database credentials from ever being committed to GitHub.

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

The backend server will launch on `http://localhost:5000`. Test the health check endpoint:
```
http://localhost:5000/api/health
```

---

### Step 3: Configure & Start Frontend

In a new terminal window:

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Start Vite dev server
npm run dev
```

Open your browser and navigate to:
```
http://localhost:5173
```

---

## 📡 API Reference

| Endpoint | Method | Description | Underlying SQL Mechanism |
|:---------|:------:|:------------|:-------------------------|
| `/api/health` | `GET` | System and DB connectivity test | `SELECT 1 AS ok` |
| `/api/categories` | `GET` | List all active categories & statistics | `SELECT * FROM vw_category_stats` |
| `/api/products` | `GET` | Paginated product list with dynamic filters | `CALL get_filtered_products(...)` |
| `/api/products/:slug` | `GET` | Detailed product specifications & reviews | `CALL get_product_detail(...)` |
| `/api/search` | `GET` | Full-text query with relevance ranking | `CALL search_products(...)` (MATCH/AGAINST) |
| `/api/search/suggestions` | `GET` | Prefix autocomplete suggestions | `CALL get_product_suggestions(...)` |
| `/api/search/filters` | `GET` | Available dynamic filter values for category | `CALL get_filter_values(...)` |

---

## 📂 Project Directory Layout

```
├── .gitignore                   # Ignores .env, node_modules, build artifacts
├── .gitattributes               # Line endings normalization
├── README.md                    # Project documentation
├── phase1summary.md             # Detailed engineering summary of Phase 1
│
├── database/                    # Core MySQL Intelligence Layer
│   ├── 00_create_database.sql   # DB initialization
│   ├── 01_schema.sql            # Table definitions & constraints
│   ├── 02_indexes.sql           # B-tree & FULLTEXT indexes
│   ├── 03_views.sql             # SQL views for reporting
│   ├── 04_stored_procedures.sql # Business logic routines
│   ├── 05_triggers.sql          # Automated event triggers
│   ├── 06_events.sql            # Scheduled events placeholder
│   ├── 07_sample_data.sql       # Seed data
│   └── README.md                # In-depth database guide
│
├── backend/                     # Node.js + Express API Layer
│   ├── .env.example             # Environment template (safe to commit)
│   ├── package.json
│   ├── server.js                # Express app entry point
│   ├── config/
│   │   └── db.js                # mysql2 connection pool
│   ├── middleware/
│   │   └── errorHandler.js      # Global error handler
│   └── routes/
│       ├── categories.js        # Category endpoints
│       ├── products.js          # Product & filter endpoints
│       └── search.js            # Search & autocomplete endpoints
│
└── frontend/                    # React 18 + Vite + Tailwind UI
    ├── package.json
    ├── vite.config.js           # Vite dev config with API proxy
    ├── tailwind.config.js       # Tailwind design tokens
    └── src/
        ├── api/                 # Axios/Fetch API client
        ├── components/          # Reusable UI, layout & search components
        └── pages/               # Home, Search, Product Detail, Category views
```

---

## 🛡️ Security & Git Best Practices

- **Zero Credentials in Git:** All database passwords and private port configurations are loaded strictly via `.env`.
- **Pre-configured `.gitignore`:** Ignores `backend/.env`, `frontend/.env`, all `*.env` files, `node_modules/`, debug logs, and build artifacts.
- **Reproducible Setup:** `.env.example` provides explicit setup documentation for team members or reviewers without exposing production/local credentials.

---

## 📜 License

This project is open-source and available under the [MIT License](LICENSE).
