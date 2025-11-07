#  Grocery Store Backend API Documentation

##  Base URL
```
http://localhost:8081/api/v1
```

**Version:** 1.0.0  
**Last Updated:** November 7, 2025

##  Headers
All POST/PUT requests require:
```
Content-Type: application/json
```

---

##  PRODUCTS API

### 1. Get All Products
```http
GET /products
```

**Query Parameters:**
- `categoryId` (optional, UUID) - Filter by category ID
- `subcategoryId` (optional, UUID) - Filter by subcategory ID
- `search` (optional, string, min 2 chars) - Search products by name, description, OR category name

**Search Behavior:**
- **Minimum length:** 2 characters required
- **Matches against:** Product name, description, AND category name
- **Partial matching:** "milk" matches "Milk Product", "Dairy Milk", "Milkshake"
- **Case insensitive:** "MILK" = "milk" = "Milk"

**Examples:**
```http
GET /products                                           # All products
GET /products?categoryId=550e8400-...                   # By category ID
GET /products?subcategoryId=550e8400-...                # By subcategory ID
GET /products?search=milk                               # Search: name/description/category containing "milk"
GET /products?search=da                                 # Search: matches "Dairy", "Bread", etc.
```

**Response:** `200 OK`
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "name": "Amul Taaza Toned Milk",
    "description": "Fresh toned milk, 1L pack",
    "price": 52.00,
    "mrp": 58.00,
    "categoryId": "550e8400-e29b-41d4-a716-446655440010",
    "categoryName": "Dairy & Bakery",
    "subcategoryId": "550e8400-e29b-41d4-a716-446655440020",
    "subcategoryName": "Milk & Cream",
    "brandId": "550e8400-e29b-41d4-a716-446655440030",
    "brandName": "Amul",
    "stock": 100,
    "unit": "L",
    "quantityPerUnit": "1",
    "imageUrl": "/images/milk.jpg",
    "imageUrls": ["/images/milk-1.jpg", "/images/milk-2.jpg"],
    "rating": 4.2,
    "reviewCount": 150,
    "discountPercentage": 10.00,
    "isAvailable": true,
    "isFeatured": false,
    "createdAt": "2025-11-05T10:30:00Z",
    "updatedAt": "2025-11-05T10:30:00Z"
  }
]
```

---

### 2. Get Products by Category Name
```http
GET /categories/{category-name}
```

**Path Parameters:**
- `category-name` (required) - Category name in kebab-case or plain text

**Category Name Mapping:**  
The API automatically converts kebab-case URLs to Title Case for database matching:
- `home-appliances`  "Home Appliances"
- `cold-drinks`  "Cold Drinks"
- `vegetables-fruits`  "Vegetables Fruits"
- `electronics`  "Electronics"

**Supported Categories:**
- Electronics, Fashion, Foods, Fruits, Home Appliances
- Mobiles, Snacks, Toys, Vegetables
- Fruits & Vegetables, Dairy & Bakery, Beverages, Snacks & Packaged Foods, Personal Care, Household

**Examples:**
```http
GET /categories/home-appliances           # Returns products in "Home Appliances" category
GET /categories/cold-drinks               # Returns products in "Cold Drinks" category
GET /categories/electronics               # Returns products in "Electronics" category
GET /categories/fruits-vegetables         # Returns products in "Fruits Vegetables" category
```

**Response:** `200 OK`
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "name": "Product Name",
    "description": "Product description",
    "price": 99.99,
    "categoryId": "550e8400-...",
    "categoryName": "Home Appliances",
    "stock": 50,
    ...
  }
]
```

---

### 3. Get Featured Products
```http
GET /products/featured
```

Returns all products marked as featured.

**Response:** `200 OK` (Same structure as Get All Products)

---

### 4. Get Product by ID
```http
GET /products/{id}
```

**Path Parameters:**
- `id` (UUID) - Product ID

**Response:** `200 OK`
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440001",
  "name": "Amul Taaza Toned Milk",
  "description": "Fresh toned milk, 1L pack",
  "price": 52.00,
  "mrp": 58.00,
  "categoryId": "550e8400-...",
  "categoryName": "Dairy & Bakery",
  ...
}
```

---

### 5. Create Product (Admin)
```http
POST /products
```

**Request Body:**
```json
{
  "name": "Product Name",
  "description": "Product description",
  "price": 99.99,
  "mrp": 120.00,
  "categoryId": "550e8400-...",
  "subcategoryId": "550e8400-...",
  "brandId": "550e8400-...",
  "stock": 100,
  "unit": "kg",
  "quantityPerUnit": "1",
  "discountPercentage": 10.00,
  "imageUrl": "/images/product.jpg",
  "isAvailable": true,
  "isFeatured": false
}
```

**Response:** `201 CREATED` (Same structure as Get Product)

---

### 6. Update Product (Admin)
```http
PUT /products/{id}
```

**Request Body:** Same as Create Product

**Response:** `200 OK` (Updated product)

---

### 7. Delete Product (Admin)
```http
DELETE /products/{id}
```

**Response:** `204 NO CONTENT`

---

##  CART API

### 1. Get Cart
```http
GET /cart
```

**Response:** `200 OK`
```json
{
  "id": "550e8400-...",
  "userId": "550e8400-...",
  "items": [
    {
      "id": "550e8400-...",
      "productId": "550e8400-...",
      "productName": "Amul Milk",
      "quantity": 2,
      "price": 52.00,
      "total": 104.00
    }
  ],
  "subtotal": 104.00,
  "tax": 10.40,
  "total": 114.40
}
```

---

### 2. Add to Cart
```http
POST /cart/items
```

**Request Body:**
```json
{
  "productId": "550e8400-...",
  "quantity": 2
}
```

**Response:** `200 OK` (Updated cart)

---

### 3. Update Cart Item
```http
PUT /cart/items/{itemId}
```

**Request Body:**
```json
{
  "quantity": 3
}
```

**Response:** `200 OK` (Updated cart)

---

### 4. Remove from Cart
```http
DELETE /cart/items/{itemId}
```

**Response:** `200 OK` (Updated cart)

---

### 5. Clear Cart
```http
DELETE /cart
```

**Response:** `204 NO CONTENT`

---

##  ORDERS API

### 1. Create Order
```http
POST /orders
```

**Request Body:**
```json
{
  "addressId": "550e8400-...",
  "paymentMethod": "CARD",
  "deliveryInstructions": "Leave at door"
}
```

**Response:** `201 CREATED`
```json
{
  "id": "550e8400-...",
  "orderNumber": "ORD-2025-001",
  "userId": "550e8400-...",
  "status": "PENDING",
  "items": [...],
  "subtotal": 500.00,
  "tax": 50.00,
  "deliveryFee": 40.00,
  "total": 590.00,
  "createdAt": "2025-11-07T10:00:00Z"
}
```

---

### 2. Get User Orders
```http
GET /orders
```

**Response:** `200 OK` (Array of orders)

---

### 3. Get Order by ID
```http
GET /orders/{id}
```

**Response:** `200 OK` (Single order)

---

### 4. Cancel Order
```http
POST /orders/{id}/cancel
```

**Response:** `200 OK` (Updated order)

---

##  ADDRESSES API

### 1. Create Address
```http
POST /addresses
```

**Request Body:**
```json
{
  "name": "Home",
  "addressLine1": "123 Main St",
  "addressLine2": "Apt 4B",
  "city": "Mumbai",
  "state": "Maharashtra",
  "pincode": "400001",
  "phoneNumber": "+911234567890",
  "isDefault": true
}
```

**Response:** `201 CREATED`

---

### 2. Get All Addresses
```http
GET /addresses
```

**Response:** `200 OK` (Array of addresses)

---

### 3. Update Address
```http
PUT /addresses/{id}
```

**Request Body:** Same as Create Address

**Response:** `200 OK` (Updated address)

---

### 4. Delete Address
```http
DELETE /addresses/{id}
```

**Response:** `204 NO CONTENT`

---

##  USER API

### 1. Get Profile
```http
GET /users/profile
```

**Response:** `200 OK`
```json
{
  "id": "550e8400-...",
  "name": "John Doe",
  "email": "john@example.com",
  "phoneNumber": "+911234567890",
  "createdAt": "2025-11-05T10:00:00Z"
}
```

---

### 2. Update Profile
```http
PUT /users/profile
```

**Request Body:**
```json
{
  "name": "John Doe Updated",
  "phoneNumber": "+919876543210"
}
```

**Response:** `200 OK` (Updated profile)

---

##  ERROR RESPONSES

All errors follow this format:

```json
{
  "timestamp": "2025-11-07T10:00:00Z",
  "status": 404,
  "error": "Not Found",
  "message": "Product not found with ID: 550e8400-...",
  "path": "/api/v1/products/550e8400-..."
}
```

**Common Error Codes:**
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)
- `409` - Conflict (duplicate resource)
- `500` - Internal Server Error

---

##  FRONTEND INTEGRATION TIPS

### 1. Search Implementation
```javascript
// Minimum 2 characters
const searchProducts = async (query) => {
  if (query.length < 2) return [];
  const response = await fetch(`/api/v1/products?search=${query}`);
  return await response.json();
};
```

### 2. Category-based Navigation
```javascript
// Use kebab-case URLs
const getCategoryProducts = async (categoryName) => {
  // Convert "Home Appliances" to "home-appliances"
  const kebabCase = categoryName.toLowerCase().replace(/\s+/g, '-');
  const response = await fetch(`/api/v1/categories/${kebabCase}`);
  return await response.json();
};
```

### 3. Sample Data Available
The backend includes sample data:
- **6 Categories:** Fruits & Vegetables, Dairy & Bakery, Beverages, etc.
- **Multiple Subcategories:** Fresh Fruits, Milk & Cream, Cold Drinks, etc.
- **5 Brands:** Amul, Tata, Nestle, Britannia, Haldiram''s
- **17 Products:** Apple, Banana, Mango, Milk, Bread, etc.

All products have:
- 10% discount
- 4.2 rating with 150 reviews
- Realistic pricing
- In-stock availability

---

**For any questions or issues, please contact the backend team.**
