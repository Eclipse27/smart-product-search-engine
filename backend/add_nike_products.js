require('dotenv').config();
const pool = require('./config/db');

async function addNikeProducts() {
  console.log('Adding Nike shoes products to catalog...');
  const nikeProducts = [
    [
      4,
      'Nike Air Zoom Pegasus 40 Running Shoes',
      'nike-air-zoom-pegasus-40',
      'A springy ride for every run, the Nike Pegasus 40 features responsive Zoom Air cushioning and engineered mesh upper for breathable comfort. Durable rubber waffle outsole provides superior road traction.',
      139.99,
      159.99,
      60,
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop',
      JSON.stringify({
        brand: 'Nike',
        size: '10',
        fabric: 'Mesh & Synthetic',
        color: 'Black/White',
        gender: 'Men',
        type: 'Running Shoes'
      })
    ],
    [
      4,
      'Nike Air Force 1 07 Classic Sneakers',
      'nike-air-force-1-07',
      'The radiance lives on in the Nike Air Force 1 07, the b-ball icon that puts a fresh spin on what you know best: stitched overlays, bold colors and the perfect amount of flash. Encapsulated Air-Sole cushioning for lightweight comfort.',
      115.00,
      130.00,
      85,
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500&h=500&fit=crop',
      JSON.stringify({
        brand: 'Nike',
        size: '9.5',
        fabric: 'Genuine Leather',
        color: 'Triple White',
        gender: 'Unisex',
        type: 'Sneakers'
      })
    ],
    [
      4,
      'Nike InfinityRN 4 Road Running Shoes',
      'nike-infinityrn-4',
      'Maximum cushioning for an effortless stride. Crafted with all-new ReactX foam for 13% more energy return compared to React foam, helping you stay fresh. Water-resistant liner helps keep your toes dry when conditions turn.',
      160.00,
      180.00,
      45,
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500&h=500&fit=crop',
      JSON.stringify({
        brand: 'Nike',
        size: '11',
        fabric: 'Flyknit',
        color: 'Racer Blue',
        gender: 'Men',
        type: 'Running Shoes'
      })
    ]
  ];

  for (const p of nikeProducts) {
    await pool.query(
      `INSERT INTO products (category_id, name, slug, description, price, original_price, stock_quantity, image_url, attributes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE name = VALUES(name), description = VALUES(description), price = VALUES(price), attributes = VALUES(attributes)`,
      p
    );
  }

  const [[{ count }]] = await pool.query('SELECT COUNT(*) as count FROM products');
  console.log(`✅ Products catalog now has: ${count} products (including Nike shoes)`);
  process.exit(0);
}

addNikeProducts().catch(err => {
  console.error(err);
  process.exit(1);
});

