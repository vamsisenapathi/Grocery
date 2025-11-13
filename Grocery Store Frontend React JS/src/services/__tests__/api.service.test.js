import { apiService } from '../api.service';
import apiClient from '../baseApi';
import { getUserId } from '../../utils/userUtils';

jest.mock('../baseApi');
jest.mock('../../utils/userUtils');

describe('apiService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('products', () => {
    it('should fetch all products successfully', async () => {
      const mockProducts = [{ id: 1, name: 'Product 1' }, { id: 2, name: 'Product 2' }];
      apiClient.get.mockResolvedValue({ data: mockProducts });

      const result = await apiService.products.getAll();

      expect(apiClient.get).toHaveBeenCalledWith('/products');
      expect(result).toEqual(mockProducts);
    });

    it('should return empty array if products data is null', async () => {
      apiClient.get.mockResolvedValue({ data: null });

      const result = await apiService.products.getAll();

      expect(result).toEqual([]);
    });

    it('should throw error when fetching products fails', async () => {
      const error = new Error('Network error');
      apiClient.get.mockRejectedValue(error);

      await expect(apiService.products.getAll()).rejects.toThrow('Network error');
    });

    it('should fetch product by id', async () => {
      const mockProduct = { id: 1, name: 'Product 1' };
      apiClient.get.mockResolvedValue({ data: mockProduct });

      const result = await apiService.products.getById(1);

      expect(apiClient.get).toHaveBeenCalledWith('/products/1');
      expect(result).toEqual(mockProduct);
    });
  });

  describe('categories', () => {
    it('should fetch all categories', async () => {
      const mockCategories = [{ id: 1, name: 'Category 1' }];
      apiClient.get.mockResolvedValue({ data: mockCategories });

      const result = await apiService.categories.getAll();

      expect(apiClient.get).toHaveBeenCalledWith('/categories');
      expect(result).toEqual(mockCategories);
    });

    it('should fetch category products successfully', async () => {
      const mockProducts = [{ id: 1, name: 'Product 1' }];
      apiClient.get.mockResolvedValue({ data: mockProducts });

      const result = await apiService.categories.getProducts('dairy');

      expect(apiClient.get).toHaveBeenCalledWith('/categories/dairy');
      expect(result).toEqual(mockProducts);
    });

    it('should return empty array when fetching category products fails', async () => {
      apiClient.get.mockRejectedValue(new Error('Network error'));

      const result = await apiService.categories.getProducts('dairy');

      expect(result).toEqual([]);
    });
  });

  describe('cart', () => {
    it('should fetch cart successfully', async () => {
      const mockCart = { items: [{ id: 1, quantity: 2 }], totalAmount: 100 };
      getUserId.mockReturnValue('user123');
      apiClient.get.mockResolvedValue({ data: mockCart });

      const result = await apiService.cart.get();

      expect(apiClient.get).toHaveBeenCalledWith('/cart/user123');
      expect(result).toEqual(mockCart);
    });

    it('should return empty cart when userId is not available', async () => {
      getUserId.mockReturnValue(null);

      const result = await apiService.cart.get();

      expect(result).toEqual({ items: [], totalAmount: 0 });
    });

    it('should return empty cart when cart not found (404)', async () => {
      getUserId.mockReturnValue('user123');
      apiClient.get.mockRejectedValue({ response: { status: 404 } });

      const result = await apiService.cart.get();

      expect(result).toEqual({ items: [], totalAmount: 0 });
    });

    it('should return empty cart when server error (500)', async () => {
      getUserId.mockReturnValue('user123');
      apiClient.get.mockRejectedValue({ response: { status: 500 } });

      const result = await apiService.cart.get();

      expect(result).toEqual({ items: [], totalAmount: 0 });
    });

    it('should throw error for other cart fetch failures', async () => {
      getUserId.mockReturnValue('user123');
      apiClient.get.mockRejectedValue({ response: { status: 403 } });

      await expect(apiService.cart.get()).rejects.toEqual({ response: { status: 403 } });
    });

    it('should add item to cart', async () => {
      const mockCart = { items: [{ id: 1, quantity: 1 }] };
      getUserId.mockReturnValue('user123');
      apiClient.post.mockResolvedValue({ data: mockCart });

      const result = await apiService.cart.addItem(1, 2);

      expect(apiClient.post).toHaveBeenCalledWith('/cart/items', {
        userId: 'user123',
        productId: 1,
        quantity: 2,
      });
      expect(result).toEqual(mockCart);
    });

    it('should add item with default quantity 1', async () => {
      const mockCart = { items: [{ id: 1, quantity: 1 }] };
      getUserId.mockReturnValue('user123');
      apiClient.post.mockResolvedValue({ data: mockCart });

      await apiService.cart.addItem(1);

      expect(apiClient.post).toHaveBeenCalledWith('/cart/items', {
        userId: 'user123',
        productId: 1,
        quantity: 1,
      });
    });

    it('should update cart item', async () => {
      const mockCart = { items: [{ id: 1, quantity: 5 }] };
      apiClient.put.mockResolvedValue({ data: mockCart });

      const result = await apiService.cart.updateItem(1, 5);

      expect(apiClient.put).toHaveBeenCalledWith('/cart/items/1', { quantity: 5 });
      expect(result).toEqual(mockCart);
    });

    it('should remove cart item', async () => {
      const mockCart = { items: [] };
      getUserId.mockReturnValue('user123');
      apiClient.delete.mockResolvedValue({ data: mockCart });

      const result = await apiService.cart.removeItem(1);

      expect(apiClient.delete).toHaveBeenCalledWith('/cart/items/1', { data: { userId: 'user123' } });
      expect(result).toEqual(mockCart);
    });

    it('should clear cart', async () => {
      const mockCart = { items: [], totalAmount: 0 };
      getUserId.mockReturnValue('user123');
      apiClient.delete.mockResolvedValue({ data: mockCart });

      const result = await apiService.cart.clear();

      expect(apiClient.delete).toHaveBeenCalledWith('/cart/user123');
      expect(result).toEqual(mockCart);
    });
  });

  describe('auth', () => {
    it('should login successfully', async () => {
      const mockResponse = { token: 'abc123', user: { id: 1, email: 'test@test.com' } };
      apiClient.post.mockResolvedValue({ data: mockResponse });

      const result = await apiService.auth.login('test@test.com', 'password');

      expect(apiClient.post).toHaveBeenCalledWith('/auth/login', {
        email: 'test@test.com',
        password: 'password',
      });
      expect(result).toEqual(mockResponse);
    });

    it('should register successfully', async () => {
      const userData = { email: 'test@test.com', password: 'password', name: 'Test User' };
      const mockResponse = { token: 'abc123', user: { id: 1, ...userData } };
      apiClient.post.mockResolvedValue({ data: mockResponse });

      const result = await apiService.auth.register(userData);

      expect(apiClient.post).toHaveBeenCalledWith('/auth/register', userData);
      expect(result).toEqual(mockResponse);
    });
  });
});
