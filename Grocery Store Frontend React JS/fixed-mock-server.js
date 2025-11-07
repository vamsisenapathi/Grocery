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
    imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
    createdAt: "2025-11-05T14:30:00.000Z",
    updatedAt: "2025-11-05T14:30:00.000Z"
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440002",
    name: "Wireless Headphones",
    description: "High-quality wireless headphones",
    price: 89.99,
    category: "Electronics",
    stock: 75,
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
    createdAt: "2025-11-05T14:30:00.000Z",
    updatedAt: "2025-11-05T14:30:00.000Z"
  },
  // Fashion
  {
    id: "550e8400-e29b-41d4-a716-446655440003",
    name: "Cotton T-Shirt",
    description: "Comfortable cotton t-shirt",
    price: 19.99,
    category: "Fashion",
    stock: 100,
    imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
    createdAt: "2025-11-05T14:30:00.000Z",
    updatedAt: "2025-11-05T14:30:00.000Z"
  }
];

// Add more products to simulate 804 products
for (let i = 4; i <= 804; i++) {
  const categories = ['Electronics', 'Fashion', 'Foods', 'Fruits', 'Home Appliances', 'Mobiles', 'Snacks', 'Toys', 'Vegetables'];
  const category = categories[i % categories.length];
  
  mockProducts.push({
    id: `550e8400-e29b-41d4-a716-44665544${String(i).padStart(4, '0')}`,
    name: `${category} Product ${i}`,
    description: `Description for ${category} product ${i}`,
    price: Math.round((Math.random() * 500 + 10) * 100) / 100,
    category: category,
    stock: Math.floor(Math.random() * 100) + 1,
    imageUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43",
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
      filteredProducts = filteredProducts.filter(p => 
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase())
      );
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

categoryEndpoints.forEach(categoryName => {
  app.get(`/api/v1/categories/${categoryName}`, (req, res) => {
    console.log(`📱 ${categoryName} category endpoint hit`);
    try {
      const normalizedCategory = categoryName.replace('-', ' ');
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
});