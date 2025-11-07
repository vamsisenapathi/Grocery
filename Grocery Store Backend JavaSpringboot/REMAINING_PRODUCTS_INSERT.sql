-- Continue inserting products - Beverages, Snacks, Personal Care, Household
-- This adds 434 more products to reach 801 total

-- Section 3: Beverages (100 products)
DO $$
DECLARE
    v_category_id UUID := '6096240d-5a08-4b9d-9e2c-71c634fee065';
    v_subcat UUID := (SELECT id FROM subcategories WHERE category_id = '6096240d-5a08-4b9d-9e2c-71c634fee065' LIMIT 1);
    counter INT := 0;
    
    beverages TEXT[][] := ARRAY[
        ['Coca Cola', 'Regular', 'https://images.unsplash.com/photo-1554866585-cd94860890b7'],
        ['Pepsi', 'Regular', 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e'],
        ['Sprite', 'Regular', 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3'],
        ['Fanta', 'Orange', 'https://images.unsplash.com/photo-1624517452488-04869289c4ca'],
        ['Mountain Dew', 'Regular', 'https://images.unsplash.com/photo-1629203849382-0f6bc413bf17'],
        ['Thumbs Up', 'Regular', 'https://images.unsplash.com/photo-1581006852262-e4307cf6283a'],
        ['Limca', 'Fresh', 'https://images.unsplash.com/photo-1625772452859-1c03d5bf1137'],
        ['Tropicana', 'Orange Juice', 'https://images.unsplash.com/photo-1600271886742-f049cd451bba'],
        ['Real', 'Mango Juice', 'https://images.unsplash.com/photo-1610889556528-9a770e32642f'],
        ['Maaza', 'Mango Drink', 'https://images.unsplash.com/photo-1627315604245-40d38e6f7109'],
        ['Frooti', 'Mango Drink', 'https://images.unsplash.com/photo-1570831739435-6601aa3fa4fb'],
        ['Appy Fizz', 'Sparkling', 'https://images.unsplash.com/photo-1624517452488-04869289c4ca'],
        ['Red Bull', 'Energy Drink', 'https://images.unsplash.com/photo-1622543925917-763c34f3e663'],
        ['Monster', 'Energy Drink', 'https://images.unsplash.com/photo-1591337676887-a217a6970a8a'],
        ['Bisleri', 'Mineral Water', 'https://images.unsplash.com/photo-1550268830-05cd0ed74fc7']
    ];
    
    i INT;
    j INT;
BEGIN
    FOR i IN 1..15 LOOP
        FOR j IN 1..7 LOOP
            counter := counter + 1;
            EXIT WHEN counter > 100;
            
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
                beverages[i][1] || ' ' || beverages[i][2] || CASE 
                    WHEN j = 1 THEN ' - 200ml'
                    WHEN j = 2 THEN ' - 500ml'
                    WHEN j = 3 THEN ' - 750ml'
                    WHEN j = 4 THEN ' - 1L'
                    WHEN j = 5 THEN ' - 1.5L'
                    WHEN j = 6 THEN ' - 2L'
                    ELSE ' - 2.5L'
                END,
                'Refreshing ' || lower(beverages[i][2]) || ' ' || lower(beverages[i][1]),
                15.00 + (i * 2) + (j * 8),
                20.00 + (i * 2) + (j * 8),
                v_category_id,
                v_subcat,
                100 + (i * 8) + (j * 12),
                'ml',
                1,
                CASE
                    WHEN j = 1 THEN '200 ml'
                    WHEN j = 2 THEN '500 ml'
                    WHEN j = 3 THEN '750 ml'
                    WHEN j = 4 THEN '1 ltr'
                    WHEN j = 5 THEN '1.5 ltr'
                    WHEN j = 6 THEN '2 ltr'
                    ELSE '2.5 ltr'
                END,
                10.00 + j,
                4.0 + (random() * 0.7)::numeric(3,2),
                120 + (i * 10) + (j * 15),
                beverages[i][3],
                ARRAY[beverages[i][3]],
                true,
                (j = 2 OR j = 3),
                false,
                (counter <= 50),
                ARRAY['beverages', 'drinks', lower(beverages[i][1])],
                1,
                20
            );
        END LOOP;
    END LOOP;
    
    RAISE NOTICE 'Inserted 100 beverage products';
END $$;

-- Section 4: Snacks & Packaged Foods (180 products)
DO $$
DECLARE
    v_category_id UUID := '6096240d-5a08-4b9d-9e2c-71c634fee065';
    v_subcat UUID := (SELECT id FROM subcategories WHERE category_id = '6096240d-5a08-4b9d-9e2c-71c634fee065' LIMIT 1);
    v_haldiram_brand UUID := '1a845e67-8d65-4763-9237-d9d4020b1b11';
    counter INT := 0;
    
    snacks TEXT[][] := ARRAY[
        ['Chips', 'Salted', 'https://images.unsplash.com/photo-1566478989037-eec170784d0b'],
        ['Chips', 'Masala', 'https://images.unsplash.com/photo-1600952841320-db92ec4047ca'],
        ['Chips', 'Tomato', 'https://images.unsplash.com/photo-1621447504864-d8686e12698c'],
        ['Namkeen', 'Mixture', 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087'],
        ['Namkeen', 'Bhujia', 'https://images.unsplash.com/photo-1606755962773-d324e0a13086'],
        ['Biscuits', 'Marie', 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35'],
        ['Biscuits', 'Cream', 'https://images.unsplash.com/photo-1609501676725-7186f017a4b7'],
        ['Cookies', 'Butter', 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e'],
        ['Noodles', 'Masala', 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841'],
        ['Noodles', 'Atta', 'https://images.unsplash.com/photo-1626266061368-46ab11971b32'],
        ['Pasta', 'Penne', 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9'],
        ['Pasta', 'Macaroni', 'https://images.unsplash.com/photo-1611171711912-e0fe38c05ab5'],
        ['Popcorn', 'Butter', 'https://images.unsplash.com/photo-1578849278619-e73505e9610f'],
        ['Popcorn', 'Caramel', 'https://images.unsplash.com/photo-1603830492311-1efb0aeb6e97'],
        ['Nuts', 'Cashew', 'https://images.unsplash.com/photo-1617200124730-d043c0c48ab9'],
        ['Nuts', 'Almonds', 'https://images.unsplash.com/photo-1590155398165-1fda4d58234b'],
        ['Chocolate', 'Dairy Milk', 'https://images.unsplash.com/photo-1606312619070-d48b4cde58f7'],
        ['Candy', 'Assorted', 'https://images.unsplash.com/photo-1576717585940-08199b730890']
    ];
    
    i INT;
    j INT;
BEGIN
    FOR i IN 1..18 LOOP
        FOR j IN 1..10 LOOP
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
                snacks[i][1] || ' ' || snacks[i][2] || CASE
                    WHEN j <= 5 THEN ' - ' || (j * 50)::TEXT || 'g'
                    ELSE ' - ' || ((j - 5) * 500)::TEXT || 'g'
                END,
                'Delicious ' || lower(snacks[i][2]) || ' ' || lower(snacks[i][1]),
                10.00 + (i * 2) + (j * 5),
                15.00 + (i * 2) + (j * 5),
                v_category_id,
                v_subcat,
                v_haldiram_brand,
                80 + (i * 5) + (j * 8),
                'gm',
                1,
                CASE WHEN j <= 5 THEN (j * 50)::TEXT || ' gm' ELSE ((j - 5) * 500)::TEXT || ' gm' END,
                12.00 + j,
                4.0 + (random() * 0.7)::numeric(3,2),
                90 + (i * 8) + (j * 12),
                snacks[i][3],
                ARRAY[snacks[i][3]],
                true,
                (j <= 4),
                false,
                (counter <= 90),
                ARRAY['snacks', 'packaged', lower(snacks[i][1])],
                1,
                25
            );
        END LOOP;
    END LOOP;
    
    RAISE NOTICE 'Inserted 180 snack products';
END $$;

-- Section 5: Personal Care (80 products)
DO $$
DECLARE
    v_category_id UUID := '62556c79-3ce8-4e43-9b84-1443919138bc';
    v_subcat UUID := (SELECT id FROM subcategories WHERE category_id = '62556c79-3ce8-4e43-9b84-1443919138bc' LIMIT 1);
    counter INT := 0;
    
    personal_care TEXT[][] := ARRAY[
        ['Shampoo', 'Anti-Dandruff', 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d'],
        ['Shampoo', 'Silky Smooth', 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b'],
        ['Conditioner', 'Smooth & Silky', 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b'],
        ['Soap', 'Bathing', 'https://images.unsplash.com/photo-1591360236480-4ed861025fa1'],
        ['Face Wash', 'Oil Control', 'https://images.unsplash.com/photo-1556228720-195a672e8a03'],
        ['Toothpaste', 'Whitening', 'https://images.unsplash.com/photo-1622597468795-b1d25e6801fc'],
        ['Deodorant', 'Fresh', 'https://images.unsplash.com/photo-1627149388695-92d48d00e0f2'],
        ['Body Lotion', 'Moisturizing', 'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd'],
        ['Sunscreen', 'SPF 50', 'https://images.unsplash.com/photo-1593165988533-b9fdaa7827b3'],
        ['Hand Wash', 'Antibacterial', 'https://images.unsplash.com/photo-1584305574094-368f41b78d21']
    ];
    
    i INT;
    j INT;
BEGIN
    FOR i IN 1..10 LOOP
        FOR j IN 1..8 LOOP
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
                personal_care[i][1] || ' ' || personal_care[i][2] || CASE
                    WHEN j <= 4 THEN ' - ' || (j * 100)::TEXT || 'ml'
                    ELSE ' - ' || ((j - 4) * 200)::TEXT || 'ml'
                END,
                'Premium ' || lower(personal_care[i][2]) || ' ' || lower(personal_care[i][1]),
                50.00 + (i * 10) + (j * 15),
                70.00 + (i * 10) + (j * 15),
                v_category_id,
                v_subcat,
                60 + (i * 5) + (j * 8),
                'ml',
                1,
                CASE WHEN j <= 4 THEN (j * 100)::TEXT || ' ml' ELSE ((j - 4) * 200)::TEXT || ' ml' END,
                15.00 + j,
                4.0 + (random() * 0.8)::numeric(3,2),
                100 + (i * 12) + (j * 15),
                personal_care[i][3],
                ARRAY[personal_care[i][3]],
                true,
                (j <= 3),
                false,
                (counter <= 40),
                ARRAY['personal-care', 'hygiene', lower(personal_care[i][1])],
                1,
                10
            );
        END LOOP;
    END LOOP;
    
    RAISE NOTICE 'Inserted 80 personal care products';
END $$;

-- Section 6: Household Items (74 products to reach exactly 801 total)
DO $$
DECLARE
    v_category_id UUID := 'cdbae0d0-d38d-4aa0-84c9-18a8d41b634d';
    v_subcat UUID := (SELECT id FROM subcategories WHERE category_id = 'cdbae0d0-d38d-4aa0-84c9-18a8d41b634d' LIMIT 1);
    counter INT := 0;
    
    household TEXT[][] := ARRAY[
        ['Detergent', 'Powder', 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce'],
        ['Detergent', 'Liquid', 'https://images.unsplash.com/photo-1602192509154-0b900ee1f851'],
        ['Dishwash', 'Gel', 'https://images.unsplash.com/photo-1583947215259-38e31be8751f'],
        ['Dishwash', 'Bar', 'https://images.unsplash.com/photo-1612718730681-ecd7d9c9e25c'],
        ['Floor Cleaner', 'Disinfectant', 'https://images.unsplash.com/photo-1563453392212-326f5e854473'],
        ['Toilet Cleaner', 'Liquid', 'https://images.unsplash.com/photo-1585421514738-01798e348b17'],
        ['Air Freshener', 'Lavender', 'https://images.unsplash.com/photo-1612480557558-0d9bc655ec6a'],
        ['Tissue Paper', 'Soft', 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be'],
        ['Garbage Bags', 'Large', 'https://images.unsplash.com/photo-1604608672516-9e24b8c4f98d'],
        ['Kitchen Wipes', 'Multi-Purpose', 'https://images.unsplash.com/photo-1585421514738-01798e348b17']
    ];
    
    i INT;
    j INT;
    products_needed INT := 74;
BEGIN
    FOR i IN 1..10 LOOP
        FOR j IN 1..8 LOOP
            counter := counter + 1;
            EXIT WHEN counter > products_needed;
            
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
                household[i][1] || ' ' || household[i][2] || CASE
                    WHEN j <= 4 THEN ' - ' || (j * 250)::TEXT || 'ml'
                    ELSE ' - ' || ((j - 4) * 500)::TEXT || 'gm'
                END,
                'Effective ' || lower(household[i][2]) || ' ' || lower(household[i][1]),
                40.00 + (i * 8) + (j * 12),
                55.00 + (i * 8) + (j * 12),
                v_category_id,
                v_subcat,
                70 + (i * 6) + (j * 10),
                CASE WHEN j <= 4 THEN 'ml' ELSE 'gm' END,
                1,
                CASE WHEN j <= 4 THEN (j * 250)::TEXT || ' ml' ELSE ((j - 4) * 500)::TEXT || ' gm' END,
                18.00 + j,
                4.0 + (random() * 0.7)::numeric(3,2),
                80 + (i * 10) + (j * 12),
                household[i][3],
                ARRAY[household[i][3]],
                true,
                (j <= 2),
                false,
                (counter <= 35),
                ARRAY['household', 'cleaning', lower(household[i][1])],
                1,
                15
            );
        END LOOP;
    END LOOP;
    
    RAISE NOTICE 'Inserted % household products', counter;
END $$;

-- Final count verification
DO $$
DECLARE
    total_count INT;
BEGIN
    SELECT COUNT(*) INTO total_count FROM products;
    RAISE NOTICE '============================================';
    RAISE NOTICE 'FINAL TOTAL PRODUCTS IN DATABASE: %', total_count;
    RAISE NOTICE '============================================';
END $$;
