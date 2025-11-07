import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import Header from '../../components/grocery/Header';
import ProductCard from '../../components/grocery/ProductCard';
import CartDrawer from '../../components/grocery/CartDrawer';
import { apiService } from '../../services/api.service';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);

  useEffect(() => {
    if (searchQuery) {
      searchProducts();
    }
  }, [searchQuery]);

  const searchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Validate search query
      if (searchQuery.trim().length < 2) {
        setError('Please enter at least 2 characters to search');
        setProducts([]);
        setLoading(false);
        return;
      }
      
      const results = await apiService.products.search(searchQuery);
      setProducts(results);
      
      if (results.length === 0) {
        setError(`No products found for "${searchQuery}". Try searching with different keywords like product name, category, or description.`);
      }
    } catch (error) {
      console.error('Search error:', error);
      setError('Failed to search products. Please try again.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Header onCartClick={() => setCartDrawerOpen(true)} />
      
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
          Search Results for "{searchQuery}"
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {loading ? 'Searching...' : error ? '' : `Found ${products.length} product${products.length !== 1 ? 's' : ''}`}
        </Typography>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity={products.length === 0 ? 'info' : 'error'} sx={{ mb: 3 }}>
            {error}
          </Alert>
        ) : products.length === 0 ? (
          <Alert severity="info">
            No products found for "{searchQuery}". Try searching with different keywords.
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

export default SearchPage;
