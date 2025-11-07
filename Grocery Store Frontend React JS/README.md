# Fresh Grocery Store Frontend

A modern, responsive React.js frontend application for a grocery shopping platform with JWT authentication, built with Material UI, Redux Toolkit, and React Router.

## 🚀 Features

- **Authentication System**
  - User registration and login with JWT tokens
  - Protected routes and automatic token refresh
  - Secure token storage with localStorage fallback

- **Product Management**
  - Browse products with filtering and search
  - Category-based filtering and price sorting
  - Responsive product cards with detailed information

- **Shopping Cart**
  - Add/remove items with quantity management
  - Real-time cart updates and local state management
  - Cart persistence across sessions

- **Checkout Process**
  - Multi-step checkout form with validation
  - Address and payment method selection
  - Order confirmation and success handling

- **User Experience**
  - Responsive design for mobile and desktop
  - Loading states and error handling
  - Snackbar notifications for user feedback
  - Material UI theming and consistent design

## 🛠️ Tech Stack

- **Frontend Framework**: React 18+
- **UI Library**: Material UI (MUI) v5+
- **State Management**: Redux Toolkit
- **Routing**: React Router v6
- **HTTP Client**: Axios with interceptors
- **Form Handling**: React Hook Form
- **Validation**: Yup schema validation
- **Notifications**: Notistack
- **Styling**: Material UI theming system

## 📁 Project Structure

```
src/
├── api/
│   └── api.js                 # Axios configuration and API endpoints
├── app/
│   └── store.js              # Redux store configuration
├── features/
│   ├── auth/
│   │   └── authSlice.js      # Authentication state management
│   ├── products/
│   │   └── productSlice.js   # Product state management
│   └── cart/
│       └── cartSlice.js      # Cart state management
├── components/
│   ├── AppNavbar.js          # Navigation bar component
│   ├── ProtectedRoute.js     # Route protection wrapper
│   ├── ProductCard.js        # Product display component
│   ├── FilterBar.js          # Search and filter component
│   └── CartItem.js           # Cart item component
├── pages/
│   ├── ProductListPage.js    # Home/product listing page
│   ├── LoginPage.js          # User login page
│   ├── RegisterPage.js       # User registration page
│   ├── CartPage.js           # Shopping cart page
│   └── CheckoutPage.js       # Checkout process page
├── validation/
│   ├── authSchemas.js        # Login/register validation
│   └── checkoutSchemas.js    # Checkout form validation
├── theme.js                  # Material UI theme configuration
├── App.js                    # Main app component with routing
└── index.js                  # Application entry point
```

## 🔧 Installation & Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- Running Spring Boot backend at `http://localhost:8080/api/v1`

### Installation Steps

1. **Clone or download the project**
   ```bash
   cd "grocery-frontend"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the project root:
   ```env
   REACT_APP_API_BASE_URL=http://localhost:8080/api/v1
   REACT_APP_STORAGE_TYPE=localStorage
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Access the application**
   Open [http://localhost:3000](http://localhost:3000) in your browser

## 🌐 API Integration

### Backend Requirements

Your Spring Boot backend should provide these endpoints:

#### Authentication Endpoints
```
POST /api/v1/auth/register
Body: { "name": "string", "email": "string", "password": "string" }
Response: { "id": number, "name": "string", "email": "string" }

POST /api/v1/auth/login
Body: { "email": "string", "password": "string" }
Response: { 
  "accessToken": "jwt_token", 
  "refreshToken": "refresh_token", 
  "user": { "id": number, "name": "string", "email": "string" }
}

POST /api/v1/auth/refresh
Body: { "refreshToken": "string" }
Response: { "accessToken": "new_jwt_token" }

POST /api/v1/auth/logout
Headers: Authorization: Bearer <token>
```

#### Product Endpoints
```
GET /api/v1/products
Response: [{ "id": number, "name": "string", "price": number, "category": "string", "stock": number, "image": "string", "description": "string" }]

GET /api/v1/products/{id}
Response: { "id": number, "name": "string", "price": number, "category": "string", "stock": number, "image": "string", "description": "string" }
```

#### Cart Endpoints
```
GET /api/v1/cart/{userId}
Response: { "items": [{ "id": number, "productId": number, "name": "string", "price": number, "quantity": number, "image": "string" }] }

POST /api/v1/cart/{userId}/items
Body: { "productId": number, "name": "string", "price": number, "quantity": number, "image": "string" }

PUT /api/v1/cart/{userId}/items/{itemId}
Body: { "quantity": number }

DELETE /api/v1/cart/{userId}/items/{itemId}
```

### CORS Configuration

Ensure your Spring Boot backend allows requests from the frontend:

```java
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = true)
```

Or configure global CORS:

```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:3000")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
```

## 🔐 Security Features

### Token Management

- **Access Token**: Stored in localStorage for demo purposes
- **Refresh Token**: Stored in localStorage (production should use HttpOnly cookies)
- **Automatic Refresh**: Axios interceptors handle token refresh on 401 responses
- **Logout Handling**: Clears all tokens and redirects to login

### Security Recommendations for Production

1. **Use HttpOnly Cookies for Refresh Tokens**
   ```javascript
   // Backend should set HttpOnly cookie
   res.cookie('refreshToken', token, { 
     httpOnly: true, 
     secure: true, 
     sameSite: 'strict' 
   });
   ```

2. **Implement CSRF Protection**
3. **Use HTTPS in production**
4. **Consider token rotation**
5. **Add rate limiting**

### Form Validation

- **Login**: Email format and password minimum length
- **Register**: Name, email, password strength, and confirmation matching
- **Checkout**: Complete address validation with phone number format

## 🎨 Theming & Customization

### Material UI Theme

The app uses a custom Material UI theme with:

- **Primary Color**: Green (#2E7D32) for grocery/fresh theme
- **Secondary Color**: Orange (#FF9800) for accents
- **Typography**: Roboto font family
- **Border Radius**: 12px for cards, 8px for buttons
- **Responsive Breakpoints**: Mobile-first design

### Customizing the Theme

Edit `src/theme.js` to modify colors, typography, or component styles:

```javascript
const theme = createTheme({
  palette: {
    primary: { main: '#YOUR_COLOR' },
    secondary: { main: '#YOUR_ACCENT_COLOR' },
  },
  // ... other theme configurations
});
```

## 📱 Responsive Design

- **Mobile First**: Optimized for mobile devices
- **Breakpoints**: xs (0px), sm (600px), md (900px), lg (1200px), xl (1536px)
- **Grid System**: Material UI Grid for responsive layouts
- **Navigation**: Collapsible menu for mobile devices

## 🧪 Testing the Application

### Manual Testing Workflow

1. **Registration Flow**
   - Navigate to `/register`
   - Fill form with validation
   - Verify redirect to login

2. **Login Flow**
   - Use registered credentials
   - Verify token storage
   - Check protected route access

3. **Product Browsing**
   - View product list
   - Test search and filters
   - Verify sorting functionality

4. **Cart Operations**
   - Add items to cart
   - Update quantities
   - Remove items
   - Verify cart persistence

5. **Checkout Process**
   - Complete multi-step form
   - Verify validation
   - Test order placement

### API Testing with Postman

1. **Register a User**
   ```
   POST http://localhost:8080/api/v1/auth/register
   {
     "name": "Test User",
     "email": "test@example.com",
     "password": "password123"
   }
   ```

2. **Login and Get Token**
   ```
   POST http://localhost:8080/api/v1/auth/login
   {
     "email": "test@example.com",
     "password": "password123"
   }
   ```

3. **Use Token in Frontend**
   - Copy the `accessToken` from login response
   - The frontend will automatically use this token for subsequent requests

## 🚀 Available Scripts

### `npm start`
Runs the app in development mode on [http://localhost:3000](http://localhost:3000)

### `npm run build`
Builds the app for production to the `build` folder

### `npm test`
Launches the test runner in interactive watch mode

### `npm run eject`
**Note: This is a one-way operation**. Ejects from Create React App setup

## 🔧 Environment Variables

Create a `.env` file with these variables:

```env
# API Configuration
REACT_APP_API_BASE_URL=http://localhost:8080/api/v1

# Storage Configuration (localStorage or sessionStorage)
REACT_APP_STORAGE_TYPE=localStorage

# Optional: Enable debug mode
REACT_APP_DEBUG=true
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Material UI** for the excellent component library
- **Redux Toolkit** for simplified state management
- **React Hook Form** for efficient form handling
- **Yup** for schema validation

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the API integration guide

---

**Happy Coding! 🛒🥬**