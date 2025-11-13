import apiClient from './baseApi';
import { getUserId } from '../utils/userUtils';

export const apiService = {
  products: {
    getAll: async () => {
      try {
        const response = await apiClient.get('/products');
        return response.data || [];
      } catch (error) {
        console.error('Failed to fetch products:', error);
        throw error;
      }
    },
    getById: async (productId) => {
      const response = await apiClient.get(`/products/${productId}`);
      return response.data;
    },
  },

  categories: {
    getAll: async () => {
      const response = await apiClient.get('/categories');
      return response.data;
    },
    getProducts: async (categoryName) => {
      try {
        const response = await apiClient.get(`/categories/${categoryName}`);
        return response.data;
      } catch (error) {
        return [];
      }
    },
  },

  cart: {
    get: async () => {
      try {
        const userId = getUserId();
        if (!userId) return { items: [], totalAmount: 0 };
        const response = await apiClient.get(`/cart/${userId}`);
        return response.data;
      } catch (error) {
        if (error.response?.status === 404 || error.response?.status === 500) {
          return { items: [], totalAmount: 0 };
        }
        throw error;
      }
    },
    addItem: async (productId, quantity = 1) => {
      const userId = getUserId();
      const response = await apiClient.post('/cart/items', { userId, productId, quantity });
      return response.data;
    },
    updateItem: async (itemId, quantity) => {
      const response = await apiClient.put(`/cart/items/${itemId}`, { quantity });
      return response.data;
    },
    removeItem: async (itemId) => {
      const userId = getUserId();
      const response = await apiClient.delete(`/cart/items/${itemId}`, { data: { userId } });
      return response.data;
    },
    clear: async () => {
      const userId = getUserId();
      const response = await apiClient.delete(`/cart/${userId}`);
      return response.data;
    },
  },

  auth: {
    login: async (email, password) => {
      const response = await apiClient.post('/auth/login', { email, password });
      return response.data;
    },
    register: async (userData) => {
      const response = await apiClient.post('/auth/register', userData);
      return response.data;
    },
  },
};
