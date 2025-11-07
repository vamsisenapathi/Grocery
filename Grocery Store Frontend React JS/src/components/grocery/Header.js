import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  IconButton,
  InputBase,
  Badge,
  Button,
  useTheme,
  useMediaQuery,
  alpha,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
} from '@mui/material';
import {
  Search as SearchIcon,
  ShoppingCart as CartIcon,
  Menu as MenuIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon,
  Home as HomeIcon,
  Category as CategoryIcon,
  ListAlt as OrdersIcon,
  LocationCity as AddressIcon,
  CardGiftcard as GiftCardIcon,
  Lock as PrivacyIcon,
  Logout as LogoutIcon,
  KeyboardArrowDown as ArrowDownIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { apiService } from '../../services/api.service';
import { useAuth } from '../../context/AuthContext';
import { useLocation as useLocationContext } from '../../context/LocationContext';
import { cartEvents } from '../../utils/cartEvents';

const Header = ({ onCartClick }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { isLoggedIn, user, logout } = useAuth();
  const { currentLocation, setCurrentLocation } = useLocationContext();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartItemCount, setCartItemCount] = useState(0);
  const [accountMenuAnchor, setAccountMenuAnchor] = useState(null);
  const [locationDialogOpen, setLocationDialogOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [newAddress, setNewAddress] = useState({
    label: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    country: 'India',
    pincode: '',
  });
  const accountMenuOpen = Boolean(accountMenuAnchor);

  // Mock saved addresses with edit functionality
  const [savedAddresses, setSavedAddresses] = useState([
    { id: 1, label: 'Home', line1: '123 Main St', city: 'Bangalore', state: 'Karnataka', country: 'India', pincode: '560001' },
    { id: 2, label: 'Work', line1: '456 Tech Park', city: 'Bangalore', state: 'Karnataka', country: 'India', pincode: '560037' },
  ]);

  useEffect(() => {
    loadCartCount();
    
    // Subscribe to cart changes
    const unsubscribe = cartEvents.subscribe(() => {
      loadCartCount();
    });
    
    return unsubscribe;
  }, []);

  const loadCartCount = async () => {
    try {
      const cart = await apiService.cart.get();
      setCartItemCount(cart.totalItems || 0);
    } catch (error) {
      console.error('Error loading cart count:', error);
      setCartItemCount(0);
    }
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleCartClick = () => {
    if (onCartClick) {
      onCartClick();
    } else {
      navigate('/cart');
    }
  };

  const handleAccountMenuOpen = (event) => {
    setAccountMenuAnchor(event.currentTarget);
  };

  const handleAccountMenuClose = () => {
    setAccountMenuAnchor(null);
  };

  const handleMenuItemClick = (path) => {
    navigate(path);
    handleAccountMenuClose();
  };

  const handleLogout = () => {
    logout();
    handleAccountMenuClose();
    enqueueSnackbar('Logged out successfully', { variant: 'success' });
    navigate('/');
  };

  const handleLocationClick = () => {
    setLocationDialogOpen(true);
  };

  const handleLocationDialogClose = () => {
    setLocationDialogOpen(false);
    setEditingAddressId(null);
    setNewAddress({ label: '', line1: '', line2: '', city: '', state: '', country: 'India', pincode: '' });
  };

  const handleSaveLocation = () => {
    if (selectedAddress) {
      const selected = savedAddresses.find(addr => addr.id === parseInt(selectedAddress));
      if (selected) {
        setCurrentLocation(selected);
        enqueueSnackbar('Location updated successfully', { variant: 'success' });
        setLocationDialogOpen(false);
      }
    } else if (newAddress.line1 && newAddress.city && newAddress.pincode && newAddress.label) {
      // Validate pincode
      if (!/^\d{6}$/.test(newAddress.pincode)) {
        enqueueSnackbar('Please enter a valid 6-digit pincode', { variant: 'error' });
        return;
      }

      if (editingAddressId) {
        // Update existing address
        setSavedAddresses(prev => 
          prev.map(addr => addr.id === editingAddressId ? { ...newAddress, id: editingAddressId } : addr)
        );
        setCurrentLocation({ ...newAddress, id: editingAddressId });
        enqueueSnackbar('Address updated successfully', { variant: 'success' });
      } else {
        // Add new address
        const newAddr = { ...newAddress, id: Date.now() };
        setSavedAddresses(prev => [...prev, newAddr]);
        setCurrentLocation(newAddr);
        enqueueSnackbar('New address saved successfully', { variant: 'success' });
      }
      
      setLocationDialogOpen(false);
      setEditingAddressId(null);
      setNewAddress({ label: '', line1: '', line2: '', city: '', state: '', country: 'India', pincode: '' });
    } else {
      enqueueSnackbar('Please fill in all required fields', { variant: 'error' });
    }
  };

  const handleEditAddress = (address) => {
    setEditingAddressId(address.id);
    setNewAddress(address);
    setSelectedAddress('');
  };

  const handlePincodeChange = async (pincode) => {
    setNewAddress(prev => ({ ...prev, pincode }));
    
    // Auto-fill city and state based on pincode (6 digits)
    if (/^\d{6}$/.test(pincode)) {
      try {
        // Using India Post Pincode API
        const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
        const data = await response.json();
        
        if (data[0]?.Status === 'Success' && data[0]?.PostOffice?.length > 0) {
          const { District, State } = data[0].PostOffice[0];
          setNewAddress(prev => ({
            ...prev,
            city: District,
            state: State,
          }));
          enqueueSnackbar('City and State auto-filled', { variant: 'success' });
        } else {
          enqueueSnackbar('Invalid pincode', { variant: 'warning' });
        }
      } catch (error) {
        console.error('Pincode lookup failed:', error);
      }
    }
  };

  return (
    <>
      <AppBar position="sticky" elevation={1} sx={{ bgcolor: 'white', color: 'text.primary', width: '100%' }}>
        <Toolbar sx={{ gap: 2, minHeight: { xs: 60, md: 70 }, px: { xs: 2, md: 3 }, maxWidth: '100%' }}>
          {isMobile && (
            <IconButton edge="start" onClick={() => setMobileMenuOpen(true)}>
              <MenuIcon />
            </IconButton>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <img 
              src="/GroCery-Logo.svg" 
              alt="GroCery" 
              style={{ height: isMobile ? 28 : 40, cursor: 'pointer' }} 
              onClick={() => navigate('/')}
            />
          </Box>

          {!isMobile && (
            <Button 
              startIcon={<HomeIcon />}
              onClick={() => navigate('/')}
              sx={{ 
                textTransform: 'none',
                color: 'text.primary',
                fontWeight: 600,
                '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' }
              }}
            >
              Home
            </Button>
          )}

          {!isMobile && (
            <Button 
              startIcon={<LocationIcon sx={{ color: theme.palette.primary.main }} />} 
              onClick={handleLocationClick}
              endIcon={<ArrowDownIcon />}
              sx={{ 
                textTransform: 'none',
                color: 'text.primary',
                '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' }
              }}
            >
              <Box sx={{ textAlign: 'left' }}>
                <Typography variant="caption" display="block" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
                  Delivery in 10 mins
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.9rem' }}>
                  {currentLocation ? `${currentLocation.label} - ${currentLocation.pincode}` : 'Select Location'}
                </Typography>
              </Box>
            </Button>
          )}

          <Box 
            sx={{ 
              flexGrow: 2,
              maxWidth: 800,
              display: 'flex',
              bgcolor: '#F8F8F8',
              borderRadius: 2,
              px: 2,
              py: 0.5,
            }}
          >
            <SearchIcon sx={{ color: 'text.secondary', alignSelf: 'center', mr: 1 }} />
            <InputBase
              placeholder='Search for "milk"'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && searchQuery.trim()) {
                  navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
                }
              }}
              sx={{ flex: 1 }}
            />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 'auto' }}>
            {isLoggedIn ? (
              <Button
                onClick={handleAccountMenuOpen}
                endIcon={<ArrowDownIcon />}
                sx={{
                  textTransform: 'none',
                  color: 'text.primary',
                  fontWeight: 500,
                }}
              >
                <PersonIcon sx={{ mr: 0.5 }} />
                Account
              </Button>
            ) : (
              <Button
                variant="text"
                onClick={() => navigate('/login')}
                sx={{
                  textTransform: 'none',
                  color: 'text.primary',
                  fontWeight: 500,
                }}
              >
                <PersonIcon sx={{ mr: 0.5 }} />
                Login
              </Button>
            )}

            <IconButton onClick={handleCartClick}>
              <Badge badgeContent={cartItemCount} color="primary">
                <CartIcon />
              </Badge>
            </IconButton>
          </Box>
        </Toolbar>

        {/* Account Menu */}
        <Menu
          anchorEl={accountMenuAnchor}
          open={accountMenuOpen}
          onClose={handleAccountMenuClose}
          PaperProps={{
            sx: { width: 240, mt: 1 }
          }}
        >
          <MenuItem onClick={() => handleMenuItemClick('/addresses')}>
            <ListItemIcon><AddressIcon fontSize="small" /></ListItemIcon>
            <ListItemText>My Addresses</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => handleMenuItemClick('/orders')}>
            <ListItemIcon><OrdersIcon fontSize="small" /></ListItemIcon>
            <ListItemText>My Orders</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => handleMenuItemClick('/gift-cards')}>
            <ListItemIcon><GiftCardIcon fontSize="small" /></ListItemIcon>
            <ListItemText>E-Gift Cards</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => handleMenuItemClick('/privacy')}>
            <ListItemIcon><PrivacyIcon fontSize="small" /></ListItemIcon>
            <ListItemText>Account privacy</ListItemText>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout}>
            <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
            <ListItemText>Logout</ListItemText>
          </MenuItem>
        </Menu>

        {isMobile && (
          <Box sx={{ px: 2, pb: 1 }}>
            <Box sx={{ bgcolor: alpha(theme.palette.grey[200], 0.8), borderRadius: 2, display: 'flex', alignItems: 'center', px: 2, py: 1 }}>
              <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
              <InputBase
                placeholder='Search for products...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleSearch}
                fullWidth
                sx={{ fontSize: '0.875rem' }}
              />
            </Box>
          </Box>
        )}
      </AppBar>

      <Drawer anchor="left" open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)}>
        <Box sx={{ width: 280 }}>
          <Box sx={{ p: 2, bgcolor: theme.palette.primary.main, color: 'white' }}>
            <Typography variant="h6">Menu</Typography>
          </Box>
          <List>
            <ListItem disablePadding>
              <ListItemButton onClick={() => { navigate('/'); setMobileMenuOpen(false); }}>
                <ListItemIcon><HomeIcon color="primary" /></ListItemIcon>
                <ListItemText primary="Home" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={() => { navigate('/orders'); setMobileMenuOpen(false); }}>
                <ListItemIcon><CategoryIcon color="primary" /></ListItemIcon>
                <ListItemText primary="My Orders" />
              </ListItemButton>
            </ListItem>
            <Divider />
            <ListItem disablePadding>
              <ListItemButton onClick={() => { navigate('/login'); setMobileMenuOpen(false); }}>
                <ListItemIcon><PersonIcon color="primary" /></ListItemIcon>
                <ListItemText primary="Login" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* Location Selection Dialog */}
      <Dialog open={locationDialogOpen} onClose={handleLocationDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingAddressId ? 'Edit Address' : 'Select Delivery Location'}
        </DialogTitle>
        <DialogContent>
          {!editingAddressId && (
            <>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Choose a saved address or add a new one
              </Typography>
              
              <RadioGroup value={selectedAddress} onChange={(e) => setSelectedAddress(e.target.value)}>
                {savedAddresses.map((addr) => (
                  <Box key={addr.id} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <FormControlLabel 
                      value={addr.id.toString()}
                      control={<Radio />}
                      sx={{ flex: 1 }}
                      label={
                        <Box>
                          <Typography variant="body1" fontWeight={600}>{addr.label}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {addr.line1}, {addr.city}, {addr.state}, {addr.country} - {addr.pincode}
                          </Typography>
                        </Box>
                      }
                    />
                    <Button 
                      size="small" 
                      onClick={() => handleEditAddress(addr)}
                      sx={{ textTransform: 'none', ml: 1 }}
                    >
                      Edit
                    </Button>
                  </Box>
                ))}
              </RadioGroup>

              <Button
                fullWidth
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => {
                  setSelectedAddress('');
                  setNewAddress({ label: '', line1: '', line2: '', city: '', state: '', country: 'India', pincode: '' });
                }}
                sx={{ mt: 2, textTransform: 'none' }}
              >
                Add New Address
              </Button>
            </>
          )}

          {(selectedAddress === '' || editingAddressId) && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                {editingAddressId ? 'Edit Address Details' : 'New Address Details'}
              </Typography>
              
              <TextField
                fullWidth
                label="Label (e.g., Home, Work) *"
                value={newAddress.label}
                onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
                sx={{ mb: 2, mt: 1 }}
                size="small"
              />
              
              <TextField
                fullWidth
                label="Address Line 1 *"
                value={newAddress.line1}
                onChange={(e) => setNewAddress({ ...newAddress, line1: e.target.value })}
                sx={{ mb: 2 }}
                size="small"
              />
              
              <TextField
                fullWidth
                label="Address Line 2"
                value={newAddress.line2}
                onChange={(e) => setNewAddress({ ...newAddress, line2: e.target.value })}
                sx={{ mb: 2 }}
                size="small"
              />
              
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <TextField
                  label="Pincode *"
                  value={newAddress.pincode}
                  onChange={(e) => handlePincodeChange(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  size="small"
                  sx={{ width: 150 }}
                  helperText="Enter 6-digit pincode"
                />
                <TextField
                  fullWidth
                  label="City *"
                  value={newAddress.city}
                  onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                  size="small"
                  InputProps={{
                    readOnly: newAddress.pincode.length === 6,
                  }}
                />
              </Box>

              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <TextField
                  fullWidth
                  label="State *"
                  value={newAddress.state}
                  onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                  size="small"
                  InputProps={{
                    readOnly: newAddress.pincode.length === 6,
                  }}
                />
                <TextField
                  fullWidth
                  label="Country"
                  value={newAddress.country}
                  size="small"
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Box>
              
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                * City and State will be auto-filled when you enter a valid 6-digit pincode
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLocationDialogClose}>Cancel</Button>
          <Button onClick={handleSaveLocation} variant="contained">
            {editingAddressId ? 'Update' : 'Save'} Location
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Header;
