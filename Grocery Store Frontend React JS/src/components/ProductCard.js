import React, { useState } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
} from '@mui/material';
import { Add as AddIcon, Visibility as ViewIcon } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { addToCart } from '../redux/actions/cartActions';
import { ButtonLoader } from '../components/LoadingComponents';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [imageError, setImageError] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  
  const storeData = useSelector((state) => {
    return {
      isAuthenticated: state?.auth?.isAuthenticated,
      user: state?.auth?.user,
    };
  });

  const { isAuthenticated, user } = storeData;

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      // Redirect to login page
      enqueueSnackbar('Please login to add items to cart', { variant: 'warning' });
      navigate('/login');
      return;
    }

    if (isOutOfStock) {
      enqueueSnackbar('Sorry, this item is out of stock', { variant: 'error' });
      return;
    }

    // Get user ID from the authentication state
    const userId = user?.userId || user?.id;
    
    if (!userId) {
      enqueueSnackbar('User information not found. Please login again.', { variant: 'error' });
      navigate('/login');
      return;
    }

    const cartItem = {
      userId: userId,
      productId: product.id,
      quantity: 1
    };

    try {
      setIsAddingToCart(true);
      console.log('Adding to cart:', cartItem);
      await dispatch(addToCart(cartItem));
      enqueueSnackbar(`${product.name} added to cart!`, { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Failed to add item to cart', { variant: 'error' });
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleViewDetails = () => {
    // Show product details using snackbar notification
    enqueueSnackbar(
      `${product.name} - $${product.price} | Category: ${product.category} | Stock: ${product.stock}`, 
      { 
        variant: 'info',
        autoHideDuration: 4000
      }
    );
    
    // You can also log to console for more details
    console.log('Product Details:', {
      name: product.name,
      price: product.price,
      category: product.category,
      stock: product.stock,
      description: product.description
    });
    
    // Uncomment this line when you have a product details page
    // navigate(`/products/${product.id}`);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const getImageSrc = () => {
    if (imageError) {
      return `https://via.placeholder.com/400x400/f0f0f0/666666?text=${encodeURIComponent(product.name)}`;
    }
    return product.imageUrl || product.image || `https://via.placeholder.com/400x400/f0f0f0/666666?text=${encodeURIComponent(product.name)}`;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  const isOutOfStock = !product.stock || product.stock <= 0;

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
        },
      }}
    >
      <CardMedia
        component="img"
        height="200"
        image={getImageSrc()}
        alt={product.name}
        onError={handleImageError}
        sx={{
          objectFit: 'cover',
          backgroundColor: '#f5f5f5',
        }}
      />
      
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        <Typography gutterBottom variant="h6" component="div" noWrap>
          {product.name}
        </Typography>
        
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            mb: 1,
          }}
        >
          {product.description}
        </Typography>

        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="h6" color="primary" fontWeight="bold">
            {formatPrice(product.price)}
          </Typography>
          
          <Chip
            label={product.category}
            size="small"
            color="secondary"
            variant="outlined"
          />
        </Box>

        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="body2" color="text.secondary">
            Stock: {product.stock || 0}
          </Typography>
          
          {isOutOfStock && (
            <Chip
              label="Out of Stock"
              size="small"
              color="error"
              variant="filled"
            />
          )}
        </Box>
      </CardContent>

      <CardActions sx={{ pt: 0, justifyContent: 'space-between' }}>
        <Button
          size="small"
          variant="text"
          color="primary"
          startIcon={<ViewIcon />}
          onClick={handleViewDetails}
        >
          View Details
        </Button>
        
        <ButtonLoader
          size="small"
          variant="contained"
          color="primary"
          loading={isAddingToCart}
          disabled={isOutOfStock}
          onClick={handleAddToCart}
          startIcon={<AddIcon />}
          sx={{ minWidth: 120 }}
        >
          Add to Cart
        </ButtonLoader>
      </CardActions>
    </Card>
  );
};

export default ProductCard;