import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/grocery/Header';
import CartDrawer from '../../components/grocery/CartDrawer';
import { apiService } from '../../services/api.service';

const CartPage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(true); // Open by default

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      setLoading(true);
      const cartData = await apiService.cart.get();
      setCart(cartData);
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box>
        <Header onCartClick={() => setCartDrawerOpen(true)} />
        <Container sx={{ py: 8, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Container>
      </Box>
    );
  }

  return (
    <Box>
      <Header onCartClick={() => setCartDrawerOpen(true)} />
      
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>
          Shopping Cart
        </Typography>

        {!cart || !cart.items || cart.items.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Your cart is empty
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Add items to get started
            </Typography>
            <Button variant="contained" onClick={() => navigate('/')}>
              Start Shopping
            </Button>
          </Box>
        ) : (
          <Alert severity="info">
            View your cart items in the cart drawer on the right
          </Alert>
        )}
      </Container>

      <CartDrawer 
        open={cartDrawerOpen} 
        onClose={() => { setCartDrawerOpen(false); navigate('/'); }} 
      />
    </Box>
  );
};

export default CartPage;
