-- ============================================================
-- SMART PRODUCT SEARCH & RECOMMENDATION ENGINE
-- 08_additional_products.sql — Extra Products to Fill Catalog
-- ============================================================
-- Adds ~100 more products across all 8 categories
-- ============================================================

USE smart_product_engine;

-- ============================================================
-- MORE SMARTPHONES (category_id = 1)
-- ============================================================
INSERT INTO products (category_id, name, slug, description, price, original_price, stock_quantity, image_url, attributes) VALUES
(1, 'Samsung Galaxy Z Fold 5', 'samsung-galaxy-z-fold-5', 'Samsung Galaxy Z Fold 5 redefines multitasking with its 7.6-inch foldable AMOLED display. Powered by Snapdragon 8 Gen 2 with 12GB RAM. Flex Mode and Multi-Window support turn one phone into a productivity powerhouse. IPX8 water resistance for peace of mind.', 1799.99, 1899.99, 22, 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500&h=500&fit=crop', '{"brand":"Samsung","ram":"12GB","storage":"256GB","battery":"4400mAh","display_size":"7.6 inch","processor":"Snapdragon 8 Gen 2","os":"Android 13"}'),
(1, 'Apple iPhone 15', 'apple-iphone-15', 'iPhone 15 features the Dynamic Island, 48MP main camera, and USB-C connectivity. A16 Bionic chip ensures smooth performance for everything from gaming to photography. Ceramic Shield front cover and aerospace-grade aluminum design for everyday durability.', 799.99, NULL, 95, 'https://images.unsplash.com/photo-1592950630581-03cb41342cc5?w=500&h=500&fit=crop', '{"brand":"Apple","ram":"6GB","storage":"128GB","battery":"3877mAh","display_size":"6.1 inch","processor":"A16 Bionic","os":"iOS 17"}'),
(1, 'Google Pixel 8', 'google-pixel-8', 'Google Pixel 8 delivers the best of Google AI with the Tensor G3 chip. 50MP Octa PD camera with Magic Eraser, Photo Unblur, and Best Take. 7 years of OS and security updates with a smooth 120Hz Actua display.', 699.99, 749.99, 55, 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&h=500&fit=crop', '{"brand":"Google","ram":"8GB","storage":"128GB","battery":"4575mAh","display_size":"6.2 inch","processor":"Tensor G3","os":"Android 14"}'),
(1, 'Samsung Galaxy S23 FE', 'samsung-galaxy-s23-fe', 'Galaxy S23 FE brings flagship experiences to a fan-favorite price. 6.4-inch Dynamic AMOLED display with 120Hz refresh rate and 50MP triple camera system. Powered by Exynos 2200 with 8GB RAM for smooth multitasking.', 599.99, 699.99, 70, 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=500&h=500&fit=crop', '{"brand":"Samsung","ram":"8GB","storage":"128GB","battery":"4500mAh","display_size":"6.4 inch","processor":"Exynos 2200","os":"Android 14"}'),
(1, 'Motorola Edge 40 Pro', 'motorola-edge-40-pro', 'Motorola Edge 40 Pro features a stunning 165Hz pOLED curved display with Snapdragon 8 Gen 2 processor. 50MP triple camera with OIS and 68W TurboPower charging gets you to 100% in under 30 minutes. IP68 water and dust resistance.', 699.99, 799.99, 35, 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=500&h=500&fit=crop', '{"brand":"Motorola","ram":"12GB","storage":"256GB","battery":"4600mAh","display_size":"6.67 inch","processor":"Snapdragon 8 Gen 2","os":"Android 13"}'),
(1, 'Sony Xperia 1 V', 'sony-xperia-1-v', 'Sony Xperia 1 V is the ultimate content creator phone with a 4K HDR OLED 120Hz display. Dual stacked Exmor T sensor with real-time Eye AF tracking. CineAlta-inspired Cinematography Pro and Music Pro apps for professional-grade content creation.', 1199.99, 1299.99, 15, 'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=500&h=500&fit=crop', '{"brand":"Sony","ram":"12GB","storage":"256GB","battery":"5000mAh","display_size":"6.5 inch","processor":"Snapdragon 8 Gen 2","os":"Android 13"}'),
(1, 'ASUS ROG Phone 7', 'asus-rog-phone-7', 'ASUS ROG Phone 7 is the ultimate gaming smartphone with Snapdragon 8 Gen 2 and GameCool 7 cooling system. 165Hz Samsung AMOLED display with 720Hz touch sampling rate. AeroActive Cooler 7 and programmable AirTrigger 7 ultrasonic buttons for competitive gaming.', 999.99, NULL, 28, 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=500&h=500&fit=crop', '{"brand":"ASUS","ram":"16GB","storage":"512GB","battery":"6000mAh","display_size":"6.78 inch","processor":"Snapdragon 8 Gen 2","os":"Android 13"}'),
(1, 'Realme GT 5 Pro', 'realme-gt-5-pro', 'Realme GT 5 Pro pushes boundaries with Snapdragon 8 Gen 3 and a 50MP Sony IMX890 periscope telephoto camera. 1.5K AMOLED display with 4500 nits peak brightness and GT Mode for maximum gaming performance. 100W SUPERVOOC charge in just 26 minutes.', 549.99, 649.99, 50, 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=500&h=500&fit=crop', '{"brand":"Realme","ram":"12GB","storage":"256GB","battery":"5400mAh","display_size":"6.78 inch","processor":"Snapdragon 8 Gen 3","os":"Android 14"}');


-- ============================================================
-- MORE LAPTOPS (category_id = 2)
-- ============================================================
INSERT INTO products (category_id, name, slug, description, price, original_price, stock_quantity, image_url, attributes) VALUES
(2, 'MacBook Air 15 M3', 'macbook-air-15-m3', 'MacBook Air 15-inch with M3 chip delivers remarkable performance in an impossibly thin design. 15.3-inch Liquid Retina display with 500 nits brightness, 18 hours of battery life, and fanless silent operation. Perfect for productivity, content creation, and everyday computing.', 1299.99, NULL, 40, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=500&fit=crop', '{"brand":"Apple","ram":"8GB","storage":"256GB","processor":"M3","display_size":"15.3 inch","gpu":"10-core GPU","os":"macOS"}'),
(2, 'Dell Inspiron 16 Plus', 'dell-inspiron-16-plus', 'Dell Inspiron 16 Plus combines powerful performance with a stunning 16-inch 2.5K display. 13th Gen Intel Core i7 processor with NVIDIA RTX 3050 handles demanding creative workloads. ComfortView Plus low blue light technology protects your eyes during long sessions.', 1099.99, 1299.99, 30, 'https://images.unsplash.com/photo-1593642702749-b7d2a804fbcf?w=500&h=500&fit=crop', '{"brand":"Dell","ram":"16GB","storage":"512GB","processor":"Intel Core i7-13700H","display_size":"16 inch","gpu":"NVIDIA RTX 3050","os":"Windows 11"}'),
(2, 'ASUS ZenBook 14 OLED', 'asus-zenbook-14-oled', 'ASUS ZenBook 14 OLED delivers stunning visuals with a 14-inch 2.8K OLED HDR display. Intel Core Ultra 7 with Intel Arc graphics in a ultra-portable 1.2kg body. NumberPad 2.0 touchpad and ErgoLift hinge for comfortable typing angles.', 999.99, 1149.99, 35, 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=500&h=500&fit=crop', '{"brand":"ASUS","ram":"16GB","storage":"512GB","processor":"Intel Core Ultra 7","display_size":"14 inch","gpu":"Intel Arc","os":"Windows 11"}'),
(2, 'Lenovo Legion Pro 5', 'lenovo-legion-pro-5', 'Lenovo Legion Pro 5 is built for serious gamers with Intel Core i9 and NVIDIA RTX 4070 graphics. 16-inch WQXGA 240Hz display with 3ms response time. ColdFront 5.0 thermal system with dual fans and quad exhaust ports keeps temperatures in check during marathon gaming sessions.', 1699.99, 1899.99, 18, 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&h=500&fit=crop', '{"brand":"Lenovo","ram":"32GB","storage":"1TB","processor":"Intel Core i9-13900HX","display_size":"16 inch","gpu":"NVIDIA RTX 4070","os":"Windows 11"}'),
(2, 'HP Pavilion Plus 14', 'hp-pavilion-plus-14', 'HP Pavilion Plus 14 offers premium features at an accessible price point. 14-inch 2.8K OLED display, Intel Core Ultra 7, and up to 16GB RAM. Sleek aluminum chassis weighing just 1.4kg with HP Wide Vision 5MP IR camera for clear video calls.', 849.99, 999.99, 45, 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500&h=500&fit=crop', '{"brand":"HP","ram":"16GB","storage":"512GB","processor":"Intel Core Ultra 7","display_size":"14 inch","gpu":"Intel Arc","os":"Windows 11"}'),
(2, 'Razer Blade 16', 'razer-blade-16', 'Razer Blade 16 is the ultimate gaming laptop with a dual-mode display supporting 4K 120Hz and FHD 240Hz modes. Intel Core i9 and NVIDIA RTX 4090 deliver uncompromising performance. CNC aluminum unibody with per-key RGB Chroma keyboard and Vapor Chamber cooling.', 3499.99, 3799.99, 8, 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&h=500&fit=crop', '{"brand":"Razer","ram":"32GB","storage":"2TB","processor":"Intel Core i9-13950HX","display_size":"16 inch","gpu":"NVIDIA RTX 4090","os":"Windows 11"}'),
(2, 'Microsoft Surface Laptop 6', 'microsoft-surface-laptop-6', 'Surface Laptop 6 combines elegant design with powerful Snapdragon X Elite processor and Copilot+ AI features. 15-inch PixelSense touchscreen with Dolby Vision IQ and incredible 20+ hour battery life. All-day AI-powered productivity in a premium alcantara or metal finish.', 1399.99, NULL, 25, 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=500&h=500&fit=crop', '{"brand":"Microsoft","ram":"16GB","storage":"512GB","processor":"Snapdragon X Elite","display_size":"15 inch","gpu":"Qualcomm Adreno","os":"Windows 11"}'),
(2, 'Samsung Galaxy Book4 Ultra', 'samsung-galaxy-book4-ultra', 'Samsung Galaxy Book4 Ultra features Intel Core Ultra 9 with NVIDIA RTX 4070 graphics for demanding workflows. 16-inch 3K AMOLED display with 120Hz refresh and Galaxy ecosystem integration. Intel AI Boost NPU enables on-device AI capabilities for next-gen productivity.', 2199.99, 2499.99, 12, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=500&fit=crop', '{"brand":"Samsung","ram":"32GB","storage":"1TB","processor":"Intel Core Ultra 9","display_size":"16 inch","gpu":"NVIDIA RTX 4070","os":"Windows 11"}');


-- ============================================================
-- MORE HEADPHONES (category_id = 3)
-- ============================================================
INSERT INTO products (category_id, name, slug, description, price, original_price, stock_quantity, image_url, attributes) VALUES
(3, 'Sony WF-1000XM5', 'sony-wf-1000xm5', 'Sony WF-1000XM5 are the world smallest and lightest premium noise-cancelling earbuds. Dynamic Driver X delivers incredible bass and crystal-clear highs. Speak-to-Chat and Adaptive Sound Control automatically adjust to your environment. 8 hours of playtime with ANC on.', 299.99, NULL, 60, 'https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=500&h=500&fit=crop', '{"brand":"Sony","connectivity":"Wireless","type":"In-Ear","battery_life":"8 hours","noise_cancellation":"Yes","driver_size":"8.4mm"}'),
(3, 'Apple AirPods Max', 'apple-airpods-max', 'AirPods Max deliver stunningly detailed sound with Active Noise Cancellation and Spatial Audio with dynamic head tracking. Apple-designed H1 chip in each ear cup, computational audio, and a breathable knit mesh canopy. Premium aluminum ear cups with Digital Crown for precise control.', 549.99, NULL, 25, 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500&h=500&fit=crop', '{"brand":"Apple","connectivity":"Wireless","type":"Over-Ear","battery_life":"20 hours","noise_cancellation":"Yes","driver_size":"40mm"}'),
(3, 'Jabra Elite 85t', 'jabra-elite-85t', 'Jabra Elite 85t features Jabra Advanced ANC with semi-open design for comfortable all-day wear. 12mm custom speakers deliver powerful sound with adjustable ANC and HearThrough modes. 6-mic call technology and MySound personalized audio profile for the perfect listening experience.', 199.99, 229.99, 55, 'https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=500&h=500&fit=crop', '{"brand":"Jabra","connectivity":"Wireless","type":"In-Ear","battery_life":"5.5 hours","noise_cancellation":"Yes","driver_size":"12mm"}'),
(3, 'Beyerdynamic DT 770 Pro', 'beyerdynamic-dt-770-pro', 'Beyerdynamic DT 770 Pro is the gold standard for studio monitoring headphones. 250-ohm impedance for studio use with detailed and spacious sound. Velour ear pads and spring steel headband provide exceptional comfort during marathon mixing sessions.', 159.99, NULL, 45, 'https://images.unsplash.com/photo-1578319439584-104c94d37305?w=500&h=500&fit=crop', '{"brand":"Beyerdynamic","connectivity":"Wired","type":"Over-Ear","battery_life":"N/A","noise_cancellation":"No","driver_size":"45mm"}'),
(3, 'Beats Studio Pro', 'beats-studio-pro', 'Beats Studio Pro combines iconic Beats design with premium sound and Active Noise Cancelling. Custom acoustic platform with proprietary transducers delivers powerful, immersive audio. Up to 40 hours of battery life, lossless audio via USB-C, and seamless Apple and Android compatibility.', 349.99, 399.99, 40, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop', '{"brand":"Beats","connectivity":"Wireless","type":"Over-Ear","battery_life":"40 hours","noise_cancellation":"Yes","driver_size":"40mm"}'),
(3, 'Skullcandy Crusher ANC 2', 'skullcandy-crusher-anc-2', 'Skullcandy Crusher ANC 2 features adjustable Sensory Bass technology that lets you feel the music. Four-mic digital Active Noise Canceling with Personal Sound profiles. 50 hours of battery life with rapid charge: 10 minutes gives 4 hours of playtime.', 149.99, 179.99, 70, 'https://images.unsplash.com/photo-1572535147248-ac59a8abfa4b?w=500&h=500&fit=crop', '{"brand":"Skullcandy","connectivity":"Wireless","type":"Over-Ear","battery_life":"50 hours","noise_cancellation":"Yes","driver_size":"40mm"}'),
(3, 'Google Pixel Buds Pro', 'google-pixel-buds-pro', 'Google Pixel Buds Pro deliver immersive sound with Silent Seal ANC and custom 11mm drivers tuned by Google. Real-time translation across 49 languages, Google Assistant built-in, and multipoint connectivity. IPX4 water resistance with up to 11 hours of listening time.', 199.99, NULL, 50, 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&h=500&fit=crop', '{"brand":"Google","connectivity":"Wireless","type":"In-Ear","battery_life":"11 hours","noise_cancellation":"Yes","driver_size":"11mm"}'),
(3, 'Bang & Olufsen Beoplay H95', 'bang-olufsen-beoplay-h95', 'Bang & Olufsen Beoplay H95 is the pinnacle of luxury audio with titanium drivers and lambskin leather ear cushions. Adaptive Active Noise Cancellation with Transparency Mode. Premium aluminum construction with up to 50 hours of battery life and USB-C charging.', 899.99, NULL, 10, 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500&h=500&fit=crop', '{"brand":"Bang & Olufsen","connectivity":"Wireless","type":"Over-Ear","battery_life":"50 hours","noise_cancellation":"Yes","driver_size":"40mm"}');


-- ============================================================
-- MORE CLOTHING (category_id = 4)
-- ============================================================
INSERT INTO products (category_id, name, slug, description, price, original_price, stock_quantity, image_url, attributes) VALUES
(4, 'Vintage Washed Graphic Tee', 'vintage-washed-graphic-tee', 'Retro-inspired graphic t-shirt with vintage wash treatment for a lived-in look from day one. Printed using eco-friendly water-based inks on 100% ringspun cotton. Relaxed unisex fit with drop shoulders and a slightly cropped length for modern styling.', 34.99, 44.99, 130, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop', '{"brand":"RetroVibe","size":"M","fabric":"Cotton","color":"Vintage Black","gender":"Unisex","fit":"Relaxed"}'),
(4, 'Tech Fleece Jogger Pants', 'tech-fleece-jogger-pants', 'Engineered tech fleece joggers with modern tapered fit and zippered pockets. Lightweight thermal construction keeps you warm without bulk. Elastic waistband with internal drawcord and ribbed cuffs for a clean, tailored look from gym to street.', 69.99, 89.99, 85, 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=500&h=500&fit=crop', '{"brand":"ActiveFit","size":"L","fabric":"Polyester Blend","color":"Heather Gray","gender":"Men","fit":"Tapered"}'),
(4, 'Classic Polo Shirt', 'classic-polo-shirt', 'Timeless pique cotton polo shirt with a modern slim fit silhouette. Two-button placket with ribbed collar and sleeve cuffs. Embroidered logo on chest with side vents for easy movement. Perfect for smart-casual occasions.', 49.99, NULL, 110, 'https://images.unsplash.com/photo-1564557287817-3085a4c31e69?w=500&h=500&fit=crop', '{"brand":"Essentials","size":"M","fabric":"Cotton Pique","color":"Navy","gender":"Men","fit":"Slim"}'),
(4, 'High-Waisted Yoga Leggings', 'high-waisted-yoga-leggings', 'Buttery-soft yoga leggings with four-way stretch and moisture-wicking technology. High-waisted design with a hidden waistband pocket for keys or cards. Flatlock seams prevent chafing during intense workouts. Available in 15 colors.', 54.99, 64.99, 140, 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&h=500&fit=crop', '{"brand":"FlexFit","size":"S","fabric":"Nylon Spandex","color":"Midnight Blue","gender":"Women","fit":"Compression"}'),
(4, 'Merino Wool Crewneck Sweater', 'merino-wool-crewneck-sweater', 'Ultra-fine merino wool sweater with a classic crewneck design. Naturally temperature regulating, breathable, and odor resistant. Ribbed cuffs and hem with reinforced shoulder seams. Machine washable for easy care.', 89.99, 119.99, 55, 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500&h=500&fit=crop', '{"brand":"WoolCraft","size":"L","fabric":"Merino Wool","color":"Burgundy","gender":"Unisex","fit":"Regular"}'),
(4, 'Waterproof Hiking Pants', 'waterproof-hiking-pants', 'Technical hiking pants with DWR waterproof coating and articulated knees for unrestricted movement. Convertible zip-off legs transform pants to shorts for versatile trail use. Multiple cargo pockets with UPF 50+ sun protection.', 79.99, NULL, 60, 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&h=500&fit=crop', '{"brand":"TrailBlazer","size":"32","fabric":"Nylon","color":"Olive","gender":"Unisex","fit":"Regular"}'),
(4, 'Tailored Chino Shorts', 'tailored-chino-shorts', 'Premium stretch cotton chino shorts with a tailored 7-inch inseam. Flat-front design with welt back pockets and hidden security pocket. Garment-dyed for rich color and soft hand feel that improves with each wash.', 44.99, 54.99, 100, 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&h=500&fit=crop', '{"brand":"CoastalWear","size":"32","fabric":"Cotton Stretch","color":"Khaki","gender":"Men","fit":"Tailored"}'),
(4, 'Floral Print Maxi Dress', 'floral-print-maxi-dress', 'Flowing floral maxi dress with a flattering empire waist and adjustable spaghetti straps. Lightweight rayon fabric with tropical print perfect for summer occasions. Side pockets and smocked back panel for a comfortable, custom fit.', 69.99, 89.99, 65, 'https://images.unsplash.com/photo-1434389677669-e08b4cda3f0a?w=500&h=500&fit=crop', '{"brand":"LuxeMode","size":"M","fabric":"Rayon","color":"Floral Multi","gender":"Women","fit":"Flowing"}'),
(4, 'Heavyweight Denim Jacket', 'heavyweight-denim-jacket', 'Classic trucker-style denim jacket in heavyweight 14oz selvedge denim. Blanket-lined for extra warmth with genuine leather patch and brass button closure. Pre-washed for comfort with authentic fading that develops character over time.', 129.99, 159.99, 40, 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=500&h=500&fit=crop', '{"brand":"DenimCo","size":"L","fabric":"Denim","color":"Dark Wash","gender":"Unisex","fit":"Regular"}'),
(4, 'Performance Compression Top', 'performance-compression-top', 'Compression athletic top with targeted muscle support zones and 360-degree stretch. Flatlock stitching eliminates irritation during high-intensity training. Moisture-wicking and anti-odor treatment keeps you fresh through the toughest workouts.', 39.99, NULL, 90, 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&h=500&fit=crop', '{"brand":"ActiveFit","size":"M","fabric":"Polyester Spandex","color":"Black","gender":"Unisex","fit":"Compression"}');


-- ============================================================
-- MORE ACCESSORIES (category_id = 5)
-- ============================================================
INSERT INTO products (category_id, name, slug, description, price, original_price, stock_quantity, image_url, attributes) VALUES
(5, 'Premium Leather Belt', 'premium-leather-belt', 'Handcrafted full-grain Italian leather belt with brushed nickel buckle. 35mm width perfect for both casual and dress wear. Double-stitched edges and reinforced holes ensure years of daily use without stretching or cracking.', 59.99, 79.99, 80, 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=500&h=500&fit=crop', '{"brand":"LeatherCraft","color":"Dark Brown","material":"Italian Leather"}'),
(5, 'Canvas Weekender Bag', 'canvas-weekender-bag', 'Rugged waxed canvas weekender bag with genuine leather handles and detachable shoulder strap. Spacious main compartment with shoe compartment on the bottom. Interior zip pocket and brass hardware. Perfect for 2-3 day trips.', 129.99, 169.99, 35, 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&h=500&fit=crop', '{"brand":"TravelGear","color":"Olive","material":"Waxed Canvas"}'),
(5, 'Smart Bluetooth Tracker 4-Pack', 'smart-bluetooth-tracker-4pack', 'Never lose your essentials again with these ultra-slim Bluetooth trackers. Works with Find My network for precise location tracking. Replaceable CR2032 battery lasts up to 1 year. Includes keyring, wallet insert, and adhesive attachments.', 79.99, 99.99, 95, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop', '{"brand":"TrackIt","color":"White","material":"Polycarbonate"}'),
(5, 'Titanium Polarized Sports Sunglasses', 'titanium-polarized-sports-sunglasses', 'Lightweight titanium frame sports sunglasses with polarized photochromic lenses that adapt to light conditions. Rubberized nose pads and temple tips for a secure athletic fit. Impact-resistant polycarbonate lenses with anti-reflective coating.', 149.99, NULL, 40, 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=500&fit=crop', '{"brand":"OpticShade","color":"Matte Black","material":"Titanium"}'),
(5, 'Mechanical Keyboard (Cherry MX)', 'mechanical-keyboard-cherry-mx', 'Premium mechanical keyboard with genuine Cherry MX Brown switches for tactile feedback. Aircraft-grade aluminum frame with PBT double-shot keycaps. USB-C detachable cable, per-key RGB lighting, and hot-swappable switches for customization.', 139.99, 169.99, 55, 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=500&fit=crop', '{"brand":"KeyMaster","color":"Space Gray","material":"Aluminum"}'),
(5, 'Wireless Ergonomic Mouse', 'wireless-ergonomic-mouse', 'Ergonomic vertical mouse designed to reduce wrist strain with a natural 57-degree angle. 4000 DPI optical sensor with 6 programmable buttons. Bluetooth and 2.4GHz dual connectivity with rechargeable battery lasting up to 3 months.', 49.99, 69.99, 75, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop', '{"brand":"ErgoDesk","color":"Black","material":"ABS Plastic"}'),
(5, 'USB-C Hub 10-in-1 Docking Station', 'usb-c-hub-10-in-1', 'All-in-one USB-C docking station with HDMI 4K@60Hz, 3x USB-A 3.0, USB-C PD 100W, SD/microSD readers, Ethernet, and 3.5mm audio. Aluminum shell with built-in thermal vents. Compatible with MacBook, Surface, and all USB-C laptops.', 69.99, 89.99, 60, 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=500&fit=crop', '{"brand":"TechPack","color":"Silver","material":"Aluminum"}'),
(5, 'Noise-Cancelling Microphone', 'noise-cancelling-microphone', 'Professional USB condenser microphone with AI-powered noise cancellation. Cardioid pickup pattern with 24-bit/96kHz recording quality. Built-in gain control, mute button, and headphone monitoring. Perfect for streaming, podcasting, and meetings.', 89.99, 119.99, 45, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop', '{"brand":"AudioPro","color":"Black","material":"Metal"}');


-- ============================================================
-- MORE CAMERAS (category_id = 6)
-- ============================================================
INSERT INTO products (category_id, name, slug, description, price, original_price, stock_quantity, image_url, attributes) VALUES
(6, 'Canon EOS R8', 'canon-eos-r8', 'Canon EOS R8 is a compact full-frame mirrorless camera with 24.2MP sensor and DIGIC X processor. Advanced deep learning AF system detects and tracks people, animals, and vehicles. 4K 60p HDR PQ video and up to 40fps electronic shutter burst shooting in a lightweight body.', 1499.99, 1599.99, 18, 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500&h=500&fit=crop', '{"brand":"Canon","type":"Mirrorless","sensor":"Full Frame","resolution":"24.2MP","video":"4K 60fps","stabilization":"Electronic"}'),
(6, 'Sony Alpha A6700', 'sony-alpha-a6700', 'Sony A6700 is a powerful APS-C mirrorless camera with 26MP Exmor R sensor and AI-based subject recognition AF. 4K 120p video recording with S-Cinetone color science. 5-axis in-body stabilization with up to 5 stops of shake correction. Perfect for hybrid shooters.', 1399.99, NULL, 25, 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&h=500&fit=crop', '{"brand":"Sony","type":"Mirrorless","sensor":"APS-C","resolution":"26MP","video":"4K 120fps","stabilization":"5-axis IBIS"}'),
(6, 'DJI Pocket 3', 'dji-pocket-3', 'DJI Pocket 3 is an ultra-compact gimbal camera with a 1-inch CMOS sensor for stunning 4K video. 3-axis motorized stabilization eliminates shake in any situation. 2-inch rotatable touchscreen with ActiveTrack 6.0 subject tracking. Weighs only 179g for incredible portability.', 519.99, NULL, 50, 'https://images.unsplash.com/photo-1581591524425-c7e0978865fc?w=500&h=500&fit=crop', '{"brand":"DJI","type":"Gimbal Camera","sensor":"1 inch","resolution":"48MP","video":"4K 120fps","stabilization":"3-axis Gimbal"}'),
(6, 'Panasonic Lumix S5 IIX', 'panasonic-lumix-s5-iix', 'Panasonic Lumix S5 IIX is a cinema-focused full-frame mirrorless camera with 24.2MP sensor and phase-detect AF. Internal 6K 30p and 4K 120p recording with V-Log/V-Gamut for professional color grading. Dual native ISO and unlimited recording time for serious videographers.', 1999.99, 2199.99, 14, 'https://images.unsplash.com/photo-1606986628253-49f5fb9e5506?w=500&h=500&fit=crop', '{"brand":"Panasonic","type":"Mirrorless","sensor":"Full Frame","resolution":"24.2MP","video":"6K 30fps","stabilization":"5-axis IBIS"}'),
(6, 'Insta360 X4', 'insta360-x4', 'Insta360 X4 captures immersive 360-degree video in stunning 8K resolution. AI-powered Invisible Selfie Stick effect and FlowState stabilization create cinematic footage from any angle. Waterproof to 10m without housing with 135-min battery life.', 499.99, NULL, 35, 'https://images.unsplash.com/photo-1564466809058-bf4114d55352?w=500&h=500&fit=crop', '{"brand":"Insta360","type":"360 Camera","sensor":"1/2 inch","resolution":"72MP","video":"8K 30fps","stabilization":"FlowState"}'),
(6, 'Hasselblad X2D 100C', 'hasselblad-x2d-100c', 'Hasselblad X2D 100C is the ultimate medium format mirrorless camera with 100MP BSI CMOS sensor. 7-stop IBIS for handheld shooting and 1TB built-in SSD storage. Hasselblad Natural Colour Solution delivers the most accurate color reproduction available. A true work of Swedish engineering artistry.', 7999.99, NULL, 3, 'https://images.unsplash.com/photo-1516724562728-afc824a36e84?w=500&h=500&fit=crop', '{"brand":"Hasselblad","type":"Medium Format","sensor":"Medium Format","resolution":"100MP","video":"2.7K","stabilization":"5-axis IBIS"}'),
(6, 'DJI Mini 4 Pro Drone', 'dji-mini-4-pro-drone', 'DJI Mini 4 Pro weighs under 249g while delivering 4K 100fps HDR video with 48MP photos. Omnidirectional obstacle sensing and APAS 5.0 for safe autonomous flight. 34-minute max flight time with ActiveTrack 360-degree subject tracking and MasterShots.', 759.99, 849.99, 30, 'https://images.unsplash.com/photo-1564466809058-bf4114d55352?w=500&h=500&fit=crop', '{"brand":"DJI","type":"Drone","sensor":"1/1.3 inch","resolution":"48MP","video":"4K 100fps","stabilization":"3-axis Gimbal"}'),
(6, 'Leica Q3', 'leica-q3', 'Leica Q3 pairs a full-frame 60MP sensor with the legendary Summilux 28mm f/1.7 ASPH lens. Tilting 3-inch touchscreen and 5.76M-dot OLED EVF. IP52 weather sealing and Leica FOTOS app for seamless mobile workflows. Digital crop modes simulate 35mm, 50mm, 75mm, and 90mm focal lengths.', 5995.99, NULL, 5, 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&h=500&fit=crop', '{"brand":"Leica","type":"Compact","sensor":"Full Frame","resolution":"60MP","video":"8K","stabilization":"Sensor-shift"}');


-- ============================================================
-- MORE TABLETS (category_id = 7)
-- ============================================================
INSERT INTO products (category_id, name, slug, description, price, original_price, stock_quantity, image_url, attributes) VALUES
(7, 'Apple iPad 10th Gen', 'apple-ipad-10th-gen', 'The redesigned iPad features a 10.9-inch Liquid Retina display with True Tone, A14 Bionic chip, and USB-C connectivity. 12MP front camera with Center Stage and 12MP back camera for 4K video recording. Supports Apple Pencil 1st gen and Magic Keyboard Folio.', 349.99, 449.99, 75, 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&h=500&fit=crop', '{"brand":"Apple","storage":"64GB","display_size":"10.9 inch","connectivity":"WiFi","processor":"A14 Bionic","os":"iPadOS 17"}'),
(7, 'Samsung Galaxy Tab A9+', 'samsung-galaxy-tab-a9-plus', 'Samsung Galaxy Tab A9+ offers a large 11-inch TFT display with quad speakers for immersive entertainment. Octa-core processor with 4GB RAM handles everyday multitasking. One UI for a smooth Samsung experience with Samsung Knox security.', 229.99, 279.99, 90, 'https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=500&h=500&fit=crop', '{"brand":"Samsung","storage":"64GB","display_size":"11 inch","connectivity":"WiFi","processor":"Octa-core","os":"Android 14"}'),
(7, 'OnePlus Pad 2', 'oneplus-pad-2', 'OnePlus Pad 2 features a stunning 12.1-inch LCD display with 144Hz refresh rate and Snapdragon 8 Gen 3 processor. Dolby Vision and Dolby Atmos for cinematic entertainment. 67W SUPERVOOC charging fills the 9510mAh battery in just 81 minutes.', 549.99, NULL, 30, 'https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=500&h=500&fit=crop', '{"brand":"OnePlus","storage":"256GB","display_size":"12.1 inch","connectivity":"WiFi","processor":"Snapdragon 8 Gen 3","os":"Android 14"}'),
(7, 'Amazon Fire Max 11', 'amazon-fire-max-11', 'Amazon Fire Max 11 is the most powerful Fire tablet with an 11-inch 2K display and aluminum body. Octa-core processor with 4GB RAM and all-day battery life. Access to millions of apps, games, and content through Amazon Appstore. Built-in Alexa for hands-free control.', 229.99, 279.99, 65, 'https://images.unsplash.com/photo-1561154464-82e0f6e62c5c?w=500&h=500&fit=crop', '{"brand":"Amazon","storage":"128GB","display_size":"11 inch","connectivity":"WiFi","processor":"Octa-core","os":"Fire OS"}'),
(7, 'Xiaomi Pad 6 Pro', 'xiaomi-pad-6-pro', 'Xiaomi Pad 6 Pro features a stunning 11-inch 2.8K display with 144Hz refresh rate and Snapdragon 8+ Gen 1. Quad speakers with Dolby Atmos and 8600mAh battery for all-day productivity. Supports Xiaomi Smart Pen and keyboard for laptop-like functionality.', 399.99, 449.99, 40, 'https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=500&h=500&fit=crop', '{"brand":"Xiaomi","storage":"256GB","display_size":"11 inch","connectivity":"WiFi","processor":"Snapdragon 8+ Gen 1","os":"Android 14"}'),
(7, 'Google Pixel Tablet', 'google-pixel-tablet', 'Google Pixel Tablet doubles as a smart home hub when docked on its included charging speaker dock. 10.95-inch display with Tensor G2 chip. Built-in Chromecast support, Google Assistant, and smart home controls. Hub Mode transforms it into a digital photo frame and Nest display.', 499.99, 599.99, 20, 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&h=500&fit=crop', '{"brand":"Google","storage":"128GB","display_size":"10.95 inch","connectivity":"WiFi","processor":"Tensor G2","os":"Android 14"}');


-- ============================================================
-- MORE SMARTWATCHES (category_id = 8)
-- ============================================================
INSERT INTO products (category_id, name, slug, description, price, original_price, stock_quantity, image_url, attributes) VALUES
(8, 'Apple Watch Series 9', 'apple-watch-series-9', 'Apple Watch Series 9 features the S9 SiP chip with Double Tap gesture for one-handed control. Precision Finding for iPhone, advanced health sensors, and carbon neutral options. Always-On Retina display with 2000 nits peak brightness and crash detection.', 399.99, NULL, 55, 'https://images.unsplash.com/photo-1546868871-af0de0ae72be?w=500&h=500&fit=crop', '{"brand":"Apple","os":"watchOS 10","battery_life":"18 hours","water_resistance":"50m","display_size":"45mm","gps":"GPS"}'),
(8, 'Samsung Galaxy Watch Ultra', 'samsung-galaxy-watch-ultra', 'Samsung Galaxy Watch Ultra is built for extreme adventures with a titanium Grade 4 case and sapphire crystal. 590mAh battery delivers up to 60 hours in power saving mode. 10ATM + IP68 water resistance, dual-frequency GPS, and a customizable Quick Button for instant action access.', 649.99, NULL, 20, 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&h=500&fit=crop', '{"brand":"Samsung","os":"Wear OS","battery_life":"60 hours","water_resistance":"100m","display_size":"47mm","gps":"Dual-frequency"}'),
(8, 'Garmin Venu 3', 'garmin-venu-3', 'Garmin Venu 3 combines smartwatch features with advanced health monitoring. Nap detection, wheelchair mode, and Body Battery energy monitoring. Built-in speaker and microphone for Bluetooth calls. AMOLED display with up to 14 days battery life in smartwatch mode.', 449.99, NULL, 30, 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&h=500&fit=crop', '{"brand":"Garmin","os":"Garmin OS","battery_life":"14 days","water_resistance":"50m","display_size":"45mm","gps":"Multi-band"}'),
(8, 'Amazfit T-Rex Ultra', 'amazfit-t-rex-ultra', 'Amazfit T-Rex Ultra is built for the most extreme conditions with MIL-STD-810G certification and 100m water resistance. Dual-band GPS with 6 satellite positioning systems. Freediving mode to 30m and route navigation with offline maps. 20-day battery life for extended expeditions.', 299.99, 399.99, 25, 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&h=500&fit=crop', '{"brand":"Amazfit","os":"Zepp OS","battery_life":"20 days","water_resistance":"100m","display_size":"47mm","gps":"Dual-band"}'),
(8, 'TicWatch Pro 5', 'ticwatch-pro-5', 'TicWatch Pro 5 features unique dual-layer display technology with Snapdragon W5+ Gen 1 processor. Ultra-low-power display mode extends battery up to 45 days. Wear OS with Google apps, compass, barometer, and advanced sleep and health tracking.', 349.99, NULL, 35, 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&h=500&fit=crop', '{"brand":"Mobvoi","os":"Wear OS","battery_life":"45 days","water_resistance":"50m","display_size":"48mm","gps":"GPS"}'),
(8, 'Withings ScanWatch 2', 'withings-scanwatch-2', 'Withings ScanWatch 2 combines elegant analog watch design with medical-grade health monitoring. ECG, SpO2, continuous heart rate, and temperature tracking. 30-day battery life in a classic stainless steel case. FDA-cleared and clinically validated health sensors.', 349.99, NULL, 28, 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500&h=500&fit=crop', '{"brand":"Withings","os":"Withings OS","battery_life":"30 days","water_resistance":"50m","display_size":"42mm","gps":"GPS"}'),
(8, 'COROS PACE 3', 'coros-pace-3', 'COROS PACE 3 is the lightest GPS sport watch at just 39g with all-day training metrics. Dual-frequency GPS for precise tracking and 24-day battery life. EvoLab training analysis with personalized recovery recommendations. Perfect for runners, cyclists, and triathletes.', 229.99, 249.99, 40, 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&h=500&fit=crop', '{"brand":"COROS","os":"COROS OS","battery_life":"24 days","water_resistance":"50m","display_size":"46mm","gps":"Dual-frequency"}');


-- ============================================================
-- Additional Reviews for New Products
-- ============================================================
INSERT INTO reviews (product_id, customer_id, rating, comment, created_at) VALUES
-- Samsung Galaxy Z Fold 5 (product_id will be 53)
(53, 2, 5, 'The Z Fold 5 is revolutionary. Multitasking on the large inner screen is a game changer for productivity.', '2024-08-10 10:00:00'),
(53, 7, 4, 'Love the foldable concept but it is still quite heavy. The inner screen is amazing for media though.', '2024-08-15 14:00:00'),
-- Apple iPhone 15 (54)
(54, 3, 5, 'iPhone 15 is the sweet spot. USB-C finally and the Dynamic Island is very useful. Great camera too.', '2024-08-20 09:00:00'),
(54, 6, 4, 'Solid upgrade from iPhone 13. Camera quality jumped significantly. Wish it had ProMotion display though.', '2024-08-25 11:00:00'),
-- MacBook Air 15 M3 (61)
(61, 1, 5, 'MacBook Air 15 M3 is the perfect laptop. Lightweight, silent, incredible battery life. No compromises.', '2024-08-18 10:00:00'),
(61, 4, 5, 'Best laptop value available. The 15-inch screen is gorgeous and M3 handles everything I throw at it.', '2024-08-22 14:00:00'),
-- Sony WF-1000XM5 (69)
(69, 5, 5, 'These are the best earbuds money can buy. ANC is incredible and they are so comfortable you forget them.', '2024-08-12 09:00:00'),
(69, 9, 4, 'Excellent sound quality and ANC. Only wish the case was a bit more compact. Still highly recommended.', '2024-08-16 15:00:00'),
-- Apple AirPods Max (70)
(70, 8, 4, 'AirPods Max sound quality is unmatched. Heavy but the comfort is surprisingly good. Premium price but premium experience.', '2024-08-20 11:00:00'),
-- High-Waisted Yoga Leggings (82)
(82, 2, 5, 'These leggings are amazing! Buttery soft and perfect for yoga. The high waist stays up during every pose.', '2024-08-14 10:00:00'),
(82, 6, 5, 'Best workout leggings I have ever owned. No see-through issues and they hold up wash after wash.', '2024-08-19 12:00:00'),
-- DJI Pocket 3 (91)
(91, 3, 5, 'DJI Pocket 3 is incredibly portable. The 1-inch sensor makes a huge difference in video quality.', '2024-08-17 09:00:00'),
(91, 10, 4, 'Perfect vlogging companion. Stabilization is silky smooth. Battery life could be slightly better.', '2024-08-21 13:00:00'),
-- Apple Watch Series 9 (99)
(99, 1, 5, 'Apple Watch Series 9 is a refined smartwatch. Double Tap gesture is surprisingly useful in everyday life.', '2024-08-16 10:00:00'),
(99, 7, 4, 'Great health tracking and the display is super bright. Wish battery lasted more than a day though.', '2024-08-20 15:00:00');


-- ============================================================
-- Update avg_rating and review_count for all products
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
-- Additional Product Views for new products
-- ============================================================
INSERT INTO product_views (product_id, customer_id, viewed_at) VALUES
(53, 1, '2024-08-05 10:00:00'), (53, 2, '2024-08-05 10:30:00'), (53, 5, '2024-08-10 14:00:00'),
(54, 3, '2024-08-06 09:00:00'), (54, 6, '2024-08-06 09:30:00'), (54, 8, '2024-08-12 14:00:00'),
(55, 1, '2024-08-07 10:00:00'), (55, 4, '2024-08-07 10:30:00'),
(56, 2, '2024-08-08 11:00:00'), (56, 7, '2024-08-08 11:30:00'),
(57, 3, '2024-08-09 14:00:00'), (57, 5, '2024-08-09 14:30:00'),
(58, 6, '2024-08-10 09:00:00'), (58, 9, '2024-08-10 09:30:00'),
(59, 1, '2024-08-11 10:00:00'), (59, 7, '2024-08-11 10:30:00'),
(60, 4, '2024-08-12 14:00:00'), (60, 10, '2024-08-12 14:30:00'),
(61, 1, '2024-08-13 09:00:00'), (61, 2, '2024-08-13 09:30:00'), (61, 4, '2024-08-15 14:00:00'),
(62, 3, '2024-08-14 10:00:00'), (62, 6, '2024-08-14 10:30:00'),
(63, 5, '2024-08-15 11:00:00'), (63, 8, '2024-08-15 11:30:00'),
(64, 2, '2024-08-16 14:00:00'), (64, 9, '2024-08-16 14:30:00'),
(65, 1, '2024-08-17 09:00:00'), (65, 7, '2024-08-17 09:30:00'),
(66, 3, '2024-08-18 10:00:00'), (66, 10, '2024-08-18 10:30:00'),
(67, 4, '2024-08-19 11:00:00'), (67, 6, '2024-08-19 11:30:00'),
(68, 5, '2024-08-20 14:00:00'), (68, 8, '2024-08-20 14:30:00'),
(69, 1, '2024-08-07 09:00:00'), (69, 5, '2024-08-07 09:30:00'), (69, 9, '2024-08-12 14:00:00'),
(70, 3, '2024-08-08 10:00:00'), (70, 8, '2024-08-08 10:30:00'),
(71, 2, '2024-08-09 11:00:00'), (71, 6, '2024-08-09 11:30:00'),
(72, 4, '2024-08-10 14:00:00'), (72, 7, '2024-08-10 14:30:00'),
(73, 1, '2024-08-11 09:00:00'), (73, 5, '2024-08-11 09:30:00'),
(74, 3, '2024-08-12 10:00:00'), (74, 9, '2024-08-12 10:30:00'),
(75, 2, '2024-08-13 11:00:00'), (75, 10, '2024-08-13 11:30:00'),
(76, 6, '2024-08-14 14:00:00'), (76, 8, '2024-08-14 14:30:00'),
(77, 1, '2024-08-15 09:00:00'), (77, 4, '2024-08-15 09:30:00'),
(78, 3, '2024-08-16 10:00:00'), (78, 7, '2024-08-16 10:30:00'),
(79, 5, '2024-08-17 11:00:00'), (79, 9, '2024-08-17 11:30:00'),
(80, 2, '2024-08-18 14:00:00'), (80, 6, '2024-08-18 14:30:00'),
(81, 1, '2024-08-19 09:00:00'), (81, 8, '2024-08-19 09:30:00'),
(82, 2, '2024-08-10 10:00:00'), (82, 6, '2024-08-10 10:30:00'), (82, 10, '2024-08-15 14:00:00'),
(83, 3, '2024-08-11 11:00:00'), (83, 7, '2024-08-11 11:30:00'),
(84, 4, '2024-08-12 14:00:00'), (84, 9, '2024-08-12 14:30:00'),
(85, 1, '2024-08-13 09:00:00'), (85, 5, '2024-08-13 09:30:00'),
(86, 2, '2024-08-14 10:00:00'), (86, 8, '2024-08-14 10:30:00'),
(87, 6, '2024-08-15 11:00:00'), (87, 10, '2024-08-15 11:30:00'),
(88, 3, '2024-08-16 14:00:00'), (88, 7, '2024-08-16 14:30:00'),
(89, 1, '2024-08-17 09:00:00'), (89, 4, '2024-08-17 09:30:00'),
(90, 5, '2024-08-18 10:00:00'), (90, 9, '2024-08-18 10:30:00'),
(91, 3, '2024-08-10 09:00:00'), (91, 6, '2024-08-10 09:30:00'), (91, 10, '2024-08-15 14:00:00'),
(92, 1, '2024-08-11 10:00:00'), (92, 7, '2024-08-11 10:30:00'),
(93, 2, '2024-08-12 11:00:00'), (93, 8, '2024-08-12 11:30:00'),
(94, 4, '2024-08-13 14:00:00'), (94, 9, '2024-08-13 14:30:00'),
(95, 5, '2024-08-14 09:00:00'), (95, 10, '2024-08-14 09:30:00'),
(96, 1, '2024-08-15 10:00:00'), (96, 3, '2024-08-15 10:30:00'),
(97, 2, '2024-08-16 11:00:00'), (97, 6, '2024-08-16 11:30:00'),
(98, 4, '2024-08-17 14:00:00'), (98, 7, '2024-08-17 14:30:00'),
(99, 1, '2024-08-10 09:00:00'), (99, 3, '2024-08-10 09:30:00'), (99, 7, '2024-08-15 14:00:00'),
(100, 5, '2024-08-11 10:00:00'), (100, 8, '2024-08-11 10:30:00'),
(101, 2, '2024-08-12 11:00:00'), (101, 9, '2024-08-12 11:30:00'),
(102, 4, '2024-08-13 14:00:00'), (102, 6, '2024-08-13 14:30:00'),
(103, 1, '2024-08-14 09:00:00'), (103, 10, '2024-08-14 09:30:00'),
(104, 3, '2024-08-15 10:00:00'), (104, 7, '2024-08-15 10:30:00'),
(105, 5, '2024-08-16 11:00:00'), (105, 8, '2024-08-16 11:30:00'),
(106, 2, '2024-08-10 09:00:00'), (106, 9, '2024-08-10 09:30:00'),
(107, 4, '2024-08-11 10:00:00'), (107, 6, '2024-08-11 10:30:00'),
(108, 1, '2024-08-12 11:00:00'), (108, 3, '2024-08-12 11:30:00'),
(109, 5, '2024-08-13 14:00:00'), (109, 7, '2024-08-13 14:30:00'),
(110, 8, '2024-08-14 09:00:00'), (110, 10, '2024-08-14 09:30:00'),
(111, 2, '2024-08-15 10:00:00'), (111, 9, '2024-08-15 10:30:00');


-- ============================================================
-- Update view_count for ALL products
-- ============================================================
UPDATE products p
SET view_count = (
    SELECT COUNT(*)
    FROM product_views pv
    WHERE pv.product_id = p.product_id
);


-- ============================================================
-- Verification
-- ============================================================
SELECT 'Additional products loaded!' AS status;
SELECT 'Total Products:' AS entity, COUNT(*) AS count FROM products
UNION ALL SELECT 'Total Reviews:', COUNT(*) FROM reviews
UNION ALL SELECT 'Total Views:', COUNT(*) FROM product_views;

