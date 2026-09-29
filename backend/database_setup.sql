-- =============================================================
-- Drift & Co. — MySQL Database Setup Script
-- College Project (B.Sc. IT)
--
-- HOW TO USE THIS FILE:
--
--   Option A — From the MySQL command line:
--     mysql -u root -p < backend/database_setup.sql
--
--   Option B — From inside the MySQL client:
--     mysql -u root -p
--     SOURCE backend/database_setup.sql;
--
--   Option C — In MySQL Workbench:
--     Open this file and click the lightning icon to execute.
--
-- This script is idempotent: running it more than once will NOT
-- destroy existing data (it uses CREATE DATABASE IF NOT EXISTS
-- and INSERT ... ON DUPLICATE KEY UPDATE / IGNORE).
-- =============================================================

-- -------------------------------------------------------------
-- 1. CREATE THE DATABASE
-- -------------------------------------------------------------
CREATE DATABASE IF NOT EXISTS `drift_and_co`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `drift_and_co`;

-- -------------------------------------------------------------
-- 2. CREATE TABLES
-- -------------------------------------------------------------

-- ---- users ----
CREATE TABLE IF NOT EXISTS `users` (
  `id`        INT AUTO_INCREMENT PRIMARY KEY,
  `name`      VARCHAR(100)  NOT NULL,
  `email`     VARCHAR(200)  NOT NULL UNIQUE,
  `password`  VARCHAR(255)  NOT NULL,           -- bcrypt hash
  `role`      VARCHAR(20)   NOT NULL DEFAULT 'user',  -- 'user' or 'admin'
  `joined`    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_users_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---- categories ----
CREATE TABLE IF NOT EXISTS `categories` (
  `id`     INT AUTO_INCREMENT PRIMARY KEY,
  `name`   VARCHAR(100) NOT NULL UNIQUE,
  `gender` VARCHAR(20)  NOT NULL,               -- 'men', 'women', 'kids'
  INDEX `idx_categories_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---- products ----
CREATE TABLE IF NOT EXISTS `products` (
  `id`           INT AUTO_INCREMENT PRIMARY KEY,
  `name`         VARCHAR(200) NOT NULL,
  `price`        INT          NOT NULL,          -- INR (₹)
  `category_id`  INT          NOT NULL,
  `gender`       VARCHAR(20)  NOT NULL,          -- 'men', 'women', 'kids'
  `image`        TEXT         NOT NULL,
  `description`  TEXT         NOT NULL,
  `sizes`        TEXT         NOT NULL,          -- comma-separated: "S,M,L,XL"
  `colors`       TEXT         NOT NULL,          -- comma-separated: "Black,White"
  `rating`       FLOAT        NOT NULL DEFAULT 0.0,
  `review_count` INT          NOT NULL DEFAULT 0,
  `trending`     BOOLEAN      NOT NULL DEFAULT FALSE,
  `new_arrival`  BOOLEAN      NOT NULL DEFAULT FALSE,
  `stock`        INT          NOT NULL DEFAULT 0,
  CONSTRAINT `fk_products_category` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`),
  INDEX `idx_products_name`   (`name`),
  INDEX `idx_products_gender` (`gender`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---- cart ----
CREATE TABLE IF NOT EXISTS `cart` (
  `id`      INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL UNIQUE,
  CONSTRAINT `fk_cart_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---- cart_items ----
CREATE TABLE IF NOT EXISTS `cart_items` (
  `id`             INT AUTO_INCREMENT PRIMARY KEY,
  `cart_id`        INT          NOT NULL,
  `product_id`     INT          NOT NULL,
  `quantity`       INT          NOT NULL DEFAULT 1,
  `selected_size`  VARCHAR(20)  NOT NULL,
  `selected_color` VARCHAR(50)  NOT NULL,
  CONSTRAINT `fk_cartitems_cart`    FOREIGN KEY (`cart_id`)    REFERENCES `cart`(`id`)       ON DELETE CASCADE,
  CONSTRAINT `fk_cartitems_product` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---- orders ----
CREATE TABLE IF NOT EXISTS `orders` (
  `id`               VARCHAR(50)  PRIMARY KEY,   -- e.g. "ORD-1695000000-1"
  `user_id`          INT          NOT NULL,
  `total`            INT          NOT NULL,       -- INR (₹)
  `date`             DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status`           VARCHAR(20)  NOT NULL DEFAULT 'Pending',
  `customer_name`    VARCHAR(100) NOT NULL,
  `customer_email`   VARCHAR(200) NOT NULL,
  `customer_phone`   VARCHAR(20)  NOT NULL,
  `customer_address` TEXT         NOT NULL,
  `customer_city`    VARCHAR(100) NOT NULL,
  `customer_state`   VARCHAR(100) NOT NULL,
  `customer_pincode` VARCHAR(20)  NOT NULL,
  `customer_country` VARCHAR(50)  NOT NULL DEFAULT 'India',
  CONSTRAINT `fk_orders_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`),
  INDEX `idx_orders_user_id` (`user_id`),
  INDEX `idx_orders_status`  (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---- order_items ----
CREATE TABLE IF NOT EXISTS `order_items` (
  `id`         INT AUTO_INCREMENT PRIMARY KEY,
  `order_id`   VARCHAR(50)  NOT NULL,
  `product_id` INT          NOT NULL,
  `name`       VARCHAR(200) NOT NULL,
  `price`      INT          NOT NULL,            -- INR (₹)
  `quantity`   INT          NOT NULL,
  `size`       VARCHAR(20)  NOT NULL,
  `color`      VARCHAR(50)  NOT NULL,
  `image`      TEXT         NOT NULL,
  CONSTRAINT `fk_orderitems_order`   FOREIGN KEY (`order_id`)   REFERENCES `orders`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_orderitems_product` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---- reviews ----
CREATE TABLE IF NOT EXISTS `reviews` (
  `id`         INT AUTO_INCREMENT PRIMARY KEY,
  `product_id` INT          NOT NULL,
  `user_id`    INT           NULL,               -- nullable for guest reviews
  `author`     VARCHAR(100)  NOT NULL,
  `rating`     INT          NOT NULL,            -- 1 to 5
  `date`       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `comment`    TEXT         NOT NULL,
  CONSTRAINT `fk_reviews_product` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_reviews_user`    FOREIGN KEY (`user_id`)    REFERENCES `users`(`id`)     ON DELETE SET NULL,
  INDEX `idx_reviews_product_id` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------
-- 3. INSERT SAMPLE USERS
--    Passwords are bcrypt hashes of:
--      admin@driftandco.com  →  admin123
--      rahul@example.com     →  pass123
-- -------------------------------------------------------------
INSERT INTO `users` (`name`, `email`, `password`, `role`) VALUES
  ('Admin',         'admin@driftandco.com', '$2b$12$uek9eMVVzOizRmHDEFW0EuCk6kYrekrUFd3hPu2E1cRiDuc61XoGy', 'admin'),
  ('Rahul Sharma',  'rahul@example.com',    '$2b$12$oUNbr9oefTCBcDe5nH8Lc.7lpz/1tKAlMBESDz95oID83pHb1H70G', 'user')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- -------------------------------------------------------------
-- 4. INSERT SAMPLE CATEGORIES
-- -------------------------------------------------------------
INSERT IGNORE INTO `categories` (`name`, `gender`) VALUES
  ('T-Shirts',    'men'),
  ('Sweaters',    'men'),
  ('Jackets',     'men'),
  ('Kurtas',      'men'),
  ('Shirts',      'men'),
  ('Jeans',       'men'),
  ('Kurtis',      'women'),
  ('Sarees',      'women'),
  ('Dresses',     'women'),
  ('Tops',        'women'),
  ('Jackets',     'women'),
  ('Jeans',       'women'),
  ('Ethnic Wear', 'kids'),
  ('Jackets',     'kids'),
  ('T-Shirts',    'kids'),
  ('Shirts',      'kids'),
  ('Jeans',       'kids');

-- -------------------------------------------------------------
-- 5. INSERT 24 SAMPLE PRODUCTS (8 Men, 8 Women, 8 Kids)
--    Prices in INR (₹). Images from Pexels (free-to-use).
--    NOTE: category_id values reference the categories inserted
--    above. We use a subquery so IDs are always correct regardless
--    of auto-increment offset.
-- -------------------------------------------------------------
INSERT INTO `products`
  (`name`, `price`, `category_id`, `gender`, `image`, `description`, `sizes`, `colors`, `rating`, `review_count`, `trending`, `new_arrival`, `stock`)
VALUES
  -- ---- MEN (8 products) ----
  ('Classic Cotton Round-Neck T-Shirt', 499,
    (SELECT id FROM categories WHERE name='T-Shirts' AND gender='men'),
    'men', 'https://images.pexels.com/photos/1389077/pexels-photo-1389077.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    'Soft combed cotton crew-neck tee in a regular fit. Breathable and comfortable for everyday Indian weather.',
    'S,M,L,XL,XXL', 'Black,White,Navy Blue,Olive', 4.5, 128, TRUE, FALSE, 45),

  ('Premium Turtleneck Sweater', 1299,
    (SELECT id FROM categories WHERE name='Sweaters' AND gender='men'),
    'men', 'https://images.pexels.com/photos/10482937/pexels-photo-10482937.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    'Fine-knit turtleneck sweater ideal for winter layering. Soft-touch fabric with a slim silhouette.',
    'M,L,XL', 'Charcoal,Black,Beige', 4.7, 89, TRUE, TRUE, 30),

  ('Slim-Fit Denim Jacket', 1999,
    (SELECT id FROM categories WHERE name='Jackets' AND gender='men'),
    'men', 'https://images.pexels.com/photos/6764727/pexels-photo-6764727.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    'Classic denim jacket with a tailored slim fit. A versatile wardrobe staple.',
    'M,L,XL', 'Indigo,Black', 4.6, 203, FALSE, TRUE, 22),

  ('Genuine Leather Biker Jacket', 4999,
    (SELECT id FROM categories WHERE name='Jackets' AND gender='men'),
    'men', 'https://images.pexels.com/photos/17783369/pexels-photo-17783369.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    'Full-grain leather biker jacket with quilted shoulders and silver hardware.',
    'M,L,XL', 'Black,Brown', 4.8, 67, TRUE, FALSE, 12),

  ('Embroidered Pathani Kurta Set', 1799,
    (SELECT id FROM categories WHERE name='Kurtas' AND gender='men'),
    'men', 'https://images.pexels.com/photos/15745642/pexels-photo-15745642.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    'Traditional Pathani kurta with churidar in breathable cotton. Subtle embroidery on the placket.',
    '38,40,42,44', 'Off-White,Maroon,Black', 4.9, 45, FALSE, TRUE, 8),

  ('Formal Office Shirt', 899,
    (SELECT id FROM categories WHERE name='Shirts' AND gender='men'),
    'men', 'https://images.pexels.com/photos/21997937/pexels-photo-21997937.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    'Crisp formal shirt in wrinkle-resistant cotton blend. Tailored slim fit with a spread collar.',
    '38,40,42,44', 'White,Sky Blue,Black', 4.4, 34, FALSE, FALSE, 18),

  ('Graphic Print Oversized Tee', 699,
    (SELECT id FROM categories WHERE name='T-Shirts' AND gender='men'),
    'men', 'https://images.pexels.com/photos/1389077/pexels-photo-1389077.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    'Trendy oversized fit tee with a bold graphic print. Drop-shoulder design in 100% cotton.',
    'S,M,L,XL,XXL', 'White,Grey,Black', 4.3, 156, FALSE, TRUE, 60),

  ('Slim-Fit Stretch Jeans', 1499,
    (SELECT id FROM categories WHERE name='Jeans' AND gender='men'),
    'men', 'https://images.pexels.com/photos/6764727/pexels-photo-6764727.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    'Slim-fit jeans with comfortable stretch denim. Mid-rise waist and classic five-pocket styling.',
    '30,32,34,36,38', 'Dark Blue,Black,Grey', 4.5, 98, TRUE, FALSE, 35),

  -- ---- WOMEN (8 products) ----
  ('Anarkali Kurti Set', 1499,
    (SELECT id FROM categories WHERE name='Kurtis' AND gender='women'),
    'women', 'https://images.pexels.com/photos/19674580/pexels-photo-19674580.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    'Flowy Anarkali kurti with palazzo and dupatta set. Lightweight rayon fabric with floral prints.',
    'XS,S,M,L,XL', 'Pink,Teal,Maroon', 4.6, 112, TRUE, TRUE, 40),

  ('Banarasi Silk Saree', 3499,
    (SELECT id FROM categories WHERE name='Sarees' AND gender='women'),
    'women', 'https://images.pexels.com/photos/29850173/pexels-photo-29850173.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    'Elegant Banarasi silk saree with zari border and woven motifs. Comes with an unstitched blouse piece.',
    'Free Size', 'Red,Royal Blue,Green', 4.8, 187, TRUE, FALSE, 25),

  ('Oversized Blazer', 2299,
    (SELECT id FROM categories WHERE name='Jackets' AND gender='women'),
    'women', 'https://images.pexels.com/photos/31674936/pexels-photo-31674936.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    'Oversized blazer with structured shoulders and a relaxed fit. A modern essential.',
    'S,M,L,XL', 'Beige,Black,Grey', 4.7, 76, FALSE, TRUE, 20),

  ('Embroidered Jacket Kurti', 1899,
    (SELECT id FROM categories WHERE name='Kurtis' AND gender='women'),
    'women', 'https://images.pexels.com/photos/22601729/pexels-photo-22601729.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    'Stylish jacket-style kurti with intricate embroidery. A versatile piece for office or evening wear.',
    'S,M,L,XL', 'Black,White,Mustard', 4.5, 54, TRUE, FALSE, 15),

  ('Floral Midi Dress', 1299,
    (SELECT id FROM categories WHERE name='Dresses' AND gender='women'),
    'women', 'https://images.pexels.com/photos/28698706/pexels-photo-28698706.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    'A flowing midi dress in a striking floral print. Lightweight fabric with a flattering A-line cut.',
    'XS,S,M,L', 'Blue,Teal,Coral', 4.6, 143, TRUE, TRUE, 28),

  ('Cozy Knit Co-ord Set', 1699,
    (SELECT id FROM categories WHERE name='Tops' AND gender='women'),
    'women', 'https://images.pexels.com/photos/19220820/pexels-photo-19220820.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    'A cozy knit co-ord set featuring a cropped sweater and matching bottoms.',
    'S,M,L,XL', 'Grey,Cream,Camel', 4.4, 67, FALSE, TRUE, 33),

  ('High-Waist Skinny Jeans', 1399,
    (SELECT id FROM categories WHERE name='Jeans' AND gender='women'),
    'women', 'https://images.pexels.com/photos/31674936/pexels-photo-31674936.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    'High-waist skinny jeans with stretch denim for a comfortable, sculpting fit.',
    '26,28,30,32,34', 'Blue,Black,Light Blue', 4.5, 210, TRUE, FALSE, 50),

  ('Silk-Blend Wrap Top', 1099,
    (SELECT id FROM categories WHERE name='Tops' AND gender='women'),
    'women', 'https://images.pexels.com/photos/19674580/pexels-photo-19674580.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    'Luxurious silk-blend wrap top with adjustable tie closure. Effortlessly elegant.',
    'XS,S,M,L', 'Ivory,Burgundy,Emerald', 4.7, 92, FALSE, TRUE, 26),

  -- ---- KIDS (8 products) ----
  ('Boys'' Sherwani Set', 2499,
    (SELECT id FROM categories WHERE name='Ethnic Wear' AND gender='kids'),
    'kids', 'https://images.pexels.com/photos/30690921/pexels-photo-30690921.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    'A dapper sherwani set for little gentlemen. Includes kurta, churidar, and jacket.',
    '2-3Y,4-5Y,6-7Y,8-9Y', 'Cream,Maroon', 4.6, 45, TRUE, TRUE, 20),

  ('Kids'' Denim Jacket Set', 1099,
    (SELECT id FROM categories WHERE name='Jackets' AND gender='kids'),
    'kids', 'https://images.pexels.com/photos/38778561/pexels-photo-38778561.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    'A fun denim outfit set for kids. Cool, comfortable, and ready for playground adventures.',
    '3-4Y,5-6Y,7-8Y,9-10Y', 'Blue,Light Blue', 4.7, 38, TRUE, FALSE, 30),

  ('Padded Winter Coat', 1599,
    (SELECT id FROM categories WHERE name='Jackets' AND gender='kids'),
    'kids', 'https://images.pexels.com/photos/35078823/pexels-photo-35078823.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    'Warm padded winter coat with a cozy hood. Keeps little ones snug and stylish.',
    '3-4Y,5-6Y,7-8Y,9-10Y', 'Black,Red,Navy', 4.8, 56, FALSE, TRUE, 24),

  ('Nautical Striped T-Shirt Set', 799,
    (SELECT id FROM categories WHERE name='T-Shirts' AND gender='kids'),
    'kids', 'https://images.pexels.com/photos/1620759/pexels-photo-1620759.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    'A charming nautical-themed outfit set. Striped top with matching bottoms.',
    '2-3Y,4-5Y,6-7Y,8-9Y', 'Navy,White,Red', 4.5, 29, TRUE, FALSE, 18),

  ('Girls'' Lehenga Choli', 2199,
    (SELECT id FROM categories WHERE name='Ethnic Wear' AND gender='kids'),
    'kids', 'https://images.pexels.com/photos/34608858/pexels-photo-34608858.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    'A vibrant lehenga choli in soft green with beautiful embellishments.',
    '2-3Y,4-5Y,6-7Y,8-9Y', 'Green,Pink,Yellow', 4.6, 22, FALSE, TRUE, 16),

  ('Boys'' Smart Shirt & Waistcoat', 1199,
    (SELECT id FROM categories WHERE name='Shirts' AND gender='kids'),
    'kids', 'https://images.pexels.com/photos/30690920/pexels-photo-30690920.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    'A smart-casual shirt and waistcoat combo for young trendsetters.',
    '4-5Y,6-7Y,8-9Y,10-11Y', 'Grey,Black,Beige', 4.4, 18, FALSE, TRUE, 14),

  ('Playtime Cotton Tee', 349,
    (SELECT id FROM categories WHERE name='T-Shirts' AND gender='kids'),
    'kids', 'https://images.pexels.com/photos/30690921/pexels-photo-30690921.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    'A soft cotton tee designed for active kids. Breathable fabric and a relaxed fit.',
    '2-3Y,4-5Y,6-7Y,8-9Y,10-11Y', 'Blue,Red,Yellow', 4.3, 67, TRUE, FALSE, 55),

  ('Kids'' Straight-Fit Jeans', 699,
    (SELECT id FROM categories WHERE name='Jeans' AND gender='kids'),
    'kids', 'https://images.pexels.com/photos/38778561/pexels-photo-38778561.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    'Durable straight-fit jeans with an adjustable waistband for growing kids.',
    '4-5Y,6-7Y,8-9Y,10-11Y,12-13Y', 'Blue,Dark Blue', 4.5, 41, FALSE, TRUE, 38);

-- -------------------------------------------------------------
-- 6. INSERT SAMPLE REVIEWS
-- -------------------------------------------------------------
INSERT INTO `reviews` (`product_id`, `author`, `rating`, `comment`) VALUES
  (1,  'Rahul Sharma',  5, 'Perfect fit and the fabric quality is amazing for the price. My new go-to tee for daily wear!'),
  (1,  'Priya Patel',  4, 'Great t-shirt, runs slightly large so size down if you want a snug fit. Cotton is soft.'),
  (2,  'Arjun Mehta',  5, 'The sweater is incredibly soft and looks very premium. Perfect for Delhi winters. Highly recommend.'),
  (3,  'Sneha Reddy',  5, 'Best denim jacket I have owned. The slim fit is exactly what I wanted. Great quality at this price.'),
  (4,  'Vikram Singh', 5, 'The leather quality is outstanding. Worth every rupee — looks better with every wear.'),
  (5,  'Amit Kumar',   5, 'Wore it for Diwali and got so many compliments. The embroidery is beautiful and fabric is comfortable.'),
  (9,  'Ananya Iyer',  5, 'So comfortable and flattering. I get compliments every time I wear it. The print is lovely.'),
  (10, 'Deepika Nair', 5, 'The saree is gorgeous. The zari work is exquisite and it drapes beautifully. Perfect for weddings.'),
  (13, 'Kavya Rao',   4, 'Beautiful dress and flow. Wish it came in more sizes though. Fabric is perfect for summer.'),
  (17, 'Pooja Gupta',  5, 'My son looked so handsome in this sherwani! Great quality for the price. Perfect for the wedding season.'),
  (19, 'Fatima Sheikh',5, 'Keeps my daughter warm and she loves wearing it. The hood is a great touch. Good quality padding.'),
  (21, 'Meera Joshi', 5, 'The lehenga is stunning! Beautiful colours and the embellishments are well done. My daughter loves it.');

-- -------------------------------------------------------------
-- DONE. Verify the data:
--   SELECT COUNT(*) FROM products;   -- should return 24
--   SELECT COUNT(*) FROM reviews;    -- should return 12
--   SELECT COUNT(*) FROM users;      -- should return 2
--   SELECT COUNT(*) FROM categories; -- should return 17
-- -------------------------------------------------------------
