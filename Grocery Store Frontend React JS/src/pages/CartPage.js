import React, { useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Divider,
  Alert,
  CircularProgress,
  Chip,
} from '@mui/material';
import {
  ShoppingCart as CartIcon,
  ShoppingCartOutlined as EmptyCartIcon,
  Payment as CheckoutIcon,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchCart, clearCart } from '../redux/actions/cartActions';
import CartItem from '../components/CartItem';

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const storeData = useSelector((state) => {
    return {
      user: state?.auth?.user,
      items: state?.cart?.items,
      totalItems: state?.cart?.totalItems,
      totalAmount: state?.cart?.totalAmount,
      loading: state?.cart?.loading,
      error: state?.cart?.error,
    };
  });

  const { user, items, totalItems, totalAmount, loading, error } = storeData;

  useEffect(() => {
    if (user?.userId) {
      dispatch(fetchCart(user.userId));
    }
  }, [dispatch, user?.userId]);

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  const isCartEmpty = items.length === 0;

  if (loading && items.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* Page Header */}
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <CartIcon color="primary" sx={{ fontSize: 40 }} />
        <Box>
          <Typography variant="h3" component="h1" fontWeight="bold">
            Your Cart
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {isCartEmpty ? 'Your cart is empty' : `${totalItems} item${totalItems !== 1 ? 's' : ''} in your cart`}
          </Typography>
        </Box>
      </Box>

      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Empty Cart State */}
      {isCartEmpty ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <EmptyCartIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Your cart is empty
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            Add some products to your cart to get started
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/')}
            sx={{ mt: 2 }}
          >
            Continue Shopping
          </Button>
        </Paper>
      ) : (
        /* Cart with Items */
        <Box display="flex" flexDirection={{ xs: 'column', lg: 'row' }} gap={3}>
          {/* Cart Items */}
          <Box flex={1}>
            <Paper sx={{ p: 2 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">
                  Cart Items ({totalItems})
                </Typography>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={handleClearCart}
                  disabled={loading}
                >
                  Clear Cart
                </Button>
              </Box>
              
              <Divider sx={{ mb: 2 }} />
              
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </Paper>
          </Box>

          {/* Order Summary */}
          <Box width={{ xs: '100%', lg: '350px' }}>
            <Paper sx={{ p: 3, position: 'sticky', top: 100 }}>
              <Typography variant="h6" gutterBottom>
                Order Summary
              </Typography>
              
              <Divider sx={{ mb: 2 }} />
              
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body1">
                  Items ({totalItems})
                </Typography>
                <Typography variant="body1">
                  {formatPrice(totalAmount)}
                </Typography>
              </Box>
              
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body1">
                  Delivery Fee
                </Typography>
                <Typography variant="body1" color="success.main">
                  FREE
                </Typography>
              </Box>
              
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body1">
                  Tax (Included)
                </Typography>
                <Typography variant="body1">
                  {formatPrice(totalAmount * 0.05)} {/* 5% tax */}
                </Typography>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Box display="flex" justifyContent="space-between" mb={3}>
                <Typography variant="h6" fontWeight="bold">
                  Total
                </Typography>
                <Typography variant="h6" fontWeight="bold" color="primary">
                  {formatPrice(totalAmount)}
                </Typography>
              </Box>

              {/* Savings Badge */}
              <Box mb={2}>
                <Chip
                  label="Free Delivery on orders over ₹500"
                  color="success"
                  variant="outlined"
                  size="small"
                  sx={{ width: '100%' }}
                />
              </Box>
              
              <Button
                variant="contained"
                fullWidth
                size="large"
                startIcon={<CheckoutIcon />}
                onClick={handleCheckout}
                disabled={loading || isCartEmpty}
                sx={{ mb: 2 }}
              >
                Proceed to Checkout
              </Button>
              
              <Button
                variant="outlined"
                fullWidth
                onClick={() => navigate('/')}
              >
                Continue Shopping
              </Button>
            </Paper>
          </Box>
        </Box>
      )}
    </Container>
  );
};

export default CartPage;