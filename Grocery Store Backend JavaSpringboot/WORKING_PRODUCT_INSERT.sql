-- Insert 784 new products to reach 801 total products
-- This script uses proper UUID generation and timestamps

-- Category and Subcategory IDs from database:
-- Fruits & Vegetables: 29fc893a-ba90-43a9-bcfe-30e59433844b
--   Fresh Fruits: 0276104e-1413-454b-9936-2f90040f2844
--   Fresh Vegetables: 125746d6-5f99-4809-a658-4e9d830eebf8
-- Dairy & Bakery: 016043e9-7d65-43e1-a1c4-c0510d37bdb8
--   Milk & Cream: 1713ba04-9317-4dfc-af4d-df4872da0bdf
--   Bread & Pav: 792b34fc-59d3-4fe3-a15f-da99fd640e21
-- Snacks & Beverages: 6096240d-5a08-4b9d-9e2c-71c634fee065
-- Personal Care: 62556c79-3ce8-4e43-9b84-1443919138bc
-- Household Items: cdbae0d0-d38d-4aa0-84c9-18a8d41b634d

-- Brand IDs:
-- Amul: a0dbb50e-4f69-4d2a-a188-9b9e32525e09
-- Haldiram's: 1a845e67-8d65-4763-9237-d9d4020b1b11

-- Section 1: Fruits & Vegetables (200 products - 100 fruits + 100 vegetables)

DO $$
DECLARE
    v_category_id UUID := '29fc893a-ba90-43a9-bcfe-30e59433844b';
    v_fruit_subcat UUID := '0276104e-1413-454b-9936-2f90040f2844';
    v_veg_subcat UUID := '125746d6-5f99-4809-a658-4e9d830eebf8';
    counter INT := 0;
    
    fruit_types TEXT[][] := ARRAY[
        ['Apple', 'Royal Gala', 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb'],
        ['Apple', 'Shimla', 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6'],
        ['Apple', 'Fuji', 'https://images.unsplash.com/photo-1619546813926-a78fa6372cd2'],
        ['Apple', 'Green', 'https://images.unsplash.com/photo-1619182522983-0a5be4eb5cbb'],
        ['Orange', 'Valencia', 'https://images.unsplash.com/photo-1547514701-42782101795e'],
        ['Orange', 'Nagpur', 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9'],
        ['Orange', 'Mandarin', 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b'],
        ['Orange', 'Blood', 'https://images.unsplash.com/photo-1624969862644-791f3dc98927'],
        ['Grapes', 'Green', 'https://images.unsplash.com/photo-1599819177476-08bf2c189b2b'],
        ['Grapes', 'Black', 'https://images.unsplash.com/photo-1596363505729-4190a9506133'],
        ['Grapes', 'Red', 'https://images.unsplash.com/photo-1601275466718-3434f2aabdb0'],
        ['Grapes', 'Seedless', 'https://images.unsplash.com/photo-1583399857804-17af2c31ec89'],
        ['Mango', 'Alphonso', 'https://images.unsplash.com/photo-1605027990121-cbae9d0ab43c'],
        ['Mango', 'Kesar', 'https://images.unsplash.com/photo-1601275466718-3434f2aabdb0'],
        ['Mango', 'Totapuri', 'https://images.unsplash.com/photo-1587132129442-96be37cb58d2'],
        ['Mango', 'Langra', 'https://images.unsplash.com/photo-1605027990121-cbae9d0ab43c'],
        ['Banana', 'Robusta', 'https://images.unsplash.com/photo-1603833665858-e61d17a86224'],
        ['Banana', 'Red', 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e'],
        ['Banana', 'Plantain', 'https://images.unsplash.com/photo-1574856344191-71e618bc2310'],
        ['Banana', 'Nendran', 'https://images.unsplash.com/photo-1528825871115-3581a5387919'],
        ['Strawberry', 'Fresh', 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6'],
        ['Papaya', 'Ripe', 'https://images.unsplash.com/photo-1617112848923-cc2234396a8d'],
        ['Watermelon', 'Seedless', 'https://images.unsplash.com/photo-1589984662646-e7b2e4962f18'],
        ['Pineapple', 'Golden', 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba'],
        ['Pomegranate', 'Red', 'https://images.unsplash.com/photo-1602253057119-37d1e93f9a2f']
    ];
    
    i INT;
    j INT;
BEGIN
    FOR i IN 1..25 LOOP
        FOR j IN 1..4 LOOP
            counter := counter + 1;
            INSERT INTO products (
                id, created_at, updated_at,
                name, description, price, mrp, category_id, subcategory_id,
                stock, unit, quantity_per_unit, weight_quantity,
                discount_percentage, rating, review_count,
                image_url, image_urls, is_available, is_featured, is_new_arrival, is_trending,
                tags, min_order_quantity, max_order_quantity
            ) VALUES (
                gen_random_uuid(),
                CURRENT_TIMESTAMP,
                CURRENT_TIMESTAMP,
                fruit_types[i][1] || ' ' || fruit_types[i][2] || CASE
                    WHEN j = 1 THEN ' - Premium'
                    WHEN j = 2 THEN ' - Organic'
                    WHEN j = 3 THEN ' - Regular'
                    ELSE ' - Value Pack'
                END,
                'Fresh ' || lower(fruit_types[i][2]) || ' ' || lower(fruit_types[i][1]) || CASE
                    WHEN j = 1 THEN ' - premium quality'
                    WHEN j = 2 THEN ' - certified organic'
                    WHEN j = 3 THEN ' - regular quality'
                    ELSE ' - value pack'
                END,
                50.00 + (i * 5) + (j * 15),
                60.00 + (i * 5) + (j * 15),
                v_category_id,
                v_fruit_subcat,
                80 + (i * 5) + (j * 10),
                'kg',
                1,
                '1 kg',
                8.00 + (j * 2),
                4.0 + (random() * 0.8)::numeric(3,2),
                100 + (i * 10) + (j * 20),
                fruit_types[i][3],
                ARRAY[fruit_types[i][3]],
                true,
                (j = 1),
                false,
                (counter <= 50),
                ARRAY['fresh', 'fruits', lower(fruit_types[i][1])],
                1,
                10
            );
        END LOOP;
    END LOOP;
    
    RAISE NOTICE 'Inserted 100 fruit products';
END $$;

-- Insert 100 Vegetables
DO $$
DECLARE
    v_category_id UUID := '29fc893a-ba90-43a9-bcfe-30e59433844b';
    v_veg_subcat UUID := '125746d6-5f99-4809-a658-4e9d830eebf8';
    counter INT := 0;
    
    vegetable_types TEXT[][] := ARRAY[
        ['Tomato', 'Local', 'https://images.unsplash.com/photo-1592841200221-a6898f307baa'],
        ['Tomato', 'Cherry', 'https://images.unsplash.com/photo-1607305387299-a3d9611cd469'],
        ['Onion', 'Red', 'https://images.unsplash.com/photo-1618512496489-1e5e7b57bbd2'],
        ['Onion', 'White', 'https://images.unsplash.com/photo-1587297033709-e59a5622d1e5'],
        ['Potato', 'Regular', 'https://images.unsplash.com/photo-1518977676601-b53f82aba655'],
        ['Potato', 'Sweet', 'https://images.unsplash.com/photo-1629799693804-c08ee53c0d0a'],
        ['Carrot', 'Orange', 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37'],
        ['Carrot', 'Red', 'https://images.unsplash.com/photo-1582515073490-39981397c445'],
        ['Capsicum', 'Green', 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83'],
        ['Capsicum', 'Red', 'https://images.unsplash.com/photo-1601597111158-2fceff292cdc'],
        ['Capsicum', 'Yellow', 'https://images.unsplash.com/photo-1593197804330-e1b08b3f3d2e'],
        ['Cucumber', 'Fresh', 'https://images.unsplash.com/photo-1604977042946-1eecc30f269e'],
        ['Cauliflower', 'White', 'https://images.unsplash.com/photo-1510627489930-0c1b0bfb6785'],
        ['Cabbage', 'Green', 'https://images.unsplash.com/photo-1595585203658-c88d523b3afe'],
        ['Broccoli', 'Fresh', 'https://images.unsplash.com/photo-1583663848850-46af132dc08e'],
        ['Spinach', 'Fresh', 'https://images.unsplash.com/photo-1576045057995-568f588f82fb'],
        ['Coriander', 'Fresh', 'https://images.unsplash.com/photo-1598030968993-b7e3f99a4505'],
        ['Mint', 'Fresh', 'https://images.unsplash.com/photo-1628556270448-4d4e4148e1b1'],
        ['Ginger', 'Fresh', 'https://images.unsplash.com/photo-1617450365226-7f635883ee4e'],
        ['Garlic', 'Fresh', 'https://images.unsplash.com/photo-1585032226651-759b368d7246'],
        ['Green Chilli', 'Fresh', 'https://images.unsplash.com/photo-1583663848850-46af132dc08e'],
        ['Beetroot', 'Fresh', 'https://images.unsplash.com/photo-1590682680314-7f2c4e732257'],
        ['Radish', 'White', 'https://images.unsplash.com/photo-1597124785276-ff183ee2e728'],
        ['Peas', 'Green', 'https://images.unsplash.com/photo-1590659857518-b17df8ea4d5d'],
        ['Beans', 'Green', 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716']
    ];
    
    i INT;
    j INT;
BEGIN
    FOR i IN 1..25 LOOP
        FOR j IN 1..4 LOOP
            counter := counter + 1;
            INSERT INTO products (
                id, created_at, updated_at,
                name, description, price, mrp, category_id, subcategory_id,
                stock, unit, quantity_per_unit, weight_quantity,
                discount_percentage, rating, review_count,
                image_url, image_urls, is_available, is_featured, is_new_arrival, is_trending,
                tags, min_order_quantity, max_order_quantity
            ) VALUES (
                gen_random_uuid(),
                CURRENT_TIMESTAMP,
                CURRENT_TIMESTAMP,
                vegetable_types[i][1] || ' ' || vegetable_types[i][2] || CASE
                    WHEN j = 1 THEN ' - Grade A'
                    WHEN j = 2 THEN ' - Organic'
                    WHEN j = 3 THEN ' - Regular'
                    ELSE ' - Value Pack'
                END,
                'Fresh ' || lower(vegetable_types[i][2]) || ' ' || lower(vegetable_types[i][1]),
                25.00 + (i * 3) + (j * 8),
                30.00 + (i * 3) + (j * 8),
                v_category_id,
                v_veg_subcat,
                90 + (i * 5) + (j * 10),
                'kg',
                1,
                '1 kg',
                6.00 + (j * 2),
                3.8 + (random() * 0.9)::numeric(3,2),
                90 + (i * 8) + (j * 15),
                vegetable_types[i][3],
                ARRAY[vegetable_types[i][3]],
                true,
                (j = 1),
                false,
                (counter <= 60),
                ARRAY['fresh', 'vegetables', lower(vegetable_types[i][1])],
                1,
                15
            );
        END LOOP;
    END LOOP;
    
    RAISE NOTICE 'Inserted 100 vegetable products';
END $$;

-- Section 2: Dairy & Bakery (150 products - 75 dairy + 75 bakery)

DO $$
DECLARE
    v_category_id UUID := '016043e9-7d65-43e1-a1c4-c0510d37bdb8';
    v_dairy_subcat UUID := '1713ba04-9317-4dfc-af4d-df4872da0bdf';
    v_amul_brand UUID := 'a0dbb50e-4f69-4d2a-a188-9b9e32525e09';
    counter INT := 0;
    
    dairy_products TEXT[][] := ARRAY[
        ['Milk', 'Full Cream', 'https://images.unsplash.com/photo-1563636619-e9143da7973b'],
        ['Milk', 'Toned', 'https://images.unsplash.com/photo-1550583724-b2692b85b150'],
        ['Milk', 'Double Toned', 'https://images.unsplash.com/photo-1628088062854-d1870b4553da'],
        ['Curd', 'Plain', 'https://images.unsplash.com/photo-1571212515674-65f6c0b98c98'],
        ['Curd', 'Flavored', 'https://images.unsplash.com/photo-1571212515674-65f6c0b98c98'],
        ['Paneer', 'Fresh', 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7'],
        ['Butter', 'Salted', 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d'],
        ['Butter', 'Unsalted', 'https://images.unsplash.com/photo-1610440042657-612c63dc0637'],
        ['Ghee', 'Pure', 'https://images.unsplash.com/photo-1622633969550-ecb0e7c43beb'],
        ['Cheese', 'Cheddar', 'https://images.unsplash.com/photo-1618164436241-4473940d1f5c'],
        ['Cheese', 'Mozzarella', 'https://images.unsplash.com/photo-1628195070630-de1e5dd22ea6'],
        ['Cheese', 'Processed', 'https://images.unsplash.com/photo-1619895092509-89f2e0b7b54b'],
        ['Yogurt', 'Plain', 'https://images.unsplash.com/photo-1571212515674-65f6c0b98c98'],
        ['Yogurt', 'Strawberry', 'https://images.unsplash.com/photo-1582281296894-d26a04a64c88'],
        ['Cream', 'Fresh', 'https://images.unsplash.com/photo-1628195072618-d429f5d56d20']
    ];
    
    i INT;
    j INT;
BEGIN
    FOR i IN 1..15 LOOP
        FOR j IN 1..5 LOOP
            counter := counter + 1;
            INSERT INTO products (
                id, created_at, updated_at,
                name, description, price, mrp, category_id, subcategory_id, brand_id,
                stock, unit, quantity_per_unit, weight_quantity,
                discount_percentage, rating, review_count,
                image_url, image_urls, is_available, is_featured, is_new_arrival, is_trending,
                tags, min_order_quantity, max_order_quantity
            ) VALUES (
                gen_random_uuid(),
                CURRENT_TIMESTAMP,
                CURRENT_TIMESTAMP,
                dairy_products[i][1] || ' ' || dairy_products[i][2] || CASE
                    WHEN j = 1 THEN ' - 500ml'
                    WHEN j = 2 THEN ' - 1L'
                    WHEN j = 3 THEN ' - 500g'
                    WHEN j = 4 THEN ' - 200g'
                    ELSE ' - 100g'
                END,
                'Fresh ' || lower(dairy_products[i][2]) || ' ' || lower(dairy_products[i][1]),
                30.00 + (i * 5) + (j * 10),
                40.00 + (i * 5) + (j * 10),
                v_category_id,
                v_dairy_subcat,
                v_amul_brand,
                60 + (i * 5) + (j * 8),
                CASE WHEN j <= 2 THEN 'ltr' ELSE 'gm' END,
                1,
                CASE
                    WHEN j = 1 THEN '500 ml'
                    WHEN j = 2 THEN '1 ltr'
                    WHEN j = 3 THEN '500 gm'
                    WHEN j = 4 THEN '200 gm'
                    ELSE '100 gm'
                END,
                8.00 + j,
                4.0 + (random() * 0.8)::numeric(3,2),
                150 + (i * 15) + (j * 20),
                dairy_products[i][3],
                ARRAY[dairy_products[i][3]],
                true,
                (j = 1 OR j = 2),
                false,
                (counter <= 40),
                ARRAY['dairy', 'fresh', lower(dairy_products[i][1])],
                1,
                10
            );
        END LOOP;
    END LOOP;
    
    RAISE NOTICE 'Inserted 75 dairy products';
END $$;

-- Insert 75 Bakery Products
DO $$
DECLARE
    v_category_id UUID := '016043e9-7d65-43e1-a1c4-c0510d37bdb8';
    v_bakery_subcat UUID := '792b34fc-59d3-4fe3-a15f-da99fd640e21';
    counter INT := 0;
    
    bakery_products TEXT[][] := ARRAY[
        ['Bread', 'White', 'https://images.unsplash.com/photo-1509440159596-0249088772ff'],
        ['Bread', 'Brown', 'https://images.unsplash.com/photo-1598373182133-52452f32e30d'],
        ['Bread', 'Multigrain', 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df'],
        ['Pav', 'Regular', 'https://images.unsplash.com/photo-1608198093002-ad4e2e53ea78'],
        ['Bun', 'Burger', 'https://images.unsplash.com/photo-1608198093002-ad4e2e53ea78'],
        ['Croissant', 'Plain', 'https://images.unsplash.com/photo-1555507036-ab1f4038808a'],
        ['Muffin', 'Chocolate', 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa'],
        ['Cookies', 'Chocolate Chip', 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e'],
        ['Cake', 'Chocolate', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587'],
        ['Pastry', 'Pineapple', 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3']
    ];
    
    i INT;
    j INT;
    products_per_type INT;
BEGIN
    FOR i IN 1..10 LOOP
        products_per_type := CASE WHEN i <= 5 THEN 8 ELSE 7 END;
        
        FOR j IN 1..products_per_type LOOP
            counter := counter + 1;
            EXIT WHEN counter > 75;
            
            INSERT INTO products (
                id, created_at, updated_at,
                name, description, price, mrp, category_id, subcategory_id,
                stock, unit, quantity_per_unit, weight_quantity,
                discount_percentage, rating, review_count,
                image_url, image_urls, is_available, is_featured, is_new_arrival, is_trending,
                tags, min_order_quantity, max_order_quantity
            ) VALUES (
                gen_random_uuid(),
                CURRENT_TIMESTAMP,
                CURRENT_TIMESTAMP,
                bakery_products[i][1] || ' ' || bakery_products[i][2] || CASE
                    WHEN j <= 3 THEN ' - ' || (j * 200)::TEXT || 'g'
                    WHEN j <= 5 THEN ' - ' || ((j - 3) * 400)::TEXT || 'g'
                    ELSE ' - Pack of ' || (j - 5)::TEXT
                END,
                'Fresh baked ' || lower(bakery_products[i][2]) || ' ' || lower(bakery_products[i][1]),
                25.00 + (i * 6) + (j * 12),
                35.00 + (i * 6) + (j * 12),
                v_category_id,
                v_bakery_subcat,
                70 + (i * 6) + (j * 10),
                CASE WHEN j <= 5 THEN 'gm' ELSE 'pcs' END,
                1,
                CASE
                    WHEN j <= 3 THEN (j * 200)::TEXT || ' gm'
                    WHEN j <= 5 THEN ((j - 3) * 400)::TEXT || ' gm'
                    ELSE 'Pack of ' || (j - 5)::TEXT
                END,
                9.00 + j,
                3.9 + (random() * 0.8)::numeric(3,2),
                110 + (i * 12) + (j * 18),
                bakery_products[i][3],
                ARRAY[bakery_products[i][3]],
                true,
                (j <= 3),
                false,
                (counter <= 45),
                ARRAY['bakery', 'fresh', lower(bakery_products[i][1])],
                1,
                12
            );
        END LOOP;
    END LOOP;
    
    RAISE NOTICE 'Inserted 75 bakery products';
END $$;

-- Count total products
DO $$
DECLARE
    total_count INT;
BEGIN
    SELECT COUNT(*) INTO total_count FROM products;
    RAISE NOTICE 'Total products in database: %', total_count;
END $$;
