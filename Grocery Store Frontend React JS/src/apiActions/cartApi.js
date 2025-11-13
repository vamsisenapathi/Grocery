import { createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from './baseApi';
import { getUserId, isGuestUser } from '../utils/userUtils';
import { getGuestCart, addToGuestCart as addToGuestCartUtil, updateGuestCartItem as updateGuestCartItemUtil, removeFromGuestCart, clearGuestCart } from '../utils/guestCartUtils';

export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const isGuest = isGuestUser();

      
      if (isGuest) {
        // Return guest cart for non-logged in users
        const guestCart = getGuestCart();

        return guestCart;
      }
      
      const userId = getUserId();

      const response = await apiClient.get(`/cart/${userId}`);

      return response.data;
    } catch (error) {
      console.error('❌ Failed to fetch cart:', error);
      if (error.response?.status === 404 || error.response?.status === 500) {

        return { items: [], totalAmount: 0 };
      }
      return rejectWithValue(error.response?.data || 'Failed to fetch cart');
    }
  }
);

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, quantity = 1, product }, { rejectWithValue }) => {
    try {
      const isGuest = isGuestUser();

      
      if (isGuest) {
        // Guest cart - store locally
        const cart = addToGuestCartUtil(product, quantity);

        return cart;
      }
      
      const userId = getUserId();

      const response = await apiClient.post('/cart/items', { userId, productId, quantity });

      return response.data;
    } catch (error) {
      console.error('❌ Failed to add to cart:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data || 'Failed to add to cart');
    }
  }
);

export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ itemId, quantity }, { rejectWithValue }) => {
    try {
      const isGuest = isGuestUser();

      
      if (isGuest) {
        // Guest cart - update locally
        const cart = updateGuestCartItemUtil(itemId, quantity);

        return cart;
      }
      

      const response = await apiClient.put(`/cart/items/${itemId}`, { quantity });

      return response.data;
    } catch (error) {
      console.error('❌ Failed to update cart item:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data || 'Failed to update cart item');
    }
  }
);

export const removeCartItem = createAsyncThunk(
  'cart/removeCartItem',
  async (itemId, { rejectWithValue, dispatch }) => {
    try {
      if (isGuestUser()) {
        // Guest cart - remove locally
        const cart = removeFromGuestCart(itemId);
        return cart;
      }
      
      const userId = getUserId();
      await apiClient.delete(`/cart/items/${itemId}`);
      // After deleting, fetch the updated cart
      const response = await apiClient.get(`/cart/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to remove cart item');
    }
  }
);

export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (_, { rejectWithValue }) => {
    try {
      if (isGuestUser()) {
        // Guest cart - clear locally
        clearGuestCart();
        return { items: [], totalAmount: 0 };
      }
      
      const userId = getUserId();
      await apiClient.delete(`/cart/${userId}`);
      return { items: [], totalPrice: 0 };
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to clear cart');
    }
  }
);
