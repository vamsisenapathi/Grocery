import React, { useState, useEffect } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  Divider,
  Button,
  useTheme,
  CircularProgress,
  Card,
  CardContent,
  Avatar,
} from '@mui/material';
import {
  Close as CloseIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
  ShoppingCart as CartIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { apiService } from '../../services/api.service';
import { cartEvents } from '../../utils/cartEvents';

const CartDrawer = ({ open, onClose }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useEffect(() => {
    if (open) {
      loadCart();
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadCart = async () => {
    try {
      setLoading(true);
      const cartData = await apiService.cart.get();
      setCart(cartData);
    } catch (error) {
      console.error('Error loading cart:', error);
      enqueueSnackbar('Failed to load cart', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (cartItemId, productName = 'Item') => {
    if (!cartItemId) {
      enqueueSnackbar('Invalid item ID', { variant: 'error' });
      return;
    }

    try {
      setActionLoading(prev => ({ ...prev, [`delete_${cartItemId}`]: true }));
      await apiService.cart.removeItem(cartItemId);
      await loadCart();
      cartEvents.emit(); // Notify other components
      enqueueSnackbar(`${productName} removed from cart`, { variant: 'success' });
    } catch (error) {
      console.error('Remove item error:', error);
      enqueueSnackbar(`Failed to remove ${productName}`, { variant: 'error' });
    } finally {
      setActionLoading(prev => ({ ...prev, [`delete_${cartItemId}`]: false }));
    }
  };

  const handleQuantityChange = async (cartItemId, newQuantity, productName = 'Item') => {
    if (!cartItemId || newQuantity < 0) {
      enqueueSnackbar('Invalid quantity', { variant: 'error' });
      return;
    }

    if (newQuantity === 0) {
      return handleRemoveItem(cartItemId, productName);
    }

    try {
      setActionLoading(prev => ({ ...prev, [`update_${cartItemId}`]: true }));
      await apiService.cart.updateItem(cartItemId, newQuantity);
      await loadCart();
      cartEvents.emit(); // Notify other components
    } catch (error) {
      console.error('Update quantity error:', error);
      enqueueSnackbar(`Failed to update ${productName} quantity`, { variant: 'error' });
    } finally {
      setActionLoading(prev => ({ ...prev, [`update_${cartItemId}`]: false }));
    }
  };

  const handleIncrement = async (cartItem) => {
    const newQuantity = (cartItem.quantity || 0) + 1;
    await handleQuantityChange(cartItem.id, newQuantity, cartItem.productName);
  };

  const handleDecrement = async (cartItem) => {
    const newQuantity = (cartItem.quantity || 0) - 1;
    await handleQuantityChange(cartItem.id, newQuantity, cartItem.productName);
  };

  const handleProceedToCheckout = () => {
    if (cart && cart.items && cart.items.length > 0) {
      setCheckoutLoading(true);
      navigate('/checkout');
      onClose();
    }
  };

  const deliveryFee = 0;
  const handlingCharge = cart?.totalPrice > 0 ? 5 : 0;
  const grandTotal = (cart?.totalPrice || 0) + deliveryFee + handlingCharge;

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: { xs: '100vw', sm: 400 }, height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box sx={{ p: 2, bgcolor: theme.palette.primary.main, color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">My Cart</Typography>
          <IconButton onClick={onClose} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Delivery Timer Banner */}
        {cart && cart.items && cart.items.length > 0 && (
          <Box sx={{ bgcolor: theme.palette.success.light, p: 1.5, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: theme.palette.success.dark, fontWeight: 600 }}>
              🚀 Delivery in 10 minutes
            </Typography>
          </Box>
        )}

        {/* Cart Items */}
        <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <CircularProgress />
            </Box>
          ) : !cart || !cart.items || cart.items.length === 0 ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center', px: 3 }}>
              <Avatar sx={{ bgcolor: 'grey.100', width: 80, height: 80, mb: 3 }}>
                <CartIcon sx={{ fontSize: 40, color: 'grey.400' }} />
              </Avatar>
              <Typography variant="h6" color="text.secondary" gutterBottom sx={{ fontWeight: 600 }}>
                Your cart is empty
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3, opacity: 0.8 }}>
                Add items to get started with your shopping
              </Typography>
              <Button 
                variant="contained" 
                onClick={() => { navigate('/'); onClose(); }}
                sx={{ px: 4, py: 1.5, borderRadius: 2 }}
              >
                Start Shopping
              </Button>
            </Box>
          ) : (
            <List sx={{ py: 0 }}>
              {cart.items.map((item, index) => (
                <React.Fragment key={item.id}>
                  <ListItem sx={{ px: 0, py: 2 }}>
                    <Card sx={{ width: '100%', boxShadow: 'none', border: `1px solid ${theme.palette.divider}`, borderRadius: 2 }}>
                      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                          <Box
                            component="img"
                            src={item.product?.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=80&h=80&fit=crop&crop=center'}
                            alt={item.product?.name || item.productName || 'Product'}
                            sx={{ 
                              width: 60, 
                              height: 60, 
                              objectFit: 'cover', 
                              borderRadius: 1.5,
                              border: `1px solid ${theme.palette.divider}`
                            }}
                          />
                          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                            <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5, lineHeight: 1.3 }}>
                              {item.product?.name || item.productName || 'Product'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                              ₹{(item.price || item.product?.price || 0).toFixed(2)} each
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <Box sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                border: `1px solid ${theme.palette.primary.main}`, 
                                borderRadius: 1.5,
                                bgcolor: 'background.paper'
                              }}>
                                <IconButton 
                                  size="small" 
                                  onClick={() => handleDecrement(item)}
                                  disabled={actionLoading[`update_${item.id}`] || item.quantity <= 0}
                                  sx={{ 
                                    p: 0.5, 
                                    color: theme.palette.primary.main,
                                    '&:hover': { bgcolor: theme.palette.primary.light + '20' }
                                  }}
                                >
                                  {actionLoading[`update_${item.id}`] ? <CircularProgress size={14} /> : <RemoveIcon fontSize="small" />}
                                </IconButton>
                                <Typography sx={{ px: 2, py: 0.5, fontWeight: 'bold', minWidth: 32, textAlign: 'center' }}>
                                  {item.quantity || 0}
                                </Typography>
                                <IconButton 
                                  size="small" 
                                  onClick={() => handleIncrement(item)}
                                  disabled={actionLoading[`update_${item.id}`]}
                                  sx={{ 
                                    p: 0.5, 
                                    color: theme.palette.primary.main,
                                    '&:hover': { bgcolor: theme.palette.primary.light + '20' }
                                  }}
                                >
                                  {actionLoading[`update_${item.id}`] ? <CircularProgress size={14} /> : <AddIcon fontSize="small" />}
                                </IconButton>
                              </Box>
                              <IconButton 
                                size="small" 
                                onClick={() => handleRemoveItem(item.id, item.product?.name || item.productName)}
                                disabled={actionLoading[`delete_${item.id}`]}
                                sx={{ 
                                  color: 'error.main',
                                  '&:hover': { bgcolor: 'rgba(244, 67, 54, 0.08)' }
                                }}
                              >
                                {actionLoading[`delete_${item.id}`] ? <CircularProgress size={16} color="error" /> : <DeleteIcon fontSize="small" />}
                              </IconButton>
                            </Box>
                          </Box>
                          <Box sx={{ textAlign: 'right' }}>
                            <Typography variant="body1" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
                              ₹{(item.totalPrice || (item.quantity * (item.price || item.product?.price || 0))).toFixed(2)}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </ListItem>
                </React.Fragment>
              ))}
            </List>
          )}
        </Box>

        {/* Bill Details */}
        {cart && cart.items && cart.items.length > 0 && (
          <Box sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1.5 }}>
              Bill Details
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="body2">Items Total</Typography>
              <Typography variant="body2">₹{cart.totalPrice?.toFixed(2)}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="body2">Delivery Fee</Typography>
              <Typography variant="body2" sx={{ color: 'success.main' }}>
                {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee.toFixed(2)}`}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
              <Typography variant="body2">Handling Charge</Typography>
              <Typography variant="body2">₹{handlingCharge.toFixed(2)}</Typography>
            </Box>
            <Divider sx={{ my: 1 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                Grand Total
              </Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
                ₹{grandTotal.toFixed(2)}
              </Typography>
            </Box>
            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={handleProceedToCheckout}
              disabled={checkoutLoading}
              startIcon={checkoutLoading ? <CircularProgress size={20} color="inherit" /> : null}
              sx={{
                bgcolor: theme.palette.primary.main,
                color: 'white',
                fontWeight: 'bold',
                py: 1.5,
                '&:hover': {
                  bgcolor: theme.palette.primary.dark,
                }
              }}
            >
              {checkoutLoading ? 'Processing...' : 'Proceed to Checkout'}
            </Button>
          </Box>
        )}
      </Box>
    </Drawer>
  );
};

export default CartDrawer;
