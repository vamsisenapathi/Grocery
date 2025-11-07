const express = require('express');
const cors = require('cors');

console.log('🚀 Starting Fixed Mock Grocery Store API server...');

const app = express();
const PORT = 8081;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.path}`);
  next();
});

// Mock data - using the actual product data structure
const mockProducts = [
  // Electronics
  {
    id: "550e8400-e29b-41d4-a716-446655440001",
    name: "Smartphone",
    description: "Latest Android smartphone with great features",
    price: 299.99,
    category: "Electronics",
    stock: 50,
    imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80",
    createdAt: "2025-11-05T14:30:00.000Z",
    updatedAt: "2025-11-05T14:30:00.000Z"
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440002",
    name: "Wireless Headphones",
    description: "High-quality wireless headphones with noise cancellation",
    price: 89.99,
    category: "Electronics",
    stock: 75,
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
    createdAt: "2025-11-05T14:30:00.000Z",
    updatedAt: "2025-11-05T14:30:00.000Z"
  },
  // Fashion
  {
    id: "550e8400-e29b-41d4-a716-446655440003",
    name: "Cotton T-Shirt",
    description: "Comfortable 100% cotton t-shirt in multiple colors",
    price: 19.99,
    category: "Fashion",
    stock: 100,
    imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80",
    createdAt: "2025-11-05T14:30:00.000Z",
    updatedAt: "2025-11-05T14:30:00.000Z"
  }
];

// Add more products to simulate 804 products
const categoryImages = {
  'Electronics': [
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1588058365548-9efe5acb8077?auto=format&fit=crop&w=800&q=80'
  ],
  'Fashion': [
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1573855619003-97b4799dcd8b?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80'
  ],
  'Foods': [
    'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?auto=format&fit=crop&w=800&q=80'
  ],
  'Fruits': [
    'https://images.unsplash.com/photo-1560807707-8cc77767d783?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1502741126161-b048400d73a5?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1574226516831-e1dff420e0f3?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1464965911861-746a04b4bca1?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1452195100486-9cc805987862?auto=format&fit=crop&w=800&q=80'
  ],
  'Home Appliances': [
    'https://images.unsplash.com/photo-1558618047-fd8adc469556?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1571175351006-98f7245b6e04?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1493946740644-2d8a1f1a6aff?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1543269664-56d93c1b41a6?auto=format&fit=crop&w=800&q=80'
  ],
  'Mobiles': [
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1542393545-10f5cde2c810?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1605236453806-6ff36851218e?auto=format&fit=crop&w=800&q=80'
  ],
  'Snacks': [
    'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1607580498176-45330ef59779?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=800&q=80'
  ],
  'Toys': [
    'https://images.unsplash.com/photo-1558060370-d644479cb6f7?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1566576912219-afd959744952?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1515378960530-7c0da6231fb1?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80'
  ],
  'Vegetables': [
    'https://images.unsplash.com/photo-1594282486031-6d9ad2d08090?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1583852886443-d5e40d4ddb0b?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1582515073490-39981397c445?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1590779033100-9f60a05a013d?auto=format&fit=crop&w=800&q=80'
  ]
};

for (let i = 4; i <= 804; i++) {
  const categories = ['Electronics', 'Fashion', 'Foods', 'Fruits', 'Home Appliances', 'Mobiles', 'Snacks', 'Toys', 'Vegetables'];
  const category = categories[i % categories.length];
  
  // Get a random image from the category's image array
  const categoryImageArray = categoryImages[category] || categoryImages['Foods'];
  const randomImageIndex = i % categoryImageArray.length;
  const imageUrl = categoryImageArray[randomImageIndex];
  
  mockProducts.push({
    id: `550e8400-e29b-41d4-a716-44665544${String(i).padStart(4, '0')}`,
    name: `${category} Product ${i}`,
    description: `High quality ${category.toLowerCase()} product ${i}`,
    price: Math.round((Math.random() * 500 + 10) * 100) / 100,
    category: category,
    stock: Math.floor(Math.random() * 100) + 1,
    imageUrl: imageUrl,
    createdAt: "2025-11-05T14:30:00.000Z",
    updatedAt: "2025-11-05T14:30:00.000Z"
  });
}

// Mock user for reference
const mockUser = {
  id: "550e8400-e29b-41d4-a716-446655440001",
  email: "test@example.com",
  name: "Test User",
  role: "customer"
};

// Health check
app.get('/api/v1/health', (req, res) => {
  console.log('📊 Health endpoint hit');
  res.json({ 
    status: 'OK', 
    message: 'Fixed Mock Grocery Store API is running',
    timestamp: new Date().toISOString(),
    productsCount: mockProducts.length
  });
});

// Test endpoint
app.get('/api/v1/test', (req, res) => {
  console.log('🧪 Test endpoint hit');
  res.json({ 
    message: 'Test endpoint working!',
    productsCount: mockProducts.length
  });
});

// Products endpoint (no authentication required)
app.get('/api/v1/products', (req, res) => {
  console.log('🛒 Products endpoint hit');
  try {
    const { category, search } = req.query;
    let filteredProducts = [...mockProducts];
    
    if (category) {
      filteredProducts = filteredProducts.filter(p => 
        p.category && p.category.toLowerCase() === category.toLowerCase()
      );
    }
    
    if (search) {
      const searchTerm = search.toLowerCase().trim();
      filteredProducts = filteredProducts.filter(p => {
        // Search in name, description, and category
        const nameMatch = p.name.toLowerCase().includes(searchTerm);
        const descMatch = p.description.toLowerCase().includes(searchTerm);
        const categoryMatch = p.category && p.category.toLowerCase().includes(searchTerm);
        
        // Also check for partial word matches (e.g., "milk" matches "Milk Product")
        const words = searchTerm.split(' ');
        const wordMatch = words.some(word => 
          p.name.toLowerCase().includes(word) || 
          p.description.toLowerCase().includes(word) ||
          (p.category && p.category.toLowerCase().includes(word))
        );
        
        return nameMatch || descMatch || categoryMatch || wordMatch;
      });
      console.log(`🔍 Search for "${search}": Found ${filteredProducts.length} products`);
    }
    
    res.json(filteredProducts);
  } catch (error) {
    console.error('Error in products endpoint:', error);
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
});

// Product by ID endpoint (no authentication required)
app.get('/api/v1/products/:id', (req, res) => {
  console.log('🛒 Product by ID endpoint hit');
  try {
    const product = mockProducts.find(p => p.id === req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({
        timestamp: new Date().toISOString(),
        status: 404,
        error: "Not Found",
        message: `Product not found with ID: ${req.params.id}`,
        path: req.path
      });
    }
  } catch (error) {
    console.error('Error in product by ID endpoint:', error);
    res.status(500).json({ message: 'Error fetching product', error: error.message });
  }
});

// Category endpoints (no authentication required as per API docs)
const categoryEndpoints = [
  'electronics', 'fashion', 'foods', 'fruits', 'home-appliances', 
  'mobiles', 'snacks', 'toys', 'vegetables', 'dairy', 'bakery', 
  'meat', 'beverages', 'frozen', 'household'
];

// Get all categories list
app.get('/api/v1/categories', (req, res) => {
  console.log('📂 Categories list endpoint hit');
  try {
    const uniqueCategories = [...new Set(mockProducts.map(p => p.category))].filter(Boolean);
    const categoriesList = uniqueCategories.map((cat, index) => ({
      id: index + 1,
      name: cat.toLowerCase().replace(/ /g, '-'),
      displayName: cat,
      imageUrl: `https://images.unsplash.com/photo-${1542838132 + index}?w=270&h=270&fit=crop`
    }));
    console.log(`Found ${categoriesList.length} categories`);
    res.json(categoriesList);
  } catch (error) {
    console.error('Error in categories endpoint:', error);
    res.status(500).json({ message: 'Error fetching categories', error: error.message });
  }
});

categoryEndpoints.forEach(categoryName => {
  app.get(`/api/v1/categories/${categoryName}`, (req, res) => {
    console.log(`📱 ${categoryName} category endpoint hit`);
    try {
      // Convert kebab-case to Title Case (e.g., 'home-appliances' -> 'Home Appliances')
      const normalizedCategory = categoryName
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      const categoryProducts = mockProducts.filter(p => 
        p.category && p.category.toLowerCase() === normalizedCategory.toLowerCase()
      );
      console.log(`Found ${categoryProducts.length} products for category: ${normalizedCategory}`);
      res.json(categoryProducts);
    } catch (error) {
      console.error(`Error in ${categoryName} endpoint:`, error);
      res.status(500).json({ 
        message: `Error fetching ${categoryName} products`, 
        error: error.message 
      });
    }
  });
});

// Mock JWT token for auth endpoints
const mockToken = "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiI1NTBlODQwMC1lMjliLTQxZDQtYTcxNi00NDY2NTU0NDAwMDEiLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJuYW1lIjoiVGVzdCBVc2VyIiwic3ViIjoidGVzdEBleGFtcGxlLmNvbSIsImlhdCI6MTY5OTIyMjIyMiwiZXhwIjoyMDk5MzA4NjIyfQ.mock-signature";

// Mock cart data
let mockCarts = {};

// Cart endpoints (no authentication required for development)
app.get('/api/v1/cart/:userId', (req, res) => {
  console.log('🛒 Get cart endpoint hit for user:', req.params.userId);
  try {
    const userId = req.params.userId;
    const userCart = mockCarts[userId] || {
      id: `cart_${userId}`,
      userId: userId,
      items: [],
      totalItems: 0,
      totalPrice: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    res.json(userCart);
  } catch (error) {
    console.error('Error in get cart endpoint:', error);
    res.status(500).json({ message: 'Error fetching cart', error: error.message });
  }
});

app.post('/api/v1/cart/items', (req, res) => {
  console.log('🛒 Add to cart endpoint hit');
  try {
    const { userId, productId, quantity = 1 } = req.body;
    
    if (!userId || !productId) {
      return res.status(400).json({
        message: 'userId and productId are required',
        timestamp: new Date().toISOString()
      });
    }

    // Find the product
    const product = mockProducts.find(p => p.id === productId);
    if (!product) {
      return res.status(404).json({
        message: 'Product not found',
        timestamp: new Date().toISOString()
      });
    }

    // Initialize cart if it doesn't exist
    if (!mockCarts[userId]) {
      mockCarts[userId] = {
        id: `cart_${userId}`,
        userId: userId,
        items: [],
        totalItems: 0,
        totalPrice: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    }

    const cart = mockCarts[userId];
    
    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(item => item.productId === productId);
    
    if (existingItemIndex >= 0) {
      // Update existing item
      cart.items[existingItemIndex].quantity += parseInt(quantity);
      cart.items[existingItemIndex].totalPrice = cart.items[existingItemIndex].quantity * product.price;
    } else {
      // Add new item
      const cartItem = {
        id: `item_${Date.now()}`,
        productId: productId,
        quantity: parseInt(quantity),
        price: product.price,
        totalPrice: product.price * parseInt(quantity),
        product: product,
        addedAt: new Date().toISOString()
      };
      cart.items.push(cartItem);
    }

    // Recalculate totals
    cart.totalItems = cart.items.reduce((total, item) => total + item.quantity, 0);
    cart.totalPrice = cart.items.reduce((total, item) => total + item.totalPrice, 0);
    cart.updatedAt = new Date().toISOString();

    console.log(`Added ${quantity} of product ${productId} to cart for user ${userId}`);
    res.json({
      message: 'Item added to cart successfully',
      cart: cart,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in add to cart endpoint:', error);
    res.status(500).json({ message: 'Error adding item to cart', error: error.message });
  }
});

// Update cart item quantity (PUT endpoint)
app.put('/api/v1/cart/items/:cartItemId', (req, res) => {
  console.log('🔄 Update cart item endpoint hit');
  try {
    const cartItemId = req.params.cartItemId;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        message: 'Quantity must be at least 1',
        validationErrors: { quantity: 'Quantity must be at least 1' },
        timestamp: new Date().toISOString()
      });
    }

    // Find the cart containing this item
    let foundCart = null;
    let foundUserId = null;
    
    for (const [userId, cart] of Object.entries(mockCarts)) {
      if (cart.items.some(item => item.id === cartItemId)) {
        foundCart = cart;
        foundUserId = userId;
        break;
      }
    }

    if (!foundCart) {
      return res.status(404).json({
        message: 'Cart item not found',
        timestamp: new Date().toISOString()
      });
    }

    // Update the item quantity
    const itemIndex = foundCart.items.findIndex(item => item.id === cartItemId);
    if (itemIndex >= 0) {
      foundCart.items[itemIndex].quantity = parseInt(quantity);
      foundCart.items[itemIndex].totalPrice = foundCart.items[itemIndex].quantity * foundCart.items[itemIndex].price;
      
      // Recalculate totals
      foundCart.totalItems = foundCart.items.reduce((total, item) => total + item.quantity, 0);
      foundCart.totalPrice = foundCart.items.reduce((total, item) => total + item.totalPrice, 0);
      foundCart.updatedAt = new Date().toISOString();

      console.log(`Updated cart item ${cartItemId} to quantity ${quantity}`);
      res.json({
        message: 'Cart item updated successfully',
        cart: foundCart,
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(404).json({
        message: 'Cart item not found',
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error('Error in update cart item endpoint:', error);
    res.status(500).json({ message: 'Error updating cart item', error: error.message });
  }
});

app.delete('/api/v1/cart/items/:cartItemId', (req, res) => {
  console.log('🛒 Remove from cart endpoint hit');
  try {
    const cartItemId = req.params.cartItemId;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        message: 'userId is required',
        timestamp: new Date().toISOString()
      });
    }

    const cart = mockCarts[userId];
    if (!cart) {
      return res.status(404).json({
        message: 'Cart not found',
        timestamp: new Date().toISOString()
      });
    }

    // Remove item from cart
    cart.items = cart.items.filter(item => item.id !== cartItemId);
    
    // Recalculate totals
    cart.totalItems = cart.items.reduce((total, item) => total + item.quantity, 0);
    cart.totalPrice = cart.items.reduce((total, item) => total + item.totalPrice, 0);
    cart.updatedAt = new Date().toISOString();

    console.log(`Removed item ${cartItemId} from cart for user ${userId}`);
    res.json({
      message: 'Item removed from cart successfully',
      cart: cart,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in remove from cart endpoint:', error);
    res.status(500).json({ message: 'Error removing item from cart', error: error.message });
  }
});

// Auth endpoints
app.post('/api/v1/auth/login', (req, res) => {
  console.log('🔐 Login endpoint hit');
  const { email, password } = req.body;
  
  if (email === 'test@example.com' && password === 'password123') {
    res.json({
      token: mockToken,
      tokenType: "Bearer",
      ...mockUser,
      createdAt: "2025-11-05T14:30:00.000Z",
      updatedAt: "2025-11-05T14:30:00.000Z"
    });
  } else {
    res.status(401).json({
      timestamp: new Date().toISOString(),
      status: 401,
      error: "Unauthorized",
      message: "Invalid email or password",
      path: req.path
    });
  }
});

app.post('/api/v1/auth/register', (req, res) => {
  console.log('📝 Register endpoint hit');
  const { email, password, name } = req.body;
  
  res.status(201).json({
    id: "550e8400-e29b-41d4-a716-446655440999",
    email,
    name,
    role: "customer",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    message: "Registration successful"
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('❌ Unhandled error:', error);
  res.status(500).json({
    timestamp: new Date().toISOString(),
    status: 500,
    error: 'Internal Server Error',
    message: 'An unexpected error occurred. Please try again later.',
    path: req.path
  });
});

// 404 handler
app.use((req, res) => {
  console.log(`❓ 404 - Route not found: ${req.method} ${req.path}`);
  res.status(404).json({
    timestamp: new Date().toISOString(),
    status: 404,
    error: "Not Found",
    message: `Route not found: ${req.method} ${req.path}`,
    path: req.path
  });
});

app.listen(PORT, () => {
  console.log(`🎉 Fixed Mock Grocery Store API running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/v1/health`);
  console.log(`🧪 Test: http://localhost:${PORT}/api/v1/test`);
  console.log(`🛒 Products: http://localhost:${PORT}/api/v1/products`);
  console.log(`📱 Electronics: http://localhost:${PORT}/api/v1/categories/electronics`);
  console.log(`🔐 Test login: test@example.com / password123`);
  console.log('');
  console.log('📖 Available category endpoints:');
  categoryEndpoints.forEach(cat => {
    console.log(`   GET  /api/v1/categories/${cat}`);
  });
  console.log('');
  console.log('📖 Other endpoints:');
  console.log('   POST /api/v1/auth/login');
  console.log('   POST /api/v1/auth/register');
  console.log('   GET  /api/v1/products');
  console.log('   GET  /api/v1/products/:id');
  console.log('   GET  /api/v1/cart/:userId');
  console.log('   POST /api/v1/cart/items');
  console.log('   PUT  /api/v1/cart/items/:cartItemId');
  console.log('   DELETE /api/v1/cart/items/:cartItemId');
});