import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Box, Paper, Typography, Button, Divider, Radio, RadioGroup, FormControlLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { clearCart } from '../redux/actions/cartActions';
import { createOrder } from '../redux/actions/orderActions';
import { fetchAddresses } from '../redux/actions/addressActions';
import { useSnackbar } from 'notistack';
import { getUserId } from '../utils/userUtils';

const PaymentPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  
  const storeData = useSelector((state) => {
    return {
      items: state?.cart?.items || [],
      totalAmount: state?.cart?.totalAmount || 0,
      cartLoading: state?.cart?.loading || false,
      cartError: state?.cart?.error,
      addresses: state?.addresses?.addresses || [],
    };
  });
  
  const [paymentMethod, setPaymentMethod] = React.useState('');

  // Extract cart items for easier access
  const cartItems = storeData.items;

  // Get default address or first address
  const deliveryAddress = storeData.addresses.find(addr => addr.isDefault) || storeData.addresses[0];

  // Redirect to login if user is not logged in or to home if cart is empty
  useEffect(() => {
    const userId = getUserId();
    if (!userId) {
      enqueueSnackbar('Please login to continue with checkout', { variant: 'info' });
      // Save current path to redirect back after login
      navigate('/login', { state: { from: '/payment', returnAfterLogin: true } });
      return;
    }
    
    // Redirect to home if cart is empty (order was placed or cart was cleared)
    if (cartItems.length === 0 && !storeData.cartLoading) {
      enqueueSnackbar('Your cart is empty. Please add items to proceed with checkout.', { variant: 'info' });
      navigate('/');
    }
  }, [navigate, enqueueSnackbar, cartItems.length, storeData.cartLoading]);

  // Fetch addresses on mount
  useEffect(() => {
    dispatch(fetchAddresses());
  }, [dispatch]);

  const handlePayment = async () => {
    if (!paymentMethod) {
      enqueueSnackbar('Please select a payment method', { variant: 'warning' });
      return;
    }

    if (!deliveryAddress) {
      enqueueSnackbar('Please select a delivery address', { variant: 'warning' });
      return;
    }

    if (!cartItems || cartItems.length === 0) {
      enqueueSnackbar('Your cart is empty', { variant: 'warning' });
      return;
    }

    try {
      // Format payment method to uppercase as backend expects COD, CARD, or UPI
      const formattedPaymentMethod = paymentMethod.toUpperCase();
      
      // Convert cart items to order items format
      const orderItems = cartItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity
      }));

      // Create order with cart items, payment method and address
      const orderData = {
        items: orderItems,
        paymentMethod: formattedPaymentMethod,
        deliveryAddressId: deliveryAddress.id
      };

      const result = await dispatch(createOrder(orderData));
      
      enqueueSnackbar(`Order placed successfully! Order #${result.payload.orderNumber}`, { variant: 'success' });
      
      // Clear cart
      await dispatch(clearCart());
      
      // Navigate to orders page to show the new order
      navigate('/my-orders');
    } catch (error) {
      console.error('Payment failed:', error);
      const errorMsg = error?.message || error?.error || 'Payment failed. Please try again.';
      enqueueSnackbar(errorMsg, { variant: 'error' });
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>Select Payment Method</Typography>

      <Box sx={{ display: 'flex', gap: 3 }}>
        <Box sx={{ flex: 2 }}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Payment Options</Typography>
            <RadioGroup value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
              <FormControlLabel value="wallet" control={<Radio />} label="Wallets" />
              <FormControlLabel value="card" control={<Radio />} label="Add credit or debit card" />
              <FormControlLabel value="netbanking" control={<Radio />} label="Netbanking" />
              <FormControlLabel value="upi" control={<Radio />} label="Add new UPI ID" />
              <FormControlLabel value="cod" control={<Radio />} label="Cash on Delivery (COD)" />
            </RadioGroup>
          </Paper>
        </Box>

        <Box sx={{ flex: 1 }}>
          <Paper sx={{ p: 3, position: 'sticky', top: 80 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Delivery Address</Typography>
            {deliveryAddress ? (
              <Box>
                <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
                  {deliveryAddress.addressType?.charAt(0).toUpperCase() + deliveryAddress.addressType?.slice(1) || 'Home'}
                </Typography>
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  {deliveryAddress.name}
                </Typography>
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  {deliveryAddress.address}
                </Typography>
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  {deliveryAddress.city}, {deliveryAddress.state} - {deliveryAddress.pincode}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Phone: {deliveryAddress.phoneNumber}
                </Typography>
                <Button 
                  size="small" 
                  onClick={() => navigate('/saved-addresses')}
                  sx={{ mt: 1, textTransform: 'none' }}
                >
                  Change Address
                </Button>
              </Box>
            ) : (
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  No delivery address found
                </Typography>
                <Button 
                  variant="outlined" 
                  size="small"
                  onClick={() => navigate('/saved-addresses')}
                  sx={{ textTransform: 'none' }}
                >
                  Add Address
                </Button>
              </Box>
            )}
            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>My Cart</Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>{storeData.items?.length || 0} item(s)</Typography>
            
            {storeData.items?.map((item, index) => (
              <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">
                  {item.quantity} x
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  ₹{((item.priceAtAdd || item.product?.price || item.price || 0) * item.quantity).toFixed(2)}
                </Typography>
              </Box>
            ))}

            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>Total</Typography>
              <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                ₹{storeData.totalAmount || 0}
              </Typography>
            </Box>

            <Button variant="contained" fullWidth size="large" onClick={handlePayment} disabled={!paymentMethod || !deliveryAddress} sx={{ py: 1.5 }}>
              Pay Now
            </Button>
          </Paper>
        </Box>
      </Box>
    </Container>
  );
};

export default PaymentPage;
