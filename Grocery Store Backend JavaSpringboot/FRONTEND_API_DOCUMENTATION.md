# Grocery Store Backend - Frontend API Documentation

**Base URL:** `http://localhost:8081/api/v1`

**Last Updated:** November 7, 2025

**Total Products in Database:** 801

---

## 📋 Table of Contents

1. [Products API](#products-api)
2. [Cart API](#cart-api)
3. [Categories API](#categories-api)
4. [Search Functionality](#search-functionality)
5. [Error Responses](#error-responses)
6. [Testing Examples](#testing-examples)

---

## 🛍️ Products API

### 1. Get All Products

Retrieves all products from the database.

**Endpoint:** `GET /products`

**Response:** Array of products

```json
[
  {
    "id": "dcfb8535-118a-47a2-956f-56d542041644",
    "name": "Amul Taaza Toned Milk",
    "description": "Fresh toned milk",
    "price": 28.00,
    "mrp": 30.00,
    "categoryId": "016043e9-7d65-43e1-a1c4-c0510d37bdb8",
    "categoryName": "Dairy & Bakery",
    "subcategoryId": "33e9d56a-8d55-465b-bf16-4de52a12bf72",
    "subcategoryName": "Milk & Dairy Products",
    "brandId": "a0dbb50e-4f69-4d2a-a188-9b9e32525e09",
    "brandName": "Amul",
    "stock": 200,
    "unit": "L",
    "quantityPerUnit": 1.00,
    "weightQuantity": "1 L",
    "discountPercentage": 15.00,
    "rating": 4.5,
    "reviewCount": 150,
    "imageUrl": "https://images.unsplash.com/photo-1550583724-b2692b85b150",
    "imageUrls": [
      "https://images.unsplash.com/photo-1550583724-b2692b85b150"
    ],
    "isAvailable": true,
    "isFeatured": true,
    "isTrending": false,
    "isNewArrival": false,
    "tags": ["dairy", "milk", "fresh"],
    "minOrderQuantity": 1,
    "maxOrderQuantity": 10,
    "createdAt": "2025-11-07T13:07:23.181655Z",
    "updatedAt": "2025-11-07T13:07:23.181655Z"
  }
]
```

**Notes:**
- Returns all 801 products
- No pagination currently implemented
- Images are from Unsplash and are publicly accessible

---

### 2. Search Products

Search products by name, description, or category.

**Endpoint:** `GET /products?search={searchTerm}`

**Query Parameters:**
- `search` (string, required): Search term (minimum 2 characters)

**Examples:**
```
GET /products?search=milk       // Returns 26 milk products
GET /products?search=apple      // Returns 28 apple products
GET /products?search=bread      // Returns 25 bread products
GET /products?search=chips      // Returns 31 chips products
```

**Response:** Array of matching products (same structure as Get All Products)

**Search Features:**
- ✅ Searches in product name
- ✅ Searches in product description
- ✅ Searches in category name
- ✅ Case-insensitive search
- ✅ Partial matching supported
- ✅ Minimum 2 characters required

---

### 3. Filter Products by Category

Get all products in a specific category.

**Endpoint:** `GET /products?categoryId={categoryId}`

**Query Parameters:**
- `categoryId` (UUID, required): Category UUID

**Example:**
```
GET /products?categoryId=29fc893a-ba90-43a9-bcfe-30e59433844b
// Returns 206 products in "Fruits & Vegetables"
```

**Available Category IDs:**
- `29fc893a-ba90-43a9-bcfe-30e59433844b` - Fruits & Vegetables (206 products)
- `016043e9-7d65-43e1-a1c4-c0510d37bdb8` - Dairy & Bakery (153 products)
- `6096240d-5a08-4b9d-9e2c-71c634fee065` - Snacks & Beverages (285 products)
- `a0431904-3dc4-48ff-8ecf-08207a0429bc` - Groceries & Staples (3 products)
- `62556c79-3ce8-4e43-9b84-1443919138bc` - Personal Care (80 products)
- `cdbae0d0-d38d-4aa0-84c9-18a8d41b634d` - Household Items (74 products)

---

### 4. Filter Products by Subcategory

Get all products in a specific subcategory.

**Endpoint:** `GET /products?subcategoryId={subcategoryId}`

**Query Parameters:**
- `subcategoryId` (UUID, required): Subcategory UUID

**Example:**
```
GET /products?subcategoryId=0276104e-1413-454b-9936-2f90040f2844
// Returns products in "Fresh Fruits"
```

---

### 5. Get Featured Products

Get all featured products.

**Endpoint:** `GET /products/featured`

**Response:** Array of featured products (261 products marked as featured)

**Example:**
```
GET /products/featured
// Returns 261 featured products
```

---

### 6. Get Single Product

Get details of a specific product by ID.

**Endpoint:** `GET /products/{productId}`

**Path Parameters:**
- `productId` (UUID, required): Product UUID

**Example:**
```
GET /products/dcfb8535-118a-47a2-956f-56d542041644
```

**Response:** Single product object

**Error Response (404):**
```json
{
  "timestamp": "2025-11-07T13:30:00.000Z",
  "status": 404,
  "error": "Not Found",
  "message": "Product not found with ID: dcfb8535-118a-47a2-956f-56d542041644",
  "path": "/api/v1/products/dcfb8535-118a-47a2-956f-56d542041644"
}
```

---

### 7. Create Product (Admin)

Create a new product.

**Endpoint:** `POST /products`

**Request Body:**
```json
{
  "name": "Fresh Orange Juice",
  "description": "100% natural orange juice",
  "price": 85.00,
  "mrp": 100.00,
  "categoryId": "6096240d-5a08-4b9d-9e2c-71c634fee065",
  "subcategoryId": "7e1f2345-1234-5678-9abc-def012345678",
  "brandId": null,
  "stock": 50,
  "unit": "ml",
  "quantityPerUnit": 1.00,
  "weightQuantity": "500 ml",
  "discountPercentage": 15.00,
  "imageUrl": "https://images.unsplash.com/photo-1600271886742-f049cd451bba",
  "imageUrls": ["https://images.unsplash.com/photo-1600271886742-f049cd451bba"],
  "isAvailable": true,
  "isFeatured": false,
  "tags": ["juice", "beverages", "fresh"],
  "minOrderQuantity": 1,
  "maxOrderQuantity": 10
}
```

**Response:** Created product object (201 Created)

---

### 8. Update Product (Admin)

Update an existing product.

**Endpoint:** `PUT /products/{productId}`

**Path Parameters:**
- `productId` (UUID, required): Product UUID

**Request Body:** Same as Create Product

**Response:** Updated product object (200 OK)

---

### 9. Delete Product (Admin)

Delete a product.

**Endpoint:** `DELETE /products/{productId}`

**Path Parameters:**
- `productId` (UUID, required): Product UUID

**Response:** No content (204 No Content)

---

## 🛒 Cart API

### 1. Get Cart

Get or create a cart for a user.

**Endpoint:** `GET /cart/{userId}`

**Path Parameters:**
- `userId` (UUID, required): User UUID

**Example:**
```
GET /cart/ab3d9b07-2393-40fc-ad01-05eb12c3a549
```

**Response:**
```json
{
  "id": "f8e7d6c5-b4a3-9281-7069-584736251abc",
  "userId": "ab3d9b07-2393-40fc-ad01-05eb12c3a549",
  "items": [],
  "totalItems": 0,
  "totalPrice": 0.00,
  "createdAt": "2025-11-07T13:30:00.000Z",
  "updatedAt": "2025-11-07T13:30:00.000Z"
}
```

**Notes:**
- If cart doesn't exist, a new empty cart is created automatically
- Returns existing cart if it exists

---

### 2. Add Item to Cart

Add a product to the cart or update quantity if already exists.

**Endpoint:** `POST /cart/items`

**Request Body:**
```json
{
  "userId": "ab3d9b07-2393-40fc-ad01-05eb12c3a549",
  "productId": "dcfb8535-118a-47a2-956f-56d542041644",
  "quantity": 2
}
```

**Response:**
```json
{
  "id": "f8e7d6c5-b4a3-9281-7069-584736251abc",
  "userId": "ab3d9b07-2393-40fc-ad01-05eb12c3a549",
  "items": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "productId": "dcfb8535-118a-47a2-956f-56d542041644",
      "productName": "Amul Taaza Toned Milk",
      "productImage": "https://images.unsplash.com/photo-1550583724-b2692b85b150",
      "quantity": 2,
      "priceAtAdd": 28.00,
      "subtotal": 56.00,
      "createdAt": "2025-11-07T13:30:00.000Z",
      "updatedAt": "2025-11-07T13:30:00.000Z"
    }
  ],
  "totalItems": 1,
  "totalPrice": 56.00,
  "createdAt": "2025-11-07T13:30:00.000Z",
  "updatedAt": "2025-11-07T13:30:00.000Z"
}
```

**Features:**
- ✅ Validates product exists
- ✅ Checks stock availability
- ✅ If item already in cart, quantity is added
- ✅ Creates cart automatically if doesn't exist

**Error Response (400 - Insufficient Stock):**
```json
{
  "timestamp": "2025-11-07T13:30:00.000Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Insufficient stock for product 'Amul Taaza Toned Milk'. Requested: 250, Available: 200",
  "path": "/api/v1/cart/items"
}
```

---

### 3. Update Cart Item

Update the quantity of a cart item.

**Endpoint:** `PUT /cart/items/{itemId}`

**Path Parameters:**
- `itemId` (UUID, required): Cart item UUID

**Request Body:**
```json
{
  "quantity": 5
}
```

**Response:** Updated cart object (same structure as Get Cart)

**Features:**
- ✅ Validates stock availability
- ✅ Updates quantity to exact value (not additive)

---

### 4. Remove Item from Cart

Remove a specific item from the cart.

**Endpoint:** `DELETE /cart/items/{itemId}`

**Path Parameters:**
- `itemId` (UUID, required): Cart item UUID

**Response:** No content (204 No Content)

---

### 5. Clear Cart

Remove all items from a user's cart.

**Endpoint:** `DELETE /cart/{userId}`

**Path Parameters:**
- `userId` (UUID, required): User UUID

**Response:** No content (204 No Content)

---

## 📂 Categories API

### Get Products by Category Name (Kebab-Case)

Get products using category name in kebab-case format.

**Endpoint:** `GET /categories/{categoryName}`

**Path Parameters:**
- `categoryName` (string, required): Category name in kebab-case

**Examples:**
```
GET /categories/fruits-vegetables     // Returns Fruits & Vegetables products
GET /categories/dairy-bakery           // Returns Dairy & Bakery products
GET /categories/snacks-beverages       // Returns Snacks & Beverages products
GET /categories/groceries-staples      // Returns Groceries & Staples products
GET /categories/personal-care          // Returns Personal Care products
GET /categories/household-items        // Returns Household Items products
```

**Response:** Array of products in that category

**Note:** The backend converts kebab-case to Title Case automatically:
- `fruits-vegetables` → `Fruits & Vegetables`
- `dairy-bakery` → `Dairy & Bakery`

---

## 🔍 Search Functionality

### Comprehensive Search Guide

The search endpoint supports flexible searching across multiple fields:

**Endpoint:** `GET /products?search={term}`

**What You Can Search:**
1. **Product Names** - Exact or partial matches
2. **Product Descriptions** - Full-text search
3. **Category Names** - Search by category

**Search Examples:**

```javascript
// Frontend Implementation Example
const searchProducts = async (searchTerm) => {
  if (searchTerm.length < 2) {
    // Minimum 2 characters required
    return [];
  }
  
  const response = await fetch(
    `http://localhost:8081/api/v1/products?search=${encodeURIComponent(searchTerm)}`
  );
  return await response.json();
};

// Usage Examples:
searchProducts("milk");      // 26 results
searchProducts("apple");     // 28 results
searchProducts("organic");   // All organic products
searchProducts("fresh");     // All products with "fresh" in name/description
searchProducts("dairy");     // All dairy products
searchProducts("500ml");     // All 500ml products
searchProducts("chips");     // 31 chip varieties
searchProducts("bread");     // 25 bread products
searchProducts("detergent"); // Cleaning products
searchProducts("shampoo");   // Personal care products
```

**Search Performance:**
- ✅ Case-insensitive
- ✅ Partial matching
- ✅ Searches name, description, and category
- ✅ Returns empty array if less than 2 characters
- ✅ Fast indexing on product names

**Common Search Keywords:**
- Food items: `milk`, `bread`, `apple`, `orange`, `banana`, `rice`, `wheat`
- Beverages: `juice`, `cola`, `pepsi`, `sprite`, `water`, `coffee`, `tea`
- Snacks: `chips`, `biscuits`, `cookies`, `namkeen`, `chocolate`, `candy`
- Dairy: `milk`, `curd`, `paneer`, `butter`, `cheese`, `ghee`
- Bakery: `bread`, `pav`, `bun`, `cake`, `pastry`, `croissant`, `muffin`
- Personal Care: `shampoo`, `soap`, `toothpaste`, `face wash`, `deodorant`
- Household: `detergent`, `cleaner`, `tissue`, `bags`, `wipes`
- Brands: `amul`, `haldiram`, `coca cola`, `pepsi`, `tropicana`, `lays`
- Attributes: `organic`, `fresh`, `premium`, `large`, `small`, `500ml`, `1L`

---

## ❌ Error Responses

### Common HTTP Status Codes

**404 - Not Found**
```json
{
  "timestamp": "2025-11-07T13:30:00.000Z",
  "status": 404,
  "error": "Not Found",
  "message": "Product not found with ID: {productId}",
  "path": "/api/v1/products/{productId}"
}
```

**400 - Bad Request (Insufficient Stock)**
```json
{
  "timestamp": "2025-11-07T13:30:00.000Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Insufficient stock for product '{productName}'. Requested: {requested}, Available: {available}",
  "path": "/api/v1/cart/items"
}
```

**400 - Bad Request (Validation Error)**
```json
{
  "timestamp": "2025-11-07T13:30:00.000Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "errors": {
    "name": "Product name is required",
    "price": "Price must be greater than 0"
  },
  "path": "/api/v1/products"
}
```

**500 - Internal Server Error**
```json
{
  "timestamp": "2025-11-07T13:30:00.000Z",
  "status": 500,
  "error": "Internal Server Error",
  "message": "An unexpected error occurred",
  "path": "/api/v1/products"
}
```

---

## 🧪 Testing Examples

### Using JavaScript/Fetch

```javascript
// Get all products
const getAllProducts = async () => {
  const response = await fetch('http://localhost:8081/api/v1/products');
  const products = await response.json();
  return products;
};

// Search products
const searchProducts = async (searchTerm) => {
  const response = await fetch(
    `http://localhost:8081/api/v1/products?search=${encodeURIComponent(searchTerm)}`
  );
  return await response.json();
};

// Get products by category
const getProductsByCategory = async (categoryId) => {
  const response = await fetch(
    `http://localhost:8081/api/v1/products?categoryId=${categoryId}`
  );
  return await response.json();
};

// Get single product
const getProduct = async (productId) => {
  const response = await fetch(
    `http://localhost:8081/api/v1/products/${productId}`
  );
  if (!response.ok) {
    throw new Error('Product not found');
  }
  return await response.json();
};

// Add to cart
const addToCart = async (userId, productId, quantity) => {
  const response = await fetch('http://localhost:8081/api/v1/cart/items', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId,
      productId,
      quantity,
    }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }
  
  return await response.json();
};

// Get cart
const getCart = async (userId) => {
  const response = await fetch(`http://localhost:8081/api/v1/cart/${userId}`);
  return await response.json();
};

// Update cart item
const updateCartItem = async (itemId, quantity) => {
  const response = await fetch(
    `http://localhost:8081/api/v1/cart/items/${itemId}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ quantity }),
    }
  );
  return await response.json();
};

// Remove from cart
const removeFromCart = async (itemId) => {
  await fetch(`http://localhost:8081/api/v1/cart/items/${itemId}`, {
    method: 'DELETE',
  });
};

// Clear cart
const clearCart = async (userId) => {
  await fetch(`http://localhost:8081/api/v1/cart/${userId}`, {
    method: 'DELETE',
  });
};
```

### Using Axios

```javascript
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081/api/v1';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Products
export const getAllProducts = () => api.get('/products');
export const searchProducts = (term) => api.get(`/products?search=${term}`);
export const getProductsByCategory = (categoryId) => 
  api.get(`/products?categoryId=${categoryId}`);
export const getFeaturedProducts = () => api.get('/products/featured');
export const getProduct = (id) => api.get(`/products/${id}`);

// Cart
export const getCart = (userId) => api.get(`/cart/${userId}`);
export const addToCart = (userId, productId, quantity) =>
  api.post('/cart/items', { userId, productId, quantity });
export const updateCartItem = (itemId, quantity) =>
  api.put(`/cart/items/${itemId}`, { quantity });
export const removeFromCart = (itemId) => api.delete(`/cart/items/${itemId}`);
export const clearCart = (userId) => api.delete(`/cart/${userId}`);
```

### Using PowerShell (for testing)

```powershell
# Get all products
Invoke-RestMethod -Uri "http://localhost:8081/api/v1/products" -Method GET

# Search products
Invoke-RestMethod -Uri "http://localhost:8081/api/v1/products?search=milk" -Method GET

# Get featured products
Invoke-RestMethod -Uri "http://localhost:8081/api/v1/products/featured" -Method GET

# Get single product
$productId = "dcfb8535-118a-47a2-956f-56d542041644"
Invoke-RestMethod -Uri "http://localhost:8081/api/v1/products/$productId" -Method GET

# Add to cart
$userId = [guid]::NewGuid()
$body = @{
    userId = $userId
    productId = "dcfb8535-118a-47a2-956f-56d542041644"
    quantity = 2
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8081/api/v1/cart/items" `
                  -Method POST `
                  -Body $body `
                  -ContentType "application/json"

# Get cart
Invoke-RestMethod -Uri "http://localhost:8081/api/v1/cart/$userId" -Method GET
```

---

## 📊 Database Statistics

**Total Products:** 801

**Products by Category:**
- Snacks & Beverages: 285 products
- Fruits & Vegetables: 206 products
- Dairy & Bakery: 153 products
- Personal Care: 80 products
- Household Items: 74 products
- Groceries & Staples: 3 products

**Featured Products:** 261

**Product Attributes:**
- All products have valid images from Unsplash
- All products have stock information
- All products have pricing (price and MRP)
- Products have ratings and review counts
- Products support tags for advanced filtering

---

## 🔧 Important Notes for Frontend Developers

1. **CORS Enabled:** All endpoints have `@CrossOrigin(origins = "*")` enabled for development

2. **UUID Format:** All IDs are UUIDs in the format: `dcfb8535-118a-47a2-956f-56d542041644`

3. **No Pagination:** Currently, the products endpoint returns all products. Frontend should implement client-side pagination if needed.

4. **Image URLs:** All images are from Unsplash and are publicly accessible. No authentication needed.

5. **Cart Persistence:** Carts are persisted in PostgreSQL database. Use the same `userId` to retrieve the same cart.

6. **Stock Validation:** The backend validates stock before adding/updating cart items. Handle the error response gracefully.

7. **Search Minimum:** Search requires minimum 2 characters. Frontend should disable search or show message for 1 character.

8. **Price Format:** All prices are in decimal format (e.g., 28.00). Use ₹ symbol in frontend.

9. **Response Times:** All endpoints respond quickly (<100ms for most queries).

10. **Error Handling:** Always implement try-catch blocks and handle error responses with proper user messages.

---

## 🚀 Quick Start Integration

```javascript
// Example: Product Listing Page
import { useEffect, useState } from 'react';

function ProductListPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:8081/api/v1/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    if (term.length < 2) {
      fetchProducts(); // Reset to all products
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8081/api/v1/products?search=${encodeURIComponent(term)}`
      );
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error searching products:', error);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={handleSearch}
      />
      
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="products-grid">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

// Example: Shopping Cart
function ShoppingCart({ userId }) {
  const [cart, setCart] = useState(null);

  useEffect(() => {
    fetchCart();
  }, [userId]);

  const fetchCart = async () => {
    try {
      const response = await fetch(`http://localhost:8081/api/v1/cart/${userId}`);
      const data = await response.json();
      setCart(data);
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  const addToCart = async (productId, quantity) => {
    try {
      const response = await fetch('http://localhost:8081/api/v1/cart/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, productId, quantity }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        alert(error.message); // Show stock error to user
        return;
      }
      
      const data = await response.json();
      setCart(data);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  return (
    <div>
      <h2>Shopping Cart</h2>
      {cart && (
        <>
          <p>Total Items: {cart.totalItems}</p>
          <p>Total Price: ₹{cart.totalPrice}</p>
          
          {cart.items.map(item => (
            <CartItem key={item.id} item={item} />
          ))}
        </>
      )}
    </div>
  );
}
```

---

## 📞 Support

If you encounter any issues or have questions:
1. Check the database connection (PostgreSQL should be running on port 5432)
2. Verify the backend is running on port 8081
3. Check the console logs for detailed error messages
4. All endpoints support CORS for local development

**Backend Status Check:**
```bash
# PowerShell
Get-NetTCPConnection -LocalPort 8081
```

If port 8081 is listening, the backend is running successfully.

---

## ✅ Validation Checklist

Before integrating with frontend:
- [x] Products API returns all 801 products
- [x] Search works for all keywords (milk, apple, bread, chips, etc.)
- [x] Featured products endpoint returns 261 products
- [x] Category filtering works (6 categories)
- [x] Single product retrieval works
- [x] Cart creation works
- [x] Add to cart works with stock validation
- [x] Update cart item works
- [x] Remove cart item works
- [x] Clear cart works
- [x] All images load from Unsplash
- [x] CORS enabled for all endpoints
- [x] Error responses are consistent
- [x] All endpoints respond quickly (<100ms)

---

**End of Documentation**

Last tested: November 7, 2025  
Backend Version: Spring Boot 3.5.0  
Database: PostgreSQL 18.0  
Total Products: 801  
All endpoints: ✅ WORKING
