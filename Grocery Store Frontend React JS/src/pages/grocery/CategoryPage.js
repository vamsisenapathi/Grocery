import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  CircularProgress,
  Alert,
  Breadcrumbs,
  Link,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/grocery/Header';
import ProductCard from '../../components/grocery/ProductCard';
import CartDrawer from '../../components/grocery/CartDrawer';
import { apiService } from '../../services/api.service';

const CategoryPage = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);

  useEffect(() => {
    if (category) {
      loadCategoryProducts();
    }
  }, [category]);

  const loadCategoryProducts = async () => {
    try {
      setLoading(true);
      const categoryProducts = await apiService.categories.getProducts(category);
      setProducts(categoryProducts);
      setError(null);
    } catch (error) {
      console.error('Error loading category products:', error);
      setError('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const categoryTitle = category?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Products';

  return (
    <Box>
      <Header onCartClick={() => setCartDrawerOpen(true)} />
      
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Breadcrumbs sx={{ mb: 2 }}>
          <Link color="inherit" onClick={() => navigate('/')} sx={{ cursor: 'pointer' }}>
            Home
          </Link>
          <Typography color="text.primary">{categoryTitle}</Typography>
        </Breadcrumbs>

        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
          {categoryTitle}
        </Typography>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        ) : products.length === 0 ? (
          <Alert severity="info">
            No products found in this category.
          </Alert>
        ) : (
          <Grid container spacing={2}>
            {products.map(product => (
              <Grid item xs={6} sm={4} md={3} lg={2.4} key={product.id}>
                <ProductCard product={product} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      <CartDrawer 
        open={cartDrawerOpen} 
        onClose={() => setCartDrawerOpen(false)} 
      />
    </Box>
  );
};

export default CategoryPage;
