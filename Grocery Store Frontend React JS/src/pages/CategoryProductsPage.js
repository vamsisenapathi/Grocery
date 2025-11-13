import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Container, Typography, Grid, Box, CircularProgress, Paper } from '@mui/material';
import ProductCard from '../components/ProductCard';

const CategoryProductsPage = () => {
  const [searchParams] = useSearchParams();
  const categoryName = searchParams.get('category') || '';

  const storeData = useSelector((state) => {
    return {
      products: state?.products?.products || [],
      loading: state?.products?.loading || false,
    };
  });

  // Filter products by category
  const categoryProducts = useMemo(() => {
    if (!categoryName) return [];
    return storeData.products.filter(
      product => product.categoryName?.toLowerCase() === categoryName.toLowerCase()
    );
  }, [storeData.products, categoryName]);

  if (storeData.loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
        {categoryName}
      </Typography>

      {categoryProducts.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            No products found in this category
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={2}>
          {categoryProducts.map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>
      )}

      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Showing {categoryProducts.length} {categoryProducts.length === 1 ? 'product' : 'products'}
        </Typography>
      </Box>
    </Container>
  );
};

export default CategoryProductsPage;
