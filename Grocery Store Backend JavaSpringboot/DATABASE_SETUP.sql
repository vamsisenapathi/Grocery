-- ================================================
-- GROCERY STORE BACKEND - DATABASE SETUP
-- ================================================
-- Database: PostgreSQL 18.0
-- Schema: public
-- ================================================

-- ================================================
-- 1. CREATE TABLES (Already created by JPA)
-- ================================================
-- Tables are auto-created by Spring Boot JPA
-- Run this only if you need to manually create tables

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(100) NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    image_url TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Cart table
CREATE TABLE IF NOT EXISTS cart (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_cart_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Cart Items table
CREATE TABLE IF NOT EXISTS cart_item (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cart_id UUID NOT NULL,
    product_id UUID NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    price_at_add DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_cart_item_cart FOREIGN KEY (cart_id) REFERENCES cart(id) ON DELETE CASCADE,
    CONSTRAINT fk_cart_item_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- ================================================
-- 2. INSERT SAMPLE USERS
-- ================================================
-- Note: Passwords are BCrypt hashed version of "password123"

INSERT INTO users (id, name, email, password, phone_number) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'John Doe', 'john.doe@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '+1234567890'),
('550e8400-e29b-41d4-a716-446655440002', 'Jane Smith', 'jane.smith@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '+1234567891'),
('550e8400-e29b-41d4-a716-446655440003', 'Admin User', 'admin@grocerystore.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '+1234567892')
ON CONFLICT (email) DO NOTHING;

-- ================================================
-- 3. INSERT SAMPLE PRODUCTS
-- ================================================

-- Fruits
INSERT INTO products (id, name, description, price, category, stock, image_url) VALUES
('650e8400-e29b-41d4-a716-446655440001', 'Fresh Red Apples', 'Crisp and sweet red apples, perfect for snacking', 1.99, 'Fruits', 150, 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6'),
('650e8400-e29b-41d4-a716-446655440002', 'Ripe Bananas', 'Fresh yellow bananas rich in potassium', 0.99, 'Fruits', 200, 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e'),
('650e8400-e29b-41d4-a716-446655440003', 'Juicy Oranges', 'Sweet and tangy oranges packed with vitamin C', 2.49, 'Fruits', 120, 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9'),
('650e8400-e29b-41d4-a716-446655440004', 'Fresh Strawberries', 'Sweet and fresh strawberries', 3.99, 'Fruits', 80, 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6'),
('650e8400-e29b-41d4-a716-446655440005', 'Seedless Grapes', 'Fresh green seedless grapes', 4.49, 'Fruits', 100, 'https://images.unsplash.com/photo-1599819177818-6f3c8b6d4b02')
ON CONFLICT (id) DO NOTHING;

-- Vegetables
INSERT INTO products (id, name, description, price, category, stock, image_url) VALUES
('650e8400-e29b-41d4-a716-446655440006', 'Fresh Tomatoes', 'Ripe red tomatoes perfect for salads and cooking', 1.49, 'Vegetables', 180, 'https://images.unsplash.com/photo-1546470427-227c50e98fc9'),
('650e8400-e29b-41d4-a716-446655440007', 'Green Cucumbers', 'Crisp and fresh cucumbers', 0.89, 'Vegetables', 160, 'https://images.unsplash.com/photo-1568584711271-3e185b8b9e0a'),
('650e8400-e29b-41d4-a716-446655440008', 'Fresh Carrots', 'Organic carrots rich in beta-carotene', 1.29, 'Vegetables', 140, 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37'),
('650e8400-e29b-41d4-a716-446655440009', 'Green Broccoli', 'Fresh broccoli florets', 2.29, 'Vegetables', 90, 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc'),
('650e8400-e29b-41d4-a716-446655440010', 'Fresh Spinach', 'Organic fresh spinach leaves', 1.79, 'Vegetables', 110, 'https://images.unsplash.com/photo-1576045057995-568f588f82fb')
ON CONFLICT (id) DO NOTHING;

-- Dairy
INSERT INTO products (id, name, description, price, category, stock, image_url) VALUES
('650e8400-e29b-41d4-a716-446655440011', 'Fresh Milk', 'Whole milk 1 gallon', 3.99, 'Dairy', 120, 'https://images.unsplash.com/photo-1563636619-e9143da7973b'),
('650e8400-e29b-41d4-a716-446655440012', 'Greek Yogurt', 'Plain Greek yogurt 500g', 4.49, 'Dairy', 85, 'https://images.unsplash.com/photo-1488477181946-6428a0291777'),
('650e8400-e29b-41d4-a716-446655440013', 'Cheddar Cheese', 'Sharp cheddar cheese block', 5.99, 'Dairy', 70, 'https://images.unsplash.com/photo-1452195100486-9cc805987862'),
('650e8400-e29b-41d4-a716-446655440014', 'Fresh Butter', 'Salted butter 250g', 3.49, 'Dairy', 95, 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d'),
('650e8400-e29b-41d4-a716-446655440015', 'Farm Eggs', 'Free-range eggs (12 count)', 4.29, 'Dairy', 130, 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f')
ON CONFLICT (id) DO NOTHING;

-- Bakery
INSERT INTO products (id, name, description, price, category, stock, image_url) VALUES
('650e8400-e29b-41d4-a716-446655440016', 'Whole Wheat Bread', 'Fresh whole wheat bread loaf', 2.99, 'Bakery', 100, 'https://images.unsplash.com/photo-1509440159596-0249088772ff'),
('650e8400-e29b-41d4-a716-446655440017', 'Croissants', 'Butter croissants (6 pack)', 5.49, 'Bakery', 60, 'https://images.unsplash.com/photo-1555507036-ab1f4038808a'),
('650e8400-e29b-41d4-a716-446655440018', 'Bagels', 'Plain bagels (6 pack)', 3.99, 'Bakery', 75, 'https://images.unsplash.com/photo-1555507036-ab1f4038808a'),
('650e8400-e29b-41d4-a716-446655440019', 'Chocolate Muffins', 'Fresh chocolate muffins (4 pack)', 4.99, 'Bakery', 55, 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa'),
('650e8400-e29b-41d4-a716-446655440020', 'Dinner Rolls', 'Soft dinner rolls (12 pack)', 3.49, 'Bakery', 80, 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73')
ON CONFLICT (id) DO NOTHING;

-- Beverages
INSERT INTO products (id, name, description, price, category, stock, image_url) VALUES
('650e8400-e29b-41d4-a716-446655440021', 'Orange Juice', 'Fresh squeezed orange juice 1L', 4.99, 'Beverages', 90, 'https://images.unsplash.com/photo-1600271886742-f049cd451bba'),
('650e8400-e29b-41d4-a716-446655440022', 'Green Tea', 'Organic green tea (20 bags)', 3.99, 'Beverages', 110, 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9'),
('650e8400-e29b-41d4-a716-446655440023', 'Coffee Beans', 'Premium roasted coffee beans 500g', 8.99, 'Beverages', 65, 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e'),
('650e8400-e29b-41d4-a716-446655440024', 'Mineral Water', 'Natural mineral water (6 bottles)', 5.49, 'Beverages', 150, 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d'),
('650e8400-e29b-41d4-a716-446655440025', 'Apple Cider', 'Fresh apple cider 1L', 5.99, 'Beverages', 70, 'https://images.unsplash.com/photo-1570831739435-6601aa3fa4fb')
ON CONFLICT (id) DO NOTHING;

-- Snacks
INSERT INTO products (id, name, description, price, category, stock, image_url) VALUES
('650e8400-e29b-41d4-a716-446655440026', 'Potato Chips', 'Classic salted potato chips', 2.49, 'Snacks', 120, 'https://images.unsplash.com/photo-1566478989037-eec170784d0b'),
('650e8400-e29b-41d4-a716-446655440027', 'Mixed Nuts', 'Roasted mixed nuts 300g', 6.99, 'Snacks', 85, 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32'),
('650e8400-e29b-41d4-a716-446655440028', 'Granola Bars', 'Oat and honey granola bars (6 pack)', 4.49, 'Snacks', 95, 'https://images.unsplash.com/photo-1521778467873-fcb3a3d35e1a'),
('650e8400-e29b-41d4-a716-446655440029', 'Dark Chocolate', 'Premium dark chocolate bar 100g', 3.99, 'Snacks', 110, 'https://images.unsplash.com/photo-1481391319762-47dff72954d9'),
('650e8400-e29b-41d4-a716-446655440030', 'Popcorn', 'Butter flavored microwave popcorn (3 pack)', 3.49, 'Snacks', 130, 'https://images.unsplash.com/photo-1578849278619-e73505e9610f')
ON CONFLICT (id) DO NOTHING;

-- ================================================
-- 4. VERIFY DATA
-- ================================================

-- Check users
SELECT COUNT(*) as total_users FROM users;

-- Check products by category
SELECT category, COUNT(*) as product_count, AVG(price) as avg_price 
FROM products 
GROUP BY category 
ORDER BY category;

-- Check total products
SELECT COUNT(*) as total_products FROM products;

-- ================================================
-- 5. USEFUL QUERIES FOR TESTING
-- ================================================

-- Get all products with stock > 100
SELECT name, category, price, stock 
FROM products 
WHERE stock > 100 
ORDER BY category, name;

-- Get user by email (for login testing)
SELECT id, name, email, phone_number 
FROM users 
WHERE email = 'john.doe@example.com';

-- Get all products in Fruits category
SELECT * FROM products 
WHERE category = 'Fruits' 
ORDER BY price;

-- Clear all cart data (useful for testing)
-- DELETE FROM cart_item;
-- DELETE FROM cart;

-- ================================================
-- 6. SAMPLE CART DATA (Optional for testing)
-- ================================================

-- Create a cart for John Doe
INSERT INTO cart (id, user_id) VALUES
('750e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001')
ON CONFLICT (id) DO NOTHING;

-- Add items to John's cart
INSERT INTO cart_item (id, cart_id, product_id, quantity, price_at_add) VALUES
('850e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440001', 3, 1.99),
('850e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440006', 2, 1.49),
('850e8400-e29b-41d4-a716-446655440003', '750e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440011', 1, 3.99)
ON CONFLICT (id) DO NOTHING;

-- ================================================
-- NOTES:
-- ================================================
-- 1. All UUIDs are pre-generated for consistency
-- 2. Password for all test users: "password123"
-- 3. BCrypt hash: $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
-- 4. Use ON CONFLICT DO NOTHING to safely re-run inserts
-- 5. Image URLs are placeholder Unsplash images
-- 6. Categories: Fruits, Vegetables, Dairy, Bakery, Beverages, Snacks
-- ================================================
