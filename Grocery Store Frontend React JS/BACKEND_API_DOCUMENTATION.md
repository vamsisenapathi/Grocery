# Backend API Documentation

## Base URL
```
http://localhost:8081/api/v1
```

## Available Endpoints

### 1. Health Check
```http
GET /health
Response: { status: "UP", message: "Grocery Store API is running!" }
```

### 2. Products

#### Get All Products
```http
GET /products
Response: Array of products
Query Parameters:
  - category (optional): Filter by category
  - search (optional): Search term
  - page (optional): Page number
  - size (optional): Items per page
```

#### Get Product by ID
```http
GET /products/:id
Response: Single product object
```

#### Product Object Structure
```javascript
{
  id: "550e8400-e29b-41d4-a716-446655440001",
  name: "Product Name",
  description: "Product description",
  price: 299.99,
  category: "Electronics",
  stock: 50,
  imageUrl: "https://...",
  createdAt: "2025-11-05T14:30:00.000Z",
  updatedAt: "2025-11-05T14:30:00.000Z"
}
```

### 3. Categories

#### Available Categories
- electronics
- fashion
- foods
- fruits
- home-appliances
- mobiles
- snacks
- toys
- vegetables
- dairy
- bakery
- meat
- beverages
- frozen
- household

#### Get Products by Category
```http
GET /categories/{category-name}
Example: GET /categories/electronics
Response: Array of products in that category
```

### 4. Cart Operations

#### Get User Cart
```http
GET /cart/:userId
Response: {
  id: "cart_userId",
  userId: "userId",
  items: [
    {
      id: "item_timestamp",
      productId: "product-id",
      quantity: 2,
      price: 19.99,
      totalPrice: 39.98,
      product: {...productObject},
      addedAt: "2025-11-07T..."
    }
  ],
  totalItems: 2,
  totalPrice: 39.98,
  createdAt: "2025-11-07T...",
  updatedAt: "2025-11-07T..."
}
```

#### Add Item to Cart
```http
POST /cart/items
Body: {
  userId: "user-id",
  productId: "product-id",
  quantity: 1
}
Response: {
  message: "Item added to cart successfully",
  cart: {...cartObject},
  timestamp: "2025-11-07T..."
}
```

#### Update Cart Item Quantity
```http
POST /cart/items
Body: {
  userId: "user-id",
  productId: "product-id",  // Same product ID to update
  quantity: 1  // Positive to add, negative to subtract
}
```

#### Remove Item from Cart
```http
DELETE /cart/items/:cartItemId
Body: {
  userId: "user-id"
}
Response: {
  message: "Item removed from cart successfully",
  cart: {...cartObject},
  timestamp: "2025-11-07T..."
}
```

### 5. Authentication

#### Login
```http
POST /auth/login
Body: {
  email: "test@example.com",
  password: "password123"
}
Response: {
  token: "eyJhbGciOiJIUzI1...",
  user: {
    id: "550e8400-e29b-41d4-a716-446655440001",
    email: "test@example.com",
    name: "Test User"
  }
}
```

#### Register
```http
POST /auth/register
Body: {
  email: "user@example.com",
  password: "password",
  name: "User Name"
}
Response: {
  message: "User registered successfully",
  token: "eyJhbGciOiJIUzI1...",
  user: {...userObject}
}
```

## Frontend Integration Notes

### 1. User ID
- For development, you can use a static userId: `"550e8400-e29b-41d4-a716-446655440001"`
- Or generate from localStorage: `localStorage.getItem('userId') || 'guest-' + Date.now()`

### 2. Adding to Cart
```javascript
// When user clicks ADD button
await axios.post('http://localhost:8081/api/v1/cart/items', {
  userId: currentUserId,
  productId: product.id,
  quantity: 1
});
```

### 3. Incrementing Cart Item
```javascript
// When user clicks + button
await axios.post('http://localhost:8081/api/v1/cart/items', {
  userId: currentUserId,
  productId: product.id,
  quantity: 1  // Adds 1 to existing quantity
});
```

### 4. Decrementing Cart Item
```javascript
// When user clicks - button
await axios.post('http://localhost:8081/api/v1/cart/items', {
  userId: currentUserId,
  productId: product.id,
  quantity: -1  // Subtracts 1 from existing quantity
});
```

### 5. Removing from Cart
```javascript
// When user clicks delete/remove button
await axios.delete(`http://localhost:8081/api/v1/cart/items/${cartItemId}`, {
  data: { userId: currentUserId }
});
```

### 6. Stock Management
- Currently stock is not decremented automatically by the API
- Frontend should display stock from product.stock
- After adding to cart, you can optimistically update local state
- Backend will need to implement stock decrement in real implementation

### 7. Search Products
```javascript
// Search by name or description
const response = await axios.get('http://localhost:8081/api/v1/products', {
  params: {
    search: searchTerm
  }
});
```

### 8. Filter by Category
```javascript
// Get specific category products
const response = await axios.get(`http://localhost:8081/api/v1/categories/${categoryName}`);
// Or filter all products
const response = await axios.get('http://localhost:8081/api/v1/products', {
  params: {
    category: categoryName
  }
});
```

## Error Handling

All endpoints return standard error responses:
```javascript
{
  timestamp: "2025-11-07T...",
  status: 404,
  error: "Not Found",
  message: "Error message here",
  path: "/api/v1/..."
}
```

Common status codes:
- 200: Success
- 400: Bad Request (missing parameters)
- 404: Not Found (product/cart not found)
- 500: Internal Server Error
