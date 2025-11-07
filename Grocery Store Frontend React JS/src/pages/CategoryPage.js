import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Box, 
  Typography, 
  Container,
  Grid,
  Button,
  Paper,
  Breadcrumbs,
  Link,
  Fade
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import { fetchProductsByCategory } from '../redux/actions/productActions';
import { 
  ProductsGridSkeleton, 
  ErrorState,
  ButtonLoader 
} from '../components/LoadingComponents';
import ProductCard from '../components/ProductCard';
import { AVAILABLE_CATEGORIES, CATEGORY_DISPLAY_NAMES } from '../apiActions';

const CategoryPage = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { products, loading, error } = useSelector((state) => state.products);

  // Check if category is valid using the API constants
  const isValidCategory = AVAILABLE_CATEGORIES.includes(category?.toLowerCase());

  // Get display name for the category
  const displayCategory = CATEGORY_DISPLAY_NAMES[category?.toLowerCase()] || 
    (category ? category.charAt(0).toUpperCase() + category.slice(1) : '');

  // Fetch products for the category when component mounts or category changes
  useEffect(() => {
    if (isValidCategory) {
      console.log('🔄 CategoryPage: Fetching products for category:', category);
      dispatch(fetchProductsByCategory(category));
    }
  }, [dispatch, category, isValidCategory]);

  // Handle invalid category
  if (!isValidCategory) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <ErrorState
          title="Category Not Found"
          message={`The category "${category}" is not available.`}
          onRetry={() => navigate('/products')}
          retryText="View All Products"
          showHomeButton={true}
          onHome={() => navigate('/')}
        />
        <Paper elevation={1} sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Available Categories:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
            {AVAILABLE_CATEGORIES.map((cat) => (
              <Button
                key={cat}
                variant="outlined"
                size="small"
                onClick={() => navigate(`/category/${cat}`)}
                sx={{ textTransform: 'capitalize' }}
              >
                {CATEGORY_DISPLAY_NAMES[cat] || cat}
              </Button>
            ))}
          </Box>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
        <Link 
          color="inherit" 
          href="/" 
          onClick={(e) => { e.preventDefault(); navigate('/'); }}
          sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
        >
          <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          Home
        </Link>
        <Link 
          color="inherit" 
          href="/products"
          onClick={(e) => { e.preventDefault(); navigate('/products'); }}
          sx={{ textDecoration: 'none' }}
        >
          Products
        </Link>
        <Typography color="text.primary">{displayCategory}</Typography>
      </Breadcrumbs>

      {/* Category Header */}
      <Fade in={true} timeout={500}>
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom
            sx={{ 
              fontWeight: 'bold',
              color: 'primary.main',
              mb: 2
            }}
          >
            {displayCategory}
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary"
            sx={{ mb: 2 }}
          >
            Fresh {displayCategory.toLowerCase()} delivered to your doorstep
          </Typography>
          
          {/* Product count - only show when not loading */}
          {!loading && !error && products && (
            <Typography 
              variant="body1" 
              color="text.secondary"
            >
              {products.length > 0 ? 
                `Found ${products.length} ${displayCategory.toLowerCase()} products` :
                `No ${displayCategory.toLowerCase()} products available`
              }
            </Typography>
          )}
        </Box>
      </Fade>

      {/* Loading State with Skeleton */}
      {loading && (
        <Fade in={true} timeout={300}>
          <Box>
            <Typography 
              variant="body1" 
              color="text.secondary" 
              sx={{ mb: 3, textAlign: 'center' }}
            >
              Loading {displayCategory.toLowerCase()} products...
            </Typography>
            <ProductsGridSkeleton count={8} />
          </Box>
        </Fade>
      )}

      {/* Error State */}
      {error && !loading && (
        <Fade in={true} timeout={300}>
          <Box>
            <ErrorState
              title="Failed to Load Products"
              message={error}
              onRetry={() => dispatch(fetchProductsByCategory(category))}
              retryText="Try Again"
              showHomeButton={true}
              onHome={() => navigate('/')}
            />
          </Box>
        </Fade>
      )}

      {/* Products Grid */}
      {!loading && !error && products && (
        <Fade in={true} timeout={600}>
          <Box>
            {products.length > 0 ? (
              <Grid container spacing={3}>
                {products.map((product, index) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                    <Fade 
                      in={true} 
                      timeout={300 + (index * 50)} 
                      style={{ transitionDelay: `${index * 50}ms` }}
                    >
                      <Box>
                        <ProductCard product={product} />
                      </Box>
                    </Fade>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Paper elevation={1} sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No {displayCategory} Products Found
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  We don't have any {displayCategory.toLowerCase()} products available at the moment.
                  Check back later or browse other categories.
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <ButtonLoader
                    onClick={() => navigate('/products')}
                    variant="contained"
                    color="primary"
                  >
                    View All Products
                  </ButtonLoader>
                  <ButtonLoader
                    onClick={() => dispatch(fetchProductsByCategory(category))}
                    variant="outlined"
                    color="primary"
                  >
                    Refresh
                  </ButtonLoader>
                  <ButtonLoader
                    onClick={() => navigate('/')}
                    variant="text"
                    color="secondary"
                  >
                    Go Home
                  </ButtonLoader>
                </Box>
              </Paper>
            )}
          </Box>
        </Fade>
      )}
    </Container>
  );
};

export default CategoryPage;