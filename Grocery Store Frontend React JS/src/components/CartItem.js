import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  TextField,
  Button,
  Divider,
  Avatar,
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { updateCartItem, removeFromCart } from '../redux/actions/cartActions';

const CartItem = ({ item }) => {
  const dispatch = useDispatch();
  
  const storeData = useSelector((state) => {
    return {
      loading: state?.cart?.loading,
    };
  });

  const { loading } = storeData;

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) return;
    
    dispatch(updateCartItem({
      cartItemId: item.cartItemId,
      quantity: newQuantity,
    }));
  };

  const handleRemoveItem = () => {
    dispatch(removeFromCart({
      cartItemId: item.cartItemId,
    }));
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  const itemTotal = (item.priceAtAdd || item.subtotal || 0);

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box display="flex" alignItems="center" gap={2}>
          {/* Product Image */}
          <Avatar
            src={item.imageUrl || '/api/placeholder/80/80'}
            alt={item.productName}
            sx={{ 
              width: 80, 
              height: 80, 
              borderRadius: 2,
              backgroundColor: 'grey.100'
            }}
            variant="rounded"
          />

          {/* Product Details */}
          <Box flex={1} minWidth={0}>
            <Typography variant="h6" gutterBottom noWrap>
              {item.productName}
            </Typography>
            
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Price: {formatPrice(item.priceAtAdd)}
            </Typography>

            <Box display="flex" alignItems="center" gap={1} mt={1}>
              <Typography variant="body2" color="text.secondary">
                Quantity:
              </Typography>
              
              {/* Quantity Controls */}
              <Box display="flex" alignItems="center" gap={1}>
                <IconButton
                  size="small"
                  onClick={() => handleQuantityChange(item.quantity - 1)}
                  disabled={loading || item.quantity <= 1}
                  color="primary"
                >
                  <RemoveIcon />
                </IconButton>

                <TextField
                  size="small"
                  value={item.quantity}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 1;
                    handleQuantityChange(value);
                  }}
                  inputProps={{
                    min: 1,
                    style: { textAlign: 'center', width: '60px' }
                  }}
                  type="number"
                />

                <IconButton
                  size="small"
                  onClick={() => handleQuantityChange(item.quantity + 1)}
                  disabled={loading}
                  color="primary"
                >
                  <AddIcon />
                </IconButton>
              </Box>
            </Box>
          </Box>

          {/* Price and Actions */}
          <Box textAlign="right" minWidth="120px">
            <Typography variant="h6" color="primary" fontWeight="bold" gutterBottom>
              {formatPrice(itemTotal)}
            </Typography>
            
            <Button
              variant="outlined"
              color="error"
              size="small"
              startIcon={<DeleteIcon />}
              onClick={handleRemoveItem}
              disabled={loading}
              sx={{ minWidth: 'auto' }}
            >
              Remove
            </Button>
          </Box>
        </Box>

        <Divider sx={{ mt: 2 }} />
        
        {/* Item Summary */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
          <Typography variant="body2" color="text.secondary">
            {item.quantity} × {formatPrice(item.priceAtAdd)}
          </Typography>
          <Typography variant="subtitle1" fontWeight="bold">
            {formatPrice(item.subtotal || itemTotal)}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CartItem;