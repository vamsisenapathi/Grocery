import { createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from './baseApi';

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/products');
      return response.data || [];
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch products');
    }
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/products/${productId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch product');
    }
  }
);

export const searchProducts = createAsyncThunk(
  'products/searchProducts',
  async (searchTerm, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/products/search?q=${searchTerm}`);
      return response.data || [];
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to search products');
    }
  }
);
