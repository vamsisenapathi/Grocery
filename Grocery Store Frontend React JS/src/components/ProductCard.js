import React, { useMemo, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardMedia, CardContent, Typography, Box, Button, IconButton, Chip, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Add as AddIcon, Remove as RemoveIcon, Delete as DeleteIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
import { addToCart, updateCartItem, removeCartItem } from '../redux/actions/cartActions';
import { useSnackbar } from 'notistack';

const ProductCard = React.memo(({ product }) => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [showDescription, setShowDescription] = useState(false);
  
  // Optimized selector - only select the specific cart item for this product
  const storeData = useSelector((state) => {
    return {
      items: state?.cart?.items,
    };
  });
  
  const cartItem = storeData.items?.find(item => item.productId === product.id);
  const quantity = cartItem?.quantity || 0;

  const handleAdd = useCallback(async (e) => {
    e.stopPropagation();
    try{
      const result = await dispatch(addToCart({ 
        productId: product.id, 
        quantity: 1,
        product: product // Pass full product for guest cart
      }));

      enqueueSnackbar('Added to cart', { variant: 'success' });
    } catch (error) {
      console.error('❌ Failed to add to cart:', error);
      enqueueSnackbar('Failed to add to cart', { variant: 'error' });
    }
  }, [dispatch, product, enqueueSnackbar]);

  const handleIncrement = useCallback(async (e) => {
    e.stopPropagation();
    const currentCartItem = storeData.items?.find(item => item.productId === product.id);
    if (currentCartItem && quantity < product.stock) {
      try {
        console.log('🔍 Incrementing cart item:', {
          cartItem: currentCartItem,
          cartItemId: currentCartItem.id,
          productId: product.id,
          currentQuantity: quantity
        });
        await dispatch(updateCartItem({ itemId: currentCartItem.id, quantity: quantity + 1 }));
        enqueueSnackbar('Cart updated', { variant: 'success' });
      } catch (error) {
        console.error('❌ Failed to update cart:', error);
        enqueueSnackbar('Failed to update cart', { variant: 'error' });
      }
    }
  }, [dispatch, storeData.items, quantity, product.stock, product.id, enqueueSnackbar]);

  const handleDecrement = useCallback(async (e) => {
    e.stopPropagation();
    const currentCartItem = storeData.items?.find(item => item.productId === product.id);
    if (currentCartItem) {
      try {
        console.log('🔍 Decrementing cart item:', {
          cartItem: currentCartItem,
          cartItemId: currentCartItem.id,
          productId: product.id,
          currentQuantity: quantity
        });
        if (quantity === 1) {
          await dispatch(removeCartItem(currentCartItem.id));
          enqueueSnackbar('Removed from cart', { variant: 'success' });
        } else {
          await dispatch(updateCartItem({ itemId: currentCartItem.id, quantity: quantity - 1 }));
          enqueueSnackbar('Cart updated', { variant: 'success' });
        }
      } catch (error) {
        console.error('❌ Failed to update cart:', error);
        enqueueSnackbar('Failed to update cart', { variant: 'error' });
      }
    }
  }, [dispatch, storeData.items, quantity, product.id, enqueueSnackbar]);

  const discountPercent = product.discount || 0;
  const discountedPrice = useMemo(() => 
    discountPercent > 0 ? product.price - (product.price * discountPercent / 100) : null,
    [product.price, discountPercent]
  );
  
  const isOutOfStock = product.stock === 0 || !product.isAvailable;

  return (
    <Card sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column', 
      borderRadius: 3, 
      border: '1px solid #f0f0f0', 
      position: 'relative',
      opacity: isOutOfStock ? 0.6 : 1,
      bgcolor: isOutOfStock ? 'grey.100' : 'background.paper'
    }}>
      {isOutOfStock && (
        <Chip 
          label="OUT OF STOCK" 
          size="small" 
          sx={{ 
            position: 'absolute', 
            top: 8, 
            right: 8, 
            zIndex: 1, 
            bgcolor: 'error.main', 
            color: 'white', 
            fontWeight: 'bold', 
            fontSize: '0.65rem' 
          }} 
        />
      )}
      {discountPercent > 0 && !isOutOfStock && (
        <Chip label={`${discountPercent}% OFF`} size="small" sx={{ position: 'absolute', top: 8, left: 8, zIndex: 1, bgcolor: 'success.main', color: 'white', fontWeight: 'bold', fontSize: '0.7rem' }} />
      )}
      
      {/* Eye icon for description */}
      {product.description && (
        <Tooltip title="View description" placement="left">
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              setShowDescription(true);
            }}
            sx={{
              position: 'absolute',
              top: isOutOfStock ? 40 : (discountPercent > 0 ? 40 : 8),
              right: 8,
              zIndex: 1,
              bgcolor: 'rgba(255, 255, 255, 0.9)',
              '&:hover': { bgcolor: 'white' },
              boxShadow: 1
            }}
          >
            <VisibilityIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}

      <CardMedia 
        component="img" 
        height="140" 
        image={
          product.imageUrl 
            ? (product.imageUrl.startsWith('http') 
                ? product.imageUrl 
                : `http://localhost:8081/api/v1${product.imageUrl}`)
            : 'https://via.placeholder.com/200'
        } 
        alt={product.name} 
        sx={{ 
          objectFit: 'contain', 
          p: 1,
          filter: isOutOfStock ? 'grayscale(100%)' : 'none'
        }} 
      />

      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 1.5, pt: 1 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', minHeight: '2.5em' }}>
          {product.name}
        </Typography>

        <Typography variant="caption" color="text.secondary" sx={{ mb: 1 }}>{product.weight} {product.unit}</Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '1rem' }}>₹{discountedPrice ? discountedPrice.toFixed(2) : product.price?.toFixed(2)}</Typography>
          {discountedPrice && (
            <Typography variant="body2" sx={{ textDecoration: 'line-through', color: 'text.secondary', fontSize: '0.8rem' }}>₹{product.price?.toFixed(2)}</Typography>
          )}
        </Box>

        <Box sx={{ mt: 'auto' }}>
          {isOutOfStock ? (
            <Button variant="outlined" size="small" fullWidth disabled sx={{ borderRadius: 2, color: 'error.main', borderColor: 'error.main' }}>
              Out of Stock
            </Button>
          ) : quantity === 0 ? (
            <Button variant="contained" size="small" fullWidth onClick={handleAdd} sx={{ bgcolor: 'primary.main', color: 'white', borderRadius: 2, fontWeight: 'bold', '&:hover': { bgcolor: 'primary.dark' } }}>
              ADD
            </Button>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '2px solid', borderColor: 'primary.main', borderRadius: 2, px: 0.5, py: 0.3 }}>
              <IconButton size="small" onClick={handleDecrement} sx={{ color: 'primary.main' }}>
                {quantity === 1 ? <DeleteIcon fontSize="small" /> : <RemoveIcon fontSize="small" />}
              </IconButton>
              <Typography sx={{ fontWeight: 'bold', minWidth: 24, textAlign: 'center' }}>{quantity}</Typography>
              <IconButton size="small" onClick={handleIncrement} disabled={quantity >= product.stock} sx={{ bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark' }, '&.Mui-disabled': { bgcolor: 'grey.300' } }}>
                <AddIcon fontSize="small" />
              </IconButton>
            </Box>
          )}
          {!isOutOfStock && product.stock <= 10 && product.stock > 0 && (
            <Typography variant="caption" color="warning.main" sx={{ display: 'block', textAlign: 'center', mt: 0.5, fontWeight: 600 }}>
              Only {product.stock} left!
            </Typography>
          )}
        </Box>
      </CardContent>
      
      {/* Description Dialog */}
      <Dialog open={showDescription} onClose={() => setShowDescription(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{product.name}</DialogTitle>
        <DialogContent>
          {/* Product Image */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <CardMedia 
              component="img" 
              image={
                product.imageUrl 
                  ? (product.imageUrl.startsWith('http') 
                      ? product.imageUrl 
                      : `http://localhost:8081/api/v1${product.imageUrl}`)
                  : 'https://via.placeholder.com/200'
              }
              alt={product.name}
              sx={{ 
                maxWidth: '100%', 
                height: 'auto',
                maxHeight: 300,
                objectFit: 'contain',
                borderRadius: 2,
                border: '1px solid #e0e0e0'
              }}
            />
          </Box>
          
          <Typography variant="body2" sx={{ mb: 2 }}>
            {product.description || 'No description available.'}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              <strong>Unit:</strong> {product.weight} {product.unit}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Price:</strong> ₹{product.price?.toFixed(2)}
            </Typography>
          </Box>
          {product.stock <= 10 && product.stock > 0 && (
            <Typography variant="body2" color="warning.main" sx={{ mt: 1 }}>
              Only {product.stock} items left in stock!
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDescription(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
});

export default ProductCard;
