import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import { useDispatch } from 'react-redux';
import { fetchCart } from './redux/actions/cartActions';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import MyOrdersPage from './pages/MyOrdersPage';
import SavedAddressesPage from './pages/SavedAddressesPage';
import PaymentPage from './pages/PaymentPage';
import CategoryProductsPage from './pages/CategoryProductsPage';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Fetch cart on app load
    if (process.env.NODE_ENV !== 'test') {
      dispatch(fetchCart());
    }
  }, [dispatch]);

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/category" element={<CategoryProductsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/my-orders" element={<MyOrdersPage />} />
          <Route path="/saved-addresses" element={<SavedAddressesPage />} />
          <Route path="/payment" element={<PaymentPage />} />
        </Routes>
      </Box>
    </Box>
  );
}

export default App;
