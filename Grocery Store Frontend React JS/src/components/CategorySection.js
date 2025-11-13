import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { ChevronRight } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import ProductCard from './ProductCard';

const CategorySection = ({ categoryName, products }) => {
  const navigate = useNavigate();
  
  if (!products || products.length === 0) return null;

  const handleSeeAll = () => {
    navigate(`/category?category=${encodeURIComponent(categoryName)}`);
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>{categoryName}</Typography>
        <Box 
          onClick={handleSeeAll}
          sx={{ display: 'flex', alignItems: 'center', color: 'success.main', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
        >
          <Typography variant="body2" sx={{ fontWeight: 600 }}>see all</Typography>
          <IconButton size="small" sx={{ color: 'success.main' }}>
            <ChevronRight />
          </IconButton>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 2, '&::-webkit-scrollbar': { height: 6 }, '&::-webkit-scrollbar-thumb': { bgcolor: 'grey.300', borderRadius: 3 } }}>
        {products.map((product) => (
          <Box key={product.id} sx={{ minWidth: 180, maxWidth: 180 }}>
            <ProductCard product={product} />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default CategorySection;
