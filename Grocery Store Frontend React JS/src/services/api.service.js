// ============ CENTRALIZED API SERVICE ============
// Single source of truth for all API calls matching backend endpoints

import apiClient from '../apiActions/baseApi';
import { getUserId } from '../utils/userUtils';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8081/api/v1';

export const apiService = {
  // ============ PRODUCTS ============
  products: {
    // Get all products
    getAll: async () => {
      try {
        console.log('📡 Fetching products from API...');
        const response = await apiClient.get('/products');
        console.log('📦 Products response:', response.data?.length || 0, 'products');
        return response.data || [];
      } catch (error) {
        console.error('❌ Failed to fetch products:', error.message);
        console.error('Full error:', error);
        throw error;
      }
    },

    // Get product by ID
    getById: async (productId) => {
      try {
        const response = await apiClient.get(`/products/${productId}`);
        return response.data;
      } catch (error) {
        console.error(`❌ Failed to fetch product ${productId}:`, error);
        throw error;
      }
    },

    // Search products
    search: async (query) => {
      try {
        const response = await apiClient.get('/products', {
          params: { search: query }
        });
        return response.data;
      } catch (error) {
        console.error('❌ Failed to search products:', error);
        throw error;
      }
    },
  },

  // ============ CATEGORIES ============
  categories: {
    // Get all categories
    getAll: async () => {
      try {
        const response = await apiClient.get('/categories');
        return response.data;
      } catch (error) {
        console.error('❌ Failed to fetch categories:', error);
        throw error;
      }
    },

    // Get products by category
    getProducts: async (categoryName) => {
      try {
        const response = await apiClient.get(`/categories/${categoryName}`);
        return response.data;
      } catch (error) {
        console.error(`❌ Failed to fetch products for category ${categoryName}:`, error);
        // Fallback to all products if category endpoint fails
        return [];
      }
    },
  },

  // ============ CART ============
  cart: {
    // Get cart for user
    get: async () => {
      try {
        const userId = getUserId();
        if (!userId) {
          // Return empty cart if user not logged in
          return { items: [], totalAmount: 0, totalItems: 0, totalPrice: 0 };
        }
        const response = await apiClient.get(`/cart/${userId}`);
        return response.data;
      } catch (error) {
        console.error('❌ Failed to fetch cart:', error);
        // Return empty cart if cart doesn't exist or there's an error
        if (error.response?.status === 404 || error.response?.status === 500) {
          return { items: [], totalAmount: 0, totalItems: 0, totalPrice: 0 };
        }
        throw error;
      }
    },

    // Add item to cart
    addItem: async (productId, quantity = 1) => {
      try {
        const userId = getUserId();
        if (!userId) {
          throw new Error('Please login to add items to cart');
        }
        const response = await apiClient.post('/cart/items', {
          userId,
          productId,
          quantity
        });
        return response.data;
      } catch (error) {
        console.error('❌ Failed to add item to cart:', error);
        throw error;
      }
    },

    // Increment item quantity: if item exists, update absolute quantity; otherwise add new
    incrementItem: async (productId) => {
      try {
        const userId = getUserId();
        if (!userId) {
          throw new Error('Please login to update cart');
        }

        // Fetch cart and look for existing item
        const cartResp = await apiClient.get(`/cart/${userId}`);
        const cart = cartResp.data || { items: [] };
        const existing = cart.items?.find(item => item.productId === productId);

        if (existing) {
          // update absolute quantity
          const newQty = (existing.quantity || 0) + 1;
          const response = await apiClient.put(`/cart/items/${existing.id}`, { quantity: newQty });
          return response.data;
        }

        // If item doesn't exist, add it
        const response = await apiClient.post('/cart/items', {
          userId,
          productId,
          quantity: 1
        });
        return response.data;
      } catch (error) {
        console.error('❌ Failed to increment item:', error);
        if (error.response?.status === 404 || error.response?.status === 500) {
          return { items: [], totalAmount: 0, totalItems: 0, totalPrice: 0 };
        }
        throw error;
      }
    },

    // Decrement item quantity: find the cart item and update absolute quantity or remove if reaches 0
    decrementItem: async (productId) => {
      try {
        const userId = getUserId();
        if (!userId) {
          throw new Error('Please login to update cart');
        }

        // Fetch cart and look for existing item
        const cartResp = await apiClient.get(`/cart/${userId}`);
        const cart = cartResp.data || { items: [] };
        const existing = cart.items?.find(item => item.productId === productId);

        if (!existing) {
          throw new Error('Cart item not found');
        }

        const newQty = (existing.quantity || 0) - 1;
        if (newQty <= 0) {
          // remove the item
          const response = await apiClient.delete(`/cart/items/${existing.id}`, { data: { userId } });
          return response.data;
        }

        // update absolute quantity
        const response = await apiClient.put(`/cart/items/${existing.id}`, { quantity: newQty });
        return response.data;
      } catch (error) {
        console.error('❌ Failed to decrement item:', error);
        if (error.response?.status === 404 || error.response?.status === 500) {
          return { items: [], totalAmount: 0, totalItems: 0, totalPrice: 0 };
        }
        throw error;
      }
    },

    // Update cart item to an absolute quantity (use this from cart UI)
    updateItem: async (cartItemId, quantity) => {
      try {
        const userId = getUserId();
        if (!userId) {
          throw new Error('Please login to update cart');
        }
        const response = await apiClient.put(`/cart/items/${cartItemId}`, { quantity });
        return response.data;
      } catch (error) {
        console.error('❌ Failed to update cart item:', error);
        // Return empty response on error to prevent UI crash
        if (error.response?.status === 404 || error.response?.status === 500) {
          return { items: [], totalAmount: 0, totalItems: 0, totalPrice: 0 };
        }
        throw error;
      }
    },

    // Remove item from cart
    removeItem: async (cartItemId) => {
      try {
        const userId = getUserId();
        if (!userId) {
          throw new Error('Please login to modify cart');
        }
        const response = await apiClient.delete(`/cart/items/${cartItemId}`, {
          data: { userId }
        });
        return response.data;
      } catch (error) {
        console.error(`❌ Failed to remove cart item ${cartItemId}:`, error);
        // Return empty response on error to prevent UI crash
        if (error.response?.status === 404 || error.response?.status === 500) {
          return { items: [], totalAmount: 0, totalItems: 0, totalPrice: 0 };
        }
        throw error;
      }
    },

    // Clear entire cart
    clear: async () => {
      try {
        const userId = getUserId();
        if (!userId) {
          throw new Error('Please login to clear cart');
        }
        const response = await apiClient.delete(`/cart/${userId}`);
        return response.data;
      } catch (error) {
        console.error('❌ Failed to clear cart:', error);
        // Return empty response on error to prevent UI crash
        if (error.response?.status === 404 || error.response?.status === 500) {
          return { items: [], totalAmount: 0, totalItems: 0, totalPrice: 0 };
        }
        throw error;
      }
    },
  },

  // ============ AUTH ============
  auth: {
    // Login
    login: async (credentials) => {
      try {
        const response = await apiClient.post('/auth/login', credentials);
        return response.data;
      } catch (error) {
        console.error('❌ Login failed:', error);
        throw error;
      }
    },

    // Register
    register: async (userData) => {
      try {
        const response = await apiClient.post('/auth/register', userData);
        return response.data;
      } catch (error) {
        console.error('❌ Registration failed:', error);
        throw error;
      }
    },

    // Logout
    logout: async () => {
      try {
        const response = await apiClient.post('/auth/logout');
        return response.data;
      } catch (error) {
        console.error('❌ Logout failed:', error);
        throw error;
      }
    },
  },
};

export default apiService;
