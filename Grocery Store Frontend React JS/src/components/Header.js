import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppBar, Toolbar, Box, Typography, IconButton, Badge, TextField, InputAdornment, Menu, MenuItem, Button, Paper, List, ListItem, ListItemText, ClickAwayListener } from '@mui/material';
import { ShoppingCart, AccountCircle, LocationOn, Search as SearchIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../redux/actions/authActions';
import CartDrawer from './CartDrawer';
import LocationModal from './LocationModal';
import AnimatedSearchPlaceholder from './AnimatedSearchPlaceholder';
import { useLocation } from '../context/LocationContext';

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { location } = useLocation();
  
  const storeData = useSelector((state) => {
    return {
      user: state?.auth?.user,
      isAuthenticated: state?.auth?.isAuthenticated,
      cartItems: state?.cart?.items,
      products: state?.products?.products,
    };
  });

  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [accountMenuAnchor, setAccountMenuAnchor] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchInputRef = useRef(null);

  const totalQuantity = (storeData.cartItems || []).reduce((sum, item) => sum + item.quantity, 0);

  // Update search suggestions based on query
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const query = searchQuery.toLowerCase();
      const suggestions = (storeData.products || [])
        .filter(product => 
          product.name.toLowerCase().includes(query) ||
          product.categoryName?.toLowerCase().includes(query)
        )
        .slice(0, 8) // Limit to 8 suggestions
        .map(product => ({
          id: product.id,
          name: product.name,
          category: product.categoryName,
          imageUrl: product.imageUrl
        }));
      setSearchSuggestions(suggestions);
      setShowSuggestions(true);
    } else {
      setSearchSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery, storeData.products]);

  const handleAccountClick = (event) => {
    if (storeData.isAuthenticated) {
      setAccountMenuAnchor(event.currentTarget);
    } else {
      navigate('/login');
    }
  };

  const handleAccountClose = () => {
    setAccountMenuAnchor(null);
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    handleAccountClose();
    navigate('/');
  };

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to home page with search query
      navigate(`/?search=${encodeURIComponent(searchQuery)}`);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (productName) => {
    setSearchQuery(productName);
    navigate(`/?search=${encodeURIComponent(productName)}`);
    setShowSuggestions(false);
  };

  const handleClickAway = () => {
    setShowSuggestions(false);
  };

  return (
    <>
      <AppBar position="sticky" sx={{ bgcolor: 'white', color: 'text.primary', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        <Toolbar sx={{ gap: 2, justifyContent: 'space-between' }}>
          {/* Left side: Logo and Location */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main', cursor: 'pointer', minWidth: '120px' }} onClick={() => navigate('/')}>
              Grocery
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer', minWidth: '200px' }} onClick={() => setLocationModalOpen(true)}>
              <LocationOn sx={{ fontSize: 20 }} />
              <Box>
                <Typography variant="caption" sx={{ fontWeight: 600, display: 'block' }}>Delivery in {location.deliveryTime}</Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>{location.address}</Typography>
              </Box>
            </Box>
          </Box>

          {/* Center: Search */}
          <ClickAwayListener onClickAway={handleClickAway}>
            <Box component="form" onSubmit={handleSearch} sx={{ flexGrow: 1, maxWidth: 600, mx: 2, position: 'relative' }}>
              <TextField
                fullWidth
                size="small"
                placeholder=""
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.trim().length > 0 && setShowSuggestions(true)}
                inputRef={searchInputRef}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                  sx: { borderRadius: 2, bgcolor: 'background.default' }
                }}
              />
              
              {/* Animated Placeholder Overlay */}
              {!searchQuery && (
                <Box
                  sx={{
                    position: 'absolute',
                    left: 48,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none',
                    zIndex: 1,
                  }}
                >
                  <AnimatedSearchPlaceholder />
                </Box>
              )}
              
              {/* Search Suggestions Dropdown */}
              {showSuggestions && searchSuggestions.length > 0 && (
                <Paper
                  sx={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    zIndex: 1300,
                    mt: 0.5,
                    maxHeight: 400,
                    overflowY: 'auto',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  }}
                >
                  <List sx={{ py: 0 }}>
                    {searchSuggestions.map((suggestion) => (
                      <ListItem
                        key={suggestion.id}
                        button
                        onClick={() => handleSuggestionClick(suggestion.name)}
                        sx={{
                          py: 1.5,
                          px: 2,
                          '&:hover': {
                            bgcolor: 'action.hover',
                          },
                          borderBottom: '1px solid',
                          borderColor: 'divider',
                          '&:last-child': {
                            borderBottom: 'none',
                          }
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                          {suggestion.imageUrl && (
                            <Box
                              component="img"
                              src={suggestion.imageUrl}
                              alt={suggestion.name}
                              sx={{
                                width: 40,
                                height: 40,
                                objectFit: 'cover',
                                borderRadius: 1,
                                flexShrink: 0,
                              }}
                            />
                          )}
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary' }}>
                              {suggestion.name}
                            </Typography>
                            {suggestion.category && (
                              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                in {suggestion.category}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              )}
            </Box>
          </ClickAwayListener>

          {/* Right side: Account/Login and Cart */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {storeData.isAuthenticated ? (
              <Button startIcon={<AccountCircle />} onClick={handleAccountClick} sx={{ textTransform: 'none' }}>
                Account
              </Button>
            ) : (
              <Button variant="text" onClick={() => navigate('/login')} sx={{ textTransform: 'none' }}>
                Login
              </Button>
            )}
            
            <IconButton onClick={() => setCartDrawerOpen(true)} aria-label="shopping cart">
              <Badge badgeContent={totalQuantity} color="primary">
                <ShoppingCart />
              </Badge>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Menu anchorEl={accountMenuAnchor} open={Boolean(accountMenuAnchor)} onClose={handleAccountClose}>
        <MenuItem disabled>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>{storeData.user?.name || storeData.user?.email}</Typography>
        </MenuItem>
        <MenuItem onClick={() => { handleAccountClose(); navigate('/my-orders'); }}>My Orders</MenuItem>
        <MenuItem onClick={() => { handleAccountClose(); navigate('/saved-addresses'); }}>Saved Addresses</MenuItem>
        <MenuItem onClick={handleLogout}>Log Out</MenuItem>
      </Menu>

      <CartDrawer open={cartDrawerOpen} onClose={() => setCartDrawerOpen(false)} />
      <LocationModal open={locationModalOpen} onClose={() => setLocationModalOpen(false)} />
    </>
  );
};

export default Header;
