import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Badge,
  Box,
  Menu,
  MenuItem,
  Avatar,
  Divider,
} from '@mui/material';
import {
  ShoppingCart as CartIcon,
  AccountCircle as AccountIcon,
  Store as StoreIcon,
  Logout as LogoutIcon,
  LocationOn as AddressIcon,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../redux/actions/authActions';
import { AVAILABLE_CATEGORIES, CATEGORY_DISPLAY_NAMES } from '../apiActions';
import { ButtonLoader, CategoryNavSkeleton } from '../components/LoadingComponents';

const AppNavbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Use categories from API constants
  const categories = AVAILABLE_CATEGORIES;
  
  const storeData = useSelector((state) => {
    return {
      isAuthenticated: state?.auth?.isAuthenticated,
      user: state?.auth?.user,
      totalItems: state?.cart?.totalItems,
      productsLoading: state?.products?.loading, // Add loading state for navigation feedback
    };
  });

  const { isAuthenticated, user, totalItems, productsLoading } = storeData;
  
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [categoriesMenuAnchor, setCategoriesMenuAnchor] = React.useState(null);
  const [navigationLoading, setNavigationLoading] = React.useState(false);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCategoriesMenu = (event) => {
    setCategoriesMenuAnchor(event.currentTarget);
  };

  const handleCategoriesClose = () => {
    setCategoriesMenuAnchor(null);
  };

  const handleCategoryNavigation = async (category) => {
    setNavigationLoading(true);
    try {
      navigate(`/category/${category}`);
    } finally {
      // Small delay to show loading state
      setTimeout(() => setNavigationLoading(false), 300);
    }
  };

  const handleLogout = async () => {
    await dispatch(logoutUser());
    handleClose();
    navigate('/login');
  };

  const getUserDisplayName = () => {
    if (user?.name) return user.name;
    if (user?.email) return user.email;
    return 'User';
  };

  return (
    <>
      {/* Main Navigation Bar */}
      <AppBar position="sticky" color="primary">
        <Toolbar>
          {/* Logo and Brand */}
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => navigate('/')}
            sx={{ mr: 2 }}
          >
            <StoreIcon />
          </IconButton>
          
          <Typography
            variant="h6"
            component="div"
            sx={{ 
              cursor: 'pointer',
              display: { xs: 'none', sm: 'block' }
            }}
            onClick={() => navigate('/')}
          >
            GroCery Store
          </Typography>

          {/* Category Navigation - In the green bar */}
          <Box 
            sx={{ 
              display: { xs: 'none', md: 'flex' }, 
              gap: 1, 
              ml: 4,
              flexGrow: 1,
              alignItems: 'center'
            }}
          >
            {navigationLoading || productsLoading ? (
              <CategoryNavSkeleton />
            ) : (
              categories.map((category) => (
                <ButtonLoader
                  key={category}
                  color="inherit"
                  size="small"
                  variant="text"
                  loading={false}
                  onClick={() => handleCategoryNavigation(category)}
                  sx={{
                    minWidth: 'auto',
                    whiteSpace: 'nowrap',
                    px: 1.5,
                    py: 0.5,
                    fontSize: '0.875rem',
                    fontWeight: 400,
                    textTransform: 'none',
                    color: 'inherit',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    },
                  }}
                >
                  {CATEGORY_DISPLAY_NAMES[category] || category}
                </ButtonLoader>
              ))
            )}
          </Box>

          {/* Mobile Categories Button */}
          <Button
            color="inherit"
            onClick={handleCategoriesMenu}
            sx={{ 
              display: { xs: 'block', md: 'none' },
              ml: 1
            }}
          >
            Categories
          </Button>

          {/* Spacer for right side alignment */}
          <Box sx={{ flexGrow: { xs: 1, md: 0 } }} />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Products Link */}
            <Button 
              color="inherit" 
              onClick={() => navigate('/')}
              sx={{ display: { xs: 'none', sm: 'block' } }}
            >
              Products
            </Button>

            {/* Orders Link - Only for authenticated users */}
            {isAuthenticated && (
              <Button 
                color="inherit" 
                onClick={() => navigate('/orders')}
                sx={{ display: { xs: 'none', sm: 'block' } }}
              >
                Orders
              </Button>
            )}

            {/* Cart Icon */}
            <IconButton 
              color="inherit" 
              onClick={() => navigate('/cart')}
              sx={{ mr: 1 }}
            >
              <Badge badgeContent={totalItems || 0} color="error">
                <CartIcon />
              </Badge>
            </IconButton>

            {/* User Authentication */}
            {isAuthenticated ? (
              <>
                <IconButton
                  size="large"
                  color="inherit"
                  onClick={handleMenu}
                >
                  <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                    {getUserDisplayName().charAt(0).toUpperCase()}
                  </Avatar>
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem disabled>
                    <Typography variant="body2" color="text.secondary">
                      {getUserDisplayName()}
                    </Typography>
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={() => { handleClose(); navigate('/orders'); }}>
                    <AccountIcon sx={{ mr: 1 }} />
                    My Orders
                  </MenuItem>
                  <MenuItem onClick={() => { handleClose(); navigate('/addresses'); }}>
                    <AddressIcon sx={{ mr: 1 }} />
                    Saved Addresses
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleLogout}>
                    <LogoutIcon sx={{ mr: 1 }} />
                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button color="inherit" onClick={() => navigate('/login')}>
                  Login
                </Button>
                <Button 
                  color="inherit" 
                  variant="outlined" 
                  onClick={() => navigate('/register')}
                  sx={{ 
                    borderColor: 'white',
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)'
                    }
                  }}
                >
                  Register
                </Button>
              </Box>
            )}
          </Box>
        </Toolbar>

        {/* Mobile Categories Menu */}
        <Menu
          anchorEl={categoriesMenuAnchor}
          open={Boolean(categoriesMenuAnchor)}
          onClose={handleCategoriesClose}
          sx={{ display: { xs: 'block', md: 'none' } }}
        >
          {categories.map((category) => (
            <MenuItem 
              key={category}
              onClick={() => {
                handleCategoriesClose();
                handleCategoryNavigation(category);
              }}
            >
              {CATEGORY_DISPLAY_NAMES[category] || category}
            </MenuItem>
          ))}
        </Menu>
      </AppBar>
    </>
  );
};

export default AppNavbar;