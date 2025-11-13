import { configureStore } from '@reduxjs/toolkit';
import { fetchCategories, fetchCategoryProducts } from '../categoryApi';
import apiClient from '../baseApi';

jest.mock('../baseApi');

describe('categoryApi', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        test: (state = {}) => state,
      },
    });
    jest.clearAllMocks();
  });

  describe('fetchCategories', () => {
    it('should fetch categories from backend successfully', async () => {
      const mockProducts = [
        { id: '1', name: 'Milk', categoryName: 'Dairy' },
        { id: '2', name: 'Apple', categoryName: 'Fruits' },
        { id: '3', name: 'Carrot', categoryName: 'Vegetables' },
        { id: '4', name: 'Bread', categoryName: 'Bakery' },
      ];
      apiClient.get.mockResolvedValue({ data: mockProducts });

      const result = await store.dispatch(fetchCategories());

      expect(apiClient.get).toHaveBeenCalledWith('/products');
      expect(result.type).toBe('categories/fetchCategories/fulfilled');
      expect(result.payload).toEqual([
        { name: 'bakery', displayName: 'Bakery' },
        { name: 'dairy', displayName: 'Dairy' },
        { name: 'fruits', displayName: 'Fruits' },
        { name: 'vegetables', displayName: 'Vegetables' },
      ]);
    });

    it('should return empty array when categories data is null', async () => {
      apiClient.get.mockResolvedValue({ data: null });

      const result = await store.dispatch(fetchCategories());

      expect(result.type).toBe('categories/fetchCategories/fulfilled');
      expect(result.payload).toEqual([]);
    });

    it('should handle fetch categories failure with error response', async () => {
      const errorData = { message: 'Server error' };
      apiClient.get.mockRejectedValue({ response: { data: errorData } });

      const result = await store.dispatch(fetchCategories());

      expect(result.type).toBe('categories/fetchCategories/rejected');
      expect(result.payload).toEqual(errorData);
    });

    it('should handle fetch categories failure without error response', async () => {
      apiClient.get.mockRejectedValue(new Error('Network error'));

      const result = await store.dispatch(fetchCategories());

      expect(result.type).toBe('categories/fetchCategories/rejected');
      expect(result.payload).toBe('Failed to fetch categories');
    });

    it('should convert category names to lowercase for name field', async () => {
      const mockProducts = [
        { id: '1', name: 'Milk', categoryName: 'DAIRY' },
        { id: '2', name: 'Apple', categoryName: 'Fruits & Vegetables' },
        { id: '3', name: 'Chips', categoryName: 'SNACKS' },
      ];
      apiClient.get.mockResolvedValue({ data: mockProducts });

      const result = await store.dispatch(fetchCategories());

      expect(result.payload).toEqual([
        { name: 'dairy', displayName: 'DAIRY' },
        { name: 'fruits & vegetables', displayName: 'Fruits & Vegetables' },
        { name: 'snacks', displayName: 'SNACKS' },
      ]);
    });
  });

  describe('fetchCategoryProducts', () => {
    it('should fetch category products successfully', async () => {
      const mockProducts = [
        { id: 1, name: 'Milk', category: 'dairy', price: 50 },
        { id: 2, name: 'Cheese', category: 'dairy', price: 200 },
      ];
      apiClient.get.mockResolvedValue({ data: mockProducts });

      const result = await store.dispatch(fetchCategoryProducts('dairy'));

      expect(apiClient.get).toHaveBeenCalledWith('/categories/dairy');
      expect(result.type).toBe('categories/fetchCategoryProducts/fulfilled');
      expect(result.payload).toEqual({ categoryName: 'dairy', products: mockProducts });
    });

    it('should return empty array when products data is null', async () => {
      apiClient.get.mockResolvedValue({ data: null });

      const result = await store.dispatch(fetchCategoryProducts('fruits'));

      expect(result.type).toBe('categories/fetchCategoryProducts/fulfilled');
      expect(result.payload).toEqual({ categoryName: 'fruits', products: [] });
    });

    it('should handle fetch category products failure with error response', async () => {
      const errorData = { message: 'Category not found' };
      apiClient.get.mockRejectedValue({ response: { status: 404, data: errorData } });

      const result = await store.dispatch(fetchCategoryProducts('invalid'));

      expect(result.type).toBe('categories/fetchCategoryProducts/rejected');
      expect(result.payload).toEqual(errorData);
    });

    it('should handle fetch category products failure without error response', async () => {
      apiClient.get.mockRejectedValue(new Error('Network error'));

      const result = await store.dispatch(fetchCategoryProducts('dairy'));

      expect(result.type).toBe('categories/fetchCategoryProducts/rejected');
      expect(result.payload).toBe('Failed to fetch category products');
    });

    it('should handle category names with special characters', async () => {
      const mockProducts = [{ id: 1, name: 'Test Product' }];
      apiClient.get.mockResolvedValue({ data: mockProducts });

      const result = await store.dispatch(fetchCategoryProducts('fruits-vegetables'));

      expect(apiClient.get).toHaveBeenCalledWith('/categories/fruits-vegetables');
      expect(result.type).toBe('categories/fetchCategoryProducts/fulfilled');
      expect(result.payload).toEqual({ categoryName: 'fruits-vegetables', products: mockProducts });
    });
  });
});
