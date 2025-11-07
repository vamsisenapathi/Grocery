import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Chip,
  IconButton,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Home as HomeIcon,
  Work as WorkIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Header from '../components/grocery/Header';

const SavedAddressesPage = () => {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [formData, setFormData] = useState({
    label: '',
    name: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false,
  });

  const storeData = useSelector((state) => {
    return {
      isAuthenticated: state?.auth?.isAuthenticated,
      user: state?.auth?.user,
    };
  });

  const { isAuthenticated } = storeData;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Load saved addresses from localStorage (in real app, this would come from API)
    const savedAddresses = JSON.parse(localStorage.getItem('savedAddresses') || '[]');
    setAddresses(savedAddresses);
  }, [isAuthenticated, navigate]);

  const handleOpenDialog = (address = null) => {
    if (address) {
      setEditingAddress(address);
      setFormData(address);
    } else {
      setEditingAddress(null);
      setFormData({
        label: '',
        name: '',
        phone: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        pincode: '',
        isDefault: false,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingAddress(null);
  };

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSaveAddress = () => {
    if (!formData.name || !formData.addressLine1 || !formData.city || !formData.pincode) {
      alert('Please fill in all required fields');
      return;
    }

    const newAddress = {
      ...formData,
      id: editingAddress ? editingAddress.id : Date.now(),
    };

    let updatedAddresses;
    if (editingAddress) {
      updatedAddresses = addresses.map(addr => 
        addr.id === editingAddress.id ? newAddress : addr
      );
    } else {
      updatedAddresses = [...addresses, newAddress];
    }

    // If this is set as default, remove default from others
    if (newAddress.isDefault) {
      updatedAddresses = updatedAddresses.map(addr => ({
        ...addr,
        isDefault: addr.id === newAddress.id,
      }));
    }

    setAddresses(updatedAddresses);
    localStorage.setItem('savedAddresses', JSON.stringify(updatedAddresses));
    handleCloseDialog();
  };

  const handleDeleteAddress = (addressId) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      const updatedAddresses = addresses.filter(addr => addr.id !== addressId);
      setAddresses(updatedAddresses);
      localStorage.setItem('savedAddresses', JSON.stringify(updatedAddresses));
    }
  };

  const handleSetDefault = (addressId) => {
    const updatedAddresses = addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === addressId,
    }));
    setAddresses(updatedAddresses);
    localStorage.setItem('savedAddresses', JSON.stringify(updatedAddresses));
  };

  const getAddressIcon = (label) => {
    switch (label?.toLowerCase()) {
      case 'home':
        return <HomeIcon />;
      case 'work':
        return <WorkIcon />;
      default:
        return <LocationIcon />;
    }
  };

  return (
    <>
      <Header />
      <Container maxWidth="md" sx={{ py: 4, mt: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1" color="primary" fontWeight="bold">
            Saved Addresses
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Add New Address
          </Button>
        </Box>

      {addresses.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No Saved Addresses
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            Add your delivery addresses to make checkout faster and easier.
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Add Your First Address
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {addresses.map((address) => (
            <Grid item xs={12} md={6} key={address.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box display="flex" alignItems="center" gap={1} mb={2}>
                    {getAddressIcon(address.label)}
                    <Typography variant="h6" color="primary">
                      {address.label || 'Address'}
                    </Typography>
                    {address.isDefault && (
                      <Chip label="Default" size="small" color="primary" />
                    )}
                  </Box>
                  
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    {address.name}
                  </Typography>
                  
                  {address.phone && (
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Phone: {address.phone}
                    </Typography>
                  )}
                  
                  <Typography variant="body2" gutterBottom>
                    {address.addressLine1}
                  </Typography>
                  
                  {address.addressLine2 && (
                    <Typography variant="body2" gutterBottom>
                      {address.addressLine2}
                    </Typography>
                  )}
                  
                  <Typography variant="body2">
                    {address.city}, {address.state} - {address.pincode}
                  </Typography>
                </CardContent>
                
                <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                  <Box>
                    <IconButton
                      size="small"
                      onClick={() => handleOpenDialog(address)}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteAddress(address.id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                  
                  {!address.isDefault && (
                    <Button
                      size="small"
                      onClick={() => handleSetDefault(address.id)}
                    >
                      Set as Default
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Add/Edit Address Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingAddress ? 'Edit Address' : 'Add New Address'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="label"
                label="Address Label"
                value={formData.label}
                onChange={handleInputChange}
                fullWidth
                placeholder="e.g., Home, Work"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="name"
                label="Full Name *"
                value={formData.name}
                onChange={handleInputChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="phone"
                label="Phone Number"
                value={formData.phone}
                onChange={handleInputChange}
                fullWidth
                type="tel"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="addressLine1"
                label="Address Line 1 *"
                value={formData.addressLine1}
                onChange={handleInputChange}
                fullWidth
                required
                placeholder="Street address, building name"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="addressLine2"
                label="Address Line 2"
                value={formData.addressLine2}
                onChange={handleInputChange}
                fullWidth
                placeholder="Apartment, suite, floor (optional)"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="city"
                label="City *"
                value={formData.city}
                onChange={handleInputChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="state"
                label="State"
                value={formData.state}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="pincode"
                label="Pincode *"
                value={formData.pincode}
                onChange={handleInputChange}
                fullWidth
                required
                type="number"
              />
            </Grid>
            <Grid item xs={12}>
              <Box display="flex" alignItems="center">
                <input
                  type="checkbox"
                  id="isDefault"
                  name="isDefault"
                  checked={formData.isDefault}
                  onChange={handleInputChange}
                />
                <label htmlFor="isDefault" style={{ marginLeft: 8 }}>
                  Set as default address
                </label>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveAddress} variant="contained">
            {editingAddress ? 'Update' : 'Save'} Address
          </Button>
        </DialogActions>
      </Dialog>
      </Container>
    </>
  );
};

export default SavedAddressesPage;