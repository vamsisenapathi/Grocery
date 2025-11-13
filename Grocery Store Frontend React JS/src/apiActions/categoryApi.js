import { createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from './baseApi';

export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      // WORKAROUND: Backend /categories endpoint missing from compiled JAR
      // Extract unique categories from all products instead
      const response = await apiClient.get('/products');
      const products = response.data || [];
      
      // Extract unique category names from products
      const categorySet = new Set();
      products.forEach(product => {
        if (product.categoryName) {
          categorySet.add(product.categoryName);
        }
      });
      
      const categoryNames = Array.from(categorySet).sort();
      
      // Convert category names to category objects with name and displayName
      const categories = categoryNames.map(name => ({
        name: name.toLowerCase(),
        displayName: name
      }));
      

      return categories;
    } catch (error) {
      console.error('❌ Failed to fetch categories:', error);
      return rejectWithValue(error.response?.data || 'Failed to fetch categories');
    }
  }
);

export const fetchCategoryProducts = createAsyncThunk(
  'categories/fetchCategoryProducts',
  async (categoryName, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/categories/${categoryName}`);
      return { categoryName, products: response.data || [] };
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch category products');
    }
  }
);
