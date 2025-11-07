-- Insert sample products into the database
-- Run this in your PostgreSQL database

INSERT INTO products (id, name, description, price, stock, category, image_url, created_at, updated_at) VALUES
('650e8400-e29b-41d4-a716-446655440001', 'Fresh Apples', 'Crisp and juicy red apples', 1.99, 100, 'Fruits', 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb', NOW(), NOW()),
('650e8400-e29b-41d4-a716-446655440002', 'Organic Bananas', 'Fresh organic bananas', 0.89, 150, 'Fruits', 'https://images.unsplash.com/photo-1603833665858-e61d17a86224', NOW(), NOW()),
('650e8400-e29b-41d4-a716-446655440003', 'Fresh Milk', 'Whole milk 1 gallon', 3.49, 50, 'Dairy', 'https://images.unsplash.com/photo-1550583724-b2692b85b150', NOW(), NOW()),
('650e8400-e29b-41d4-a716-446655440004', 'White Bread', 'Freshly baked white bread', 2.29, 75, 'Bakery', 'https://images.unsplash.com/photo-1509440159596-0249088772ff', NOW(), NOW()),
('650e8400-e29b-41d4-a716-446655440005', 'Cheddar Cheese', 'Sharp cheddar cheese block', 4.99, 40, 'Dairy', 'https://images.unsplash.com/photo-1618164436241-4473940d1f5c', NOW(), NOW()),
('650e8400-e29b-41d4-a716-446655440006', 'Orange Juice', 'Fresh squeezed orange juice', 4.29, 60, 'Beverages', 'https://images.unsplash.com/photo-1600271886742-f049cd451bba', NOW(), NOW()),
('650e8400-e29b-41d4-a716-446655440007', 'Chicken Breast', 'Fresh chicken breast per lb', 6.99, 30, 'Meat', 'https://images.unsplash.com/photo-1604503468506-a8da13d82791', NOW(), NOW()),
('650e8400-e29b-41d4-a716-446655440008', 'Brown Eggs', 'Farm fresh brown eggs (dozen)', 3.99, 80, 'Dairy', 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f', NOW(), NOW()),
('650e8400-e29b-41d4-a716-446655440009', 'Tomatoes', 'Fresh vine tomatoes per lb', 2.49, 90, 'Vegetables', 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea', NOW(), NOW()),
('650e8400-e29b-41d4-a716-446655440010', 'Carrots', 'Fresh carrots bunch', 1.79, 120, 'Vegetables', 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37', NOW(), NOW());
