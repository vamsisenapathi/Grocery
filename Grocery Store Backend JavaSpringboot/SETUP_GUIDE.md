# 🚀 Complete Setup Guide - Grocery Store Backend

## 📋 Prerequisites Installation

### 1. Install Required Software
- **Java 21 JDK**: Download from [Oracle](https://www.oracle.com/java/technologies/downloads/) or [OpenJDK](https://adoptium.net/)
- **PostgreSQL**: Download from [PostgreSQL.org](https://www.postgresql.org/download/)
- **pgAdmin 4**: Download from [pgAdmin.org](https://www.pgadmin.org/download/)
- **Maven**: Download from [Maven.apache.org](https://maven.apache.org/download.cgi)

## 🗄️ PostgreSQL Database Setup in pgAdmin4

### Step 1: Open pgAdmin4
1. Launch pgAdmin4
2. Enter your master password (set during PostgreSQL installation)

### Step 2: Connect to PostgreSQL Server
1. In the left panel, expand "Servers"
2. Right-click on "PostgreSQL 15" (or your version)
3. Click "Connect Server"
4. Enter your PostgreSQL password (set during installation)

### Step 3: Create Database
1. Right-click on "Databases"
2. Select "Create" → "Database..."
3. In the "General" tab:
   - **Database name**: `grocerydb`
   - **Owner**: `postgres` (or your preferred user)
4. Click "Save"

### Step 4: Create Database User (Optional but Recommended)
1. Right-click on "Login/Group Roles"
2. Select "Create" → "Login/Group Role..."
3. In the "General" tab:
   - **Name**: `admin`
4. In the "Definition" tab:
   - **Password**: `admin`
5. In the "Privileges" tab:
   - Check "Can login?"
   - Check "Superuser?" (for development)
6. Click "Save"

### Step 5: Grant Permissions
1. Right-click on `grocerydb` database
2. Select "Properties"
3. Go to "Security" tab
4. Click "+" to add a new privilege
5. Select "admin" as Grantee
6. Grant all privileges
7. Click "Save"

## 🏗️ Backend Application Setup

### Step 1: Navigate to Project Directory
```powershell
cd "C:\Vamsi\React js\App\Grocery Store\Grocery Store Backend JavaSpringboot"
```

### Step 2: Verify Java Installation
```powershell
java -version
javac -version
mvn -version
```

### Step 3: Clean and Build Project
```powershell
mvn clean compile
mvn clean package -DskipTests
```

### Step 4: Run the Application
```powershell
java -jar target/grocery-backend.jar
```

**Alternative: Run with Maven**
```powershell
mvn spring-boot:run
```

## ✅ Verify Setup

### 1. Check Application Startup
Look for these log messages:
```
Started GroceryAppBackendApplication in X.XXX seconds
Tomcat started on port 8081 (http) with context path '/api/v1'
```

### 2. Test Health Endpoint
Open browser: `http://localhost:8081/api/v1/actuator/health`

Expected response:
```json
{
  "status": "UP",
  "components": {
    "db": {
      "status": "UP",
      "details": {
        "database": "PostgreSQL",
        "validationQuery": "isValid()"
      }
    },
    "diskSpace": {
      "status": "UP"
    },
    "ping": {
      "status": "UP"
    }
  }
}
```

### 3. Test Products Endpoint
Open browser: `http://localhost:8081/api/v1/products`

Should return array of sample products.

## 🔧 Troubleshooting

### Issue 1: Port 8080 Already in Use
```powershell
# Find process using port 8080
netstat -ano | findstr :8080

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

### Issue 2: Database Connection Failed
1. Verify PostgreSQL is running:
   - Open Services (services.msc)
   - Check "postgresql-x64-15" service is running
2. Test connection in pgAdmin4
3. Verify credentials in `application.yml`

### Issue 3: Maven Build Failed
```powershell
# Clear Maven cache
mvn dependency:purge-local-repository

# Rebuild
mvn clean install -U
```

## 🌐 API Endpoints for Frontend

### Base URL
```
http://localhost:8080/api/v1
```

### Products API

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| GET | `/products` | Get all products | None |
| GET | `/products?category=Fruits` | Filter by category | None |
| GET | `/products?search=apple` | Search products | None |
| GET | `/products/{productId}` | Get specific product | None |
| POST | `/products` | Create new product | ProductRequestDto |
| PUT | `/products/{productId}` | Update product | ProductRequestDto |
| DELETE | `/products/{productId}` | Delete product | None |

### Cart API

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| GET | `/cart/{userId}` | Get user's cart | None |
| POST | `/cart/{userId}/items` | Add item to cart | AddToCartRequestDto |
| PUT | `/cart/{userId}/items/{itemId}` | Update item quantity | UpdateCartItemRequestDto |
| DELETE | `/cart/{userId}/items/{itemId}` | Remove item from cart | None |
| DELETE | `/cart/{userId}` | Clear entire cart | None |

## 📊 Request/Response Examples

### 1. Get All Products
```http
GET http://localhost:8080/api/v1/products
```

**Response:**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "name": "Fresh Bananas",
    "description": "Organic bananas from local farms",
    "price": 2.99,
    "category": "Fruits",
    "stock": 50,
    "createdAt": "2025-11-05T10:30:00Z",
    "updatedAt": "2025-11-05T10:30:00Z"
  }
]
```

### 2. Create Product
```http
POST http://localhost:8080/api/v1/products
Content-Type: application/json

{
  "name": "Fresh Apples",
  "description": "Crisp red apples",
  "price": 3.99,
  "category": "Fruits",
  "stock": 100
}
```

### 3. Get User's Cart
```http
GET http://localhost:8080/api/v1/cart/123e4567-e89b-12d3-a456-426614174000
```

**Response:**
```json
{
  "id": "cart-uuid",
  "userId": "123e4567-e89b-12d3-a456-426614174000",
  "items": [],
  "totalAmount": 0.00,
  "totalItems": 0,
  "createdAt": "2025-11-05T10:30:00Z",
  "updatedAt": "2025-11-05T10:30:00Z"
}
```

### 4. Add Item to Cart
```http
POST http://localhost:8080/api/v1/cart/123e4567-e89b-12d3-a456-426614174000/items
Content-Type: application/json

{
  "productId": "550e8400-e29b-41d4-a716-446655440001",
  "quantity": 2
}
```

### 5. Update Cart Item
```http
PUT http://localhost:8080/api/v1/cart/{userId}/items/{itemId}
Content-Type: application/json

{
  "quantity": 5
}
```

## 🧪 Testing with Postman/Frontend

### Sample User IDs for Testing:
```
123e4567-e89b-12d3-a456-426614174000
456e7890-e12b-34d5-a678-901234567890
789e0123-e45b-67d8-a901-234567890123
```

### Sample Product IDs (from data.sql):
```
550e8400-e29b-41d4-a716-446655440001  # Fresh Bananas
550e8400-e29b-41d4-a716-446655440002  # Whole Wheat Bread
550e8400-e29b-41d4-a716-446655440003  # Organic Milk
```

## 🎯 Frontend Integration Checklist

### ✅ Required Frontend Implementation:
1. **Products Page**
   - Fetch and display products
   - Category filtering
   - Search functionality
   - Add to cart button

2. **Cart Page**
   - Display cart items
   - Update quantities
   - Remove items
   - Show total amount

3. **Error Handling**
   - Handle API errors gracefully
   - Show user-friendly messages

### ✅ Frontend API Service Example:
```javascript
const API_BASE_URL = 'http://localhost:8080/api/v1';

// Products
export const getProducts = () => fetch(`${API_BASE_URL}/products`);
export const createProduct = (product) => 
  fetch(`${API_BASE_URL}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product)
  });

// Cart
export const getCart = (userId) => fetch(`${API_BASE_URL}/cart/${userId}`);
export const addToCart = (userId, item) =>
  fetch(`${API_BASE_URL}/cart/${userId}/items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item)
  });
```

## 🚨 Important Notes

1. **CORS**: The application is configured with `@CrossOrigin(origins = "*")` for development
2. **User IDs**: Generate UUIDs in your frontend or use the sample ones provided
3. **Error Handling**: All endpoints return structured error responses
4. **Validation**: Request bodies are validated automatically
5. **Database**: Sample data is loaded automatically on startup

---

🎉 **Your Grocery Store Backend is now ready to serve your frontend application!**