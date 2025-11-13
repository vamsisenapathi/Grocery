import { configureStore } from '@reduxjs/toolkit';
import { fetchProducts, fetchProductById, searchProducts } from '../productApi';
import apiClient from '../baseApi';

jest.mock('../baseApi');

describe('productApi', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        test: (state = {}) => state,
      },
    });
    jest.clearAllMocks();
  });

  describe('fetchProducts', () => {
    it('should fetch all products successfully', async () => {
      const mockProducts = [
        { id: 1, name: 'Product 1', price: 100 },
        { id: 2, name: 'Product 2', price: 200 },
      ];
      apiClient.get.mockResolvedValue({ data: mockProducts });

      const result = await store.dispatch(fetchProducts());

      expect(apiClient.get).toHaveBeenCalledWith('/products');
      expect(result.type).toBe('products/fetchProducts/fulfilled');
      expect(result.payload).toEqual(mockProducts);
    });

    it('should return empty array when products data is null', async () => {
      apiClient.get.mockResolvedValue({ data: null });

      const result = await store.dispatch(fetchProducts());

      expect(result.type).toBe('products/fetchProducts/fulfilled');
      expect(result.payload).toEqual([]);
    });

    it('should handle fetch products failure with error response', async () => {
      const errorData = { message: 'Server error' };
      apiClient.get.mockRejectedValue({ response: { data: errorData } });

      const result = await store.dispatch(fetchProducts());

      expect(result.type).toBe('products/fetchProducts/rejected');
      expect(result.payload).toEqual(errorData);
    });

    it('should handle fetch products failure without error response', async () => {
      apiClient.get.mockRejectedValue(new Error('Network error'));

      const result = await store.dispatch(fetchProducts());

      expect(result.type).toBe('products/fetchProducts/rejected');
      expect(result.payload).toBe('Failed to fetch products');
    });
  });

  describe('fetchProductById', () => {
    it('should fetch product by id successfully', async () => {
      const mockProduct = { id: 1, name: 'Product 1', price: 100, description: 'Test' };
      apiClient.get.mockResolvedValue({ data: mockProduct });

      const result = await store.dispatch(fetchProductById(1));

      expect(apiClient.get).toHaveBeenCalledWith('/products/1');
      expect(result.type).toBe('products/fetchProductById/fulfilled');
      expect(result.payload).toEqual(mockProduct);
    });

    it('should handle fetch product by id failure with error response', async () => {
      const errorData = { message: 'Product not found' };
      apiClient.get.mockRejectedValue({ response: { status: 404, data: errorData } });

      const result = await store.dispatch(fetchProductById(999));

      expect(result.type).toBe('products/fetchProductById/rejected');
      expect(result.payload).toEqual(errorData);
    });

    it('should handle fetch product by id failure without error response', async () => {
      apiClient.get.mockRejectedValue(new Error('Network error'));

      const result = await store.dispatch(fetchProductById(1));

      expect(result.type).toBe('products/fetchProductById/rejected');
      expect(result.payload).toBe('Failed to fetch product');
    });
  });

  describe('searchProducts', () => {
    it('should search products successfully', async () => {
      const mockProducts = [
        { id: 1, name: 'Milk', price: 50 },
        { id: 2, name: 'Milk Chocolate', price: 100 },
      ];
      apiClient.get.mockResolvedValue({ data: mockProducts });

      const result = await store.dispatch(searchProducts('milk'));

      expect(apiClient.get).toHaveBeenCalledWith('/products/search?q=milk');
      expect(result.type).toBe('products/searchProducts/fulfilled');
      expect(result.payload).toEqual(mockProducts);
    });

    it('should return empty array when search returns null', async () => {
      apiClient.get.mockResolvedValue({ data: null });

      const result = await store.dispatch(searchProducts('xyz'));

      expect(result.type).toBe('products/searchProducts/fulfilled');
      expect(result.payload).toEqual([]);
    });

    it('should handle search products failure with error response', async () => {
      const errorData = { message: 'Invalid search term' };
      apiClient.get.mockRejectedValue({ response: { data: errorData } });

      const result = await store.dispatch(searchProducts(''));

      expect(result.type).toBe('products/searchProducts/rejected');
      expect(result.payload).toEqual(errorData);
    });

    it('should handle search products failure without error response', async () => {
      apiClient.get.mockRejectedValue(new Error('Network error'));

      const result = await store.dispatch(searchProducts('milk'));

      expect(result.type).toBe('products/searchProducts/rejected');
      expect(result.payload).toBe('Failed to search products');
    });

    it('should handle search with special characters', async () => {
      const mockProducts = [{ id: 1, name: 'Special Product' }];
      apiClient.get.mockResolvedValue({ data: mockProducts });

      const result = await store.dispatch(searchProducts('test&special'));

      expect(apiClient.get).toHaveBeenCalledWith('/products/search?q=test&special');
      expect(result.type).toBe('products/searchProducts/fulfilled');
    });
  });
});
