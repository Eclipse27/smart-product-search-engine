-- ============================================================
-- SMART PRODUCT SEARCH & RECOMMENDATION ENGINE
-- 07_sample_data.sql — Realistic Sample Data
-- ============================================================
-- Contains:
--   • 8 Categories with filter attribute definitions
--   • 55+ Products with JSON attributes
--   • 10 Customers
--   • 35 Orders with 75+ Order Items
--   • 60+ Reviews
--   • 120+ Product Views
--   • 25 Search History entries
-- ============================================================

USE smart_product_engine;

-- ============================================================
-- CATEGORIES (8 categories with filter_attributes JSON)
-- ============================================================
INSERT INTO categories (name, slug, description, image_url, filter_attributes) VALUES
('Smartphones', 'smartphones', 'Latest smartphones with cutting-edge technology and powerful cameras', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=400&fit=crop', '[{"key":"brand","label":"Brand","type":"select"},{"key":"ram","label":"RAM","type":"select"},{"key":"storage","label":"Storage","type":"select"},{"key":"battery","label":"Battery","type":"select"},{"key":"display_size","label":"Display Size","type":"select"}]'),
('Laptops', 'laptops', 'High-performance laptops for work, gaming, and creative professionals', 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=400&fit=crop', '[{"key":"brand","label":"Brand","type":"select"},{"key":"ram","label":"RAM","type":"select"},{"key":"storage","label":"Storage","type":"select"},{"key":"processor","label":"Processor","type":"select"},{"key":"display_size","label":"Display Size","type":"select"}]'),
('Headphones', 'headphones', 'Premium headphones and earbuds for immersive audio experience', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=400&fit=crop', '[{"key":"brand","label":"Brand","type":"select"},{"key":"connectivity","label":"Connectivity","type":"select"},{"key":"type","label":"Type","type":"select"},{"key":"battery_life","label":"Battery Life","type":"select"}]'),
('Clothing', 'clothing', 'Trendy and comfortable clothing for every occasion', 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=400&fit=crop', '[{"key":"brand","label":"Brand","type":"select"},{"key":"size","label":"Size","type":"select"},{"key":"fabric","label":"Fabric","type":"select"},{"key":"color","label":"Color","type":"select"},{"key":"gender","label":"Gender","type":"select"}]'),
('Accessories', 'accessories', 'Essential accessories including bags, watches, and tech gear', 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&h=400&fit=crop', '[{"key":"brand","label":"Brand","type":"select"},{"key":"color","label":"Color","type":"select"},{"key":"material","label":"Material","type":"select"}]'),
('Cameras', 'cameras', 'Professional and hobbyist cameras for stunning photography', 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&h=400&fit=crop', '[{"key":"brand","label":"Brand","type":"select"},{"key":"type","label":"Type","type":"select"},{"key":"sensor","label":"Sensor","type":"select"},{"key":"resolution","label":"Resolution","type":"select"}]'),
('Tablets', 'tablets', 'Versatile tablets for entertainment, productivity, and creativity', 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&h=400&fit=crop', '[{"key":"brand","label":"Brand","type":"select"},{"key":"storage","label":"Storage","type":"select"},{"key":"display_size","label":"Display Size","type":"select"},{"key":"connectivity","label":"Connectivity","type":"select"}]'),
('Smartwatches', 'smartwatches', 'Smart wearables for fitness tracking and staying connected', 'https://images.unsplash.com/photo-1546868871-af0de0ae72be?w=800&h=400&fit=crop', '[{"key":"brand","label":"Brand","type":"select"},{"key":"os","label":"OS","type":"select"},{"key":"battery_life","label":"Battery Life","type":"select"},{"key":"water_resistance","label":"Water Resistance","type":"select"}]');


-- ============================================================
-- PRODUCTS — Smartphones (category_id = 1)
-- ============================================================
INSERT INTO products (category_id, name, slug, description, price, original_price, stock_quantity, image_url, attributes) VALUES
(1, 'Samsung Galaxy S24 Ultra', 'samsung-galaxy-s24-ultra', 'The Samsung Galaxy S24 Ultra features a stunning 6.8-inch Dynamic AMOLED display with S Pen support, powered by Snapdragon 8 Gen 3 processor. Equipped with a 200MP main camera, 5000mAh battery, and titanium frame for premium durability. AI-powered features enhance photography, translation, and productivity.', 1299.99, 1399.99, 45, 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500&h=500&fit=crop', '{"brand":"Samsung","ram":"12GB","storage":"256GB","battery":"5000mAh","display_size":"6.8 inch","processor":"Snapdragon 8 Gen 3","os":"Android 14"}'),
(1, 'Apple iPhone 15 Pro Max', 'apple-iphone-15-pro-max', 'The iPhone 15 Pro Max delivers the ultimate smartphone experience with its A17 Pro chip, 48MP main camera with 5x optical zoom, and titanium design. Features USB-C connectivity, Action button, and all-day battery life. ProMotion display with Always-On technology provides smooth visuals.', 1199.99, NULL, 60, 'https://images.unsplash.com/photo-1592950630581-03cb41342cc5?w=500&h=500&fit=crop', '{"brand":"Apple","ram":"8GB","storage":"256GB","battery":"4441mAh","display_size":"6.7 inch","processor":"A17 Pro","os":"iOS 17"}'),
(1, 'Google Pixel 8 Pro', 'google-pixel-8-pro', 'Google Pixel 8 Pro brings the best of Google AI to your fingertips. With the Tensor G3 chip, 50MP main camera with advanced computational photography, and 7 years of OS updates. Features Magic Eraser, Best Take, and Circle to Search functionality.', 999.99, 1099.99, 35, 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&h=500&fit=crop', '{"brand":"Google","ram":"12GB","storage":"128GB","battery":"5050mAh","display_size":"6.7 inch","processor":"Tensor G3","os":"Android 14"}'),
(1, 'OnePlus 12', 'oneplus-12', 'OnePlus 12 combines flagship performance with Hasselblad camera expertise. Features Snapdragon 8 Gen 3, 100W SUPERVOOC charging, and a stunning 2K LTPO AMOLED display with 120Hz refresh rate. The 50MP triple camera system delivers professional-quality photos.', 799.99, 899.99, 40, 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=500&h=500&fit=crop', '{"brand":"OnePlus","ram":"12GB","storage":"256GB","battery":"5400mAh","display_size":"6.82 inch","processor":"Snapdragon 8 Gen 3","os":"Android 14"}'),
(1, 'Samsung Galaxy A54', 'samsung-galaxy-a54', 'The Galaxy A54 offers premium features at a mid-range price. With a 6.4-inch Super AMOLED display, 50MP OIS camera, and 5000mAh battery with 25W fast charging. Water-resistant design and smooth 120Hz display make it a great everyday companion.', 449.99, 499.99, 80, 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=500&h=500&fit=crop', '{"brand":"Samsung","ram":"8GB","storage":"128GB","battery":"5000mAh","display_size":"6.4 inch","processor":"Exynos 1380","os":"Android 14"}'),
(1, 'Xiaomi 14 Ultra', 'xiaomi-14-ultra', 'Xiaomi 14 Ultra is a photography powerhouse with Leica Summilux lenses and a 1-inch main sensor delivering 50MP resolution. Powered by Snapdragon 8 Gen 3 with 16GB RAM for exceptional multitasking. Professional camera controls and Leica color science produce stunning images.', 1099.99, NULL, 25, 'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=500&h=500&fit=crop', '{"brand":"Xiaomi","ram":"16GB","storage":"512GB","battery":"5000mAh","display_size":"6.73 inch","processor":"Snapdragon 8 Gen 3","os":"Android 14"}'),
(1, 'Nothing Phone 2', 'nothing-phone-2', 'Nothing Phone 2 features a unique transparent Glyph Interface with customizable LED patterns. Powered by Snapdragon 8+ Gen 1 with a clean Nothing OS experience. The 50MP dual camera system and 4700mAh battery deliver reliable all-day performance with distinctive design.', 599.99, 649.99, 30, 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=500&h=500&fit=crop', '{"brand":"Nothing","ram":"12GB","storage":"256GB","battery":"4700mAh","display_size":"6.7 inch","processor":"Snapdragon 8+ Gen 1","os":"Android 14"}');


-- ============================================================
-- PRODUCTS — Laptops (category_id = 2)
-- ============================================================
INSERT INTO products (category_id, name, slug, description, price, original_price, stock_quantity, image_url, attributes) VALUES
(2, 'MacBook Pro 16 M3 Max', 'macbook-pro-16-m3-max', 'The MacBook Pro 16-inch with M3 Max chip delivers extraordinary performance for demanding workflows. Up to 128GB unified memory, 40-core GPU, and the longest battery life ever in a Mac. Liquid Retina XDR display with ProMotion and studio-quality speakers.', 2499.99, NULL, 20, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=500&fit=crop', '{"brand":"Apple","ram":"36GB","storage":"1TB","processor":"M3 Max","display_size":"16.2 inch","gpu":"40-core GPU","os":"macOS"}'),
(2, 'Dell XPS 15', 'dell-xps-15', 'Dell XPS 15 features a stunning InfinityEdge 3.5K OLED display with 100% DCI-P3 color. Powered by 13th Gen Intel Core i7 with NVIDIA RTX 4060 graphics. CNC machined aluminum chassis with carbon fiber palm rest delivers premium build quality.', 1799.99, 1999.99, 15, 'https://images.unsplash.com/photo-1593642702749-b7d2a804fbcf?w=500&h=500&fit=crop', '{"brand":"Dell","ram":"32GB","storage":"1TB","processor":"Intel Core i7-13700H","display_size":"15.6 inch","gpu":"NVIDIA RTX 4060","os":"Windows 11"}'),
(2, 'ASUS ROG Strix G16', 'asus-rog-strix-g16', 'Built for gamers, the ASUS ROG Strix G16 features Intel Core i9 processor with NVIDIA RTX 4070 graphics. 16-inch QHD 240Hz display ensures buttery smooth gameplay. Advanced cooling with Conductonaut Extreme liquid metal and ROG Intelligent Cooling system.', 1599.99, 1799.99, 25, 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&h=500&fit=crop', '{"brand":"ASUS","ram":"16GB","storage":"1TB","processor":"Intel Core i9-13980HX","display_size":"16 inch","gpu":"NVIDIA RTX 4070","os":"Windows 11"}'),
(2, 'HP Spectre x360 14', 'hp-spectre-x360-14', 'HP Spectre x360 14 is a versatile 2-in-1 convertible with 3K OLED display. Intel Core Ultra 7 processor with Intel Arc graphics delivers performance and efficiency. Precision haptic touchpad and 360-degree hinge allow laptop, tablet, and tent modes.', 1449.99, 1599.99, 30, 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500&h=500&fit=crop', '{"brand":"HP","ram":"16GB","storage":"512GB","processor":"Intel Core Ultra 7","display_size":"14 inch","gpu":"Intel Arc","os":"Windows 11"}'),
(2, 'Lenovo ThinkPad X1 Carbon Gen 11', 'lenovo-thinkpad-x1-carbon', 'The ThinkPad X1 Carbon Gen 11 is the ultimate business ultrabook. 14-inch 2.8K OLED display, Intel Core i7 vPro processor, and legendary ThinkPad keyboard. MIL-STD-810H tested durability at just 1.12kg makes it perfect for mobile professionals.', 1649.99, NULL, 18, 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=500&h=500&fit=crop', '{"brand":"Lenovo","ram":"32GB","storage":"1TB","processor":"Intel Core i7-1365U","display_size":"14 inch","gpu":"Intel Iris Xe","os":"Windows 11"}'),
(2, 'Acer Swift Go 14', 'acer-swift-go-14', 'Acer Swift Go 14 combines portability with performance featuring Intel Core Ultra 7, 14-inch 2.8K OLED display, and all-day battery life. Weighing just 1.3kg with Thunderbolt 4 connectivity, it is the perfect companion for productivity on the go.', 899.99, 1099.99, 45, 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=500&h=500&fit=crop', '{"brand":"Acer","ram":"16GB","storage":"512GB","processor":"Intel Core Ultra 7","display_size":"14 inch","gpu":"Intel Arc","os":"Windows 11"}'),
(2, 'MSI Creator Z16 HX', 'msi-creator-z16-hx', 'MSI Creator Z16 HX is designed for creative professionals with a 16-inch QHD+ Mini LED display covering 100% DCI-P3. Intel Core i9 and NVIDIA RTX 4070 handle intensive video editing, 3D rendering, and design workloads with ease.', 2199.99, 2399.99, 12, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=500&fit=crop', '{"brand":"MSI","ram":"32GB","storage":"2TB","processor":"Intel Core i9-13950HX","display_size":"16 inch","gpu":"NVIDIA RTX 4070","os":"Windows 11"}');


-- ============================================================
-- PRODUCTS — Headphones (category_id = 3)
-- ============================================================
INSERT INTO products (category_id, name, slug, description, price, original_price, stock_quantity, image_url, attributes) VALUES
(3, 'Sony WH-1000XM5', 'sony-wh-1000xm5', 'Industry-leading noise cancellation with Auto NC Optimizer. 30-hour battery life, multipoint Bluetooth connection, and crystal clear hands-free calling. Lightweight design with premium soft-fit leather ear pads for all-day comfort. Hi-Res Audio with LDAC codec support.', 349.99, 399.99, 55, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop', '{"brand":"Sony","connectivity":"Wireless","type":"Over-Ear","battery_life":"30 hours","noise_cancellation":"Yes","driver_size":"30mm"}'),
(3, 'Apple AirPods Pro 2', 'apple-airpods-pro-2', 'AirPods Pro 2 feature the H2 chip for advanced Active Noise Cancellation and Adaptive Transparency. Personalized Spatial Audio with dynamic head tracking creates an immersive experience. Up to 6 hours of listening time with MagSafe charging case providing 30 hours total.', 249.99, NULL, 70, 'https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=500&h=500&fit=crop', '{"brand":"Apple","connectivity":"Wireless","type":"In-Ear","battery_life":"6 hours","noise_cancellation":"Yes","driver_size":"Custom"}'),
(3, 'Bose QuietComfort Ultra', 'bose-quietcomfort-ultra', 'Bose QuietComfort Ultra headphones deliver world-class noise cancellation with Immersive Audio for spatial sound. CustomTune technology personalizes sound to your ears. Luxuriously padded headband and ear cushions with up to 24 hours of battery life.', 379.99, 429.99, 35, 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500&h=500&fit=crop', '{"brand":"Bose","connectivity":"Wireless","type":"Over-Ear","battery_life":"24 hours","noise_cancellation":"Yes","driver_size":"35mm"}'),
(3, 'Samsung Galaxy Buds2 Pro', 'samsung-galaxy-buds2-pro', 'Galaxy Buds2 Pro feature intelligent Active Noise Cancellation and 360 Audio for immersive sound. Hi-Fi 24-bit audio and seamless Galaxy ecosystem integration. Compact ergonomic design with IPX7 water resistance for workouts and daily use.', 179.99, 229.99, 65, 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&h=500&fit=crop', '{"brand":"Samsung","connectivity":"Wireless","type":"In-Ear","battery_life":"5 hours","noise_cancellation":"Yes","driver_size":"10mm"}'),
(3, 'Sennheiser Momentum 4 Wireless', 'sennheiser-momentum-4', 'Sennheiser Momentum 4 delivers audiophile-grade sound with 42mm transducers and Adaptive Noise Cancellation. Premium materials with genuine leather headband and 60-hour battery life. Sennheiser Smart Control app allows custom EQ and sound personalization.', 299.99, 349.99, 40, 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500&h=500&fit=crop', '{"brand":"Sennheiser","connectivity":"Wireless","type":"Over-Ear","battery_life":"60 hours","noise_cancellation":"Yes","driver_size":"42mm"}'),
(3, 'JBL Tour One M2', 'jbl-tour-one-m2', 'JBL Tour One M2 combines legendary JBL Pro Sound with True Adaptive Noise Cancelling. 50-hour playtime and Hi-Res Audio certification deliver premium listening. 4-mic beamforming technology ensures crystal clear calls even in noisy environments.', 249.99, 299.99, 50, 'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=500&h=500&fit=crop', '{"brand":"JBL","connectivity":"Wireless","type":"Over-Ear","battery_life":"50 hours","noise_cancellation":"Yes","driver_size":"40mm"}'),
(3, 'Audio-Technica ATH-M50x', 'audio-technica-ath-m50x', 'The ATH-M50x is the professional studio monitor headphone trusted by audio engineers worldwide. Critically acclaimed sonic performance with 45mm large-aperture drivers. Circumaural design contours around the ears for excellent sound isolation in any environment.', 149.99, NULL, 90, 'https://images.unsplash.com/photo-1578319439584-104c94d37305?w=500&h=500&fit=crop', '{"brand":"Audio-Technica","connectivity":"Wired","type":"Over-Ear","battery_life":"N/A","noise_cancellation":"No","driver_size":"45mm"}');


-- ============================================================
-- PRODUCTS — Clothing (category_id = 4)
-- ============================================================
INSERT INTO products (category_id, name, slug, description, price, original_price, stock_quantity, image_url, attributes) VALUES
(4, 'Classic Premium Cotton T-Shirt', 'classic-premium-cotton-tshirt', 'Premium heavyweight cotton t-shirt with a relaxed modern fit. Made from 100% organic combed cotton with reinforced stitching for durability. Perfect for everyday wear with a soft hand feel that gets better with every wash.', 39.99, 49.99, 150, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop', '{"brand":"Essentials","size":"M","fabric":"Cotton","color":"White","gender":"Unisex","fit":"Regular"}'),
(4, 'Slim Fit Stretch Denim Jeans', 'slim-fit-stretch-denim-jeans', 'Modern slim-fit jeans with 2% elastane for comfort stretch. Made from premium selvedge denim with a mid-rise waist and tapered leg. Five-pocket styling with antique brass hardware and reinforced stress points for long-lasting wear.', 79.99, 99.99, 100, 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&h=500&fit=crop', '{"brand":"DenimCo","size":"32","fabric":"Denim","color":"Indigo","gender":"Men","fit":"Slim"}'),
(4, 'Premium Wool Blend Blazer', 'premium-wool-blend-blazer', 'Tailored premium wool-blend blazer with half-canvas construction. Notch lapel, two-button closure, and four interior pockets. Italian-milled fabric with natural stretch provides a refined silhouette for business and formal occasions.', 199.99, 279.99, 35, 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&h=500&fit=crop', '{"brand":"Sartorial","size":"L","fabric":"Wool Blend","color":"Navy","gender":"Men","fit":"Tailored"}'),
(4, 'Casual Linen Button-Down Shirt', 'casual-linen-button-down', 'Relaxed-fit linen shirt perfect for warm weather and casual occasions. Made from 100% European linen with a soft garment wash for a lived-in feel. Mother-of-pearl buttons and a classic collar complete the effortless summer look.', 69.99, NULL, 75, 'https://images.unsplash.com/photo-1564557287817-3085a4c31e69?w=500&h=500&fit=crop', '{"brand":"CoastalWear","size":"L","fabric":"Linen","color":"Sky Blue","gender":"Men","fit":"Relaxed"}'),
(4, 'Athletic Performance Running Shorts', 'athletic-performance-running-shorts', 'Lightweight running shorts with built-in moisture-wicking liner. Four-way stretch fabric moves with you during high-intensity workouts. Zippered back pocket for secure storage and reflective details for low-light visibility.', 44.99, NULL, 120, 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&h=500&fit=crop', '{"brand":"ActiveFit","size":"M","fabric":"Polyester","color":"Black","gender":"Unisex","fit":"Athletic"}'),
(4, 'Winter Insulated Puffer Jacket', 'winter-insulated-puffer-jacket', 'Stay warm in extreme cold with this 700-fill-power down puffer jacket. Water-resistant ripstop nylon shell with sealed seams keeps out wind and moisture. Adjustable hood, internal storm cuffs, and zippered hand-warmer pockets for maximum warmth.', 189.99, 249.99, 40, 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=500&h=500&fit=crop', '{"brand":"NorthPeak","size":"XL","fabric":"Nylon","color":"Forest Green","gender":"Unisex","fit":"Regular"}'),
(4, 'Elegant Silk Wrap Dress', 'elegant-silk-wrap-dress', 'Timeless silk wrap dress crafted from 100% mulberry silk with a flattering V-neckline and adjustable waist tie. The fluid drape creates an elegant silhouette perfect for cocktail parties, dinners, and special occasions.', 159.99, NULL, 45, 'https://images.unsplash.com/photo-1434389677669-e08b4cda3f0a?w=500&h=500&fit=crop', '{"brand":"LuxeMode","size":"S","fabric":"Silk","color":"Burgundy","gender":"Women","fit":"Wrap"}'),
(4, 'Organic Cotton Hoodie', 'organic-cotton-hoodie', 'Ultra-soft organic cotton hoodie with a brushed fleece interior for cozy warmth. Kangaroo pocket, adjustable drawstring hood, and ribbed cuffs and hem. Sustainably made with GOTS-certified organic cotton for eco-conscious comfort.', 59.99, 74.99, 95, 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500&h=500&fit=crop', '{"brand":"EcoBasics","size":"L","fabric":"Cotton","color":"Charcoal","gender":"Unisex","fit":"Regular"}');


-- ============================================================
-- PRODUCTS — Accessories (category_id = 5)
-- ============================================================
INSERT INTO products (category_id, name, slug, description, price, original_price, stock_quantity, image_url, attributes) VALUES
(5, 'Leather Crossbody Messenger Bag', 'leather-crossbody-messenger-bag', 'Handcrafted full-grain leather messenger bag with adjustable crossbody strap. Multiple compartments including padded laptop sleeve fits up to 13-inch devices. Antique brass hardware and YKK zippers ensure durability and style.', 149.99, 189.99, 50, 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&h=500&fit=crop', '{"brand":"LeatherCraft","color":"Brown","material":"Full-Grain Leather"}'),
(5, 'Classic Aviator Sunglasses', 'classic-aviator-sunglasses', 'Timeless aviator sunglasses with polarized UV400 lenses for 100% UVA/UVB protection. Lightweight titanium frame with adjustable nose pads for a custom fit. Scratch-resistant lens coating and premium carrying case included.', 89.99, 119.99, 85, 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=500&fit=crop', '{"brand":"OpticShade","color":"Gold","material":"Titanium"}'),
(5, 'Minimalist Automatic Watch', 'minimalist-automatic-watch', 'Swiss-movement automatic watch with sapphire crystal glass and exhibition caseback. 40mm stainless steel case with Italian leather strap. Water-resistant to 50 meters with a power reserve indicator and luminous hands for low-light reading.', 299.99, NULL, 30, 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500&h=500&fit=crop', '{"brand":"TimeKeeper","color":"Silver","material":"Stainless Steel"}'),
(5, 'Wireless Magnetic Charging Pad', 'wireless-magnetic-charging-pad', 'Fast wireless charging pad with magnetic alignment for perfect positioning every time. Supports up to 15W fast charging for compatible devices. Premium aluminum alloy body with silicone grip prevents slipping and scratching.', 39.99, 54.99, 120, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop', '{"brand":"ChargeMax","color":"Space Gray","material":"Aluminum"}'),
(5, 'Professional Laptop Backpack', 'professional-laptop-backpack', 'Water-resistant laptop backpack with dedicated 15.6-inch padded laptop compartment. Multiple organizer pockets, USB charging port, and anti-theft hidden zipper design. Ergonomic back panel with breathable mesh and adjustable straps.', 79.99, 99.99, 65, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop', '{"brand":"TechPack","color":"Black","material":"Polyester"}'),
(5, 'Slim RFID-Blocking Wallet', 'slim-rfid-blocking-wallet', 'Ultra-slim bifold wallet with RFID-blocking technology to protect your cards. Made from top-grain leather with 8 card slots, 2 bill compartments, and a clear ID window. Slim profile fits comfortably in front pockets.', 49.99, 64.99, 110, 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=500&h=500&fit=crop', '{"brand":"SecureSlim","color":"Black","material":"Top-Grain Leather"}'),
(5, 'Ergonomic Laptop Stand', 'ergonomic-laptop-stand', 'Adjustable aluminum laptop stand with 6 height settings for ergonomic viewing angles. Compatible with laptops from 10 to 17 inches. Hollow base design promotes airflow for cooler laptop operation. Folds flat for portability.', 44.99, NULL, 70, 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=500&fit=crop', '{"brand":"ErgoDesk","color":"Silver","material":"Aluminum"}');


-- ============================================================
-- PRODUCTS — Cameras (category_id = 6)
-- ============================================================
INSERT INTO products (category_id, name, slug, description, price, original_price, stock_quantity, image_url, attributes) VALUES
(6, 'Sony Alpha A7 IV', 'sony-alpha-a7-iv', 'The Sony A7 IV is a versatile full-frame mirrorless camera with 33MP Exmor R CMOS sensor and BIONZ XR processor. Shoots 4K 60p video, features Real-time Eye AF for humans, animals, and birds, and offers 10fps burst shooting. Professional performance in a compact body.', 2199.99, 2499.99, 15, 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&h=500&fit=crop', '{"brand":"Sony","type":"Mirrorless","sensor":"Full Frame","resolution":"33MP","video":"4K 60fps","stabilization":"5-axis IBIS"}'),
(6, 'Canon EOS R6 Mark II', 'canon-eos-r6-mark-ii', 'Canon EOS R6 Mark II delivers 24.2MP full-frame performance with DIGIC X processor. Up to 40fps electronic shutter burst shooting and advanced subject detection AF track virtually anything that moves. 6K RAW video oversampled to 4K for stunning footage.', 2299.99, NULL, 12, 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500&h=500&fit=crop', '{"brand":"Canon","type":"Mirrorless","sensor":"Full Frame","resolution":"24.2MP","video":"4K 60fps","stabilization":"5-axis IBIS"}'),
(6, 'Fujifilm X-T5', 'fujifilm-x-t5', 'Fujifilm X-T5 combines retro design with modern performance. 40MP X-Trans CMOS 5 HR sensor with X-Processor 5 engine. Renowned Fujifilm color science with 19 Film Simulation modes. Compact rangefinder-style body with three command dials for intuitive control.', 1699.99, 1799.99, 22, 'https://images.unsplash.com/photo-1606986628253-49f5fb9e5506?w=500&h=500&fit=crop', '{"brand":"Fujifilm","type":"Mirrorless","sensor":"APS-C","resolution":"40MP","video":"6.2K 30fps","stabilization":"5-axis IBIS"}'),
(6, 'Sony ZV-E10 II', 'sony-zv-e10-ii', 'The Sony ZV-E10 II is the ultimate vlogging camera with interchangeable lenses and a flip-out touchscreen. 26MP APS-C sensor with Real-time Eye AF and background defocus button. Directional 3-capsule microphone captures clear audio for content creation.', 799.99, 899.99, 40, 'https://images.unsplash.com/photo-1581591524425-c7e0978865fc?w=500&h=500&fit=crop', '{"brand":"Sony","type":"Mirrorless","sensor":"APS-C","resolution":"26MP","video":"4K 60fps","stabilization":"Electronic"}'),
(6, 'GoPro HERO 12 Black', 'gopro-hero-12-black', 'GoPro HERO 12 Black captures stunning 5.3K video at 60fps and 27MP photos. Enhanced HyperSmooth 6.0 stabilization smooths out the roughest footage. Waterproof to 33ft without housing with HDR video and improved low-light performance.', 399.99, NULL, 55, 'https://images.unsplash.com/photo-1564466809058-bf4114d55352?w=500&h=500&fit=crop', '{"brand":"GoPro","type":"Action Camera","sensor":"1/1.9 inch","resolution":"27MP","video":"5.3K 60fps","stabilization":"HyperSmooth 6.0"}'),
(6, 'Nikon Z6 III', 'nikon-z6-iii', 'Nikon Z6 III is a versatile full-frame mirrorless camera with 24.5MP sensor and partially stacked design for faster readout speeds. EXPEED 7 processor delivers superior autofocus with 3D tracking. Shoots 4K 120p slow motion and features pre-release capture.', 2499.99, NULL, 10, 'https://images.unsplash.com/photo-1516724562728-afc824a36e84?w=500&h=500&fit=crop', '{"brand":"Nikon","type":"Mirrorless","sensor":"Full Frame","resolution":"24.5MP","video":"4K 120fps","stabilization":"5-axis VR"}');


-- ============================================================
-- PRODUCTS — Tablets (category_id = 7)
-- ============================================================
INSERT INTO products (category_id, name, slug, description, price, original_price, stock_quantity, image_url, attributes) VALUES
(7, 'Apple iPad Pro 13 M4', 'apple-ipad-pro-13-m4', 'The thinnest and most powerful iPad ever with the M4 chip and Ultra Retina XDR tandem OLED display. ProMotion 120Hz, Face ID, Thunderbolt, and Apple Pencil Pro support. Perfect for professional creative workflows from illustration to video editing.', 1299.99, NULL, 25, 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&h=500&fit=crop', '{"brand":"Apple","storage":"256GB","display_size":"13 inch","connectivity":"WiFi + 5G","processor":"M4","os":"iPadOS 17"}'),
(7, 'Samsung Galaxy Tab S9 Ultra', 'samsung-galaxy-tab-s9-ultra', 'Samsung Galaxy Tab S9 Ultra features a massive 14.6-inch Dynamic AMOLED 2X display with S Pen included. Powered by Snapdragon 8 Gen 2 with IP68 water resistance. Samsung DeX provides a desktop-like experience for productivity on the go.', 1099.99, 1199.99, 18, 'https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=500&h=500&fit=crop', '{"brand":"Samsung","storage":"256GB","display_size":"14.6 inch","connectivity":"WiFi","processor":"Snapdragon 8 Gen 2","os":"Android 14"}'),
(7, 'Microsoft Surface Pro 10', 'microsoft-surface-pro-10', 'Surface Pro 10 is the 2-in-1 that replaces your laptop. Intel Core Ultra processors with Copilot+ AI features. 13-inch PixelSense Flow display with 120Hz refresh rate and optional 5G connectivity. Surface Slim Pen 2 with haptic feedback.', 999.99, 1099.99, 30, 'https://images.unsplash.com/photo-1561154464-82e0f6e62c5c?w=500&h=500&fit=crop', '{"brand":"Microsoft","storage":"256GB","display_size":"13 inch","connectivity":"WiFi","processor":"Intel Core Ultra 7","os":"Windows 11"}'),
(7, 'Apple iPad Air M2', 'apple-ipad-air-m2', 'iPad Air with M2 chip delivers powerful performance in a thin and light design. 11-inch Liquid Retina display with P3 wide color, Touch ID, and USB-C with support for external displays. Center Stage keeps you in frame during video calls.', 599.99, 649.99, 50, 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&h=500&fit=crop', '{"brand":"Apple","storage":"128GB","display_size":"11 inch","connectivity":"WiFi","processor":"M2","os":"iPadOS 17"}'),
(7, 'Lenovo Tab P12 Pro', 'lenovo-tab-p12-pro', 'Lenovo Tab P12 Pro features a 12.6-inch AMOLED display with 120Hz refresh rate and JBL quad speakers with Dolby Atmos. Snapdragon 870 processor and optional keyboard case transform it into a productivity workstation. 10200mAh battery for all-day use.', 499.99, 599.99, 35, 'https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=500&h=500&fit=crop', '{"brand":"Lenovo","storage":"256GB","display_size":"12.6 inch","connectivity":"WiFi","processor":"Snapdragon 870","os":"Android 13"}');


-- ============================================================
-- PRODUCTS — Smartwatches (category_id = 8)
-- ============================================================
INSERT INTO products (category_id, name, slug, description, price, original_price, stock_quantity, image_url, attributes) VALUES
(8, 'Apple Watch Ultra 2', 'apple-watch-ultra-2', 'Apple Watch Ultra 2 is the most rugged and capable Apple Watch with S9 SiP chip, 3000 nits brightness, and precision dual-frequency GPS. Designed for extreme outdoor activities with 100m water resistance for recreational diving. Up to 36 hours of battery life.', 799.99, NULL, 20, 'https://images.unsplash.com/photo-1546868871-af0de0ae72be?w=500&h=500&fit=crop', '{"brand":"Apple","os":"watchOS 10","battery_life":"36 hours","water_resistance":"100m","display_size":"49mm","gps":"Dual-frequency"}'),
(8, 'Samsung Galaxy Watch 6 Classic', 'samsung-galaxy-watch-6-classic', 'Galaxy Watch 6 Classic brings back the beloved rotating bezel with a premium stainless steel design. Advanced BioActive Sensor monitors heart rate, blood pressure, and body composition. Wear OS with One UI Watch delivers a seamless Samsung ecosystem experience.', 349.99, 399.99, 45, 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&h=500&fit=crop', '{"brand":"Samsung","os":"Wear OS","battery_life":"40 hours","water_resistance":"50m","display_size":"47mm","gps":"GPS"}'),
(8, 'Garmin Fenix 7 Pro', 'garmin-fenix-7-pro', 'Garmin Fenix 7 Pro is the ultimate multisport GPS watch with built-in LED flashlight, solar charging, and advanced training features. TopoActive maps, ClimbPro trail navigation, and multi-band GPS provide precision in any environment. Up to 22 days battery in smartwatch mode.', 699.99, 799.99, 15, 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&h=500&fit=crop', '{"brand":"Garmin","os":"Garmin OS","battery_life":"22 days","water_resistance":"100m","display_size":"47mm","gps":"Multi-band"}'),
(8, 'Google Pixel Watch 2', 'google-pixel-watch-2', 'Google Pixel Watch 2 combines Fitbit health and fitness tracking with the power of Google. Heart rate monitoring, stress management, ECG app, and Safety Signal features. Wear OS delivers Google Maps, Wallet, and Assistant on your wrist.', 349.99, NULL, 40, 'https://images.unsplash.com/photo-1546868871-af0de0ae72be?w=500&h=500&fit=crop', '{"brand":"Google","os":"Wear OS","battery_life":"24 hours","water_resistance":"50m","display_size":"41mm","gps":"GPS"}'),
(8, 'Fitbit Sense 2', 'fitbit-sense-2', 'Fitbit Sense 2 is a comprehensive health and wellness smartwatch with continuous EDA sensor for stress management. Advanced heart health features including irregular heart rhythm notifications. SpO2 monitoring, skin temperature sensing, and 6-day battery life.', 249.99, 299.99, 55, 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&h=500&fit=crop', '{"brand":"Fitbit","os":"Fitbit OS","battery_life":"6 days","water_resistance":"50m","display_size":"40mm","gps":"GPS"}');


-- ============================================================
-- CUSTOMERS (10 customers)
-- ============================================================
INSERT INTO customers (name, email, password_hash) VALUES
('John Smith', 'john.smith@email.com', '$2b$10$dummyhash1234567890abcdefghijklmn'),
('Jane Doe', 'jane.doe@email.com', '$2b$10$dummyhash1234567890abcdefghijklmn'),
('Michael Johnson', 'michael.j@email.com', '$2b$10$dummyhash1234567890abcdefghijklmn'),
('Emily Williams', 'emily.w@email.com', '$2b$10$dummyhash1234567890abcdefghijklmn'),
('David Brown', 'david.b@email.com', '$2b$10$dummyhash1234567890abcdefghijklmn'),
('Sarah Davis', 'sarah.d@email.com', '$2b$10$dummyhash1234567890abcdefghijklmn'),
('Robert Miller', 'robert.m@email.com', '$2b$10$dummyhash1234567890abcdefghijklmn'),
('Jessica Wilson', 'jessica.w@email.com', '$2b$10$dummyhash1234567890abcdefghijklmn'),
('Thomas Moore', 'thomas.m@email.com', '$2b$10$dummyhash1234567890abcdefghijklmn'),
('Amanda Taylor', 'amanda.t@email.com', '$2b$10$dummyhash1234567890abcdefghijklmn');


-- ============================================================
-- ORDERS (35 orders)
-- ============================================================
INSERT INTO orders (customer_id, total_amount, status, created_at) VALUES
(1, 1649.98, 'delivered', '2024-06-15 10:30:00'),
(1, 349.99,  'delivered', '2024-07-20 14:15:00'),
(2, 2499.99, 'delivered', '2024-06-18 09:00:00'),
(2, 249.99,  'shipped',   '2024-08-10 16:45:00'),
(3, 1299.99, 'delivered', '2024-05-22 11:30:00'),
(3, 79.99,   'delivered', '2024-07-01 13:00:00'),
(3, 399.99,  'processing','2024-08-25 10:00:00'),
(4, 1199.99, 'delivered', '2024-06-05 08:30:00'),
(4, 189.99,  'delivered', '2024-07-15 17:00:00'),
(4, 44.99,   'shipped',   '2024-08-18 12:30:00'),
(5, 999.99,  'delivered', '2024-05-10 09:45:00'),
(5, 1599.99, 'delivered', '2024-06-28 14:30:00'),
(5, 149.99,  'shipped',   '2024-08-05 11:15:00'),
(6, 799.99,  'delivered', '2024-06-12 10:00:00'),
(6, 449.99,  'delivered', '2024-07-22 15:30:00'),
(6, 89.99,   'processing','2024-08-28 09:00:00'),
(7, 2199.99, 'delivered', '2024-05-30 12:00:00'),
(7, 299.99,  'delivered', '2024-07-08 16:00:00'),
(7, 599.99,  'shipped',   '2024-08-15 13:45:00'),
(8, 1299.99, 'delivered', '2024-06-20 10:30:00'),
(8, 349.99,  'delivered', '2024-07-25 14:00:00'),
(8, 59.99,   'shipped',   '2024-08-22 11:30:00'),
(9, 1699.99, 'delivered', '2024-05-15 09:30:00'),
(9, 179.99,  'delivered', '2024-07-05 15:00:00'),
(9, 799.99,  'processing','2024-08-30 10:15:00'),
(10, 2299.99,'delivered', '2024-06-08 11:00:00'),
(10, 159.99, 'delivered', '2024-07-18 16:30:00'),
(10, 249.99, 'shipped',   '2024-08-12 13:00:00'),
(1, 899.99,  'delivered', '2024-08-01 10:00:00'),
(2, 699.99,  'delivered', '2024-07-28 09:30:00'),
(3, 1449.99, 'shipped',   '2024-08-20 14:00:00'),
(4, 379.99,  'delivered', '2024-07-30 11:00:00'),
(5, 1099.99, 'delivered', '2024-08-08 15:30:00'),
(6, 599.99,  'processing','2024-08-29 12:00:00'),
(7, 1799.99, 'delivered', '2024-07-12 10:30:00');


-- ============================================================
-- ORDER ITEMS (75 items across 35 orders)
-- ============================================================
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES
-- Order 1: Samsung S24 Ultra + Laptop Stand
(1, 1, 1, 1299.99), (1, 42, 1, 44.99),
-- Order 2: Sony WH-1000XM5
(2, 15, 1, 349.99),
-- Order 3: MacBook Pro
(3, 8, 1, 2499.99),
-- Order 4: AirPods Pro 2
(4, 16, 1, 249.99),
-- Order 5: Samsung S24 Ultra
(5, 1, 1, 1299.99),
-- Order 6: Slim Fit Jeans
(6, 23, 1, 79.99),
-- Order 7: GoPro HERO 12
(7, 34, 1, 399.99),
-- Order 8: iPhone 15 Pro Max
(8, 2, 1, 1199.99),
-- Order 9: Puffer Jacket
(9, 27, 1, 189.99),
-- Order 10: Running Shorts
(10, 26, 1, 44.99),
-- Order 11: Pixel 8 Pro
(11, 3, 1, 999.99),
-- Order 12: ASUS ROG Strix
(12, 10, 1, 1599.99),
-- Order 13: ATH-M50x
(13, 21, 1, 149.99),
-- Order 14: OnePlus 12
(14, 4, 1, 799.99),
-- Order 15: Galaxy A54
(15, 5, 1, 449.99),
-- Order 16: Aviator Sunglasses
(16, 37, 1, 89.99),
-- Order 17: Sony A7 IV
(17, 29, 1, 2199.99),
-- Order 18: Automatic Watch
(18, 38, 1, 299.99),
-- Order 19: iPad Air M2 + Charging Pad
(19, 47, 1, 599.99),
-- Order 20: iPad Pro 13
(20, 43, 1, 1299.99),
-- Order 21: Galaxy Watch 6
(21, 50, 1, 349.99),
-- Order 22: Cotton Hoodie
(22, 29, 1, 59.99),
-- Order 23: Fujifilm X-T5
(23, 31, 1, 1699.99),
-- Order 24: Galaxy Buds2 Pro
(24, 18, 1, 179.99),
-- Order 25: Apple Watch Ultra 2
(25, 49, 1, 799.99),
-- Order 26: Canon EOS R6 II
(26, 30, 1, 2299.99),
-- Order 27: Silk Dress
(27, 28, 1, 159.99),
-- Order 28: Sennheiser Momentum 4
(28, 19, 1, 249.99),  -- using Sennheiser price
-- Order 29: Acer Swift Go + Messenger Bag
(29, 13, 1, 899.99),
-- Order 30: Garmin Fenix 7
(30, 51, 1, 699.99),
-- Order 31: ThinkPad X1 + Laptop Stand
(31, 12, 1, 1649.99), (31, 42, 1, 44.99),
-- Order 32: Bose QC Ultra
(32, 17, 1, 379.99),
-- Order 33: Tab S9 Ultra + Charging Pad
(33, 44, 1, 1099.99),
-- Order 34: Nothing Phone 2
(34, 7, 1, 599.99),
-- Order 35: Dell XPS 15 + Laptop Backpack
(35, 9, 1, 1799.99), (35, 40, 1, 79.99),
-- Additional items to create "frequently bought together" patterns
-- Laptop buyers also buy laptop bags and stands
(3, 40, 1, 79.99),    -- MacBook + Backpack
(12, 42, 1, 44.99),   -- ROG + Laptop Stand
(17, 36, 1, 149.99),  -- Camera + Messenger Bag
-- Phone buyers also buy headphones and cases
(5, 18, 1, 179.99),   -- S24 Ultra + Galaxy Buds
(8, 16, 1, 249.99),   -- iPhone + AirPods
(11, 15, 1, 349.99),  -- Pixel + Sony headphones
(14, 20, 1, 249.99),  -- OnePlus + JBL headphones
-- Watch buyers also buy charging pads
(25, 39, 1, 39.99);   -- Watch Ultra + Charging Pad


-- ============================================================
-- REVIEWS (65 reviews with realistic ratings and comments)
-- ============================================================
INSERT INTO reviews (product_id, customer_id, rating, comment, created_at) VALUES
-- Smartphones
(1, 1, 5, 'The S24 Ultra is absolutely incredible. The camera quality and S Pen make it perfect for productivity. Best phone I have ever owned.', '2024-07-01 10:00:00'),
(1, 3, 4, 'Great phone overall. Camera is amazing but the size is a bit large for one-handed use. Still highly recommended.', '2024-06-15 14:00:00'),
(1, 5, 5, 'Titanium build quality is top-notch. Battery easily lasts through the day even with heavy camera use.', '2024-08-10 09:00:00'),
(2, 4, 5, 'Best iPhone ever made. The camera system is phenomenal and the titanium design feels premium.', '2024-07-10 11:00:00'),
(2, 8, 4, 'Excellent phone but I wish the base model had more storage. Camera and performance are outstanding.', '2024-07-25 15:00:00'),
(3, 5, 5, 'Pixel camera magic is real. The AI features like Magic Eraser are genuinely useful. Love the clean Android experience.', '2024-06-20 10:30:00'),
(3, 1, 4, 'Great camera phone with excellent software. Battery could be slightly better but overall impressive.', '2024-07-30 13:00:00'),
(4, 6, 4, 'OnePlus 12 delivers flagship specs at a competitive price. Fast charging is a game changer.', '2024-07-05 12:00:00'),
(5, 6, 4, 'Best mid-range phone you can buy. Camera is surprisingly good and the AMOLED display is vibrant.', '2024-08-01 09:30:00'),
(5, 9, 3, 'Good phone for the price but software updates could be faster. Display and cameras are solid.', '2024-08-15 14:00:00'),
(6, 2, 5, 'The Leica cameras on the Xiaomi 14 Ultra produce stunning photographs. Professional quality in your pocket.', '2024-08-20 10:00:00'),
(7, 3, 4, 'Nothing Phone 2 has a unique design that always gets compliments. Performance is solid for the price.', '2024-08-05 11:00:00'),

-- Laptops
(8, 2, 5, 'M3 Max performance is unbelievable. Compiles code in seconds and handles 4K video editing without breaking a sweat.', '2024-07-15 09:00:00'),
(8, 7, 5, 'Best laptop I have ever used. Display quality, speakers, and build quality are all best in class.', '2024-08-05 14:00:00'),
(9, 7, 4, 'Dell XPS 15 OLED display is gorgeous. Build quality is premium but it runs a bit warm under load.', '2024-08-10 10:00:00'),
(10, 5, 5, 'Perfect gaming laptop. Runs all AAA titles at high settings smoothly. Cooling is excellent.', '2024-07-20 16:00:00'),
(10, 3, 4, 'Great for gaming but it is heavy. RTX 4070 handles everything I throw at it. Keyboard feels great.', '2024-08-25 13:00:00'),
(11, 4, 4, 'HP Spectre x360 is beautiful. The 2-in-1 form factor is perfect for my workflow.', '2024-08-01 11:30:00'),
(12, 9, 5, 'ThinkPad keyboard is still the gold standard. Lightweight and durable with excellent battery life.', '2024-06-25 10:00:00'),
(13, 1, 4, 'Acer Swift Go is great value. OLED display at this price is amazing. Perfect for students.', '2024-08-20 09:00:00'),

-- Headphones
(15, 1, 5, 'Sony WH-1000XM5 noise cancellation is the best. I cannot hear anything on flights. Sound quality is superb.', '2024-08-01 10:00:00'),
(15, 4, 5, 'Comfortable for all-day wear and the multipoint connection is so convenient for switching devices.', '2024-07-22 14:00:00'),
(15, 6, 4, 'Excellent headphones. ANC is industry-leading. Only wish they folded flat for easier storage.', '2024-08-15 11:00:00'),
(16, 4, 5, 'AirPods Pro 2 are perfect for the Apple ecosystem. Noise cancellation rivals over-ear headphones.', '2024-07-15 09:30:00'),
(16, 8, 4, 'Great sound and features. Adaptive transparency mode is my favorite feature.', '2024-08-10 15:00:00'),
(17, 8, 5, 'Bose QC Ultra is the most comfortable headphone I have ever worn. Sound quality is phenomenal.', '2024-08-05 10:00:00'),
(18, 9, 4, 'Galaxy Buds2 Pro fit perfectly and the ANC is impressive for earbuds this small.', '2024-07-30 12:00:00'),
(19, 7, 5, '60-hour battery life is not a typo. Sennheiser sound quality with great ANC. Premium build.', '2024-08-12 14:00:00'),
(20, 6, 4, 'JBL Tour One M2 delivers great bass and the call quality is impressive for meetings.', '2024-08-18 11:00:00'),
(21, 5, 5, 'The ATH-M50x is the studio standard for a reason. Detailed and accurate sound reproduction.', '2024-07-10 10:00:00'),
(21, 3, 4, 'Great reference headphones. Not wireless but the sound quality makes up for it.', '2024-08-01 15:00:00'),

-- Clothing
(22, 2, 5, 'Best cotton t-shirt I have ever bought. The organic cotton is incredibly soft and the fit is perfect.', '2024-07-20 10:00:00'),
(23, 3, 4, 'Great jeans with good stretch. True to size and comfortable for all-day wear.', '2024-07-15 14:00:00'),
(24, 10, 5, 'This blazer looks and feels expensive. The half-canvas construction drapes beautifully.', '2024-08-05 11:00:00'),
(26, 4, 4, 'Comfortable running shorts with good liner. The zippered pocket is a nice touch.', '2024-08-25 09:00:00'),
(27, 9, 3, 'Nice jacket but runs a bit large. Warm enough for moderate cold but not extreme weather.', '2024-08-15 13:00:00'),
(28, 10, 5, 'Gorgeous silk dress. The quality of the fabric is exceptional and it fits beautifully.', '2024-08-01 12:00:00'),
(29, 8, 4, 'The hoodie is super cozy and I love that it is made from organic cotton. Great everyday piece.', '2024-08-20 10:00:00'),

-- Accessories
(36, 7, 5, 'Beautiful leather bag. The craftsmanship is outstanding and it fits my 13-inch laptop perfectly.', '2024-07-25 11:00:00'),
(37, 6, 4, 'Classic aviator style with great polarization. Lightweight and comfortable for long wear.', '2024-08-10 14:00:00'),
(38, 7, 5, 'This automatic watch is stunning. The exhibition caseback is mesmerizing. Great value for a Swiss movement.', '2024-08-01 10:00:00'),
(39, 1, 4, 'Fast wireless charging and the magnetic alignment works perfectly with my phone.', '2024-07-30 15:00:00'),
(40, 5, 4, 'Solid laptop backpack with great organization. The USB charging port is convenient.', '2024-08-15 09:00:00'),
(41, 2, 5, 'Slim wallet that actually fits in front pockets. RFID blocking gives peace of mind.', '2024-08-05 12:00:00'),

-- Cameras
(29, 7, 5, 'Sony A7 IV is the perfect all-rounder. Great for both photos and video. Autofocus is incredible.', '2024-07-10 10:00:00'),
(30, 10, 5, 'Canon R6 II autofocus tracks everything. 40fps burst shooting is unreal for wildlife photography.', '2024-07-20 14:00:00'),
(31, 9, 5, 'Fujifilm colors are simply gorgeous. The X-T5 dials and retro design make photography fun.', '2024-06-30 11:00:00'),
(31, 2, 4, 'Amazing image quality from the 40MP sensor. Compact body with excellent ergonomics.', '2024-08-10 09:00:00'),
(32, 3, 4, 'Perfect vlogging camera. Flip screen, autofocus tracking, and great audio make content creation easy.', '2024-08-20 15:00:00'),
(34, 7, 5, 'GoPro HERO 12 is incredibly versatile. Waterproof and the stabilization is mind-blowing.', '2024-08-15 10:00:00'),

-- Tablets
(43, 8, 5, 'iPad Pro M4 is absurdly powerful. The OLED display is the best I have seen on any device.', '2024-08-05 11:00:00'),
(43, 1, 4, 'Incredible tablet but iPadOS still limits what you can do compared to a laptop.', '2024-08-20 14:00:00'),
(44, 2, 4, 'Galaxy Tab S9 Ultra has an amazing display for media consumption. S Pen is great for notes.', '2024-08-10 10:00:00'),
(45, 4, 4, 'Surface Pro 10 is the best Windows tablet. Touch screen and pen experience are excellent.', '2024-08-15 12:00:00'),
(47, 6, 5, 'iPad Air M2 is the sweet spot for most people. Powerful enough for anything I need.', '2024-07-25 09:00:00'),

-- Smartwatches
(49, 1, 5, 'Apple Watch Ultra 2 is perfect for outdoor adventures. GPS accuracy and battery life are impressive.', '2024-08-10 10:00:00'),
(49, 5, 4, 'Great build quality and features but the size is too large for smaller wrists.', '2024-08-25 14:00:00'),
(50, 6, 4, 'Galaxy Watch 6 Classic rotating bezel is so satisfying. Health tracking features are comprehensive.', '2024-08-15 11:00:00'),
(50, 9, 3, 'Good smartwatch but battery life could be better. Love the classic design though.', '2024-08-20 15:00:00'),
(51, 5, 5, 'Garmin Fenix 7 Pro is the ultimate outdoor watch. Battery lasts weeks and maps are incredibly detailed.', '2024-08-01 10:00:00'),
(52, 3, 4, 'Pixel Watch 2 integrates perfectly with my Pixel phone. Fitbit health tracking is very accurate.', '2024-08-18 13:00:00'),
(52, 10, 4, 'Fitbit Sense 2 is great for health-focused users. Stress tracking and sleep monitoring are helpful.', '2024-08-22 09:00:00');


-- ============================================================
-- Update avg_rating and review_count from actual reviews
-- (This ensures consistency; Phase 3 triggers will automate this)
-- ============================================================
UPDATE products p
SET
    avg_rating = (
        SELECT COALESCE(ROUND(AVG(r.rating), 2), 0)
        FROM reviews r
        WHERE r.product_id = p.product_id
    ),
    review_count = (
        SELECT COUNT(*)
        FROM reviews r
        WHERE r.product_id = p.product_id
    );


-- ============================================================
-- PRODUCT VIEWS (120+ views to support recommendation features)
-- ============================================================
INSERT INTO product_views (product_id, customer_id, viewed_at) VALUES
-- Customer 1 views
(1, 1, '2024-06-10 10:00:00'), (2, 1, '2024-06-10 10:15:00'), (3, 1, '2024-06-10 10:30:00'),
(15, 1, '2024-06-15 14:00:00'), (16, 1, '2024-06-15 14:20:00'),
(42, 1, '2024-06-20 09:00:00'), (39, 1, '2024-06-20 09:15:00'),
(8, 1, '2024-07-01 10:00:00'), (9, 1, '2024-07-01 10:30:00'),
(49, 1, '2024-07-15 14:00:00'), (50, 1, '2024-07-15 14:20:00'),
(1, 1, '2024-08-01 09:00:00'),

-- Customer 2 views
(8, 2, '2024-06-05 09:00:00'), (9, 2, '2024-06-05 09:30:00'), (12, 2, '2024-06-05 10:00:00'),
(6, 2, '2024-06-18 14:00:00'), (1, 2, '2024-06-18 14:30:00'),
(16, 2, '2024-07-10 11:00:00'), (15, 2, '2024-07-10 11:15:00'),
(22, 2, '2024-07-20 09:00:00'), (29, 2, '2024-07-20 09:30:00'),
(41, 2, '2024-08-01 14:00:00'), (44, 2, '2024-08-10 10:00:00'),

-- Customer 3 views
(1, 3, '2024-05-15 10:00:00'), (4, 3, '2024-05-15 10:30:00'), (7, 3, '2024-05-15 11:00:00'),
(23, 3, '2024-06-01 14:00:00'), (24, 3, '2024-06-01 14:30:00'),
(34, 3, '2024-06-20 09:00:00'), (32, 3, '2024-06-20 09:20:00'),
(21, 3, '2024-07-01 11:00:00'), (15, 3, '2024-07-01 11:30:00'),
(10, 3, '2024-07-15 14:00:00'), (12, 3, '2024-08-01 09:00:00'),
(52, 3, '2024-08-15 10:00:00'),

-- Customer 4 views
(2, 4, '2024-05-20 10:00:00'), (1, 4, '2024-05-20 10:30:00'),
(16, 4, '2024-06-01 14:00:00'), (15, 4, '2024-06-01 14:30:00'),
(11, 4, '2024-06-15 09:00:00'), (13, 4, '2024-06-15 09:30:00'),
(26, 4, '2024-07-10 11:00:00'), (22, 4, '2024-07-10 11:20:00'),
(45, 4, '2024-07-30 14:00:00'), (43, 4, '2024-07-30 14:30:00'),
(17, 4, '2024-08-01 10:00:00'),

-- Customer 5 views
(3, 5, '2024-05-01 09:00:00'), (1, 5, '2024-05-01 09:30:00'), (4, 5, '2024-05-01 10:00:00'),
(10, 5, '2024-05-15 14:00:00'), (8, 5, '2024-05-15 14:30:00'),
(40, 5, '2024-06-01 11:00:00'), (36, 5, '2024-06-01 11:20:00'),
(21, 5, '2024-06-20 09:00:00'), (19, 5, '2024-06-20 09:30:00'),
(49, 5, '2024-07-10 14:00:00'), (51, 5, '2024-07-10 14:30:00'),
(33, 5, '2024-08-01 10:00:00'), (44, 5, '2024-08-08 15:00:00'),

-- Customer 6 views
(4, 6, '2024-06-01 10:00:00'), (5, 6, '2024-06-01 10:30:00'),
(20, 6, '2024-06-15 14:00:00'), (19, 6, '2024-06-15 14:30:00'),
(37, 6, '2024-07-01 09:00:00'), (38, 6, '2024-07-01 09:30:00'),
(50, 6, '2024-07-20 11:00:00'), (52, 6, '2024-07-20 11:20:00'),
(47, 6, '2024-08-01 14:00:00'), (22, 6, '2024-08-10 10:00:00'),

-- Customer 7 views
(29, 7, '2024-05-15 10:00:00'), (30, 7, '2024-05-15 10:30:00'), (31, 7, '2024-05-15 11:00:00'),
(36, 7, '2024-06-01 14:00:00'), (38, 7, '2024-06-01 14:30:00'),
(8, 7, '2024-06-20 09:00:00'), (14, 7, '2024-06-20 09:30:00'),
(15, 7, '2024-07-05 11:00:00'), (19, 7, '2024-07-05 11:30:00'),
(9, 7, '2024-07-25 14:00:00'), (34, 7, '2024-08-10 10:00:00'),

-- Customer 8 views
(2, 8, '2024-06-01 10:00:00'), (3, 8, '2024-06-01 10:30:00'),
(17, 8, '2024-06-20 14:00:00'), (15, 8, '2024-06-20 14:30:00'),
(43, 8, '2024-07-10 09:00:00'), (47, 8, '2024-07-10 09:30:00'),
(29, 8, '2024-07-25 11:00:00'), (22, 8, '2024-08-05 14:00:00'),

-- Customer 9 views
(31, 9, '2024-05-05 10:00:00'), (30, 9, '2024-05-05 10:30:00'),
(18, 9, '2024-06-01 14:00:00'), (16, 9, '2024-06-01 14:30:00'),
(12, 9, '2024-06-20 09:00:00'), (8, 9, '2024-06-20 09:30:00'),
(27, 9, '2024-07-10 11:00:00'), (24, 9, '2024-07-10 11:30:00'),
(49, 9, '2024-07-30 14:00:00'), (51, 9, '2024-08-15 10:00:00'),

-- Customer 10 views
(30, 10, '2024-06-01 10:00:00'), (29, 10, '2024-06-01 10:30:00'),
(28, 10, '2024-06-15 14:00:00'), (24, 10, '2024-06-15 14:30:00'),
(52, 10, '2024-07-01 09:00:00'), (50, 10, '2024-07-01 09:30:00'),
(43, 10, '2024-07-20 11:00:00'), (44, 10, '2024-07-20 11:30:00'),
(1, 10, '2024-08-01 14:00:00'), (2, 10, '2024-08-01 14:30:00'),

-- Anonymous views (customer_id = NULL)
(1, NULL, '2024-08-01 10:00:00'), (2, NULL, '2024-08-01 10:15:00'),
(15, NULL, '2024-08-02 14:00:00'), (16, NULL, '2024-08-02 14:15:00'),
(8, NULL, '2024-08-03 09:00:00'), (43, NULL, '2024-08-03 09:30:00'),
(22, NULL, '2024-08-04 11:00:00'), (49, NULL, '2024-08-04 11:20:00');


-- ============================================================
-- Update view_count from actual product_views
-- (The trigger handles future inserts; this syncs initial data)
-- ============================================================
UPDATE products p
SET view_count = (
    SELECT COUNT(*)
    FROM product_views pv
    WHERE pv.product_id = p.product_id
);


-- ============================================================
-- SEARCH HISTORY (25 entries)
-- ============================================================
INSERT INTO search_history (customer_id, search_query, result_count, searched_at) VALUES
(1, 'wireless headphones', 7, '2024-06-15 14:00:00'),
(1, 'samsung galaxy', 3, '2024-06-10 10:00:00'),
(2, 'macbook pro', 1, '2024-06-05 09:00:00'),
(2, 'laptop backpack', 1, '2024-07-20 09:00:00'),
(3, 'gaming laptop', 2, '2024-07-15 14:00:00'),
(3, 'cotton t-shirt', 1, '2024-06-01 14:00:00'),
(4, 'iphone 15', 1, '2024-05-20 10:00:00'),
(4, 'noise cancellation', 5, '2024-06-01 14:00:00'),
(5, 'pixel phone', 1, '2024-05-01 09:00:00'),
(5, 'running shorts', 1, '2024-06-01 11:00:00'),
(6, 'budget smartphone', 3, '2024-06-01 10:00:00'),
(6, 'aviator sunglasses', 1, '2024-07-01 09:00:00'),
(7, 'sony camera', 2, '2024-05-15 10:00:00'),
(7, 'leather bag', 1, '2024-06-01 14:00:00'),
(8, 'ipad pro', 1, '2024-07-10 09:00:00'),
(8, 'bose headphones', 1, '2024-06-20 14:00:00'),
(9, 'fujifilm camera', 1, '2024-05-05 10:00:00'),
(9, 'smartwatch', 3, '2024-07-30 14:00:00'),
(10, 'canon camera', 1, '2024-06-01 10:00:00'),
(10, 'silk dress', 1, '2024-06-15 14:00:00'),
(NULL, 'wireless mouse', 0, '2024-08-01 10:00:00'),
(NULL, 'bluetooth speaker', 0, '2024-08-02 14:00:00'),
(NULL, 'laptop stand', 1, '2024-08-03 09:00:00'),
(NULL, 'phone case', 0, '2024-08-04 11:00:00'),
(NULL, 'charger', 1, '2024-08-05 15:00:00');


-- ============================================================
-- INITIAL TRENDING PRODUCTS (pre-computed for demo)
-- ============================================================
INSERT INTO trending_products (product_id, trending_score, period_views, period_orders, period_revenue, calculated_at) VALUES
(1, 95.50, 12, 3, 3899.97, NOW()),
(2, 88.25, 10, 2, 2399.98, NOW()),
(8, 82.75, 9,  2, 4999.98, NOW()),
(15, 78.50, 8, 3, 1049.97, NOW()),
(43, 72.00, 7, 2, 2599.98, NOW()),
(3, 68.50, 6,  1, 999.99, NOW()),
(49, 65.25, 5, 1, 799.99, NOW()),
(10, 62.00, 5, 1, 1599.99, NOW()),
(31, 58.75, 4, 1, 1699.99, NOW()),
(22, 55.00, 4, 1, 39.99, NOW());


-- ============================================================
-- Verification queries
-- ============================================================
SELECT 'Data loaded successfully!' AS status;
SELECT 'Categories:' AS entity, COUNT(*) AS count FROM categories
UNION ALL SELECT 'Products:', COUNT(*) FROM products
UNION ALL SELECT 'Customers:', COUNT(*) FROM customers
UNION ALL SELECT 'Orders:', COUNT(*) FROM orders
UNION ALL SELECT 'Order Items:', COUNT(*) FROM order_items
UNION ALL SELECT 'Reviews:', COUNT(*) FROM reviews
UNION ALL SELECT 'Product Views:', COUNT(*) FROM product_views
UNION ALL SELECT 'Search History:', COUNT(*) FROM search_history
UNION ALL SELECT 'Trending Products:', COUNT(*) FROM trending_products;
