import {
  FETCH_CART_REQUEST,
  FETCH_CART_SUCCESS,
  FETCH_CART_FAILURE,
  ADD_TO_CART_REQUEST,
  ADD_TO_CART_FAILURE,
  UPDATE_CART_ITEM_REQUEST,
  UPDATE_CART_ITEM_SUCCESS,
  UPDATE_CART_ITEM_FAILURE,
  REMOVE_FROM_CART_REQUEST,
  REMOVE_FROM_CART_SUCCESS,
  REMOVE_FROM_CART_FAILURE,
  CLEAR_CART,
  CLEAR_CART_ERROR,
  ADD_ITEM_LOCALLY,
  UPDATE_ITEM_LOCALLY,
  REMOVE_ITEM_LOCALLY,
} from "../actionTypes";

import { cartAPI, TokenService } from "../../apiActions";

// ✅ Fetch Cart
export const fetchCart = (userId) => {
  return async (dispatch) => {
    dispatch({ type: FETCH_CART_REQUEST });

    try {
      console.log('📦 Fetching cart for user:', userId);
      const response = await cartAPI.getCart(userId);
      console.log('✅ Cart fetched successfully:', response);
      
      dispatch({
        type: FETCH_CART_SUCCESS,
        payload: response,
      });
    } catch (error) {
      console.error('❌ Fetch cart failed:', error);
      let errorMessage = "Failed to fetch cart";
      
      if (error.response?.status === 404) {
        // Cart not found is normal for new users, return empty cart
        dispatch({
          type: FETCH_CART_SUCCESS,
          payload: {
            cartId: null,
            userId: userId,
            items: [],
            totalItems: 0,
            totalQuantity: 0,
            totalPrice: 0.00
          },
        });
        return;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      dispatch({
        type: FETCH_CART_FAILURE,
        payload: errorMessage,
      });
    }
  };
};

// ✅ Add to Cart - Enhanced for Backend Integration
export const addToCart = (cartItem) => {
  return async (dispatch, getState) => {
    dispatch({ type: ADD_TO_CART_REQUEST });

    try {
      console.log('🛒 Adding item to cart:', cartItem);
      
      // Get user data from TokenService (JWT format)
      const userData = TokenService.getUser();
      const userId = userData?.userId || cartItem.userId;
      
      if (!userId) {
        throw new Error('User not found. Please log in to add items to cart.');
      }

      // Call backend API with correct parameters
      const response = await cartAPI.addItem(userId, cartItem.productId, cartItem.quantity || 1);
      
      console.log('✅ Item added to cart successfully:', response);
      
      // Refresh cart after adding item to get the latest state
      dispatch(fetchCart(userId));
      
    } catch (error) {
      console.error('❌ Add to cart failed:', error);
      let errorMessage = "Failed to add item to cart";
      
      if (error.response?.status === 400) {
        errorMessage = error.response.data.message || "Invalid request or insufficient stock";
      } else if (error.response?.status === 404) {
        errorMessage = "Product not found";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.request) {
        errorMessage = "Cannot connect to server. Please check if the backend is running on port 8081.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      dispatch({
        type: ADD_TO_CART_FAILURE,
        payload: errorMessage,
      });
    }
  };
};

// ✅ Update Cart Item - Enhanced for Backend Integration
export const updateCartItem = ({ cartItemId, quantity }) => {
  return async (dispatch) => {
    dispatch({ type: UPDATE_CART_ITEM_REQUEST });

    try {
      console.log('🔄 Updating cart item:', { cartItemId, quantity });
      
      // Get user data from TokenService (JWT format)
      const userData = TokenService.getUser();
      const userId = userData?.userId;
      
      if (!userId) {
        throw new Error('User not found. Please log in to update cart items.');
      }

      const response = await cartAPI.updateItem(cartItemId, quantity);
      console.log('✅ Item updated successfully:', response);
      
      dispatch({
        type: UPDATE_CART_ITEM_SUCCESS,
        payload: response,
      });
      
      // Refresh cart after updating item
      dispatch(fetchCart(userId));
      
    } catch (error) {
      console.error('❌ Update cart item failed:', error);
      let errorMessage = "Failed to update cart item";
      
      if (error.response?.status === 404) {
        errorMessage = "Cart item not found";
      } else if (error.response?.status === 400) {
        errorMessage = error.response.data.message || "Invalid quantity or insufficient stock";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.request) {
        errorMessage = "Cannot connect to server. Please check if the backend is running on port 8081.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      dispatch({
        type: UPDATE_CART_ITEM_FAILURE,
        payload: errorMessage,
      });
    }
  };
};

// ✅ Remove from Cart - Enhanced for Backend Integration
export const removeFromCart = ({ cartItemId }) => {
  return async (dispatch) => {
    dispatch({ type: REMOVE_FROM_CART_REQUEST });

    try {
      console.log('🗑️ Removing item from cart:', { cartItemId });
      
      // Get user data from TokenService (JWT format)
      const userData = TokenService.getUser();
      const userId = userData?.userId;
      
      if (!userId) {
        throw new Error('User not found. Please log in to remove items from cart.');
      }

      // Validate parameters
      if (!cartItemId) {
        throw new Error('Invalid request: cartItemId is required');
      }

      await cartAPI.removeItem(cartItemId);
      console.log('✅ Item removed successfully from backend');
      
      dispatch({
        type: REMOVE_FROM_CART_SUCCESS,
        payload: cartItemId,
      });

      // Refresh cart after removing item
      dispatch(fetchCart(userId));

    } catch (error) {
      console.error('❌ Remove from cart failed:', error);
      let errorMessage = "Failed to remove item from cart";
      
      if (error.response?.status === 404) {
        errorMessage = "Cart item not found";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.request) {
        errorMessage = "Cannot connect to server. Please check if the backend is running on port 8081.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      dispatch({
        type: REMOVE_FROM_CART_FAILURE,
        payload: errorMessage,
      });
    }
  };
};

// ✅ Clear Cart
export const clearCart = (userId = null) => {
  return async (dispatch) => {
    try {
      // Get user data from TokenService if userId not provided
      if (!userId) {
        const userData = TokenService.getUser();
        userId = userData?.userId;
      }
      
      if (userId) {
        await cartAPI.clearCart(userId);
        console.log('✅ Cart cleared successfully from backend');
      }
    } catch (error) {
      console.error('❌ Clear cart failed:', error);
    }
    
    // Always dispatch the local clear action
    dispatch({ type: CLEAR_CART });
  };
};

// ✅ Clear Cart Error
export const clearCartError = () => ({
  type: CLEAR_CART_ERROR,
});

// ✅ Add Item Locally (for optimistic updates)
export const addItemLocally = ({ product, quantity = 1 }) => ({
  type: ADD_ITEM_LOCALLY,
  payload: { product, quantity },
});

// ✅ Update Item Locally
export const updateItemLocally = ({ itemId, quantity }) => ({
  type: UPDATE_ITEM_LOCALLY,
  payload: { itemId, quantity },
});

// ✅ Remove Item Locally
export const removeItemLocally = (itemId) => ({
  type: REMOVE_ITEM_LOCALLY,
  payload: itemId,
});