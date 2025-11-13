import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Box,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  IconButton,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Home as HomeIcon,
  Work as WorkIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import AddressForm from '../components/AddressForm';
import {
  fetchAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from '../redux/actions/addressActions';
import { getUserId, isGuestUser } from '../utils/userUtils';

const SavedAddressesPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formOpen, setFormOpen] = useState(false);
  const [editAddress, setEditAddress] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState(null);

  const storeData = useSelector((state) => {
    return {
      addresses: state?.addresses?.addresses || [],
      loading: state?.addresses?.loading || false,
      error: state?.addresses?.error,
    };
  });

  const isGuest = isGuestUser();

  useEffect(() => {
    // Only fetch addresses for authenticated users with valid UUID
    if (!isGuest) {
      const userId = getUserId();
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (userId && uuidRegex.test(userId)) {
        dispatch(fetchAddresses());
      }
    }
  }, [dispatch, isGuest]);

  const handleOpenForm = (address = null) => {
    if (address) {
      setEditAddress({
        ...address,
        name: address.fullName,
        phone: address.phoneNumber,
      });
    } else {
      setEditAddress(null);
    }
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setEditAddress(null);
  };

  const handleSubmitAddress = async (addressData) => {
    try {
      if (editAddress) {
        await dispatch(updateAddress({ addressId: editAddress.id, addressData }));
      } else {
        await dispatch(createAddress(addressData));
      }
      // Refresh the addresses list after save
      await dispatch(fetchAddresses());
      handleCloseForm();
    } catch (error) {
      console.error('Error saving address:', error);
      // Form will show its own error notification
    }
  };

  const handleDeleteClick = (address) => {
    setAddressToDelete(address);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (addressToDelete) {
      try {
        await dispatch(deleteAddress(addressToDelete.id));
        // Refresh the addresses list after delete
        await dispatch(fetchAddresses());
        setDeleteDialogOpen(false);
        setAddressToDelete(null);
      } catch (error) {
        console.error('Error deleting address:', error);
        // Keep dialog open to show error, or close it based on your preference
        setDeleteDialogOpen(false);
        setAddressToDelete(null);
      }
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setAddressToDelete(null);
  };

  const handleSetDefault = async (addressId) => {
    try {
      await dispatch(setDefaultAddress(addressId));
      // Refresh the addresses list after setting default
      await dispatch(fetchAddresses());
    } catch (error) {
      console.error('Error setting default address:', error);
      // The error will be shown in the UI via the error state
    }
  };

  const getCountryName = (code) => {
    const countries = {
      IN: 'India',
      US: 'United States',
      UK: 'United Kingdom',
      CA: 'Canada',
      AU: 'Australia',
    };
    return countries[code] || code;
  };

  if (isGuest) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper sx={{ p: 4, textAlign: 'center', bgcolor: '#e3f2fd' }}>
          <Typography variant="h6" color="primary">Please Login to Continue</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 3 }}>
            You need to login or create an account to manage your delivery addresses
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button variant="contained" onClick={() => navigate('/login')}>
              Login
            </Button>
            <Button variant="outlined" onClick={() => navigate('/signup')}>
              Sign Up
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  if (storeData.loading && storeData.addresses.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (storeData.error) {
    const errorMessage = typeof storeData.error === 'string' ? storeData.error : storeData.error?.message || 'Failed to load addresses';
    const isNetworkError = errorMessage.toLowerCase().includes('network') || errorMessage.toLowerCase().includes('connect');
    
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper sx={{ p: 4, textAlign: 'center', bgcolor: '#ffebee' }}>
          <Typography variant="h6" color="error">
            {isNetworkError ? 'Unable to connect to server' : 'Error loading addresses'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 2 }}>
            {isNetworkError 
              ? 'Please make sure the backend server is running and try again.'
              : errorMessage
            }
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => dispatch(fetchAddresses())}
            sx={{ mt: 1 }}
          >
            Retry
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Saved Addresses
        </Typography>
        <Button
          startIcon={<AddIcon />}
          variant="contained"
          onClick={() => handleOpenForm()}
        >
          Add New Address
        </Button>
      </Box>

      {storeData.addresses.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            No saved addresses
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Add your delivery addresses for faster checkout
          </Typography>
          <Button
            startIcon={<AddIcon />}
            variant="outlined"
            onClick={() => handleOpenForm()}
            sx={{ mt: 2 }}
          >
            Add Your First Address
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {storeData.addresses.map((address) => (
            <Grid item xs={12} sm={6} md={4} key={address.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  border: address.isDefault ? '2px solid' : '1px solid',
                  borderColor: address.isDefault ? 'primary.main' : 'divider',
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  {/* Address Type and Default Badge */}
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Chip
                      icon={address.addressType === 'home' ? <HomeIcon /> : <WorkIcon />}
                      label={address.addressType?.toUpperCase() || 'HOME'}
                      size="small"
                      color={address.addressType === 'home' ? 'primary' : 'secondary'}
                    />
                    {address.isDefault && (
                      <Chip
                        icon={<StarIcon />}
                        label="DEFAULT"
                        size="small"
                        color="success"
                      />
                    )}
                  </Box>

                  {/* Name and Phone */}
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                    {address.fullName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {address.phoneNumber}
                  </Typography>

                  {/* Address */}
                  <Typography variant="body2" sx={{ mt: 1.5 }}>
                    {address.addressLine1}
                  </Typography>
                  {address.addressLine2 && (
                    <Typography variant="body2">
                      {address.addressLine2}
                    </Typography>
                  )}
                  <Typography variant="body2">
                    {address.city}, {address.state}
                  </Typography>
                  <Typography variant="body2">
                    {address.pincode}
                  </Typography>

                  {/* Action Buttons */}
                  <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                    {!address.isDefault && (
                      <Button
                        size="small"
                        startIcon={<StarBorderIcon />}
                        onClick={() => handleSetDefault(address.id)}
                        disabled={storeData?.loading}
                      >
                        Set Default
                      </Button>
                    )}
                    <IconButton
                      size="small"
                      onClick={() => handleOpenForm(address)}
                      disabled={storeData?.loading}
                      aria-label="Edit address"
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteClick(address)}
                      disabled={storeData?.loading}
                      aria-label="Delete address"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Address Form Dialog */}
      <AddressForm
        open={formOpen}
        onClose={handleCloseForm}
        onSubmit={handleSubmitAddress}
        initialAddress={editAddress}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleCancelDelete}>
        <DialogTitle>Delete Address</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this address?
          </Typography>
          {addressToDelete && (
            <Box sx={{ mt: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {addressToDelete.fullName}
              </Typography>
              <Typography variant="body2">{addressToDelete.addressLine1}</Typography>
              {addressToDelete.addressLine2 && (
                <Typography variant="body2">{addressToDelete.addressLine2}</Typography>
              )}
              <Typography variant="body2">
                {addressToDelete.city}, {addressToDelete.state} - {addressToDelete.pincode}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SavedAddressesPage;
