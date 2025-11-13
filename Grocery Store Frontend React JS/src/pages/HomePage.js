import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Box, Typography, Grid, CircularProgress } from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { fetchProducts } from '../redux/actions/productActions';
import { fetchCategories } from '../redux/actions/categoryActions';
import CategorySection from '../components/CategorySection';

const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  
  const storeData = useSelector((state) => {
    return {
      products: state?.products?.products || [],
      productsLoading: state?.products?.loading || false,
      productsError: state?.products?.error,
      categories: state?.categories?.categories || [],
      categoriesLoading: state?.categories?.loading || false,
      categoriesError: state?.categories?.error,
    };
  });

  useEffect(() => {
    if (process.env.NODE_ENV !== 'test') {
      dispatch(fetchProducts());
      dispatch(fetchCategories());
    }
  }, [dispatch]);

  const loading = storeData.productsLoading || storeData.categoriesLoading;

  // Filter products based on search query only
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return storeData.products;
    
    const query = searchQuery.toLowerCase();
    return storeData.products.filter(product => 
      product.name?.toLowerCase().includes(query) ||
      product.description?.toLowerCase().includes(query) ||
      product.categoryName?.toLowerCase().includes(query) ||
      product.brandName?.toLowerCase().includes(query)
    );
  }, [storeData.products, searchQuery]);

  // Group products by category
  const categorizedProducts = useMemo(() => {
    const grouped = {};
    if (storeData.categories.length > 0 && filteredProducts.length > 0) {
      storeData.categories.forEach(category => {
        // Match products by categoryName (case-insensitive)
        const categoryProducts = filteredProducts.filter(
          p => p.categoryName && p.categoryName.toLowerCase() === category.name.toLowerCase()
        );
        if (categoryProducts.length > 0) {
          // Show all products if searching, otherwise limit based on category
          // Show more products for Groceries & Staples (20) and Snacks & Beverages (15)
          let limit = 10; // default
          if (!searchQuery) {
            if (category.name.toLowerCase().includes('groceries') || category.name.toLowerCase().includes('staples')) {
              limit = 20;
            } else if (category.name.toLowerCase().includes('snacks') || category.name.toLowerCase().includes('beverages')) {
              limit = 15;
            }
          }
          grouped[category.displayName] = searchQuery ? categoryProducts : categoryProducts.slice(0, limit);
        }
      });
    }
    return grouped;
  }, [storeData.categories, filteredProducts, searchQuery]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', flexDirection: 'column', gap: 2 }}>
        <CircularProgress size={60} thickness={4} />
        <Typography variant="body1" color="text.secondary">Loading products...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Search Results Header */}
      {searchQuery && (
        <Box sx={{ bgcolor: '#f5f5f5', py: 2, mb: 3 }}>
          <Container maxWidth="lg">
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              Search results for: <strong>"{searchQuery}"</strong>
              <Typography component="span" variant="body2" color="text.secondary">
                ({filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'} found)
              </Typography>
            </Typography>
          </Container>
        </Box>
      )}

      {/* Products by Category */}
      <Container maxWidth="lg" sx={{ py: 3 }}>
        {Object.keys(categorizedProducts).length === 0 && !loading && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h5" color="text.secondary">
              {searchQuery ? `No products found for "${searchQuery}"` : 'No products available'}
            </Typography>
            {searchQuery && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Try a different search term or browse all products
              </Typography>
            )}
          </Box>
        )}
        {Object.entries(categorizedProducts).map(([categoryName, products]) => (
          <CategorySection key={categoryName} categoryName={categoryName} products={products} />
        ))}
      </Container>
    </Box>
  );
};

export default HomePage;
