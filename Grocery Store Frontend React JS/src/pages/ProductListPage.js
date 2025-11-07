import React, { useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Box,
  CircularProgress,
  Alert,
  Skeleton,
  Button,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../redux/actions/productActions';
import ProductCard from '../components/ProductCard';
import FilterBar from '../components/FilterBar';
import APIDebugPanel from '../components/APIDebugPanel';

const ProductListPage = () => {
  const dispatch = useDispatch();
  
  const storeData = useSelector((state) => {
    return {
      filteredProducts: state?.products?.filteredProducts,
      loading: state?.products?.loading,
      error: state?.products?.error,
    };
  });

  const { filteredProducts, loading, error } = storeData;

  useEffect(() => {
    console.log('🔄 ProductListPage mounted, fetching products...');
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleRefreshProducts = () => {
    console.log('🔄 Manual refresh triggered');
    dispatch(fetchProducts());
  };

  const renderLoadingSkeletons = () => {
    return Array.from({ length: 8 }).map((_, index) => (
      <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
        <Box>
          <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 1 }} />
          <Box sx={{ pt: 1 }}>
            <Skeleton />
            <Skeleton width="60%" />
            <Box display="flex" justifyContent="space-between" sx={{ mt: 1 }}>
              <Skeleton width="40%" />
              <Skeleton width="30%" />
            </Box>
          </Box>
        </Box>
      </Grid>
    ));
  };

  const renderProducts = () => {
    if (filteredProducts.length === 0) {
      return (
        <Grid item xs={12}>
          <Box 
            display="flex" 
            flexDirection="column" 
            alignItems="center" 
            justifyContent="center"
            minHeight="300px"
            textAlign="center"
          >
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No products found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try adjusting your search or filter criteria
            </Typography>
          </Box>
        </Grid>
      );
    }

    return filteredProducts.map((product) => (
      <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
        <ProductCard product={product} />
      </Grid>
    ));
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Page Header */}
      <Box mb={3} display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
            Fresh Groceries
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Discover fresh, quality products for your daily needs
          </Typography>
        </Box>
        <Button 
          variant="outlined" 
          onClick={handleRefreshProducts}
          disabled={loading}
        >
          {loading ? <CircularProgress size={20} /> : 'Refresh Products'}
        </Button>
      </Box>

      {/* Filter Bar */}
      <FilterBar />

      {/* Debug Panel - Temporary for testing */}
      <APIDebugPanel />

      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Products Grid */}
      <Grid container spacing={3}>
        {loading ? renderLoadingSkeletons() : renderProducts()}
      </Grid>

      {/* Loading Indicator for Additional Content */}
      {loading && (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      )}

      {/* Results Summary */}
      {!loading && !error && (
        <Box mt={3} textAlign="center">
          <Typography variant="body2" color="text.secondary">
            Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default ProductListPage;