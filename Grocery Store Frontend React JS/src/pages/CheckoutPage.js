import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Button,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Payment as PaymentIcon,
  CheckCircle as SuccessIcon,
  LocalShipping as ShippingIcon,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { checkoutSchema } from '../validation/checkoutSchemas';
import { clearCart } from '../redux/actions/cartActions';

const steps = ['Delivery Details', 'Payment Method', 'Order Review'];

const CheckoutPage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const storeData = useSelector((state) => {
    return {
      items: state?.cart?.items,
      totalItems: state?.cart?.totalItems,
      totalAmount: state?.cart?.totalAmount,
      user: state?.auth?.user,
    };
  });

  const { items, totalItems, totalAmount, user } = storeData;

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    trigger,
  } = useForm({
    resolver: yupResolver(checkoutSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      paymentMethod: 'card',
    },
  });

  const watchedValues = watch();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  const handleNext = async () => {
    let fieldsToValidate = [];
    
    switch (activeStep) {
      case 0:
        fieldsToValidate = ['name', 'email', 'phone', 'address', 'city', 'state', 'zipCode'];
        break;
      case 1:
        fieldsToValidate = ['paymentMethod'];
        break;
      default:
        break;
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const onSubmit = async (data) => {
    setOrderLoading(true);
    try {
      // Simulate API call for order placement
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Clear cart and show success
      dispatch(clearCart());
      setOrderPlaced(true);
    } catch (error) {
      console.error('Order placement failed:', error);
    } finally {
      setOrderLoading(false);
    }
  };

  const handleOrderSuccess = () => {
    setOrderPlaced(false);
    navigate('/', { replace: true });
  };

  const renderDeliveryDetails = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Delivery Information
      </Typography>
      <Box display="flex" flexDirection="column" gap={2}>
        <Box display="flex" gap={2}>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Full Name"
                fullWidth
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            )}
          />
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Email"
                type="email"
                fullWidth
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            )}
          />
        </Box>

        <Controller
          name="phone"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Phone Number"
              fullWidth
              error={!!errors.phone}
              helperText={errors.phone?.message}
            />
          )}
        />

        <Controller
          name="address"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Street Address"
              fullWidth
              multiline
              rows={2}
              error={!!errors.address}
              helperText={errors.address?.message}
            />
          )}
        />

        <Box display="flex" gap={2}>
          <Controller
            name="city"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="City"
                fullWidth
                error={!!errors.city}
                helperText={errors.city?.message}
              />
            )}
          />
          <Controller
            name="state"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="State"
                fullWidth
                error={!!errors.state}
                helperText={errors.state?.message}
              />
            )}
          />
          <Controller
            name="zipCode"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="ZIP Code"
                fullWidth
                error={!!errors.zipCode}
                helperText={errors.zipCode?.message}
              />
            )}
          />
        </Box>
      </Box>
    </Box>
  );

  const renderPaymentMethod = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Payment Method
      </Typography>
      <Controller
        name="paymentMethod"
        control={control}
        render={({ field }) => (
          <FormControl error={!!errors.paymentMethod}>
            <FormLabel>Choose Payment Method</FormLabel>
            <RadioGroup {...field}>
              <FormControlLabel
                value="card"
                control={<Radio />}
                label="Credit/Debit Card"
              />
              <FormControlLabel
                value="upi"
                control={<Radio />}
                label="UPI Payment"
              />
              <FormControlLabel
                value="cash"
                control={<Radio />}
                label="Cash on Delivery"
              />
            </RadioGroup>
          </FormControl>
        )}
      />
    </Box>
  );

  const renderOrderReview = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Order Review
      </Typography>
      
      {/* Delivery Address */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          <ShippingIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Delivery Address
        </Typography>
        <Typography variant="body2">
          {watchedValues.name}<br />
          {watchedValues.address}<br />
          {watchedValues.city}, {watchedValues.state} {watchedValues.zipCode}<br />
          Phone: {watchedValues.phone}
        </Typography>
      </Paper>

      {/* Order Items */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          Order Items ({totalItems})
        </Typography>
        {items.map((item) => (
          <Box key={item.id} display="flex" justifyContent="space-between" mb={1}>
            <Typography variant="body2">
              {item.name} × {item.quantity}
            </Typography>
            <Typography variant="body2">
              {formatPrice(item.price * item.quantity)}
            </Typography>
          </Box>
        ))}
        <Divider sx={{ my: 1 }} />
        <Box display="flex" justifyContent="space-between">
          <Typography variant="subtitle1" fontWeight="bold">
            Total
          </Typography>
          <Typography variant="subtitle1" fontWeight="bold">
            {formatPrice(totalAmount)}
          </Typography>
        </Box>
      </Paper>

      {/* Payment Method */}
      <Paper sx={{ p: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          <PaymentIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Payment Method
        </Typography>
        <Typography variant="body2">
          {watchedValues.paymentMethod === 'card' && 'Credit/Debit Card'}
          {watchedValues.paymentMethod === 'upi' && 'UPI Payment'}
          {watchedValues.paymentMethod === 'cash' && 'Cash on Delivery'}
        </Typography>
      </Paper>
    </Box>
  );

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return renderDeliveryDetails();
      case 1:
        return renderPaymentMethod();
      case 2:
        return renderOrderReview();
      default:
        return 'Unknown step';
    }
  };

  if (items.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Alert severity="warning">
          Your cart is empty. Please add items to proceed with checkout.
          <Button onClick={() => navigate('/')} sx={{ ml: 2 }}>
            Continue Shopping
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
        Checkout
      </Typography>

      <Paper sx={{ p: 3 }}>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <form onSubmit={handleSubmit(onSubmit)}>
          {getStepContent(activeStep)}

          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Box sx={{ flex: '1 1 auto' }} />
            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                type="submit"
                disabled={orderLoading}
              >
                {orderLoading ? <CircularProgress size={24} /> : 'Place Order'}
              </Button>
            ) : (
              <Button variant="contained" onClick={handleNext}>
                Next
              </Button>
            )}
          </Box>
        </form>
      </Paper>

      {/* Order Success Dialog */}
      <Dialog open={orderPlaced} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ textAlign: 'center' }}>
          <SuccessIcon color="success" sx={{ fontSize: 60, mb: 1 }} />
          <Typography variant="h5">Order Placed Successfully!</Typography>
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center' }}>
          <Typography variant="body1" gutterBottom>
            Your order has been placed successfully. You will receive a confirmation email shortly.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Order Total: {formatPrice(totalAmount)}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button variant="contained" onClick={handleOrderSuccess}>
            Continue Shopping
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CheckoutPage;