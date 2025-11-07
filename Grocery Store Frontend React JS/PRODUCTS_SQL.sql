-- SQL Script to Insert Grocery Store Products with Proper Images
-- Database: grocery_store
-- Table: products

-- Create products table if not exists
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(100) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Clear existing products (optional)
-- TRUNCATE TABLE products;

-- Insert Electronics
INSERT INTO products (id, name, description, price, category, stock, image_url) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Smartphone', 'Latest Android smartphone with 128GB storage and 8GB RAM', 299.99, 'Electronics', 50, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80'),
('550e8400-e29b-41d4-a716-446655440002', 'Wireless Headphones', 'Premium noise-canceling wireless headphones with 30hr battery', 89.99, 'Electronics', 75, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'),
('550e8400-e29b-41d4-a716-446655440003', 'Laptop', 'High-performance laptop with 16GB RAM and 512GB SSD', 899.99, 'Electronics', 30, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80'),
('550e8400-e29b-41d4-a716-446655440004', 'Smart Watch', 'Fitness tracking smartwatch with heart rate monitor', 199.99, 'Electronics', 60, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80'),
('550e8400-e29b-41d4-a716-446655440005', 'Bluetooth Speaker', 'Portable waterproof Bluetooth speaker with deep bass', 49.99, 'Electronics', 100, 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80');

-- Insert Fashion
INSERT INTO products (id, name, description, price, category, stock, image_url) VALUES
('550e8400-e29b-41d4-a716-446655440010', 'Cotton T-Shirt', 'Comfortable 100% cotton t-shirt in multiple colors', 19.99, 'Fashion', 200, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80'),
('550e8400-e29b-41d4-a716-446655440011', 'Denim Jeans', 'Classic blue denim jeans with perfect fit', 49.99, 'Fashion', 150, 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=800&q=80'),
('550e8400-e29b-41d4-a716-446655440012', 'Leather Jacket', 'Genuine leather jacket for style and comfort', 199.99, 'Fashion', 40, 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80'),
('550e8400-e29b-41d4-a716-446655440013', 'Summer Dress', 'Floral printed summer dress for women', 39.99, 'Fashion', 80, 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80'),
('550e8400-e29b-41d4-a716-446655440014', 'Running Shoes', 'Comfortable sports shoes for running and gym', 79.99, 'Fashion', 120, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80');

-- Insert Fruits
INSERT INTO products (id, name, description, price, category, stock, image_url) VALUES
('550e8400-e29b-41d4-a716-446655440020', 'Fresh Apples', 'Crispy red apples - 1kg pack', 4.99, 'Fruits', 500, 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=800&q=80'),
('550e8400-e29b-41d4-a716-446655440021', 'Bananas', 'Fresh yellow bananas - 1 dozen', 2.99, 'Fruits', 600, 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?auto=format&fit=crop&w=800&q=80'),
('550e8400-e29b-41d4-a716-446655440022', 'Oranges', 'Juicy oranges - 1kg pack', 5.99, 'Fruits', 400, 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?auto=format&fit=crop&w=800&q=80'),
('550e8400-e29b-41d4-a716-446655440023', 'Strawberries', 'Fresh strawberries - 500g pack', 6.99, 'Fruits', 200, 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=800&q=80'),
('550e8400-e29b-41d4-a716-446655440024', 'Grapes', 'Seedless green grapes - 500g pack', 7.99, 'Fruits', 300, 'https://images.unsplash.com/photo-1599819177303-037f51ce1ece?auto=format&fit=crop&w=800&q=80'),
('550e8400-e29b-41d4-a716-446655440025', 'Watermelon', 'Sweet and juicy watermelon - whole', 8.99, 'Fruits', 100, 'https://images.unsplash.com/photo-1589984662646-e7b2e4962f18?auto=format&fit=crop&w=800&q=80');

-- Insert Vegetables
INSERT INTO products (id, name, description, price, category, stock, image_url) VALUES
('550e8400-e29b-41d4-a716-446655440030', 'Fresh Tomatoes', 'Organic red tomatoes - 1kg', 3.99, 'Vegetables', 500, 'https://images.unsplash.com/photo-1546470427-227b9e0b82a0?auto=format&fit=crop&w=800&q=80'),
('550e8400-e29b-41d4-a716-446655440031', 'Onions', 'Fresh onions - 1kg pack', 2.49, 'Vegetables', 700, 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=800&q=80'),
('550e8400-e29b-41d4-a716-446655440032', 'Potatoes', 'Farm fresh potatoes - 2kg', 4.99, 'Vegetables', 800, 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80'),
('550e8400-e29b-41d4-a716-446655440033', 'Carrots', 'Organic carrots - 1kg pack', 3.49, 'Vegetables', 400, 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=800&q=80'),
('550e8400-e29b-41d4-a716-446655440034', 'Bell Peppers', 'Colorful bell peppers mix - 500g', 5.99, 'Vegetables', 300, 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=800&q=80'),
('550e8400-e29b-41d4-a716-446655440035', 'Broccoli', 'Fresh green broccoli - 500g', 4.49, 'Vegetables', 250, 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?auto=format&fit=crop&w=800&q=80');

-- Insert Dairy Products
INSERT INTO products (id, name, description, price, category, stock, image_url) VALUES
('550e8400-e29b-41d4-a716-446655440040', 'Whole Milk', 'Fresh whole milk - 1 liter', 2.99, 'Dairy', 300, 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=800&q=80'),
('550e8400-e29b-41d4-a716-446655440041', 'Greek Yogurt', 'Creamy Greek yogurt - 500g', 4.99, 'Dairy', 200, 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=800&q=80'),
('550e8400-e29b-41d4-a716-446655440042', 'Cheddar Cheese', 'Aged cheddar cheese - 250g', 6.99, 'Dairy', 150, 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=800&q=80'),
('550e8400-e29b-41d4-a716-446655440043', 'Butter', 'Unsalted butter - 200g', 3.99, 'Dairy', 400, 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=800&q=80'),
('550e8400-e29b-41d4-a716-446655440044', 'Fresh Cream', 'Heavy cream - 250ml', 4.49, 'Dairy', 180, 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=800&q=80');

-- Insert Snacks
INSERT INTO products (id, name, description, price, category, stock, image_url) VALUES
('550e8400-e29b-41d4-a716-446655440050', 'Potato Chips', 'Crispy salted potato chips - 200g', 3.99, 'Snacks', 500, 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=800&q=80'),
('550e8400-e29b-41d4-a716-446655440051', 'Chocolate Bar', 'Premium milk chocolate - 100g', 2.99, 'Snacks', 600, 'https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&w=800&q=80'),
('550e8400-e29b-41d4-a716-446655440052', 'Mixed Nuts', 'Roasted and salted mixed nuts - 250g', 8.99, 'Snacks', 300, 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=800&q=80'),
('550e8400-e29b-41d4-a716-446655440053', 'Cookies', 'Chocolate chip cookies - 300g pack', 5.99, 'Snacks', 400, 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=800&q=80'),
('550e8400-e29b-41d4-a716-446655440054', 'Popcorn', 'Ready-to-eat butter popcorn - 150g', 4.49, 'Snacks', 350, 'https://images.unsplash.com/photo-1613984370701-527d5ea04fa5?auto=format&fit=crop&w=800&q=80');

-- Insert Beverages
INSERT INTO products (id, name, description, price, category, stock, image_url) VALUES
('550e8400-e29b-41d4-a716-446655440060', 'Orange Juice', 'Fresh squeezed orange juice - 1 liter', 5.99, 'Beverages', 200, 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=800&q=80'),
('550e8400-e29b-41d4-a716-446655440061', 'Cola', 'Carbonated cola drink - 2 liter', 3.49, 'Beverages', 500, 'https://images.unsplash.com/photo-1581006852262-e4307cf6283a?auto=format&fit=crop&w=800&q=80'),
('550e8400-e29b-41d4-a716-446655440062', 'Green Tea', 'Organic green tea bags - 25 count', 6.99, 'Beverages', 300, 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?auto=format&fit=crop&w=800&q=80'),
('550e8400-e29b-41d4-a716-446655440063', 'Coffee Beans', 'Premium roasted coffee beans - 500g', 12.99, 'Beverages', 150, 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=800&q=80'),
('550e8400-e29b-41d4-a716-446655440064', 'Mineral Water', 'Natural mineral water - 6x1L pack', 7.99, 'Beverages', 400, 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&w=800&q=80');

-- Insert Home Appliances
INSERT INTO products (id, name, description, price, category, stock, image_url) VALUES
('550e8400-e29b-41d4-a716-446655440070', 'Electric Kettle', '1.7L stainless steel electric kettle', 29.99, 'Home Appliances', 100, 'https://images.unsplash.com/photo-1563465697-752a7d8e9c73?auto=format&fit=crop&w=800&q=80'),
('550e8400-e29b-41d4-a716-446655440071', 'Toaster', '4-slice toaster with browning control', 39.99, 'Home Appliances', 80, 'https://images.unsplash.com/photo-1588613254813-a7a20d7c9a81?auto=format&fit=crop&w=800&q=80'),
('550e8400-e29b-41d4-a716-446655440072', 'Blender', '1000W high-speed blender', 79.99, 'Home Appliances', 60, 'https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=800&q=80'),
('550e8400-e29b-41d4-a716-446655440073', 'Microwave Oven', '25L microwave oven with grill', 149.99, 'Home Appliances', 40, 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?auto=format&fit=crop&w=800&q=80'),
('550e8400-e29b-41d4-a716-446655440074', 'Vacuum Cleaner', 'Bagless vacuum cleaner with HEPA filter', 199.99, 'Home Appliances', 50, 'https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=800&q=80');

-- Insert Bakery Items
INSERT INTO products (id, name, description, price, category, stock, image_url) VALUES
('550e8400-e29b-41d4-a716-446655440080', 'White Bread', 'Fresh white bread loaf - 500g', 2.99, 'Bakery', 300, 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80'),
('550e8400-e29b-41d4-a716-446655440081', 'Croissants', 'Butter croissants - 6 pack', 5.99, 'Bakery', 200, 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80'),
('550e8400-e29b-41d4-a716-446655440082', 'Bagels', 'Plain bagels - 6 pack', 4.99, 'Bakery', 250, 'https://images.unsplash.com/photo-1551106652-a5bcf4b29e84?auto=format&fit=crop&w=800&q=80'),
('550e8400-e29b-41d4-a716-446655440083', 'Donuts', 'Assorted glazed donuts - 12 pack', 8.99, 'Bakery', 150, 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=800&q=80'),
('550e8400-e29b-41d4-a716-446655440084', 'Muffins', 'Blueberry muffins - 4 pack', 6.99, 'Bakery', 180, 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?auto=format&fit=crop&w=800&q=80');

-- Insert Frozen Foods
INSERT INTO products (id, name, description, price, category, stock, image_url) VALUES
('550e8400-e29b-41d4-a716-446655440090', 'Frozen Pizza', 'Margherita frozen pizza - 400g', 7.99, 'Frozen', 200, 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80'),
('550e8400-e29b-41d4-a716-446655440091', 'Ice Cream', 'Vanilla ice cream tub - 1L', 6.99, 'Frozen', 300, 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?auto=format&fit=crop&w=800&q=80'),
('550e8400-e29b-41d4-a716-446655440092', 'Frozen Vegetables', 'Mixed frozen vegetables - 1kg', 5.99, 'Frozen', 250, 'https://images.unsplash.com/photo-1566622456-c86cf6eec7c3?auto=format&fit=crop&w=800&q=80'),
('550e8400-e29b-41d4-a716-446655440093', 'Chicken Nuggets', 'Crispy chicken nuggets - 500g', 8.99, 'Frozen', 180, 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=800&q=80'),
('550e8400-e29b-41d4-a716-446655440094', 'French Fries', 'Crinkle cut fries - 1kg', 4.99, 'Frozen', 400, 'https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&w=800&q=80');

-- Create index for better performance
CREATE INDEX idx_category ON products(category);
CREATE INDEX idx_name ON products(name);
CREATE INDEX idx_price ON products(price);

-- Note: To update the image_url column for existing products:
-- UPDATE products SET image_url = 'new-url-here' WHERE id = 'product-id';
