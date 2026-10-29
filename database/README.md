# Database — Smart Product Search & Recommendation Engine

## Overview

This directory contains all MySQL database files for the Smart Product Search & Recommendation Engine. The database serves as the **Core Intelligence Layer** of the application, handling search, filtering, ranking, recommendations, and analytics using Advanced SQL features.

## File Execution Order

Execute these files in order using the MySQL CLI or Workbench:

```bash
mysql -u <user> -p < 00_create_database.sql
mysql -u <user> -p smart_product_engine < 01_schema.sql
mysql -u <user> -p smart_product_engine < 02_indexes.sql
mysql -u <user> -p smart_product_engine < 03_views.sql
mysql -u <user> -p smart_product_engine < 04_stored_procedures.sql
mysql -u <user> -p smart_product_engine < 05_triggers.sql
mysql -u <user> -p smart_product_engine < 06_events.sql
mysql -u <user> -p smart_product_engine < 07_sample_data.sql
```

## File Descriptions

| File | Purpose | Advanced SQL Concepts |
|------|---------|----------------------|
| `00_create_database.sql` | Creates the database with UTF8MB4 | Database creation |
| `01_schema.sql` | 9 tables with constraints | PK, FK, UNIQUE, CHECK, JSON datatype, Generated Columns, ENUM |
| `02_indexes.sql` | All index definitions | B-tree indexes, FULLTEXT index, Index on generated column |
| `03_views.sql` | Reusable views | Views, INNER JOIN, LEFT JOIN, CASE, Aggregate functions, GROUP BY |
| `04_stored_procedures.sql` | 7 stored procedures | Stored Procedures, MATCH/AGAINST, JSON functions, Prepared statements |
| `05_triggers.sql` | Auto-update triggers | AFTER INSERT trigger, NEW keyword |
| `06_events.sql` | Placeholder for Phase 3 | (Scheduled Events to be added) |
| `07_sample_data.sql` | Realistic demo data | INSERT statements for all tables |

## Advanced SQL Concepts Implemented

### Phase 1 (Current)
- Complex SELECT queries
- INNER JOIN, LEFT JOIN
- Subqueries
- Aggregate Functions (COUNT, AVG, MIN, MAX, SUM)
- GROUP BY, HAVING
- Views
- Normal B-tree Indexes
- FULLTEXT Index
- MATCH() AGAINST() (Natural Language & Boolean modes)
- JSON Datatype
- JSON Functions (JSON_EXTRACT, JSON_UNQUOTE, JSON_KEYS, JSON_LENGTH)
- Generated Columns (STORED)
- Stored Procedures (7 procedures)
- Triggers (AFTER INSERT)
- CASE Expressions
- Constraints (PK, FK, UNIQUE, NOT NULL, CHECK)
- Referential Integrity (CASCADE, RESTRICT, SET NULL)

### Phase 2 (Planned)
- Window Functions (ROW_NUMBER, RANK, DENSE_RANK)
- Self JOIN
- Advanced subqueries
- Additional stored procedures

### Phase 3 (Planned)
- Transactions
- MySQL Scheduled Events
- Additional triggers
- Complex analytical queries

## Database Schema

```
categories ──< products ──< reviews
                  │  │
                  │  └──< product_views
                  │
                  └──< order_items >── orders >── customers
                                                      │
                                        search_history ┘
                                        product_views  ┘
                                        reviews        ┘

trending_products >── products
```

## Testing Queries

```sql
-- Test FULLTEXT search
CALL search_products('wireless headphones', NULL, NULL, NULL, NULL, 1, 10);

-- Test autocomplete
CALL get_product_suggestions('sam', 5);

-- Test JSON filtering
CALL get_filtered_products('smartphones', '{"brand":"Samsung","ram":"8GB"}', NULL, NULL, NULL, 1, 10);

-- Test product detail
CALL get_product_detail('samsung-galaxy-s24-ultra');

-- Test filter values
CALL get_filter_values('smartphones', 'brand');

-- Test views
SELECT * FROM vw_product_details WHERE is_active = TRUE LIMIT 5;
SELECT * FROM vw_category_stats;
```
