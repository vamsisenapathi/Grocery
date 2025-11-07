import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Alert,
  Button,
  Chip,
} from '@mui/material';
import { ArrowForward as ArrowForwardIcon } from '@mui/icons-material';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import Header from '../../components/grocery/Header';
import ProductCard from '../../components/grocery/ProductCard';
import CartDrawer from '../../components/grocery/CartDrawer';
import { apiService } from '../../services/api.service';
import { useNavigate } from 'react-router-dom';
import { fetchCategories } from '../../redux/actions/productActions';

const HomePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Redux state
  const { categories } = useSelector(state => state.products);
  
  // Local state
  const [products, setProducts] = useState([]);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);

  useEffect(() => {
    loadProducts();
    loadBanners();
    dispatch(fetchCategories()); // Load categories from backend
  }, [dispatch]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Loading products...');
      const productsData = await apiService.products.getAll();
      console.log('✅ Products loaded:', productsData?.length || 0, 'items');
      
      if (!productsData || productsData.length === 0) {
        throw new Error('No products returned from API');
      }
      
      setProducts(productsData);
    } catch (error) {
      console.error('❌ Error loading products:', error);
      setError('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadBanners = async () => {
    try {
      // Fetch banners from API - you should implement this endpoint in your backend
      // For now, we'll use a simple array but linked to actual categories
      setBanners([
        {
          id: 1,
          image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&h=400&fit=crop',
          title: 'Fresh Vegetables & Fruits',
          category: 'vegetables'
        },
        {
          id: 2,
          image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=1200&h=400&fit=crop',
          title: 'Electronics',
          category: 'electronics'
        },
        {
          id: 3,
          image: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=1200&h=400&fit=crop',
          title: 'Snacks & Beverages',
          category: 'snacks'
        }
      ]);
    } catch (error) {
      console.error('Error loading banners:', error);
    }
  };

  // Group products by categoryName (from backend API)
  const groupedProducts = products.reduce((acc, product) => {
    const category = product.categoryName || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(product);
    return acc;
  }, {});

  const productCategories = Object.keys(groupedProducts).sort();

  const handleBannerClick = (category) => {
    if (category) {
      navigate(`/category/${category}`);
    }
  };

  return (
    <Box>
      <Header onCartClick={() => setCartDrawerOpen(true)} />
      
      {/* Horizontal Categories Navigation */}
      <Box sx={{ 
        bgcolor: 'white', 
        borderBottom: '1px solid #e0e0e0',
        position: 'sticky',
        top: { xs: 60, md: 70 },
        zIndex: 100,
        py: 1.5,
      }}>
        <Container maxWidth="xl">
          <Box sx={{ 
            display: 'flex', 
            gap: 1.5, 
            overflowX: 'auto',
            pb: 1,
            '&::-webkit-scrollbar': {
              height: 6,
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgba(0,0,0,0.2)',
              borderRadius: 3,
            }
          }}>
            {categories.filter(cat => cat !== 'All').map((category) => (
              <Chip
                key={category}
                label={category}
                onClick={() => navigate(`/category/${category.toLowerCase()}`)}
                sx={{
                  cursor: 'pointer',
                  fontWeight: 500,
                  fontSize: '0.875rem',
                  px: 1,
                  bgcolor: 'background.paper',
                  border: '1px solid #e0e0e0',
                  '&:hover': {
                    bgcolor: 'primary.light',
                    color: 'white',
                    borderColor: 'primary.main',
                  }
                }}
              />
            ))}
          </Box>
        </Container>
      </Box>
      
      <Container maxWidth="xl" sx={{ py: 3 }}>
        {/* Banner Carousel */}
        <Box sx={{ mb: 4, borderRadius: 2, overflow: 'hidden' }}>
          <Carousel
            autoPlay
            infiniteLoop
            showThumbs={false}
            showStatus={false}
            interval={3000}
          >
            {banners.map(banner => (
              <div 
                key={banner.id} 
                onClick={() => handleBannerClick(banner.category)}
                style={{ cursor: 'pointer' }}
              >
                <img 
                  src={banner.image} 
                  alt={banner.title}
                  style={{ maxHeight: 400, objectFit: 'cover' }}
                />
              </div>
            ))}
          </Carousel>
        </Box>

        {/* Products Section - Category-wise */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        ) : (
          <>
            {productCategories.map((category) => (
              <Box key={category} sx={{ mb: 5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    {category}
                  </Typography>
                  <Button 
                    endIcon={<ArrowForwardIcon />}
                    onClick={() => navigate(`/category/${category.toLowerCase()}`)}
                    sx={{ textTransform: 'none', fontWeight: 600, color: 'primary.main' }}
                  >
                    see all
                  </Button>
                </Box>
                
                <Box sx={{ 
                  display: 'flex', 
                  gap: 2, 
                  overflowX: 'auto',
                  pb: 2,
                  '&::-webkit-scrollbar': {
                    height: 6,
                  },
                  '&::-webkit-scrollbar-thumb': {
                    backgroundColor: 'rgba(0,0,0,0.2)',
                    borderRadius: 3,
                  }
                }}>
                  {groupedProducts[category].slice(0, 20).map((product) => (
                    <Box key={product.id} sx={{ minWidth: { xs: 160, sm: 180, md: 200 }, maxWidth: { xs: 160, sm: 180, md: 200 } }}>
                      <ProductCard product={product} />
                    </Box>
                  ))}
                </Box>
              </Box>
            ))}
          </>
        )}
      </Container>

      <CartDrawer 
        open={cartDrawerOpen} 
        onClose={() => setCartDrawerOpen(false)} 
      />
    </Box>
  );
};

export default HomePage;
