# 🛒 Grocery Store Full Stack Application

A complete e-commerce grocery store application built with Java Spring Boot backend and React.js frontend, featuring modern UI design inspired by popular grocery delivery apps.

![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-F2F4F9?style=for-the-badge&logo=spring-boot)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)

## 🌟 Features

### 🔐 Authentication & Authorization
- JWT-based secure authentication
- User registration and login
- Password encryption using BCrypt
- Protected routes and API endpoints

### 🛍️ Shopping Experience
- Browse products by categories and subcategories
- Search functionality with filters
- Product details with images and descriptions
- Shopping cart management (add, update, remove items)
- Real-time stock validation

### 📦 Order Management
- Complete checkout process with address selection
- Order history and tracking
- Multiple delivery address management
- Order status updates

### 👤 User Management
- User profile management
- Address book (add, edit, delete addresses)
- Order history view
- Account settings

### 🎨 Modern UI/UX
- Blinkit-inspired clean and intuitive design
- Responsive design for all devices
- Material-UI components
- Loading states and error handling
- Toast notifications

## 🏗️ Architecture

```
┌─────────────────┐    HTTP/REST API    ┌──────────────────┐
│   React.js      │◄──────────────────►│   Spring Boot    │
│   Frontend      │      (Port 3000)   │   Backend        │
│                 │                     │   (Port 8080)    │
└─────────────────┘                     └──────────────────┘
         │                                        │
         │ Redux State                           │ JPA/Hibernate
         │ Management                            │
         │                                       ▼
         │                              ┌──────────────────┐
         │                              │     MySQL        │
         │                              │    Database      │
         │                              │   (Port 3306)    │
         └──────────────────────────────┴──────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Java 17 or higher
- Node.js 16+ and npm
- MySQL 8.0+
- Git

### Backend Setup (Spring Boot)

1. **Navigate to backend directory:**
   ```bash
   cd "Grocery Store Backend JavaSpringboot"
   ```

2. **Configure database:**
   - Create MySQL database named `grocery_app`
   - Update `src/main/resources/application.yml` with your database credentials

3. **Install dependencies and run:**
   ```bash
   ./mvnw clean install
   ./mvnw spring-boot:run
   ```
   
   Or use the provided scripts:
   ```bash
   # Windows
   ./start.bat
   
   # PowerShell
   ./start.ps1
   ```

4. **API will be available at:** `http://localhost:8080`

### Frontend Setup (React.js)

1. **Navigate to frontend directory:**
   ```bash
   cd "Grocery Store Frontend React JS"
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm start
   ```

4. **Application will open at:** `http://localhost:3000`

## 📱 Application Screenshots

### Homepage
- Clean, modern interface with category navigation
- Featured products and promotional banners

### Product Catalog
- Grid view with product cards
- Category filters and search functionality
- Product details modal with add to cart

### Shopping Cart
- Real-time cart updates
- Quantity adjustments
- Price calculations with totals

### Checkout Process
- Address selection/addition
- Order summary
- Payment integration ready

## 🛠️ Technology Stack

### Backend
- **Framework:** Spring Boot 3.x
- **Security:** Spring Security with JWT
- **Database:** MySQL with JPA/Hibernate
- **Build Tool:** Maven
- **API Documentation:** Comprehensive REST APIs

### Frontend
- **Framework:** React.js 18+
- **State Management:** Redux Toolkit
- **UI Library:** Material-UI (MUI)
- **HTTP Client:** Axios
- **Routing:** React Router
- **Styling:** CSS-in-JS with MUI theme system

### Database Schema
- Users, Products, Categories, Subcategories
- Shopping Cart, Orders, Order Items
- Addresses, Brands
- Optimized relationships and indexing

## 📊 Database Schema

```sql
Users (id, username, email, password, role, created_at)
Products (id, name, description, price, image_url, stock, category_id, brand_id)
Categories (id, name, description)
Subcategories (id, name, category_id)
Cart (id, user_id, created_at)
Cart_Items (id, cart_id, product_id, quantity)
Orders (id, user_id, total_amount, status, address_id, created_at)
Order_Items (id, order_id, product_id, quantity, price)
Addresses (id, user_id, street, city, state, zip_code, is_default)
```

## 🔧 Configuration

### Backend Configuration
```yaml
# application.yml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/grocery_app
    username: your_username
    password: your_password
  jpa:
    hibernate:
      ddl-auto: update
  security:
    jwt:
      secret: your_jwt_secret
      expiration: 86400000
```

### Frontend Configuration
```javascript
// .env
REACT_APP_API_BASE_URL=http://localhost:8080/api
REACT_APP_JWT_SECRET=your_jwt_secret
```

## 🧪 Testing

### Backend Tests
```bash
cd "Grocery Store Backend JavaSpringboot"
./mvnw test
```

### Frontend Tests
```bash
cd "Grocery Store Frontend React JS"
npm test
```

## 🐳 Docker Deployment

### Using Docker Compose
```bash
# Build and start all services
docker-compose up -d

# Stop services
docker-compose down
```

### Manual Docker Build
```bash
# Backend
cd "Grocery Store Backend JavaSpringboot"
docker build -t grocery-backend .

# Frontend
cd "Grocery Store Frontend React JS"
docker build -t grocery-frontend .
```

## 📈 Future Enhancements

- [ ] Payment gateway integration (Stripe/PayPal)
- [ ] Real-time notifications
- [ ] Admin dashboard for inventory management
- [ ] Advanced search with filters
- [ ] Product recommendations
- [ ] Mobile app (React Native)
- [ ] Multi-vendor support
- [ ] Inventory management system
- [ ] Analytics and reporting
- [ ] Email notifications
- [ ] Social media login
- [ ] Product reviews and ratings

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 API Documentation

### Authentication Endpoints
```
POST /api/auth/register - User registration
POST /api/auth/login    - User login
POST /api/auth/refresh  - Refresh JWT token
```

### Product Endpoints
```
GET    /api/products              - Get all products
GET    /api/products/{id}         - Get product by ID
GET    /api/products/category/{id} - Get products by category
POST   /api/products/search       - Search products
```

### Cart Endpoints
```
GET    /api/cart              - Get user cart
POST   /api/cart/add          - Add item to cart
PUT    /api/cart/update/{id}  - Update cart item
DELETE /api/cart/remove/{id}  - Remove item from cart
```

### Order Endpoints
```
POST /api/orders         - Create new order
GET  /api/orders         - Get user orders
GET  /api/orders/{id}    - Get order details
```

For complete API documentation, see: [API Documentation](./Grocery%20Store%20Backend%20JavaSpringboot/API_DOCUMENTATION.md)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Vamsi Senapathi**
- GitHub: [@vamsisenapathi](https://github.com/vamsisenapathi)
- LinkedIn: [Your LinkedIn Profile](https://linkedin.com/in/your-profile)

## 🙏 Acknowledgments

- Spring Boot team for the excellent framework
- React.js community for the amazing ecosystem
- Material-UI for the beautiful component library
- Blinkit for UI/UX inspiration

---

⭐ **Star this repository if you found it helpful!** ⭐

## 📞 Support

If you have any questions or need help getting started, please:
1. Check the documentation in each project folder
2. Look through existing issues
3. Create a new issue with detailed description

---

**Happy Coding! 🚀**