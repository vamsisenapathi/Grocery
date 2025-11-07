import React, { useState, useEffect } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  IconButton,
  Button,
  Chip,
  useTheme,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { apiService } from '../../services/api.service';
import { cartEvents } from '../../utils/cartEvents';

const ProductCard = ({ product }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  
  const [quantityInCart, setQuantityInCart] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkCartStatus();
    
    // Subscribe to cart changes
    const unsubscribe = cartEvents.subscribe(() => {
      checkCartStatus();
    });
    
    return unsubscribe;
  }, [product.id]);

  const checkCartStatus = async () => {
    try {
      const cart = await apiService.cart.get();
      const cartItem = cart.items?.find(item => item.productId === product.id);
      setQuantityInCart(cartItem?.quantity || 0);
    } catch (error) {
      console.error('Error checking cart status:', error);
    }
  };

  const handleAddToCart = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await apiService.cart.addItem(product.id, 1);
      setQuantityInCart(1);
      cartEvents.emit(); // Notify other components
      enqueueSnackbar(`Added ${product.name} to cart`, { variant: 'success' });
    } catch (error) {
      const errorMessage = error.message || 'Failed to add to cart';
      enqueueSnackbar(errorMessage, { variant: 'error' });
      if (errorMessage.includes('login')) {
        setTimeout(() => navigate('/login'), 1500);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleIncrement = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await apiService.cart.incrementItem(product.id);
      setQuantityInCart(prev => prev + 1);
      cartEvents.emit(); // Notify other components
    } catch (error) {
      const errorMessage = error.message || 'Failed to update quantity';
      enqueueSnackbar(errorMessage, { variant: 'error' });
      if (errorMessage.includes('login')) {
        setTimeout(() => navigate('/login'), 1500);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDecrement = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await apiService.cart.decrementItem(product.id);
      const newQuantity = quantityInCart - 1;
      setQuantityInCart(newQuantity);
      cartEvents.emit(); // Notify other components
      if (newQuantity === 0) {
        enqueueSnackbar('Item removed from cart', { variant: 'info' });
      }
    } catch (error) {
      const errorMessage = error.message || 'Failed to update quantity';
      enqueueSnackbar(errorMessage, { variant: 'error' });
      if (errorMessage.includes('login')) {
        setTimeout(() => navigate('/login'), 1500);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[4],
        }
      }}
    >
      <Box onClick={() => navigate(`/product/${product.id}`)} sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="180"
          image={product.imageUrl || 'https://via.placeholder.com/300x180?text=Product'}
          alt={product.name}
          sx={{ objectFit: 'cover' }}
        />
        {product.stock < 10 && product.stock > 0 && (
          <Chip 
            label={`Only ${product.stock} left`}
            size="small"
            color="warning"
            sx={{ position: 'absolute', top: 8, right: 8 }}
          />
        )}
        {product.stock === 0 && (
          <Chip 
            label="Out of Stock"
            size="small"
            color="error"
            sx={{ position: 'absolute', top: 8, right: 8 }}
          />
        )}
      </Box>

      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 1.5 }}>
        <Typography 
          variant="body2" 
          sx={{ 
            fontWeight: 600,
            mb: 0.5,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            minHeight: '2.5em'
          }}
        >
          {product.name}
        </Typography>

        <Typography variant="caption" color="text.secondary" sx={{ mb: 1 }}>
          {product.category}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 'auto' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
            ₹{product.price?.toFixed(2)}
          </Typography>

          {product.stock === 0 ? (
            <Button variant="outlined" size="small" disabled sx={{ textTransform: 'none' }}>
              Out of Stock
            </Button>
          ) : quantityInCart === 0 ? (
            <Button
              variant="contained"
              size="small"
              onClick={handleAddToCart}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
              sx={{
                bgcolor: theme.palette.primary.main,
                color: 'white',
                textTransform: 'none',
                fontWeight: 'bold',
                minWidth: 70,
                '&:hover': {
                  bgcolor: theme.palette.primary.dark,
                }
              }}
            >
              {loading ? '' : 'ADD'}
            </Button>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, border: `1px solid ${theme.palette.primary.main}`, borderRadius: 1, p: 0.3 }}>
              <IconButton
                size="small"
                onClick={handleDecrement}
                disabled={loading}
                sx={{
                  color: theme.palette.primary.main,
                  p: 0.5,
                  '&:hover': { bgcolor: alpha => `${theme.palette.primary.main}15` }
                }}
              >
                {loading ? <CircularProgress size={14} color="inherit" /> : <RemoveIcon fontSize="small" />}
              </IconButton>
              <Typography sx={{ fontWeight: 'bold', minWidth: 24, textAlign: 'center', fontSize: '0.9rem' }}>
                {quantityInCart}
              </Typography>
              <IconButton
                size="small"
                onClick={handleIncrement}
                disabled={loading}
                sx={{
                  bgcolor: theme.palette.primary.main,
                  color: 'white',
                  p: 0.5,
                  '&:hover': {
                    bgcolor: theme.palette.primary.dark,
                  }
                }}
              >
                {loading ? <CircularProgress size={14} color="inherit" /> : <AddIcon fontSize="small" />}
              </IconButton>
            </Box>
          )}
        </Box>

        {product.stock > 0 && product.stock < 10 && (
          <Typography variant="caption" color="warning.main" sx={{ mt: 0.5 }}>
            {product.stock} in stock
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductCard;
