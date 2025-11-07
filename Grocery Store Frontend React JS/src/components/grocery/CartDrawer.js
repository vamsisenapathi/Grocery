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
  Alert,
} from '@mui/material';
import {
  Close as CloseIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
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
  }, [open]);

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

  const handleRemoveItem = async (cartItemId) => {
    try {
      setActionLoading(prev => ({ ...prev, [`delete_${cartItemId}`]: true }));
      await apiService.cart.removeItem(cartItemId);
      await loadCart();
      cartEvents.emit(); // Notify other components
      enqueueSnackbar('Item removed from cart', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Failed to remove item', { variant: 'error' });
    } finally {
      setActionLoading(prev => ({ ...prev, [`delete_${cartItemId}`]: false }));
    }
  };

  const handleIncrement = async (productId, currentQuantity, cartItemId) => {
    try {
      setActionLoading(prev => ({ ...prev, [`inc_${productId}`]: true }));
      // Use updateItem to send absolute quantity to backend (avoid negative/delta payloads)
      if (cartItemId) {
        await apiService.cart.updateItem(cartItemId, (currentQuantity || 0) + 1);
      } else {
        // fallback: add as new item
        await apiService.cart.addItem(productId, 1);
      }
      await loadCart();
      cartEvents.emit(); // Notify other components
    } catch (error) {
      enqueueSnackbar('Failed to update quantity', { variant: 'error' });
    } finally {
      setActionLoading(prev => ({ ...prev, [`inc_${productId}`]: false }));
    }
  };

  const handleDecrement = async (productId, currentQuantity, cartItemId) => {
    try {
      setActionLoading(prev => ({ ...prev, [`dec_${productId}`]: true }));
      if (currentQuantity === 1) {
        await handleRemoveItem(cartItemId);
      } else {
        // Update to absolute quantity (currentQuantity - 1)
        if (cartItemId) {
          await apiService.cart.updateItem(cartItemId, currentQuantity - 1);
        } else {
          // fallback to post decrement (legacy behavior)
          await apiService.cart.decrementItem(productId);
        }
        await loadCart();
      }
      cartEvents.emit(); // Notify other components
    } catch (error) {
      enqueueSnackbar('Failed to update quantity', { variant: 'error' });
    } finally {
      setActionLoading(prev => ({ ...prev, [`dec_${productId}`]: false }));
    }
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
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Your cart is empty
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Add items to get started
              </Typography>
              <Button variant="contained" onClick={() => { navigate('/'); onClose(); }}>
                Start Shopping
              </Button>
            </Box>
          ) : (
            <List>
              {cart.items.map((item, index) => (
                <React.Fragment key={item.id}>
                  <ListItem sx={{ px: 0, alignItems: 'flex-start' }}>
                    <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
                      <Box
                        component="img"
                        src={item.product?.imageUrl || 'https://via.placeholder.com/80'}
                        alt={item.product?.name}
                        sx={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 1 }}
                      />
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                          {item.product?.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          ₹{item.price?.toFixed(2)}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', border: `1px solid ${theme.palette.divider}`, borderRadius: 1 }}>
                            <IconButton 
                              size="small" 
                              onClick={() => handleDecrement(item.productId, item.quantity, item.id)}
                              disabled={actionLoading[`dec_${item.productId}`]}
                              sx={{ p: 0.5 }}
                            >
                              {actionLoading[`dec_${item.productId}`] ? <CircularProgress size={14} /> : <RemoveIcon fontSize="small" />}
                            </IconButton>
                            <Typography sx={{ px: 1.5, fontWeight: 'bold' }}>
                              {item.quantity}
                            </Typography>
                            <IconButton 
                              size="small" 
                              onClick={() => handleIncrement(item.productId, item.quantity, item.id)}
                              disabled={actionLoading[`inc_${item.productId}`]}
                              sx={{ p: 0.5 }}
                            >
                              {actionLoading[`inc_${item.productId}`] ? <CircularProgress size={14} /> : <AddIcon fontSize="small" />}
                            </IconButton>
                          </Box>
                          <IconButton 
                            size="small" 
                            onClick={() => handleRemoveItem(item.id)}
                            disabled={actionLoading[`delete_${item.id}`]}
                            color="error"
                          >
                            {actionLoading[`delete_${item.id}`] ? <CircularProgress size={16} color="error" /> : <DeleteIcon fontSize="small" />}
                          </IconButton>
                        </Box>
                      </Box>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        ₹{item.totalPrice?.toFixed(2)}
                      </Typography>
                    </Box>
                  </ListItem>
                  {index < cart.items.length - 1 && <Divider sx={{ my: 1 }} />}
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
