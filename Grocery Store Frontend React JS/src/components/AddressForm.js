import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Box,
  CircularProgress,
  Alert,
  IconButton,
} from '@mui/material';
import { Close as CloseIcon, MyLocation as MyLocationIcon } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import apiClient from '../apiActions/baseApi';

// Indian states
const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
];

// US states
const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado',
  'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho',
  'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
  'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
  'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey',
  'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma',
  'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington',
  'West Virginia', 'Wisconsin', 'Wyoming'
];

const COUNTRIES = [
  { code: 'IN', name: 'India' },
  { code: 'US', name: 'United States' },
  { code: 'UK', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'OTHER', name: 'Other' }
];

const AddressForm = ({ open, onClose, onSubmit, initialAddress = null }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    country: 'IN',
    pincode: '',
    addressType: 'home',
    latitude: null,
    longitude: null,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [pincodeError, setPincodeError] = useState('');
  const [locationLoading, setLocationLoading] = useState(false);

  useEffect(() => {
    if (initialAddress) {
      setFormData(initialAddress);
    } else {
      resetForm();
    }
  }, [initialAddress, open]);

  const resetForm = () => {
    setFormData({
      name: '',
      phoneNumber: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      country: 'IN',
      pincode: '',
      addressType: 'home',
      latitude: null,
      longitude: null,
    });
    setErrors({});
    setPincodeError('');
  };

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      enqueueSnackbar('Geolocation is not supported by your browser', { variant: 'error' });
      return;
    }

    setLocationLoading(true);
    
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
            
            // Backend returns structured address data
            const cityName = data.city || '';
            
            setFormData(prev => ({
              ...prev,
              addressLine1: data.addressLine1 || '',
              addressLine2: data.addressLine2 || '',
              city: cityName,
              state: data.state || '',
              pincode: data.pincode || '',
              latitude: latitude,
              longitude: longitude,
            }));
            
            // Update the current location display with city name
            if (window.updateCurrentLocation && cityName) {
              window.updateCurrentLocation(cityName);
            }
            
            if (cityName) {
              enqueueSnackbar('Location detected successfully!', { variant: 'success' });
            } else {
              enqueueSnackbar('Location detected. Please fill in address details manually.', { variant: 'info' });
            }
          } else {
            // Even if backend returns error, still set coordinates for manual entry
            setFormData(prev => ({
              ...prev,
              latitude: latitude,
              longitude: longitude,
            }));
            enqueueSnackbar('Location detected. Please fill in address details manually.', { variant: 'info' });
          }
        } catch (error) {
          console.error('❌ Reverse geocoding failed:', error);
          // Still try to set coordinates even if geocoding fails
          try {
            const { latitude, longitude } = position.coords;
            setFormData(prev => ({
              ...prev,
              latitude: latitude,
              longitude: longitude,
            }));
            enqueueSnackbar('Location coordinates detected. Please fill in address details manually.', { variant: 'info' });
          } catch (coordError) {
            enqueueSnackbar('Could not detect location. Please enter address manually.', { variant: 'warning' });
          }
        } finally {
          setLocationLoading(false);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        enqueueSnackbar('Could not detect your location. Please enable location access.', { variant: 'error' });
        setLocationLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    // Clear pincode error when pincode changes
    if (field === 'pincode' && pincodeError) {
      setPincodeError('');
    }

    // Reset state when country changes
    if (field === 'country') {
      setFormData(prev => ({ ...prev, state: '', city: '', pincode: '' }));
    }
  };

  const validatePhone = (phoneNumber, country) => {
    if (!phoneNumber) return 'Phone number is required';
    
    if (country === 'IN') {
      // Indian phone: Exactly 10 digits (without +91)
      const cleanPhone = phoneNumber.replace(/\s/g, '').replace(/\+91/g, '');
      const indianPhoneRegex = /^[6-9]\d{9}$/;
      if (!indianPhoneRegex.test(cleanPhone)) {
        return 'Invalid Indian phone number (10 digits starting with 6-9)';
      }
    } else if (country === 'US') {
      // US phone: 10 digits
      const usPhoneRegex = /^\d{10}$/;
      if (!usPhoneRegex.test(phoneNumber.replace(/\s/g, '').replace(/-/g, ''))) {
        return 'Invalid US phone number (10 digits)';
      }
    } else {
      // Generic: at least 10 digits
      if (phoneNumber.replace(/\D/g, '').length < 10) {
        return 'Phone number must be at least 10 digits';
      }
    }
    return '';
  };

  const validatePincode = (pincode, country) => {
    if (!pincode) return 'Pincode/ZIP is required';
    
    if (country === 'IN') {
      // Indian pincode: 6 digits
      const indianPincodeRegex = /^[1-9]\d{5}$/;
      if (!indianPincodeRegex.test(pincode)) {
        return 'Invalid Indian pincode (6 digits)';
      }
    } else if (country === 'US') {
      // US ZIP: 5 or 9 digits
      const usZipRegex = /^\d{5}(-\d{4})?$/;
      if (!usZipRegex.test(pincode)) {
        return 'Invalid US ZIP code (5 or 9 digits)';
      }
    } else if (country === 'UK') {
      // UK postcode format
      const ukPostcodeRegex = /^[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2}$/i;
      if (!ukPostcodeRegex.test(pincode)) {
        return 'Invalid UK postcode';
      }
    } else if (country === 'CA') {
      // Canadian postal code
      const caPostalCodeRegex = /^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/i;
      if (!caPostalCodeRegex.test(pincode)) {
        return 'Invalid Canadian postal code';
      }
    }
    return '';
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    
    const phoneError = validatePhone(formData.phoneNumber, formData.country);
    if (phoneError) newErrors.phoneNumber = phoneError;
    
    if (!formData.addressLine1.trim()) newErrors.addressLine1 = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state) newErrors.state = 'State is required';
    
    const pincodeError = validatePincode(formData.pincode, formData.country);
    if (pincodeError) newErrors.pincode = pincodeError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Auto-fill city and state from pincode (India only)
  const handlePincodeBlur = async () => {
    if (formData.country === 'IN' && formData.pincode.length === 6) {
      setPincodeLoading(true);
      setPincodeError('');
      
      try {
        // Using India Post Pincode API (free)
        const response = await fetch(`https://api.postalpincode.in/pincode/${formData.pincode}`);
        const data = await response.json();
        
        if (data[0].Status === 'Success' && data[0].PostOffice && data[0].PostOffice.length > 0) {
          const postOffice = data[0].PostOffice[0];
          setFormData(prev => ({
            ...prev,
            city: postOffice.District || prev.city,
            state: postOffice.State || prev.state,
          }));
          setPincodeError('');
        } else {
          setPincodeError('Invalid pincode or unable to fetch location');
        }
      } catch (error) {
        console.error('Error fetching pincode data:', error);
        setPincodeError('Unable to auto-fill location. Please enter manually.');
      } finally {
        setPincodeLoading(false);
      }
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      enqueueSnackbar('Please fill all required fields correctly', { variant: 'error' });
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
      enqueueSnackbar('Address saved successfully!', { variant: 'success' });
      resetForm();
      onClose();
    } catch (error) {
      console.error('❌ Error submitting address:', error);
      enqueueSnackbar(error.message || 'Failed to save address. Please try again.', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const getStates = () => {
    if (formData.country === 'IN') return INDIAN_STATES;
    if (formData.country === 'US') return US_STATES;
    return [];
  };

  const getPincodeLabel = () => {
    switch (formData.country) {
      case 'IN': return 'Pincode';
      case 'US': return 'ZIP Code';
      case 'UK': return 'Postcode';
      case 'CA': return 'Postal Code';
      default: return 'Postal Code';
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={(event, reason) => {
        // Prevent closing on backdrop click or escape key
        if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
          return;
        }
        handleClose();
      }} 
      maxWidth="md" 
      fullWidth
      data-testid="address-form"
      PaperProps={{
        sx: {
          maxHeight: { xs: '100vh', sm: '90vh', md: '85vh' },
          height: 'auto',
          m: { xs: 0, sm: 1, md: 2 },
          maxWidth: { xs: '100%', sm: '95%', md: '800px' },
          width: '100%'
        }
      }}
      scroll="paper"
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        pb: 1, 
        px: { xs: 2, sm: 3 }, 
        pt: { xs: 1.5, sm: 2 },
        fontSize: { xs: '1.1rem', sm: '1.25rem' }
      }}>
        {initialAddress ? 'Edit Address' : 'Add New Address'}
        <IconButton onClick={handleClose} size="small" aria-label="close">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ overflow: 'auto', px: { xs: 2, sm: 3 }, py: { xs: 1.5, sm: 2 } }}>
        {/* Detect Location Button */}
        <Box sx={{ mb: 1.5 }}>
          <Button
            variant="outlined"
            startIcon={locationLoading ? <CircularProgress size={20} /> : <MyLocationIcon />}
            onClick={handleDetectLocation}
            disabled={locationLoading}
            fullWidth
            sx={{ py: 1.2 }}
          >
            {locationLoading ? 'Detecting Location...' : 'Detect My Current Location'}
          </Button>
          <Box sx={{ mt: 0.75, textAlign: 'center' }}>
            <Alert severity="info" sx={{ fontSize: '0.8rem', py: 0.5 }}>
              Click to auto-fill address from your current location, or enter manually below
            </Alert>
          </Box>
        </Box>

        <Grid container spacing={2}>
          {/* Address Type */}
          <Grid item xs={12}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Address Type</FormLabel>
              <RadioGroup
                row
                value={formData.addressType}
                onChange={handleChange('addressType')}
              >
                <FormControlLabel value="home" control={<Radio />} label="Home" />
                <FormControlLabel value="work" control={<Radio />} label="Work" />
              </RadioGroup>
            </FormControl>
          </Grid>

          {/* Name */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Full Name"
              value={formData.name}
              onChange={handleChange('name')}
              error={!!errors.name}
              helperText={errors.name}
              required
            />
          </Grid>

          {/* Phone */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Phone Number"
              value={formData.phoneNumber}
              onChange={(e) => {
                let value = e.target.value;
                // For India, ensure only digits and limit to 10
                if (formData.country === 'IN') {
                  value = value.replace(/\D/g, '').slice(0, 10);
                }
                setFormData(prev => ({ ...prev, phoneNumber: value }));
                if (errors.phoneNumber) {
                  setErrors(prev => ({ ...prev, phoneNumber: '' }));
                }
              }}
              error={!!errors.phoneNumber}
              helperText={errors.phoneNumber || (formData.country === 'IN' ? '10 digits (e.g., 9876543210). +91 will be added automatically' : '10 digits')}
              required
              placeholder={formData.country === 'IN' ? '9876543210' : '1234567890'}
              InputProps={{
                startAdornment: formData.country === 'IN' ? (
                  <Box component="span" sx={{ mr: 1, color: 'text.secondary' }}>+91</Box>
                ) : null,
              }}
            />
          </Grid>

          {/* Address Line 1 */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address Line 1"
              value={formData.addressLine1}
              onChange={handleChange('addressLine1')}
              error={!!errors.addressLine1}
              helperText={errors.addressLine1 || 'House No., Building Name, Street'}
              required
            />
          </Grid>

          {/* Address Line 2 */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address Line 2"
              value={formData.addressLine2}
              onChange={handleChange('addressLine2')}
              helperText="Area, Landmark (Optional)"
            />
          </Grid>

          {/* Country */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>Country</InputLabel>
              <Select
                value={formData.country}
                onChange={handleChange('country')}
                label="Country"
              >
                {COUNTRIES.map((country) => (
                  <MenuItem key={country.code} value={country.code}>
                    {country.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Pincode with auto-fill */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label={getPincodeLabel()}
              value={formData.pincode}
              onChange={handleChange('pincode')}
              onBlur={handlePincodeBlur}
              error={!!errors.pincode}
              helperText={errors.pincode}
              required
              InputProps={{
                endAdornment: pincodeLoading && <CircularProgress size={20} />,
              }}
            />
            {pincodeError && (
              <Alert severity="info" sx={{ mt: 1 }}>
                {pincodeError}
              </Alert>
            )}
          </Grid>

          {/* City */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="City"
              value={formData.city}
              onChange={handleChange('city')}
              error={!!errors.city}
              helperText={errors.city || (formData.country === 'IN' ? 'Auto-filled from pincode' : '')}
              required
            />
          </Grid>

          {/* State */}
          <Grid item xs={12} sm={6}>
            {getStates().length > 0 ? (
              <FormControl fullWidth required error={!!errors.state}>
                <InputLabel>State</InputLabel>
                <Select
                  value={formData.state}
                  onChange={handleChange('state')}
                  label="State"
                >
                  {getStates().map((state) => (
                    <MenuItem key={state} value={state}>
                      {state}
                    </MenuItem>
                  ))}
                </Select>
                {errors.state && (
                  <Box sx={{ color: 'error.main', fontSize: '0.75rem', mt: 0.5 }}>
                    {errors.state}
                  </Box>
                )}
              </FormControl>
            ) : (
              <TextField
                fullWidth
                label="State/Province"
                value={formData.state}
                onChange={handleChange('state')}
                error={!!errors.state}
                helperText={errors.state}
                required
              />
            )}
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          startIcon={loading && <CircularProgress size={20} />}
        >
          {loading ? 'Saving...' : initialAddress ? 'Update Address' : 'Save Address'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddressForm;
