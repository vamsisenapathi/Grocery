import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, Button, Box, IconButton, Typography, List, ListItem, ListItemText, ListItemIcon, Chip, CircularProgress, Alert } from '@mui/material';
import { Close as CloseIcon, Home as HomeIcon, Work as WorkIcon, LocationOn as LocationIcon, Edit as EditIcon } from '@mui/icons-material';
import { useLocation } from '../context/LocationContext';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAddresses, updateAddress } from '../redux/actions/addressActions';
import { getUserId, isGuestUser } from '../utils/userUtils';
import AddressForm from './AddressForm';

const LocationModal = ({ open, onClose }) => {
  const { location, updateLocation } = useLocation();
  const dispatch = useDispatch();
  const [address, setAddress] = useState('');
  const [detecting, setDetecting] = useState(false);
  const [editAddressOpen, setEditAddressOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  
  const storeData = useSelector((state) => {
    return {
      addresses: state?.addresses?.addresses,
      loading: state?.addresses?.loading,
      error: state?.addresses?.error,
    };
  });

  const isGuest = isGuestUser();

  useEffect(() => {
    // Set up global function to update location from AddressForm
    window.updateCurrentLocation = (cityName) => {
      updateLocation({ address: cityName, deliveryTime: '8 minutes' });
    };
    
    // Fetch saved addresses when modal opens (only for authenticated users)
    if (open && !isGuest) {
      const userId = getUserId();
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (userId && uuidRegex.test(userId)) {
        dispatch(fetchAddresses());
      }
    }
    
    return () => {
      delete window.updateCurrentLocation;
    };
  }, [updateLocation, open, dispatch, isGuest]);

  const handleDetectLocation = async () => {
    if (navigator.geolocation) {
      setDetecting(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            
            // Use backend geolocation API
            const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8081/api/v1';
            const backendUrl = `${API_BASE_URL}/geolocation/reverse-geocode?latitude=${latitude}&longitude=${longitude}`;
            const response = await fetch(backendUrl);
            
            if (response.ok) {
              const data = await response.json();
              
              // Backend returns formatted address data
              const cityName = data.city || 'Current Location';
              
              // Update the text field with detected location
              setAddress(cityName);
              updateLocation({ address: cityName, deliveryTime: '8 minutes' });
            } else {
              const fallbackLocation = 'Current Location';
              setAddress(fallbackLocation);
              updateLocation({ address: fallbackLocation, deliveryTime: '8 minutes' });
            }
            
            // Don't close automatically - let user confirm or edit
          } catch (error) {
            console.error('Location detection error:', error);
            const fallbackLocation = 'Current Location';
            setAddress(fallbackLocation);
            updateLocation({ address: fallbackLocation, deliveryTime: '8 minutes' });
          } finally {
            setDetecting(false);
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          setDetecting(false);
        }
      );
    }
  };

  const handleSearch = () => {
    if (address.trim()) {
      updateLocation({ address: address.trim(), deliveryTime: '12 minutes' });
      onClose();
    }
  };

  const handleAddressSelect = (selectedAddress) => {
    const locationText = `${selectedAddress.city}, ${selectedAddress.state}`;
    setAddress(locationText);
    updateLocation({ address: locationText, deliveryTime: '8 minutes' });
    onClose();
  };

  const getAddressIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'home':
        return <HomeIcon />;
      case 'work':
        return <WorkIcon />;
      default:
        return <LocationIcon />;
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={(event, reason) => {
        // Only close on explicit cancel, not on backdrop click or escape
        if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
          return;
        }
        onClose();
      }} 
      maxWidth="sm" 
      fullWidth
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        Change Location
        <IconButton onClick={onClose} size="small" aria-label="close">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ py: 2 }}>
          <Button 
            variant="contained" 
            fullWidth 
            onClick={handleDetectLocation} 
            disabled={detecting}
            sx={{ mb: 2, py: 1.5 }}
          >
            {detecting ? 'Detecting location...' : 'Detect my location'}
          </Button>
          <Typography variant="body2" sx={{ textAlign: 'center', mb: 2, color: 'text.secondary' }}>OR</Typography>
          <TextField
            fullWidth
            placeholder="search delivery location"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            sx={{ mb: 3 }}
          />
          
          {/* Your saved addresses section */}
          {!isGuest && (
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                Your saved addresses
              </Typography>
              
              {(storeData.loading) && (storeData.addresses || []).length === 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                  <CircularProgress size={30} />
                </Box>
              )}
              
              {storeData.error && !(storeData.loading) && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {typeof storeData.error === 'string' ? storeData.error : storeData.error?.message || 'Failed to load addresses'}
                  <Button 
                    size="small" 
                    onClick={() => {
                      const userId = getUserId();
                      if (userId) {
                        dispatch(fetchAddresses());
                      }
                    }}
                    sx={{ ml: 1 }}
                  >
                    Retry
                  </Button>
                </Alert>
              )}
              
              {!(storeData.loading) && !(storeData.error) && (storeData.addresses || []).length === 0 && (
                <Alert severity="info" sx={{ mb: 2 }}>
                  No saved addresses yet. Add one to save time on future orders!
                </Alert>
              )}
              
              {(storeData.addresses || []).length > 0 && (
                <List sx={{ maxHeight: 300, overflow: 'auto' }}>
                  {(storeData.addresses || []).map((addr) => (
                    <ListItem
                      key={addr.id}
                      sx={{
                        border: '1px solid #e0e0e0',
                        borderRadius: 2,
                        mb: 1,
                        cursor: 'pointer',
                        '&:hover': {
                          bgcolor: 'action.hover',
                        },
                      }}
                      onClick={() => handleAddressSelect(addr)}
                    >
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        {getAddressIcon(addr.addressType)}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                              {addr.addressType?.charAt(0).toUpperCase() + addr.addressType?.slice(1) || 'Home'}
                            </Typography>
                            {addr.isDefault && (
                              <Chip label="Default" size="small" color="primary" sx={{ height: 20, fontSize: '0.7rem' }} />
                            )}
                          </Box>
                        }
                        secondary={
                          <>
                            <Typography component="span" variant="body2" sx={{ display: 'block' }}>
                              {addr.fullName || addr.name}
                            </Typography>
                            <Typography component="span" variant="body2" color="text.secondary" sx={{ display: 'block' }}>
                              {addr.addressLine1 || addr.address}
                            </Typography>
                            <Typography component="span" variant="body2" color="text.secondary">
                              {addr.city}, {addr.state} - {addr.pincode}
                            </Typography>
                          </>
                        }
                      />
                      <IconButton 
                        size="small" 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedAddress(addr);
                          setEditAddressOpen(true);
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </ListItem>
                  ))}
                </List>
              )}
            </Box>
          )}
          
          <Button 
            variant="outlined" 
            fullWidth 
            onClick={onClose} 
            sx={{ mt: 2 }}
          >
            Cancel
          </Button>
        </Box>
      </DialogContent>
      
      {/* Edit Address Dialog */}
      {editAddressOpen && (
        <AddressForm
          open={editAddressOpen}
          onClose={() => {
            setEditAddressOpen(false);
            setSelectedAddress(null);
          }}
          initialAddress={selectedAddress ? {
            ...selectedAddress,
            name: selectedAddress.fullName,
            phoneNumber: selectedAddress.phoneNumber,
          } : null}
          onSubmit={async (addressData) => {
            if (selectedAddress) {
              await dispatch(updateAddress({ 
                addressId: selectedAddress.id, 
                addressData 
              }));
              // Refresh addresses after update
              await dispatch(fetchAddresses());
            }
          }}
        />
      )}
    </Dialog>
  );
};

export default LocationModal;
