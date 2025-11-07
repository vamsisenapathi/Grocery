# Blinkit API Endpoints Documentation

## Product Endpoints

### 1. Get All Products
```
GET /api/v1/products
```
Returns all available products.

**Example:**
```
GET http://localhost:8081/api/v1/products
```

### 2. Search Products
```
GET /api/v1/products?search={query}
```
Search products by name, description, or category. Supports partial word matching.

**Examples:**
```
GET http://localhost:8081/api/v1/products?search=milk
GET http://localhost:8081/api/v1/products?search=da   # Matches "Dairy", "Bread", etc.
```

**Features:**
- Searches across product name, description, AND category
- Supports partial word matching
- Minimum query length: 2 characters
- Case-insensitive search

### 3. Get Product by ID
```
GET /api/v1/products/{productId}
```
Get details of a specific product.

**Example:**
```
GET http://localhost:8081/api/v1/products/550e8400-e29b-41d4-a716-446655440001
```

## Category Endpoints

### 4. Get All Categories
```
GET /api/v1/categories
```
Returns list of all available categories with metadata.

**Example:**
```
GET http://localhost:8081/api/v1/categories
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "electronics",
    "displayName": "Electronics",
    "imageUrl": "https://..."
  }
]
```

### 5. Get Products by Category (kebab-case supported)
```
GET /api/v1/categories/{category-name}
```
Get all products in a specific category. Supports kebab-case URL format.

**Examples:**
```
GET http://localhost:8081/api/v1/categories/electronics
GET http://localhost:8081/api/v1/categories/home-appliances
GET http://localhost:8081/api/v1/categories/cold-drinks
GET http://localhost:8081/api/v1/categories/fruits-vegetables
```

**Category Name Conversion:**
- URL: `home-appliances` → Database: `Home Appliances`
- URL: `cold-drinks` → Database: `Cold Drinks`
- URL: `vegetables-fruits` → Database: `Vegetables Fruits`

### 6. Get Featured Products
```
GET /api/v1/products/featured
```
Returns featured/highlighted products.

**Example:**
```
GET http://localhost:8081/api/v1/products/featured
```

## Supported Categories

The following categories are currently available:
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

## How Products Load from Backend

### HomePage (`/`)
- Loads ALL products using `GET /api/v1/products`
- Groups products by category
- Displays category-wise product sections
- Banners link to specific category pages

### CategoryPage (`/category/{name}`)
- Loads products for specific category using `GET /api/v1/categories/{name}`
- Supports kebab-case URLs (e.g., `/category/home-appliances`)
- Converts kebab-case to Title Case for matching

### SearchPage (`/search?q={query}`)
- Searches products using `GET /api/v1/products?search={query}`
- Validates minimum 2 characters
- Searches across name, description, and category
- Supports partial word matching

## Running the Backend Server

```bash
node mock-server.js
```

Server runs on: `http://localhost:8081`

## Testing the Endpoints

### Using Browser
```
http://localhost:8081/api/v1/products
http://localhost:8081/api/v1/products?search=smartphone
http://localhost:8081/api/v1/categories/electronics
```

### Using PowerShell
```powershell
Invoke-RestMethod -Uri "http://localhost:8081/api/v1/products" -Method GET
Invoke-RestMethod -Uri "http://localhost:8081/api/v1/products?search=milk" -Method GET
Invoke-RestMethod -Uri "http://localhost:8081/api/v1/categories/electronics" -Method GET
```

## Important Notes

1. **No Mock Data in Frontend**: All product data comes from backend API
2. **Search Validation**: Minimum 2 characters required for search
3. **Category Matching**: Backend automatically converts kebab-case to Title Case
4. **Error Handling**: All endpoints have proper error handling with descriptive messages
5. **CORS Enabled**: Backend allows cross-origin requests from frontend

## Branding Update

The application has been rebranded from "Grocery Store" to "Blinkit":
- Logo: Custom SVG with yellow "blink" + green "it"
- Theme Colors: 
  - Primary: #FFD400 (Yellow)
  - Secondary: #00A651 (Green)
- Title: "Blinkit - Grocery in Minutes"
