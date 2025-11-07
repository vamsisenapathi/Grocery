import apiClient, { TokenService } from './baseApi';

// ============ CART API FUNCTIONS ============
export const cartAPI = {
  // Get user's cart
  getCart: async (userId = null) => {
    try {
      const currentUserId = userId || TokenService.getUserId();
      if (!currentUserId) {
        throw new Error('User ID is required to fetch cart');
      }
      
      const response = await apiClient.get(`/cart/${currentUserId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch cart:', error);
      throw new Error(`Failed to fetch cart: ${error.response?.data?.message || error.message}`);
    }
  },

  // Add item to cart
  addToCart: async (cartItemData) => {
    try {
      const userId = TokenService.getUserId();
      if (!userId) {
        throw new Error('User must be logged in to add items to cart');
      }

      const itemWithUserId = {
        ...cartItemData,
        userId: userId
      };

      const response = await apiClient.post('/cart/items', itemWithUserId);
      return response.data;
    } catch (error) {
      console.error('Failed to add item to cart:', error);
      throw new Error(`Failed to add item to cart: ${error.response?.data?.message || error.message}`);
    }
  },

  // Add item to cart (alternative function name for compatibility)
  addItem: async (userId, productIdOrCartItem, quantity = 1) => {
    try {
      let productId, qty;
      
      // Handle both calling patterns:
      // 1. addItem(userId, productId, quantity) - legacy pattern
      // 2. addItem(userId, cartItem) - new pattern from cartSlice
      if (typeof productIdOrCartItem === 'object' && (productIdOrCartItem.productId || productIdOrCartItem.id)) {
        // Called with cartItem object
        productId = productIdOrCartItem.productId || productIdOrCartItem.id;
        qty = productIdOrCartItem.quantity || 1;
      } else {
        // Called with separate parameters
        productId = productIdOrCartItem;
        qty = quantity;
      }

      const cartItemData = {
        productId: productId,
        quantity: qty,
        userId: userId
      };

      const response = await apiClient.post('/cart/items', cartItemData);
      return response.data;
    } catch (error) {
      console.error('Failed to add item to cart:', error);
      throw new Error(`Failed to add item to cart: ${error.response?.data?.message || error.message}`);
    }
  },

  // Update cart item quantity
  updateCartItem: async (cartItemId, quantity) => {
    try {
      const response = await apiClient.put(`/cart/items/${cartItemId}`, { quantity });
      return response.data;
    } catch (error) {
      console.error('Failed to update cart item:', error);
      throw new Error(`Failed to update cart item: ${error.response?.data?.message || error.message}`);
    }
  },

  // Update cart item quantity (alias for compatibility)
  updateItem: async (cartItemId, quantity) => {
    try {
      const response = await apiClient.put(`/cart/items/${cartItemId}`, { quantity });
      return response.data;
    } catch (error) {
      console.error('Failed to update cart item:', error);
      throw new Error(`Failed to update cart item: ${error.response?.data?.message || error.message}`);
    }
  },

  // Remove item from cart
  removeFromCart: async (cartItemId) => {
    try {
      const response = await apiClient.delete(`/cart/items/${cartItemId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to remove item from cart:', error);
      throw new Error(`Failed to remove item from cart: ${error.response?.data?.message || error.message}`);
    }
  },

  // Remove item from cart (alias for compatibility)
  removeItem: async (cartItemId) => {
    try {
      const response = await apiClient.delete(`/cart/items/${cartItemId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to remove item from cart:', error);
      throw new Error(`Failed to remove item from cart: ${error.response?.data?.message || error.message}`);
    }
  },

  // Clear entire cart
  clearCart: async (userId = null) => {
    try {
      const currentUserId = userId || TokenService.getUserId();
      if (!currentUserId) {
        throw new Error('User ID is required to clear cart');
      }

      const response = await apiClient.delete(`/cart/${currentUserId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to clear cart:', error);
      throw new Error(`Failed to clear cart: ${error.response?.data?.message || error.message}`);
    }
  },

  // Get cart item count
  getCartItemCount: async (userId = null) => {
    try {
      const cart = await cartAPI.getCart(userId);
      return cart.items ? cart.items.length : 0;
    } catch (error) {
      console.error('Failed to get cart item count:', error);
      return 0; // Return 0 instead of throwing error for count
    }
  },

  // Get cart total
  getCartTotal: async (userId = null) => {
    try {
      const cart = await cartAPI.getCart(userId);
      if (!cart.items || cart.items.length === 0) {
        return 0;
      }

      return cart.items.reduce((total, item) => {
        return total + (item.price * item.quantity);
      }, 0);
    } catch (error) {
      console.error('Failed to get cart total:', error);
      return 0; // Return 0 instead of throwing error for total
    }
  }
};

export default cartAPI;