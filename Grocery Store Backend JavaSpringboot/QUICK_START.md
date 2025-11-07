# 🚀 QUICK START GUIDE - Grocery Store Backend

## ⚡ FASTEST WAY TO RUN THE APPLICATION

Since Maven might not be installed, here are the fastest options to get your backend running:

### 🐳 Option 1: Using Docker (RECOMMENDED - No Java/Maven needed)

#### Prerequisites:
- Install Docker Desktop from [docker.com](https://www.docker.com/products/docker-desktop/)

#### Steps:
1. **Navigate to project directory:**
   ```powershell
   cd "C:\Vamsi\React js\App\Grocery Store\Grocery Store Backend JavaSpringboot"
   ```

2. **Start everything with Docker:**
   ```powershell
   docker-compose up --build
   ```

3. **That's it!** The application will:
   - Download PostgreSQL
   - Build your Java application
   - Start both services
   - Load sample data automatically

4. **Access your API:**
   - Products: `http://localhost:8080/api/v1/products`
   - Health: `http://localhost:8080/api/v1/actuator/health`

---

### 🔧 Option 2: Manual Setup (If you prefer local development)

#### Step 1: Install Requirements

1. **Download & Install Java 21:**
   - Go to [Adoptium.net](https://adoptium.net/temurin/releases/)
   - Download OpenJDK 21 for Windows
   - Install and add to PATH

2. **Download & Install Maven:**
   - Go to [Maven.apache.org](https://maven.apache.org/download.cgi)
   - Download `apache-maven-3.9.5-bin.zip`
   - Extract to `C:\maven`
   - Add `C:\maven\bin` to your PATH environment variable

3. **Download & Install PostgreSQL:**
   - Go to [PostgreSQL.org](https://www.postgresql.org/download/windows/)
   - Download PostgreSQL 15+
   - Install with password: `admin`
   - Install pgAdmin 4 (included in installer)

#### Step 2: Setup Database in pgAdmin4

1. **Open pgAdmin4** (Start Menu → pgAdmin 4)

2. **Create Database:**
   - Connect to PostgreSQL server (password: `admin`)
   - Right-click "Databases" → Create → Database
   - Name: `grocerydb`
   - Save

3. **Create User (optional):**
   - Right-click "Login/Group Roles" → Create → Login/Group Role
   - General tab: Name = `admin`
   - Definition tab: Password = `admin`
   - Privileges tab: Check "Can login?" and "Superuser?"
   - Save

#### Step 3: Build and Run Application

1. **Open PowerShell as Administrator**

2. **Navigate to project:**
   ```powershell
   cd "C:\Vamsi\React js\App\Grocery Store\Grocery Store Backend JavaSpringboot"
   ```

3. **Build the application:**
   ```powershell
   mvn clean package -DskipTests
   ```

4. **Run the application:**
   ```powershell
   java -jar target/grocery-backend.jar
   ```

---

## 🌐 API ENDPOINTS FOR YOUR FRONTEND

### Base URL: `http://localhost:8080/api/v1`

### 📦 PRODUCTS API

```javascript
// Get all products
GET /products

// Filter by category
GET /products?category=Fruits

// Search products
GET /products?search=apple

// Get specific product
GET /products/{productId}

// Create new product
POST /products
{
  "name": "Fresh Apples",
  "description": "Crisp red apples",
  "price": 3.99,
  "category": "Fruits",
  "stock": 100
}

// Update product
PUT /products/{productId}
{
  "name": "Updated Apple",
  "description": "Updated description",
  "price": 4.99,
  "category": "Fruits",
  "stock": 50
}

// Delete product
DELETE /products/{productId}
```

### 🛒 CART API

```javascript
// Get user's cart (creates if doesn't exist)
GET /cart/{userId}

// Add item to cart
POST /cart/{userId}/items
{
  "productId": "550e8400-e29b-41d4-a716-446655440001",
  "quantity": 2
}

// Update item quantity
PUT /cart/{userId}/items/{itemId}
{
  "quantity": 5
}

// Remove item from cart
DELETE /cart/{userId}/items/{itemId}

// Clear entire cart
DELETE /cart/{userId}
```

## 🧪 TESTING YOUR API

### Sample User IDs (Use these for testing):
```
123e4567-e89b-12d3-a456-426614174000
456e7890-e12b-34d5-a678-901234567890
```

### Sample Product IDs (Pre-loaded in database):
```
550e8400-e29b-41d4-a716-446655440001  # Fresh Bananas
550e8400-e29b-41d4-a716-446655440002  # Whole Wheat Bread
550e8400-e29b-41d4-a716-446655440003  # Organic Milk
550e8400-e29b-41d4-a716-446655440005  # Red Apples
```

### Test in Browser:
1. **Get all products:** `http://localhost:8080/api/v1/products`
2. **Get a cart:** `http://localhost:8080/api/v1/cart/123e4567-e89b-12d3-a456-426614174000`

## 📱 FRONTEND INTEGRATION CODE

### React/JavaScript Example:
```javascript
const API_BASE = 'http://localhost:8080/api/v1';

// Fetch all products
const fetchProducts = async () => {
  const response = await fetch(`${API_BASE}/products`);
  return response.json();
};

// Add to cart
const addToCart = async (userId, productId, quantity) => {
  const response = await fetch(`${API_BASE}/cart/${userId}/items`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      productId: productId,
      quantity: quantity
    })
  });
  return response.json();
};

// Get cart
const getCart = async (userId) => {
  const response = await fetch(`${API_BASE}/cart/${userId}`);
  return response.json();
};
```

## ✅ VERIFICATION CHECKLIST

### 1. Application Started Successfully ✅
Look for this in console:
```
Started GroceryAppBackendApplication in X.XXX seconds (JVM running for Y.YYY)
```

### 2. Database Connected ✅
No error messages about database connection

### 3. Sample Data Loaded ✅
Visit: `http://localhost:8080/api/v1/products`
Should return 15 products

### 4. Cart API Working ✅
Visit: `http://localhost:8080/api/v1/cart/123e4567-e89b-12d3-a456-426614174000`
Should return empty cart

## 🚨 TROUBLESHOOTING

### Error: Port 8080 in use
```powershell
netstat -ano | findstr :8080
taskkill /PID <PROCESS_ID> /F
```

### Error: Database connection failed
1. Check PostgreSQL service is running
2. Verify database `grocerydb` exists
3. Check username/password in pgAdmin

### Error: Maven command not found
Use Docker option instead, or install Maven from [maven.apache.org](https://maven.apache.org/download.cgi)

---

## 🎯 READY FOR FRONTEND!

Your backend provides these features for your frontend:
- ✅ Complete product catalog with search & filtering
- ✅ Shopping cart functionality
- ✅ Real-time inventory management
- ✅ Input validation and error handling
- ✅ CORS enabled for frontend integration
- ✅ 15 sample products ready to use

**Start with Docker for fastest setup, then connect your React frontend!** 🚀