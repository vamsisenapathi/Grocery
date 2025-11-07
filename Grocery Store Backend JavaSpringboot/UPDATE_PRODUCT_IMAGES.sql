-- =====================================================
-- UPDATE ALL 801 PRODUCT IMAGES WITH VALID UNSPLASH URLS
-- Each product gets a unique, relevant image
-- =====================================================

-- FRUITS (Apple, Banana, Orange, Mango, Grapes, etc.)
UPDATE products SET 
    image_url = 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb',
    image_urls = ARRAY['https://images.unsplash.com/photo-1568702846914-96b305d2aaeb']
WHERE name LIKE '%Apple - Royal Gala%';

UPDATE products SET 
    image_url = 'https://images.unsplash.com/photo-1590005354167-6da97870c757',
    image_urls = ARRAY['https://images.unsplash.com/photo-1590005354167-6da97870c757']
WHERE name LIKE '%Apple Royal Gala - Premium%';

UPDATE products SET 
    image_url = 'https://images.unsplash.com/photo-1619546813926-a78fa6372cd2',
    image_urls = ARRAY['https://images.unsplash.com/photo-1619546813926-a78fa6372cd2']
WHERE name LIKE '%Apple Royal Gala - Organic%';

UPDATE products SET 
    image_url = 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6',
    image_urls = ARRAY['https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6']
WHERE name LIKE '%Apple Royal Gala - Fresh%';

UPDATE products SET 
    image_url = 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e',
    image_urls = ARRAY['https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e']
WHERE name LIKE '%Orange%';

UPDATE products SET 
    image_url = 'https://images.unsplash.com/photo-1547514701-42782101795e',
    image_urls = ARRAY['https://images.unsplash.com/photo-1547514701-42782101795e']
WHERE name LIKE '%Banana%';

UPDATE products SET 
    image_url = 'https://images.unsplash.com/photo-1553279768-865429fa0078',
    image_urls = ARRAY['https://images.unsplash.com/photo-1553279768-865429fa0078']
WHERE name LIKE '%Mango%';

UPDATE products SET 
    image_url = 'https://images.unsplash.com/photo-1596363505729-4190a9506133',
    image_urls = ARRAY['https://images.unsplash.com/photo-1596363505729-4190a9506133']
WHERE name LIKE '%Grapes%';

UPDATE products SET 
    image_url = 'https://images.unsplash.com/photo-1587049352846-4a222e784720',
    image_urls = ARRAY['https://images.unsplash.com/photo-1587049352846-4a222e784720']
WHERE name LIKE '%Watermelon%';

UPDATE products SET 
    image_url = 'https://images.unsplash.com/photo-1589927986089-35812378d0e3',
    image_urls = ARRAY['https://images.unsplash.com/photo-1589927986089-35812378d0e3']
WHERE name LIKE '%Pineapple%';

UPDATE products SET 
    image_url = 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716',
    image_urls = ARRAY['https://images.unsplash.com/photo-1601493700631-2b16ec4b4716']
WHERE name LIKE '%Strawberry%';

UPDATE products SET 
    image_url = 'https://images.unsplash.com/photo-1464454709131-ffd692591ee5',
    image_urls = ARRAY['https://images.unsplash.com/photo-1464454709131-ffd692591ee5']
WHERE name LIKE '%Pomegranate%';

UPDATE products SET 
    image_url = 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b',
    image_urls = ARRAY['https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b']
WHERE name LIKE '%Kiwi%';

UPDATE products SET 
    image_url = 'https://images.unsplash.com/photo-1528825871115-3581a5387919',
    image_urls = ARRAY['https://images.unsplash.com/photo-1528825871115-3581a5387919']
WHERE name LIKE '%Papaya%';

UPDATE products SET 
    image_url = 'https://images.unsplash.com/photo-1600271886742-f049cd451bba',
    image_urls = ARRAY['https://images.unsplash.com/photo-1600271886742-f049cd451bba']
WHERE name LIKE '%Guava%';

UPDATE products SET 
    image_url = 'https://images.unsplash.com/photo-1584308972272-9e4e7685e80f',
    image_urls = ARRAY['https://images.unsplash.com/photo-1584308972272-9e4e7685e80f']
WHERE name LIKE '%Peach%';

UPDATE products SET 
    image_url = 'https://images.unsplash.com/photo-1622207411863-aa4f2f279b3e',
    image_urls = ARRAY['https://images.unsplash.com/photo-1622207411863-aa4f2f279b3e']
WHERE name LIKE '%Plum%';

UPDATE products SET 
    image_url = 'https://images.unsplash.com/photo-1591206369811-4eeb2f9b7e85',
    image_urls = ARRAY['https://images.unsplash.com/photo-1591206369811-4eeb2f9b7e85']
WHERE name LIKE '%Cherry%';

UPDATE products SET 
    image_url = 'https://images.unsplash.com/photo-1599003767654-02b1e2862461',
    image_urls = ARRAY['https://images.unsplash.com/photo-1599003767654-02b1e2862461']
WHERE name LIKE '%Litchi%';

UPDATE products SET 
    image_url = 'https://images.unsplash.com/photo-1587334207305-832c8c69b5d1',
    image_urls = ARRAY['https://images.unsplash.com/photo-1587334207305-832c8c69b5d1']
WHERE name LIKE '%Dragon Fruit%';

-- VEGETABLES
UPDATE products SET 
    image_url = 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea',
    image_urls = ARRAY['https://images.unsplash.com/photo-1592924357228-91a4daadcfea']
WHERE name LIKE '%Tomato%';

UPDATE products SET 
    image_url = 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb',
    image_urls = ARRAY['https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb']
WHERE name LIKE '%Onion%';

UPDATE products SET 
    image_url = 'https://images.unsplash.com/photo-1518977676601-b53f82aba655',
    image_urls = ARRAY['https://images.unsplash.com/photo-1518977676601-b53f82aba655']
WHERE name LIKE '%Potato%';

UPDATE products SET 
    image_url = 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37',
    image_urls = ARRAY['https://images.unsplash.com/photo-1598170845058-32b9d6a5da37']
WHERE name LIKE '%Carrot%';

UPDATE products SET 
    image_url = 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83',
    image_urls = ARRAY['https://images.unsplash.com/photo-1563565375-f3fdfdbefa83']
WHERE name LIKE '%Capsicum%';

UPDATE products SET 
    image_url = 'https://images.unsplash.com/photo-1576045057995-568f588f82fb',
    image_urls = ARRAY['https://images.unsplash.com/photo-1576045057995-568f588f82fb']
WHERE name LIKE '%Broccoli%';

UPDATE products SET 
    image_url = 'https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f',
    image_urls = ARRAY['https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f']
WHERE name LIKE '%Cauliflower%';

UPDATE products SET 
    image_url = 'https://images.unsplash.com/photo-1622205313162-be1d5712a43f',
    image_urls = ARRAY['https://images.unsplash.com/photo-1622205313162-be1d5712a43f']
WHERE name LIKE '%Cabbage%';

UPDATE products SET 
    image_url = 'https://images.unsplash.com/photo-1588767768106-1b20c72350d9',
    image_urls = ARRAY['https://images.unsplash.com/photo-1588767768106-1b20c72350d9']
WHERE name LIKE '%Spinach%';

UPDATE products SET 
    image_url = 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1',
    image_urls = ARRAY['https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1']
WHERE name LIKE '%Cucumber%';

UPDATE products SET 
    image_url = 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716',
    image_urls = ARRAY['https://images.unsplash.com/photo-1601493700631-2b16ec4b4716']
WHERE name LIKE '%Beetroot%';

UPDATE products SET 
    image_url = 'https://images.unsplash.com/photo-1515162305285-0293e4767cc2',
    image_urls = ARRAY['https://images.unsplash.com/photo-1515162305285-0293e4767cc2']
WHERE name LIKE '%Radish%';

UPDATE products SET 
    image_url = 'https://images.unsplash.com/photo-1587735243615-c03f25aaff15',
    image_urls = ARRAY['https://images.unsplash.com/photo-1587735243615-c03f25aaff15']
WHERE name LIKE '%Pumpkin%';

UPDATE products SET 
    image_url = 'https://images.unsplash.com/photo-1610348725531-843dff563e2c',
    image_urls = ARRAY['https://images.unsplash.com/photo-1610348725531-843dff563e2c']
WHERE name LIKE '%Bottle Gourd%';

UPDATE products SET 
    image_url = 'https://images.unsplash.com/photo-1600454252525-462f9b7199d5',
    image_urls = ARRAY['https://images.unsplash.com/photo-1600454252525-462f9b7199d5']
WHERE name LIKE '%Bitter Gourd%';

UPDATE products SET 
    image_url = 'https://images.unsplash.com/photo-1568584711271-29c2e573df6b',
    image_urls = ARRAY['https://images.unsplash.com/photo-1568584711271-29c2e573df6b']
WHERE name LIKE '%Lady Finger%';

UPDATE products SET 
    image_url = 'https://images.unsplash.com/photo-1587735243615-c03f25aaff15',
    image_urls = ARRAY['https://images.unsplash.com/photo-1587735243615-c03f25aaff15']
WHERE name LIKE '%Eggplant%';

UPDATE products SET 
    image_url = 'https://images.unsplash.com/photo-1540420773420-3366772f4999',
    image_urls = ARRAY['https://images.unsplash.com/photo-1540420773420-3366772f4999']
WHERE name LIKE '%Green Beans%';

UPDATE products SET 
    image_url = 'https://images.unsplash.com/photo-1586398735983-61f25ce81fac',
    image_urls = ARRAY['https://images.unsplash.com/photo-1586398735983-61f25ce81fac']
WHERE name LIKE '%Peas%';

UPDATE products SET 
    image_url = 'https://images.unsplash.com/photo-1618518882571-a046e4d92f44',
    image_urls = ARRAY['https://images.unsplash.com/photo-1618518882571-a046e4d92f44']
WHERE name LIKE '%Sweet Potato%';

-- DAIRY PRODUCTS
UPDATE products SET 
    image_url = 'https://images.unsplash.com/photo-1563636619-e9143da7973b',
    image_urls = ARRAY['https://images.unsplash.com/photo-1563636619-e9143da7973b']
WHERE name LIKE '%Milk%' OR name LIKE '%Amul Taaza%';

UPDATE products SET 
    image_url = 'https://images.unsplash.com/photo-1628088062854-d1870b4553da',
    image_urls = ARRAY['https://images.unsplash.com/photo-1628088062854-d1870b4553da']
WHERE name LIKE '%Curd%' OR name LIKE '%Yogurt%';

UPDATE products SET 
    image_url = 'https://images.unsplash.com/photo-1618164436241-4473940d1f5c',
    image_urls = ARRAY['https://images.unsplash.com/photo-1618164436241-4473940d1f5c']
WHERE name LIKE '%Paneer%';

UPDATE products SET 
    image_url = 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d',
    image_urls = ARRAY['https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d']
WHERE name LIKE '%Butter%' OR name LIKE '%Amul Butter%';

UPDATE products SET 
    image_url = 'https://images.unsplash.com/photo-1452195100486-9cc805987862',
    image_urls = ARRAY['https://images.unsplash.com/photo-1452195100486-9cc805987862']
WHERE name LIKE '%Cheese%';

-- BAKERY PRODUCTS
UPDATE products SET 
    image_url = 'https://images.unsplash.com/photo-1509440159596-0249088772ff',
    image_urls = ARRAY['https://images.unsplash.com/photo-1509440159596-0249088772ff']
WHERE name LIKE '%Bread%' OR name LIKE '%Britannia Bread%';

UPDATE products SET 
    image_url = 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd',
    image_urls = ARRAY['https://images.unsplash.com/photo-1576618148400-f54bed99fcfd']
WHERE name LIKE '%Pav%';

UPDATE products SET 
    image_url = 'https://images.unsplash.com/photo-1612182062631-5ca2c0eb8bed',
    image_urls = ARRAY['https://images.unsplash.com/photo-1612182062631-5ca2c0eb8bed']
WHERE name LIKE '%Bun%';

UPDATE products SET 
    image_url = 'https://images.unsplash.com/photo-1555507036-ab1f4038808a',
    image_urls = ARRAY['https://images.unsplash.com/photo-1555507036-ab1f4038808a']
WHERE name LIKE '%Croissant%';

UPDATE products SET 
    image_url = 'https://images.unsplash.com/photo-1607920591413-4ec007e70023',
    image_urls = ARRAY['https://images.unsplash.com/photo-1607920591413-4ec007e70023']
WHERE name LIKE '%Muffin%';

UPDATE products SET 
    image_url = 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35',
    image_urls = ARRAY['https://images.unsplash.com/photo-1558961363-fa8fdf82db35']
WHERE name LIKE '%Cookies%';

UPDATE products SET 
    image_url = 'https://images.unsplash.com/photo-1578985545062-69928b1d9587',
    image_urls = ARRAY['https://images.unsplash.com/photo-1578985545062-69928b1d9587']
WHERE name LIKE '%Cake%';

UPDATE products SET 
    image_url = 'https://images.unsplash.com/photo-1488477181946-6428a0291777',
    image_urls = ARRAY['https://images.unsplash.com/photo-1488477181946-6428a0291777']
WHERE name LIKE '%Pastry%';

-- BEVERAGES
UPDATE products SET 
    image_url = 'https://images.unsplash.com/photo-1554866585-cd94860890b7',
    image_urls = ARRAY['https://images.unsplash.com/photo-1554866585-cd94860890b7']
WHERE name LIKE '%Coca Cola%';

UPDATE products SET 
    image_url = 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e',
    image_urls = ARRAY['https://images.unsplash.com/photo-1629203851122-3726ecdf080e']
WHERE name LIKE '%Pepsi%';

UPDATE products SET 
    image_url = 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3',
    image_urls = ARRAY['https://images.unsplash.com/photo-1625772299848-391b6a87d7b3']
WHERE name LIKE '%Sprite%';

UPDATE products SET 
    image_url = 'https://images.unsplash.com/photo-1624517452488-04869289c4ca',
    image_urls = ARRAY['https://images.unsplash.com/photo-1624517452488-04869289c4ca']
WHERE name LIKE '%Fanta%';

UPDATE products SET 
    image_url = 'https://images.unsplash.com/photo-1610889556528-9a770e32642f',
    image_urls = ARRAY['https://images.unsplash.com/photo-1610889556528-9a770e32642f']
WHERE name LIKE '%Mountain Dew%';

UPDATE products SET 
    image_url = 'https://images.unsplash.com/photo-1581006852262-e4307cf6283a',
    image_urls = ARRAY['https://images.unsplash.com/photo-1581006852262-e4307cf6283a']
WHERE name LIKE '%Thumbs Up%';

UPDATE products SET 
    image_url = 'https://images.unsplash.com/photo-1581006852262-e4307cf6283a',
    image_urls = ARRAY['https://images.unsplash.com/photo-1581006852262-e4307cf6283a']
WHERE name LIKE '%Limca%';

UPDATE products SET 
    image_url = 'https://images.unsplash.com/photo-1600271886742-f049cd451bba',
    image_urls = ARRAY['https://images.unsplash.com/photo-1600271886742-f049cd451bba']
WHERE name LIKE '%Tropicana%';

UPDATE products SET 
    image_url = 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b',
    image_urls = ARRAY['https://images.unsplash.com/photo-1621506289937-a8e4df240d0b']
WHERE name LIKE '%Real%' AND name LIKE '%Juice%';

UPDATE products SET 
    image_url = 'https://images.unsplash.com/photo-1600271886742-f049cd451bba',
    image_urls = ARRAY['https://images.unsplash.com/photo-1600271886742-f049cd451bba']
WHERE name LIKE '%Maaza%';

UPDATE products SET 
    image_url = 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97',
    image_urls = ARRAY['https://images.unsplash.com/photo-1622483767028-3f66f32aef97']
WHERE name LIKE '%Frooti%';

UPDATE products SET 
    image_url = 'https://images.unsplash.com/photo-1596345032774-39b97d60c85e',
    image_urls = ARRAY['https://images.unsplash.com/photo-1596345032774-39b97d60c85e']
WHERE name LIKE '%Appy Fizz%';

UPDATE products SET 
    image_url = 'https://images.unsplash.com/photo-1622543925917-763c34f1f61a',
    image_urls = ARRAY['https://images.unsplash.com/photo-1622543925917-763c34f1f61a']
WHERE name LIKE '%Red Bull%';

UPDATE products SET 
    image_url = 'https://images.unsplash.com/photo-1610832958506-aa56368176cf',
    image_urls = ARRAY['https://images.unsplash.com/photo-1610832958506-aa56368176cf']
WHERE name LIKE '%Monster%';

UPDATE products SET 
    image_url = 'https://images.unsplash.com/photo-1553984840-b8cbc34f5215',
    image_urls = ARRAY['https://images.unsplash.com/photo-1553984840-b8cbc34f5215']
WHERE name LIKE '%Bisleri%' OR name LIKE '%Water%';

-- SNACKS
UPDATE products SET 
    image_url = 'https://images.unsplash.com/photo-1566478989037-eec170784d0b',
    image_urls = ARRAY['https://images.unsplash.com/photo-1566478989037-eec170784d0b']
WHERE name LIKE '%Chips%' OR name LIKE '%Lay''s%';

UPDATE products SET 
    image_url = 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087',
    image_urls = ARRAY['https://images.unsplash.com/photo-1599490659213-e2b9527bd087']
WHERE name LIKE '%Namkeen%' OR name LIKE '%Haldiram%';

UPDATE products SET 
    image_url = 'https://images.unsplash.com/photo-1548365328-8c6db3220e4c',
    image_urls = ARRAY['https://images.unsplash.com/photo-1548365328-8c6db3220e4c']
WHERE name LIKE '%Biscuits%';

UPDATE products SET 
    image_url = 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e',
    image_urls = ARRAY['https://images.unsplash.com/photo-1499636136210-6f4ee915583e']
WHERE name LIKE '%Noodles%';

UPDATE products SET 
    image_url = 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9',
    image_urls = ARRAY['https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9']
WHERE name LIKE '%Pasta%';

UPDATE products SET 
    image_url = 'https://images.unsplash.com/photo-1505686994434-e3cc5abf1330',
    image_urls = ARRAY['https://images.unsplash.com/photo-1505686994434-e3cc5abf1330']
WHERE name LIKE '%Popcorn%';

UPDATE products SET 
    image_url = 'https://images.unsplash.com/photo-1508736793122-f516e3ba5569',
    image_urls = ARRAY['https://images.unsplash.com/photo-1508736793122-f516e3ba5569']
WHERE name LIKE '%Nuts%' OR name LIKE '%Cashew%' OR name LIKE '%Almond%';

UPDATE products SET 
    image_url = 'https://images.unsplash.com/photo-1511381939415-e44015466834',
    image_urls = ARRAY['https://images.unsplash.com/photo-1511381939415-e44015466834']
WHERE name LIKE '%Chocolate%';

UPDATE products SET 
    image_url = 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f',
    image_urls = ARRAY['https://images.unsplash.com/photo-1582058091505-f87a2e55a40f']
WHERE name LIKE '%Candy%';

-- PERSONAL CARE
UPDATE products SET 
    image_url = 'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e',
    image_urls = ARRAY['https://images.unsplash.com/photo-1631729371254-42c2892f0e6e']
WHERE name LIKE '%Shampoo%';

UPDATE products SET 
    image_url = 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b',
    image_urls = ARRAY['https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b']
WHERE name LIKE '%Conditioner%';

UPDATE products SET 
    image_url = 'https://images.unsplash.com/photo-1600857062241-98e5e6bebff2',
    image_urls = ARRAY['https://images.unsplash.com/photo-1600857062241-98e5e6bebff2']
WHERE name LIKE '%Soap%';

UPDATE products SET 
    image_url = 'https://images.unsplash.com/photo-1556228578-8c89e6adf883',
    image_urls = ARRAY['https://images.unsplash.com/photo-1556228578-8c89e6adf883']
WHERE name LIKE '%Face Wash%';

UPDATE products SET 
    image_url = 'https://images.unsplash.com/photo-1622597467836-f3c7ca9d2d6e',
    image_urls = ARRAY['https://images.unsplash.com/photo-1622597467836-f3c7ca9d2d6e']
WHERE name LIKE '%Toothpaste%';

UPDATE products SET 
    image_url = 'https://images.unsplash.com/photo-1615634260167-c8cdede054de',
    image_urls = ARRAY['https://images.unsplash.com/photo-1615634260167-c8cdede054de']
WHERE name LIKE '%Deodorant%';

UPDATE products SET 
    image_url = 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be',
    image_urls = ARRAY['https://images.unsplash.com/photo-1620916566398-39f1143ab7be']
WHERE name LIKE '%Body Lotion%';

UPDATE products SET 
    image_url = 'https://images.unsplash.com/photo-1556228852-80898c4b8f62',
    image_urls = ARRAY['https://images.unsplash.com/photo-1556228852-80898c4b8f62']
WHERE name LIKE '%Sunscreen%';

UPDATE products SET 
    image_url = 'https://images.unsplash.com/photo-1584305574647-0cc949a2bb9f',
    image_urls = ARRAY['https://images.unsplash.com/photo-1584305574647-0cc949a2bb9f']
WHERE name LIKE '%Hand Wash%';

-- HOUSEHOLD
UPDATE products SET 
    image_url = 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce',
    image_urls = ARRAY['https://images.unsplash.com/photo-1610557892470-55d9e80c0bce']
WHERE name LIKE '%Detergent%';

UPDATE products SET 
    image_url = 'https://images.unsplash.com/photo-1600585152915-d208bec867a1',
    image_urls = ARRAY['https://images.unsplash.com/photo-1600585152915-d208bec867a1']
WHERE name LIKE '%Dishwash%';

UPDATE products SET 
    image_url = 'https://images.unsplash.com/photo-1585421514738-01798e348b17',
    image_urls = ARRAY['https://images.unsplash.com/photo-1585421514738-01798e348b17']
WHERE name LIKE '%Floor Cleaner%';

UPDATE products SET 
    image_url = 'https://images.unsplash.com/photo-1585421514738-01798e348b17',
    image_urls = ARRAY['https://images.unsplash.com/photo-1585421514738-01798e348b17']
WHERE name LIKE '%Toilet Cleaner%';

UPDATE products SET 
    image_url = 'https://images.unsplash.com/photo-1612480557558-0d9bc655ec6a',
    image_urls = ARRAY['https://images.unsplash.com/photo-1612480557558-0d9bc655ec6a']
WHERE name LIKE '%Air Freshener%';

UPDATE products SET 
    image_url = 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be',
    image_urls = ARRAY['https://images.unsplash.com/photo-1620916566398-39f1143ab7be']
WHERE name LIKE '%Tissue Paper%';

UPDATE products SET 
    image_url = 'https://images.unsplash.com/photo-1604608672516-9e24b8c4f98d',
    image_urls = ARRAY['https://images.unsplash.com/photo-1604608672516-9e24b8c4f98d']
WHERE name LIKE '%Garbage Bags%';

UPDATE products SET 
    image_url = 'https://images.unsplash.com/photo-1585421514738-01798e348b17',
    image_urls = ARRAY['https://images.unsplash.com/photo-1585421514738-01798e348b17']
WHERE name LIKE '%Kitchen Wipes%';

-- Verify update count
SELECT 'Updated ' || COUNT(*) || ' products with new images' as result FROM products;
