import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Drawer, Box, Typography, IconButton, Button, Divider, List, ListItem, ListItemText, ButtonGroup } from '@mui/material';
import { Close as CloseIcon, ShoppingCart as CartIcon, Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { fetchCart, updateCartItem, removeCartItem } from '../redux/actions/cartActions';

const CartDrawer = ({ open, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const storeData = useSelector((state) => {
    return {
      items: state?.cart?.items,
      totalAmount: state?.cart?.totalAmount,
      loading: state?.cart?.loading,
      error: state?.cart?.error,
    };
  });
  
  useEffect(() => {
    if (open && process.env.NODE_ENV !== 'test') {
      dispatch(fetchCart());
    }
  }, [open, dispatch]);

  const totalQuantity = (storeData.items || []).reduce((sum, item) => sum + item.quantity, 0);

  const handleProceed = () => {
    onClose();
    navigate('/payment');
  };

  const handleContinueShopping = () => {
    onClose();
    navigate('/');
  };

  const handleQuantityChange = async (item, newQuantity) => {
    if (newQuantity < 1) {
      // Remove item if quantity becomes 0
      await dispatch(removeCartItem(item.id));
    } else {
      // Update quantity
      await dispatch(updateCartItem({ itemId: item.id, quantity: newQuantity }));
    }
    // Refresh cart after update
    dispatch(fetchCart());
  };

  const handleIncrement = (item) => {
    handleQuantityChange(item, item.quantity + 1);
  };

  const handleDecrement = (item) => {
    handleQuantityChange(item, item.quantity - 1);
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose} sx={{ '& .MuiDrawer-paper': { width: 400 } }}>
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, borderBottom: '1px solid #f0f0f0' }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>My Cart</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        {totalQuantity === 0 ? (
          <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 3 }}>
            <CartIcon sx={{ fontSize: 80, color: 'grey.300', mb: 2 }} />
            <Typography variant="h6" sx={{ mb: 1, color: 'text.secondary' }}>Your cart is empty</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>Add items to get started</Typography>
            <Button variant="contained" onClick={handleContinueShopping}>Continue Shopping</Button>
          </Box>
        ) : (
          <>
            <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
              <Typography variant="body2" sx={{ mb: 2, color: 'success.main', fontWeight: 600 }}>
                Delivery in 8 minutes • Shipment of {totalQuantity} item{totalQuantity > 1 ? 's' : ''}
              </Typography>

              <List sx={{ p: 0 }}>
                {(storeData.items || [])?.map((item) => (
                  <ListItem key={item.id} sx={{ px: 0, py: 1.5, borderBottom: '1px solid #f0f0f0', alignItems: 'flex-start' }}>
                    <Box 
                      component="img" 
                      src={
                        (item.productImage || item.product?.imageUrl || item.imageUrl)?.startsWith('http') 
                          ? (item.productImage || item.product?.imageUrl || item.imageUrl)
                          : `http://localhost:8081/api/v1${item.productImage || item.product?.imageUrl || item.imageUrl}`
                      } 
                      alt={item.productName || item.product?.name || item.name} 
                      sx={{ width: 50, height: 50, objectFit: 'contain', mr: 2, borderRadius: 1 }} 
                    />
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                        {item.productName || item.product?.name || item.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                        {item.product?.unit || item.unit || '1 unit'}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          ₹{(item.priceAtAdd || item.product?.price || item.price)?.toFixed(2)}
                        </Typography>
                        <ButtonGroup 
                          size="small" 
                          variant="contained" 
                          sx={{ 
                            bgcolor: 'success.main',
                            '& .MuiButton-root': { 
                              minWidth: '32px',
                              px: 1,
                              py: 0.5,
                              bgcolor: 'success.main',
                              color: 'white',
                              border: 'none',
                              '&:hover': {
                                bgcolor: 'success.dark',
                                border: 'none',
                              }
                            }
                          }}
                        >
                          <Button onClick={() => handleDecrement(item)}>
                            <RemoveIcon fontSize="small" />
                          </Button>
                          <Button 
                            disableRipple 
                            sx={{ 
                              cursor: 'default !important',
                              '&:hover': { bgcolor: 'success.main !important' }
                            }}
                          >
                            {item.quantity}
                          </Button>
                          <Button onClick={() => handleIncrement(item)}>
                            <AddIcon fontSize="small" />
                          </Button>
                        </ButtonGroup>
                      </Box>
                    </Box>
                  </ListItem>
                ))}
              </List>
            </Box>

            <Box sx={{ p: 2, borderTop: '2px solid #f0f0f0' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Items total</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>₹{storeData.totalAmount || 0}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Delivery charge</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.main' }}>FREE</Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>Grand total</Typography>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>₹{storeData.totalAmount || 0}</Typography>
              </Box>
              <Button variant="contained" fullWidth size="large" onClick={handleProceed} sx={{ bgcolor: 'primary.main', py: 1.5, fontWeight: 600 }}>
                Proceed to Checkout
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Drawer>
  );
};

export default CartDrawer;
