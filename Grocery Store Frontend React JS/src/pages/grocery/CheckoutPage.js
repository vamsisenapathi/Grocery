import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Alert,
  Paper,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Divider,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  Payment as PaymentIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import Header from '../../components/grocery/Header';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { apiService } from '../../services/api.service';
import { useLocation } from '../../context/LocationContext';
import { useAuth } from '../../context/AuthContext';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { currentLocation } = useLocation();
  const { user } = useAuth();
  
  const [activeStep, setActiveStep] = useState(0);
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orderLoading, setOrderLoading] = useState(false);
  
  const [deliveryAddress, setDeliveryAddress] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: '',
    landmark: '',
    city: '',
    state: '',
    pincode: '',
  });
  
  const [paymentMethod, setPaymentMethod] = useState('cod');

  const steps = ['Delivery Address', 'Payment Method', 'Review & Place Order'];

  useEffect(() => {
    loadCart();
    
    // Pre-fill address from selected location
    if (currentLocation) {
      setDeliveryAddress(prev => ({
        ...prev,
        address: `${currentLocation.line1}${currentLocation.line2 ? ', ' + currentLocation.line2 : ''}`,
        city: currentLocation.city,
        state: currentLocation.state,
        pincode: currentLocation.pincode,
      }));
    }
  }, [currentLocation]);

  const loadCart = async () => {
    try {
      setLoading(true);
      const cartData = await apiService.cart.get();
      if (!cartData || !cartData.items || cartData.items.length === 0) {
        enqueueSnackbar('Your cart is empty', { variant: 'warning' });
        navigate('/');
        return;
      }
      setCart(cartData);
    } catch (error) {
      console.error('Error loading cart:', error);
      enqueueSnackbar('Failed to load cart', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (activeStep === 0) {
      // Validate address
      if (!deliveryAddress.name || !deliveryAddress.phone || !deliveryAddress.address || 
          !deliveryAddress.city || !deliveryAddress.state || !deliveryAddress.pincode) {
        enqueueSnackbar('Please fill all required fields', { variant: 'error' });
        return;
      }
      if (deliveryAddress.phone.length !== 10) {
        enqueueSnackbar('Please enter a valid 10-digit phone number', { variant: 'error' });
        return;
      }
      if (deliveryAddress.pincode.length !== 6) {
        enqueueSnackbar('Please enter a valid 6-digit pincode', { variant: 'error' });
        return;
      }
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handlePlaceOrder = async () => {
    setOrderLoading(true);
    
    // Simulate order placement
    setTimeout(() => {
      setOrderLoading(false);
      enqueueSnackbar('Order placed successfully! 🎉', { variant: 'success' });
      navigate('/orders');
    }, 2000);
  };

  const deliveryFee = 0;
  const handlingCharge = cart?.totalPrice > 0 ? 5 : 0;
  const grandTotal = (cart?.totalPrice || 0) + deliveryFee + handlingCharge;

  if (loading) {
    return (
      <Box>
        <Header />
        <Container sx={{ py: 8, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Container>
      </Box>
    );
  }

  return (
    <Box>
      <Header />
      
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>
          Checkout
        </Typography>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              {/* Step 1: Delivery Address */}
              {activeStep === 0 && (
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <LocationIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6">Delivery Address</Typography>
                  </Box>

                  {currentLocation && (
                    <Alert severity="info" sx={{ mb: 2 }}>
                      Using selected location: <strong>{currentLocation.label}</strong>
                    </Alert>
                  )}
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Full Name *"
                        value={deliveryAddress.name}
                        onChange={(e) => setDeliveryAddress({ ...deliveryAddress, name: e.target.value })}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Phone Number *"
                        type="tel"
                        value={deliveryAddress.phone}
                        onChange={(e) => setDeliveryAddress({ ...deliveryAddress, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                        helperText="10-digit mobile number"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Address *"
                        multiline
                        rows={3}
                        value={deliveryAddress.address}
                        onChange={(e) => setDeliveryAddress({ ...deliveryAddress, address: e.target.value })}
                        placeholder="House no., Building name, Street, Area"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Landmark (Optional)"
                        value={deliveryAddress.landmark}
                        onChange={(e) => setDeliveryAddress({ ...deliveryAddress, landmark: e.target.value })}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="City *"
                        value={deliveryAddress.city}
                        onChange={(e) => setDeliveryAddress({ ...deliveryAddress, city: e.target.value })}
                        InputProps={{ readOnly: !!currentLocation }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="State *"
                        value={deliveryAddress.state}
                        onChange={(e) => setDeliveryAddress({ ...deliveryAddress, state: e.target.value })}
                        InputProps={{ readOnly: !!currentLocation }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Pincode *"
                        type="tel"
                        value={deliveryAddress.pincode}
                        onChange={(e) => setDeliveryAddress({ ...deliveryAddress, pincode: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                        helperText="6-digit pincode"
                        InputProps={{ readOnly: !!currentLocation }}
                      />
                    </Grid>
                  </Grid>
                </Box>
              )}

              {/* Step 2: Payment Method */}
              {activeStep === 1 && (
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <PaymentIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6">Payment Method</Typography>
                  </Box>
                  
                  <RadioGroup
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    <Paper sx={{ p: 2, mb: 2 }}>
                      <FormControlLabel 
                        value="cod" 
                        control={<Radio />} 
                        label={
                          <Box>
                            <Typography variant="body1" fontWeight={600}>Cash on Delivery</Typography>
                            <Typography variant="caption" color="text.secondary">
                              Pay when you receive your order
                            </Typography>
                          </Box>
                        }
                      />
                    </Paper>
                    
                    <Paper sx={{ p: 2, mb: 2 }}>
                      <FormControlLabel 
                        value="upi" 
                        control={<Radio />} 
                        label={
                          <Box>
                            <Typography variant="body1" fontWeight={600}>UPI</Typography>
                            <Typography variant="caption" color="text.secondary">
                              Pay using Google Pay, PhonePe, Paytm, etc.
                            </Typography>
                          </Box>
                        }
                      />
                    </Paper>
                    
                    <Paper sx={{ p: 2, mb: 2 }}>
                      <FormControlLabel 
                        value="card" 
                        control={<Radio />} 
                        label={
                          <Box>
                            <Typography variant="body1" fontWeight={600}>Credit/Debit Card</Typography>
                            <Typography variant="caption" color="text.secondary">
                              Visa, Mastercard, RuPay, Amex
                            </Typography>
                          </Box>
                        }
                      />
                    </Paper>
                  </RadioGroup>
                </Box>
              )}

              {/* Step 3: Review & Place Order */}
              {activeStep === 2 && (
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <CheckCircleIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6">Review Your Order</Typography>
                  </Box>
                  
                  {/* Delivery Address Review */}
                  <Paper sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}>
                    <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                      Delivery Address
                    </Typography>
                    <Typography variant="body2">{deliveryAddress.name}</Typography>
                    <Typography variant="body2">{deliveryAddress.phone}</Typography>
                    <Typography variant="body2">{deliveryAddress.address}</Typography>
                    {deliveryAddress.landmark && <Typography variant="body2">Landmark: {deliveryAddress.landmark}</Typography>}
                    <Typography variant="body2">Pincode: {deliveryAddress.pincode}</Typography>
                  </Paper>
                  
                  {/* Payment Method Review */}
                  <Paper sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}>
                    <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                      Payment Method
                    </Typography>
                    <Typography variant="body2">
                      {paymentMethod === 'cod' && 'Cash on Delivery'}
                      {paymentMethod === 'upi' && 'UPI Payment'}
                      {paymentMethod === 'card' && 'Credit/Debit Card'}
                    </Typography>
                  </Paper>
                  
                  {/* Order Items Review */}
                  <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                    <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                      Order Items ({cart?.items?.length || 0})
                    </Typography>
                    {cart?.items?.map((item) => (
                      <Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                        <Typography variant="body2">
                          {item.product?.name} × {item.quantity}
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          ₹{item.totalPrice?.toFixed(2)}
                        </Typography>
                      </Box>
                    ))}
                  </Paper>
                </Box>
              )}

              {/* Navigation Buttons */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                <Button
                  onClick={handleBack}
                  disabled={activeStep === 0 || orderLoading}
                >
                  Back
                </Button>
                {activeStep === steps.length - 1 ? (
                  <Button
                    variant="contained"
                    onClick={handlePlaceOrder}
                    disabled={orderLoading}
                    startIcon={orderLoading ? <CircularProgress size={20} color="inherit" /> : null}
                  >
                    {orderLoading ? 'Placing Order...' : 'Place Order'}
                  </Button>
                ) : (
                  <Button variant="contained" onClick={handleNext}>
                    Next
                  </Button>
                )}
              </Box>
            </Paper>
          </Grid>

          {/* Order Summary Sidebar */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, position: 'sticky', top: 20 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Order Summary
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Items Total</Typography>
                <Typography variant="body2">₹{cart?.totalPrice?.toFixed(2)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Delivery Fee</Typography>
                <Typography variant="body2" color="success.main">FREE</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body2">Handling Charge</Typography>
                <Typography variant="body2">₹{handlingCharge.toFixed(2)}</Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" fontWeight="bold">Total</Typography>
                <Typography variant="h6" fontWeight="bold" color="primary.main">
                  ₹{grandTotal.toFixed(2)}
                </Typography>
              </Box>
              <Alert severity="success" icon={false}>
                <Typography variant="caption">
                  🚀 Expected delivery in 10 minutes
                </Typography>
              </Alert>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default CheckoutPage;
