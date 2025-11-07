import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  CircularProgress,
  Alert,
  Button,
  Breadcrumbs,
  Link,
  Chip,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import Header from '../../components/grocery/Header';
import CartDrawer from '../../components/grocery/CartDrawer';
import { apiService } from '../../services/api.service';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);

  useEffect(() => {
    loadProductDetails();
  }, [id]);

  const loadProductDetails = async () => {
    try {
      setLoading(true);
      const productData = await apiService.products.getById(id);
      setProduct(productData);
      setError(null);
    } catch (error) {
      console.error('Error loading product:', error);
      setError('Failed to load product details.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    try {
      await apiService.cart.addItem(product.id, 1);
      enqueueSnackbar(`Added ${product.name} to cart`, { variant: 'success' });
      setCartDrawerOpen(true);
    } catch (error) {
      enqueueSnackbar('Failed to add to cart', { variant: 'error' });
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

  if (error || !product) {
    return (
      <Box>
        <Header onCartClick={() => setCartDrawerOpen(true)} />
        <Container sx={{ py: 4 }}>
          <Alert severity="error">{error || 'Product not found'}</Alert>
        </Container>
      </Box>
    );
  }

  return (
    <Box>
      <Header onCartClick={() => setCartDrawerOpen(true)} />
      
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Breadcrumbs sx={{ mb: 3 }}>
          <Link color="inherit" onClick={() => navigate('/')} sx={{ cursor: 'pointer' }}>
            Home
          </Link>
          <Link color="inherit" onClick={() => navigate(`/category/${product.category.toLowerCase()}`)} sx={{ cursor: 'pointer' }}>
            {product.category}
          </Link>
          <Typography color="text.primary">{product.name}</Typography>
        </Breadcrumbs>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src={product.imageUrl || 'https://via.placeholder.com/500'}
              alt={product.name}
              sx={{ width: '100%', borderRadius: 2, boxShadow: 2 }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
              {product.name}
            </Typography>

            <Chip label={product.category} color="primary" sx={{ mb: 2 }} />

            <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold', mb: 3 }}>
              ₹{product.price?.toFixed(2)}
            </Typography>

            <Typography variant="body1" color="text.secondary" paragraph>
              {product.description}
            </Typography>

            {product.stock > 0 ? (
              <Typography variant="body2" color="success.main" sx={{ mb: 3 }}>
                In Stock: {product.stock} available
              </Typography>
            ) : (
              <Typography variant="body2" color="error" sx={{ mb: 3 }}>
                Out of Stock
              </Typography>
            )}

            <Button
              variant="contained"
              size="large"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              sx={{ textTransform: 'none', fontWeight: 'bold', px: 6 }}
            >
              Add to Cart
            </Button>
          </Grid>
        </Grid>
      </Container>

      <CartDrawer 
        open={cartDrawerOpen} 
        onClose={() => setCartDrawerOpen(false)} 
      />
    </Box>
  );
};

export default ProductDetailPage;
