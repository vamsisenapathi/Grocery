import {
  FETCH_CART_REQUEST,
  FETCH_CART_SUCCESS,
  FETCH_CART_FAILURE,
  ADD_TO_CART_REQUEST,
  ADD_TO_CART_SUCCESS,
  ADD_TO_CART_FAILURE,
  UPDATE_CART_ITEM_REQUEST,
  UPDATE_CART_ITEM_SUCCESS,
  UPDATE_CART_ITEM_FAILURE,
  REMOVE_CART_ITEM_REQUEST,
  REMOVE_CART_ITEM_SUCCESS,
  REMOVE_CART_ITEM_FAILURE,
  CLEAR_CART_REQUEST,
  CLEAR_CART_SUCCESS,
  CLEAR_CART_FAILURE,
} from '../actionTypes';
import apiClient from '../../apiActions/baseApi';
import { getUserId, isGuestUser } from '../../utils/userUtils';
import { 
  getGuestCart, 
  addToGuestCart as addToGuestCartUtil, 
  updateGuestCartItem as updateGuestCartItemUtil, 
  removeFromGuestCart, 
  clearGuestCart 
} from '../../utils/guestCartUtils';

// ========== FETCH CART ==========
export const fetchCart = () => {
  return async (dispatch) => {
    dispatch({ type: FETCH_CART_REQUEST });
    try {
      const isGuest = isGuestUser();
      
      if (isGuest) {
        const guestCart = getGuestCart();
        dispatch({ type: FETCH_CART_SUCCESS, payload: guestCart });
        return { payload: guestCart };
      }
      
      const userId = getUserId();
      const response = await apiClient.get(`/cart/${userId}`);
      dispatch({ type: FETCH_CART_SUCCESS, payload: response.data });
      return { payload: response.data };
    } catch (error) {
      console.error('❌ Failed to fetch cart:', error);
      // For 404 or 500 errors, return empty cart without throwing (new users may not have a cart)
      if (error.response?.status === 404 || error.response?.status === 500) {
        const emptyCart = { items: [], totalAmount: 0 };
        dispatch({ type: FETCH_CART_SUCCESS, payload: emptyCart });
        return { payload: emptyCart };
      }
      // For other errors, still dispatch failure but don't throw to avoid blocking login
      const errorMessage = error.response?.data || 'Failed to fetch cart';
      dispatch({ type: FETCH_CART_FAILURE, payload: errorMessage });
      return { payload: { items: [], totalAmount: 0 } };
    }
  };
};

// ========== ADD TO CART ==========
export const addToCart = ({ productId, quantity = 1, product }) => {
  return async (dispatch) => {
    dispatch({ type: ADD_TO_CART_REQUEST });
    try {
      const isGuest = isGuestUser();
      
      if (isGuest) {
        const cart = addToGuestCartUtil(product, quantity);
        dispatch({ type: ADD_TO_CART_SUCCESS, payload: cart });
        return { payload: cart };
      }
      
      const userId = getUserId();
      const response = await apiClient.post('/cart/items', { userId, productId, quantity });
      dispatch({ type: ADD_TO_CART_SUCCESS, payload: response.data });
      return { payload: response.data };
    } catch (error) {
      console.error('❌ Failed to add to cart:', error.response?.data || error.message);
      const errorMessage = error.response?.data || 'Failed to add to cart';
      dispatch({ type: ADD_TO_CART_FAILURE, payload: errorMessage });
      throw error;
    }
  };
};

// ========== UPDATE CART ITEM ==========
export const updateCartItem = ({ itemId, quantity }) => {
  return async (dispatch) => {
    dispatch({ type: UPDATE_CART_ITEM_REQUEST });
    try {
      const isGuest = isGuestUser();
      
      if (isGuest) {
        const cart = updateGuestCartItemUtil(itemId, quantity);
        dispatch({ type: UPDATE_CART_ITEM_SUCCESS, payload: cart });
        return { payload: cart };
      }
      
      const response = await apiClient.put(`/cart/items/${itemId}`, { quantity });
      dispatch({ type: UPDATE_CART_ITEM_SUCCESS, payload: response.data });
      return { payload: response.data };
    } catch (error) {
      console.error('❌ Failed to update cart item:', error.response?.data || error.message);
      const errorMessage = error.response?.data || 'Failed to update cart item';
      dispatch({ type: UPDATE_CART_ITEM_FAILURE, payload: errorMessage });
      throw error;
    }
  };
};

// ========== REMOVE CART ITEM ==========
export const removeCartItem = (itemId) => {
  return async (dispatch) => {
    dispatch({ type: REMOVE_CART_ITEM_REQUEST });
    try {
      if (isGuestUser()) {
        const cart = removeFromGuestCart(itemId);
        dispatch({ type: REMOVE_CART_ITEM_SUCCESS, payload: cart });
        return { payload: cart };
      }
      
      const userId = getUserId();
      await apiClient.delete(`/cart/items/${itemId}`);
      const response = await apiClient.get(`/cart/${userId}`);
      dispatch({ type: REMOVE_CART_ITEM_SUCCESS, payload: response.data });
      return { payload: response.data };
    } catch (error) {
      const errorMessage = error.response?.data || 'Failed to remove cart item';
      dispatch({ type: REMOVE_CART_ITEM_FAILURE, payload: errorMessage });
      throw error;
    }
  };
};

// ========== CLEAR CART ==========
export const clearCart = () => {
  return async (dispatch) => {
    dispatch({ type: CLEAR_CART_REQUEST });
    try {
      if (isGuestUser()) {
        clearGuestCart();
        const emptyCart = { items: [], totalAmount: 0 };
        dispatch({ type: CLEAR_CART_SUCCESS, payload: emptyCart });
        return { payload: emptyCart };
      }
      
      const userId = getUserId();
      await apiClient.delete(`/cart/${userId}`);
      const emptyCart = { items: [], totalAmount: 0 };
      dispatch({ type: CLEAR_CART_SUCCESS, payload: emptyCart });
      return { payload: emptyCart };
    } catch (error) {
      const errorMessage = error.response?.data || 'Failed to clear cart';
      dispatch({ type: CLEAR_CART_FAILURE, payload: errorMessage });
      throw error;
    }
  };
};
