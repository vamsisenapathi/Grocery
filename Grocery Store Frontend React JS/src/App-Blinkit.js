import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import { Provider } from 'react-redux';
import { SnackbarProvider } from 'notistack';
import store from './redux/store';
import theme from './theme/blinkitTheme';

// Components
import { SuspenseFallback } from './components/LoadingComponents';

// Lazy-loaded Pages - Blinkit Style
const BlinkitHomePage = React.lazy(() => import('./pages/blinkit/BlinkitHomePage'));
const BlinkitCategoryPage = React.lazy(() => import('./pages/blinkit/BlinkitCategoryPage'));
const BlinkitProductDetailPage = React.lazy(() => import('./pages/blinkit/BlinkitProductDetailPage'));
const BlinkitCartPage = React.lazy(() => import('./pages/blinkit/BlinkitCartPage'));
const BlinkitSearchPage = React.lazy(() => import('./pages/blinkit/BlinkitSearchPage'));
const BlinkitCheckoutPage = React.lazy(() => import('./pages/blinkit/BlinkitCheckoutPage'));

// Auth Pages
const LoginPage = React.lazy(() => import('./pages/LoginPage'));
const RegisterPage = React.lazy(() => import('./pages/RegisterPage'));

// User Pages
const OrdersPage = React.lazy(() => import('./pages/OrdersPage'));
const SavedAddressesPage = React.lazy(() => import('./pages/SavedAddressesPage'));

// Test Pages (Remove in production)
const TestAuthPage = React.lazy(() => import('./pages/TestAuthPage'));
const TestCartPage = React.lazy(() => import('./test-cart-page'));

function App() {
  return (
    <Provider store={store}>
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
                <Suspense fallback={<SuspenseFallback />}>
                  <Routes>
                    {/* Main Blinkit Routes */}
                    <Route path="/" element={<BlinkitHomePage />} />
                    <Route path="/category/:category" element={<BlinkitCategoryPage />} />
                    <Route path="/product/:id" element={<BlinkitProductDetailPage />} />
                    <Route path="/search" element={<BlinkitSearchPage />} />
                    <Route path="/cart" element={<BlinkitCartPage />} />
                    <Route path="/checkout" element={<BlinkitCheckoutPage />} />

                    {/* Auth Routes */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    
                    {/* User Routes */}
                    <Route path="/orders" element={<OrdersPage />} />
                    <Route path="/addresses" element={<SavedAddressesPage />} />
                    
                    {/* Test Routes - Remove in production */}
                    <Route path="/test-auth" element={<TestAuthPage />} />
                    <Route path="/test-cart" element={<TestCartPage />} />
                    
                    {/* Fallback route */}
                    <Route path="*" element={<BlinkitHomePage />} />
                  </Routes>
                </Suspense>
              </Box>
            </Box>
          </Router>
        </SnackbarProvider>
      </ThemeProvider>
    </Provider>
  );
}

export default App;