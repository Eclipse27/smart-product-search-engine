const bcrypt = require('bcryptjs');
require('dotenv').config();
const pool = require('./config/db');

async function seed() {
  console.log('Seeding extra customers, wishlist table, and interactions...');

  // 1. Create wishlist table if not exists
  await pool.query(`
    CREATE TABLE IF NOT EXISTS wishlist (
        wishlist_id INT AUTO_INCREMENT PRIMARY KEY,
        customer_id INT NOT NULL,
        product_id  INT NOT NULL,
        created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_wishlist_customer FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT fk_wishlist_product FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT uq_customer_product_wishlist UNIQUE (customer_id, product_id)
    ) ENGINE=InnoDB;
  `);
  console.log('✅ Wishlist table ready');

  // 2. Hash password 'password123'
  const passwordHash = bcrypt.hashSync('password123', 10);

  // Update existing 10 customers so they can also log in with 'password123'
  await pool.query('UPDATE customers SET password_hash = ?', [passwordHash]);

  // Insert 15 additional customers
  const extraCustomers = [
    ['Sophia Martinez', 'sophia.m@boutique.com'],
    ['Liam Johnson', 'liam.j@boutique.com'],
    ['Olivia Brown', 'olivia.b@boutique.com'],
    ['Noah Davis', 'noah.d@boutique.com'],
    ['Emma Wilson', 'emma.w@boutique.com'],
    ['Lucas Garcia', 'lucas.g@boutique.com'],
    ['Mia Rodriguez', 'mia.r@boutique.com'],
    ['Ethan Clark', 'ethan.c@boutique.com'],
    ['Ava Lewis', 'ava.l@boutique.com'],
    ['Oliver Walker', 'oliver.w@boutique.com'],
    ['Charlotte Hall', 'charlotte.h@boutique.com'],
    ['Elijah Allen', 'elijah.a@boutique.com'],
    ['Amelia Young', 'amelia.y@boutique.com'],
    ['Benjamin King', 'benjamin.k@boutique.com'],
    ['Harper Scott', 'harper.s@boutique.com']
  ];

  for (const [name, email] of extraCustomers) {
    await pool.query(
      'INSERT INTO customers (name, email, password_hash) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE name = VALUES(name)',
      [name, email, passwordHash]
    );
  }
  const [[{ customerCount }]] = await pool.query('SELECT COUNT(*) as customerCount FROM customers');
  console.log(`✅ Total customers: ${customerCount}`);

  // 3. Add realistic product views
  const [[{ prodCount }]] = await pool.query('SELECT COUNT(*) as prodCount FROM products');
  console.log(`Current products in catalog: ${prodCount}`);

  // Add 100 extra product views distributed across customers
  for (let cId = 1; cId <= customerCount; cId++) {
    // each customer views 5-8 random products
    const viewedIds = [
      Math.floor(Math.random() * prodCount) + 1,
      Math.floor(Math.random() * prodCount) + 1,
      Math.floor(Math.random() * prodCount) + 1,
      Math.floor(Math.random() * prodCount) + 1
    ];
    for (const pId of viewedIds) {
      await pool.query('INSERT INTO product_views (product_id, customer_id, viewed_at) VALUES (?, ?, NOW() - INTERVAL FLOOR(RAND()*20) DAY)', [pId, cId]);
    }
  }

  // 4. Populate Wishlist items for customers
  for (let cId = 1; cId <= 8; cId++) {
    const p1 = (cId * 3) % prodCount + 1;
    const p2 = (cId * 7) % prodCount + 1;
    await pool.query('INSERT IGNORE INTO wishlist (customer_id, product_id) VALUES (?, ?), (?, ?)', [cId, p1, cId, p2]);
  }
  const [[{ wishlistCount }]] = await pool.query('SELECT COUNT(*) as wishlistCount FROM wishlist');
  console.log(`✅ Wishlist items: ${wishlistCount}`);

  // 5. Recalculate trending products
  await pool.query('CALL calculate_trending_products()');
  const [[{ trendingCount }]] = await pool.query('SELECT COUNT(*) as trendingCount FROM trending_products');
  console.log(`✅ Trending products scored: ${trendingCount}`);

  console.log('✅ Seeding completed successfully!');
  process.exit(0);
}

seed().catch(err => {
  console.error('Seeding error:', err);
  process.exit(1);
});

