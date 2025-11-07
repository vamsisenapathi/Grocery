import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import { Provider } from 'react-redux';
import { SnackbarProvider } from 'notistack';
import store from './redux/store';
import theme from './theme/blinkitTheme';
import { AuthProvider } from './context/AuthContext';
import { LocationProvider } from './context/LocationContext';

// Direct imports - no lazy loading to avoid chunk errors
import HomePage from './pages/grocery/HomePage';
import CategoryPage from './pages/grocery/CategoryPage';
import ProductDetailPage from './pages/grocery/ProductDetailPage';
import CartPage from './pages/grocery/CartPage';
import SearchPage from './pages/grocery/SearchPage';
import CheckoutPage from './pages/grocery/CheckoutPage';
import OrdersPage from './pages/grocery/OrdersPage';
import GiftCardsPage from './pages/grocery/GiftCardsPage';
import PrivacyPage from './pages/grocery/PrivacyPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SavedAddressesPage from './pages/SavedAddressesPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <LocationProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <SnackbarProvider 
            maxSnack={3}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            autoHideDuration={3000}
          >
            <Router>
              <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <Box component="main" sx={{ flexGrow: 1, backgroundColor: 'background.default' }}>
                  <Routes>
                    {/* Main Routes - Public */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/category/:category" element={<CategoryPage />} />
                    <Route path="/product/:id" element={<ProductDetailPage />} />
                    <Route path="/search" element={<SearchPage />} />
                    <Route path="/cart" element={<CartPage />} />

                    {/* Auth Routes */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    
                    {/* Protected Routes - Require Login */}
                    <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
                    <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
                    <Route path="/addresses" element={<ProtectedRoute><SavedAddressesPage /></ProtectedRoute>} />
                    <Route path="/gift-cards" element={<ProtectedRoute><GiftCardsPage /></ProtectedRoute>} />
                    <Route path="/privacy" element={<ProtectedRoute><PrivacyPage /></ProtectedRoute>} />
                    
                    {/* Fallback route */}
                    <Route path="*" element={<HomePage />} />
                  </Routes>
                </Box>
              </Box>
            </Router>
          </SnackbarProvider>
        </ThemeProvider>
      </LocationProvider>
      </AuthProvider>
    </Provider>
  );
}

export default App;