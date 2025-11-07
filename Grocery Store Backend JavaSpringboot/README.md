# Grocery Store Backend API

A complete Spring Boot REST API for a grocery store application with product management and shopping cart functionality.

## 🚀 Features

- **Product Management**: Create, read, update, delete products
- **Shopping Cart**: Add items, update quantities, remove items
- **Category Filtering**: Filter products by category
- **Product Search**: Search products by name
- **Stock Management**: Track product inventory
- **Input Validation**: Comprehensive request validation
- **Exception Handling**: Global error handling with meaningful responses
- **PostgreSQL Integration**: Production-ready database setup

## 🛠 Technology Stack

- **Java**: 21 (JDK 21)
- **Spring Boot**: 3.2.0
- **Spring Data JPA**: Database operations
- **PostgreSQL**: Primary database
- **Maven**: Build automation
- **Lombok**: Reduce boilerplate code
- **MapStruct**: DTO mapping
- **Docker**: Containerization

## 📋 Prerequisites

- Java 21 or higher
- Maven 3.6+
- PostgreSQL 12+ (or use Docker)
- Docker & Docker Compose (optional)

## 🏃‍♂️ Quick Start

### Option 1: Using Docker Compose (Recommended)

1. **Clone and navigate to the project:**
   ```bash
   cd "C:\Vamsi\React js\App\Grocery Store\Grocery Store Backend JavaSpringboot"
   ```

2. **Build and run with Docker Compose:**
   ```bash
   docker-compose up --build
   ```

   This will:
   - Start PostgreSQL database on port 5432
   - Build and start the Spring Boot application on port 8080
   - Initialize the database with sample data

### Option 2: Manual Setup

1. **Start PostgreSQL:**
   - Install PostgreSQL locally
   - Create database: `grocerydb`
   - Create user: `admin` with password: `admin`

2. **Build the application:**
   ```bash
   mvn clean package
   ```

3. **Run the application:**
   ```bash
   java -jar target/grocery-backend.jar
   ```

## 🔗 API Endpoints

### Products API (`/api/v1/products`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/products` | Get all products |
| GET | `/products?category=Fruits` | Get products by category |
| GET | `/products?search=apple` | Search products by name |
| GET | `/products/{id}` | Get product by ID |
| POST | `/products` | Create new product |
| PUT | `/products/{id}` | Update product |
| DELETE | `/products/{id}` | Delete product |

### Cart API (`/api/v1/cart`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/cart/{userId}` | Get user's cart |
| POST | `/cart/{userId}/items` | Add item to cart |
| PUT | `/cart/{userId}/items/{itemId}` | Update item quantity |
| DELETE | `/cart/{userId}/items/{itemId}` | Remove item from cart |
| DELETE | `/cart/{userId}` | Clear entire cart |

## 📝 Request Examples

### Create Product
```bash
curl -X POST http://localhost:8080/api/v1/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Fresh Apples",
    "description": "Crisp red apples",
    "price": 2.99,
    "category": "Fruits",
    "stock": 100
  }'
```

### Add Item to Cart
```bash
curl -X POST http://localhost:8080/api/v1/cart/{userId}/items \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "550e8400-e29b-41d4-a716-446655440001",
    "quantity": 2
  }'
```

## 📊 Sample Data

The application comes with pre-loaded sample products including:
- Fresh fruits (bananas, apples, etc.)
- Dairy products (milk, cheese, eggs)
- Meat products (chicken, beef)
- Vegetables (tomatoes, lettuce)
- Pantry items (pasta, rice, olive oil)

## 🐛 Error Handling

The API returns standardized error responses:

```json
{
  "timestamp": "2025-11-05T12:30:00Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Quantity must be at least 1",
  "path": "/api/v1/cart/123/items"
}
```

## 🏗 Project Structure

```
src/
├── main/
│   ├── java/com/groceryapp/backend/
│   │   ├── controller/          # REST controllers
│   │   ├── service/            # Business logic
│   │   ├── repository/         # Data access layer
│   │   ├── model/              # JPA entities
│   │   ├── dto/                # Data transfer objects
│   │   ├── exception/          # Custom exceptions & handlers
│   │   └── GroceryAppBackendApplication.java
│   └── resources/
│       ├── application.yml     # Configuration
│       └── data.sql           # Sample data
├── Dockerfile
├── docker-compose.yml
└── pom.xml
```

## 🔧 Configuration

Key configuration in `application.yml`:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/grocerydb
    username: admin
    password: admin
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true

server:
  port: 8080
  servlet:
    context-path: /api/v1
```

## 🧪 Testing

Test the API endpoints:

1. **Get all products:**
   ```
   GET http://localhost:8080/api/v1/products
   ```

2. **Get user's cart:**
   ```
   GET http://localhost:8080/api/v1/cart/{userId}
   ```

Replace `{userId}` with any UUID for testing (e.g., `123e4567-e89b-12d3-a456-426614174000`)

## 🐳 Docker Commands

```bash
# Build and start services
docker-compose up --build

# Run in background
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs grocery-backend

# Rebuild only the app
docker-compose build grocery-backend
```

## 📈 Health Check

Access health endpoint:
```
GET http://localhost:8080/api/v1/actuator/health
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

---

🎉 **Happy Coding!** The Grocery Store Backend API is ready to serve your frontend applications!