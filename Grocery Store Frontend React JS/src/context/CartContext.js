import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../services/api.service';
import { useSnackbar } from 'notistack';
import { getUserId } from '../utils/userUtils';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], subtotal: 0 });
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const fetchCart = async () => {
    const userId = getUserId();
    if (!userId) return;

    try {
      const response = await apiService.cart.get(userId);
      setCart(response || { items: [], subtotal: 0 });
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    }
  };

  useEffect(() => {
    // Avoid fetching cart during unit tests to prevent act() warnings
    if (process.env.NODE_ENV !== 'test') {
      fetchCart();
    }
  }, []);

  const addToCart = async (productId, quantity = 1) => {
    setLoading(true);
    try {
      await apiService.cart.addItem(productId, quantity);
      await fetchCart();
      enqueueSnackbar('Added to cart', { variant: 'success' });
    } catch (error) {
      console.error('Failed to add to cart:', error);
      enqueueSnackbar('Failed to add to cart', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    if (quantity < 1) {
      await removeItem(itemId);
      return;
    }

    setLoading(true);
    try {
      await apiService.cart.updateItem(itemId, quantity);
      await fetchCart();
    } catch (error) {
      enqueueSnackbar('Failed to update quantity', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (itemId) => {
    setLoading(true);
    try {
      await apiService.cart.removeItem(itemId);
      await fetchCart();
      enqueueSnackbar('Removed from cart', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Failed to remove item', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    const userId = getUserId();
    if (!userId) return;

    setLoading(true);
    try {
      await apiService.cart.clear(userId);
      setCart({ items: [], subtotal: 0 });
      enqueueSnackbar('Cart cleared', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Failed to clear cart', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const getTotalQuantity = () => cart.items.reduce((total, item) => total + item.quantity, 0);

  const getCartItem = (productId) => {
    if (!cart.items || cart.items.length === 0) return null;
    return cart.items.find(item => (item.product?.id || item.productId) === productId);
  };

  return (
    <CartContext.Provider value={{ cart, loading, addToCart, updateQuantity, removeItem, clearCart, getTotalQuantity, getCartItem, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};
