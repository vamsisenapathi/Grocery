import { configureStore } from '@reduxjs/toolkit';
import { fetchCart, addToCart, updateCartItem, removeCartItem, clearCart } from '../cartApi';
import apiClient from '../baseApi';
import { getUserId, isGuestUser } from '../../utils/userUtils';
import * as guestCartUtils from '../../utils/guestCartUtils';

jest.mock('../baseApi');
jest.mock('../../utils/userUtils');
jest.mock('../../utils/guestCartUtils');

describe('cartApi', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        test: (state = {}) => state,
      },
    });
    jest.clearAllMocks();
  });

  describe('fetchCart', () => {
    it('should fetch cart successfully', async () => {
      const mockCart = {
        items: [{ id: 1, productId: 1, quantity: 2, price: 50 }],
        totalAmount: 100,
      };
      isGuestUser.mockReturnValue(false);
      getUserId.mockReturnValue('user123');
      apiClient.get.mockResolvedValue({ data: mockCart });

      const result = await store.dispatch(fetchCart());

      expect(getUserId).toHaveBeenCalled();
      expect(apiClient.get).toHaveBeenCalledWith('/cart/user123');
      expect(result.type).toBe('cart/fetchCart/fulfilled');
      expect(result.payload).toEqual(mockCart);
    });

    it('should return empty cart when userId is not available', async () => {
      isGuestUser.mockReturnValue(true);
      guestCartUtils.getGuestCart.mockReturnValue({ items: [], totalAmount: 0 });

      const result = await store.dispatch(fetchCart());

      expect(result.type).toBe('cart/fetchCart/fulfilled');
      expect(result.payload).toEqual({ items: [], totalAmount: 0 });
      expect(apiClient.get).not.toHaveBeenCalled();
    });

    it('should return empty cart when cart not found (404)', async () => {
      isGuestUser.mockReturnValue(false);
      getUserId.mockReturnValue('user123');
      apiClient.get.mockRejectedValue({ response: { status: 404 } });

      const result = await store.dispatch(fetchCart());

      expect(result.type).toBe('cart/fetchCart/fulfilled');
      expect(result.payload).toEqual({ items: [], totalAmount: 0 });
    });

    it('should return empty cart when server error (500)', async () => {
      isGuestUser.mockReturnValue(false);
      getUserId.mockReturnValue('user123');
      apiClient.get.mockRejectedValue({ response: { status: 500 } });

      const result = await store.dispatch(fetchCart());

      expect(result.type).toBe('cart/fetchCart/fulfilled');
      expect(result.payload).toEqual({ items: [], totalAmount: 0 });
    });

    it('should handle other errors', async () => {
      isGuestUser.mockReturnValue(false);
      getUserId.mockReturnValue('user123');
      const errorData = { message: 'Unauthorized' };
      apiClient.get.mockRejectedValue({ response: { status: 403, data: errorData } });

      const result = await store.dispatch(fetchCart());

      expect(result.type).toBe('cart/fetchCart/rejected');
      expect(result.payload).toEqual(errorData);
    });

    it('should handle error without response data', async () => {
      isGuestUser.mockReturnValue(false);
      getUserId.mockReturnValue('user123');
      apiClient.get.mockRejectedValue(new Error('Network error'));

      const result = await store.dispatch(fetchCart());

      expect(result.type).toBe('cart/fetchCart/rejected');
      expect(result.payload).toBe('Failed to fetch cart');
    });
  });

  describe('addToCart', () => {
    it('should add item to cart successfully', async () => {
      const mockCart = {
        items: [{ id: 1, productId: 5, quantity: 2 }],
        totalAmount: 200,
      };
      getUserId.mockReturnValue('user123');
      apiClient.post.mockResolvedValue({ data: mockCart });

      const result = await store.dispatch(addToCart({ productId: 5, quantity: 2 }));

      expect(apiClient.post).toHaveBeenCalledWith('/cart/items', {
        userId: 'user123',
        productId: 5,
        quantity: 2,
      });
      expect(result.type).toBe('cart/addToCart/fulfilled');
      expect(result.payload).toEqual(mockCart);
    });

    it('should add item with default quantity 1', async () => {
      const mockCart = { items: [{ id: 1, productId: 5, quantity: 1 }], totalAmount: 100 };
      getUserId.mockReturnValue('user123');
      apiClient.post.mockResolvedValue({ data: mockCart });

      const result = await store.dispatch(addToCart({ productId: 5 }));

      expect(apiClient.post).toHaveBeenCalledWith('/cart/items', {
        userId: 'user123',
        productId: 5,
        quantity: 1,
      });
      expect(result.type).toBe('cart/addToCart/fulfilled');
    });

    it('should handle add to cart failure with error response', async () => {
      const errorData = { message: 'Product out of stock' };
      getUserId.mockReturnValue('user123');
      apiClient.post.mockRejectedValue({ response: { data: errorData } });

      const result = await store.dispatch(addToCart({ productId: 5, quantity: 2 }));

      expect(result.type).toBe('cart/addToCart/rejected');
      expect(result.payload).toEqual(errorData);
    });

    it('should handle add to cart failure without error response', async () => {
      getUserId.mockReturnValue('user123');
      apiClient.post.mockRejectedValue(new Error('Network error'));

      const result = await store.dispatch(addToCart({ productId: 5, quantity: 2 }));

      expect(result.type).toBe('cart/addToCart/rejected');
      expect(result.payload).toBe('Failed to add to cart');
    });
  });

  describe('updateCartItem', () => {
    it('should update cart item successfully', async () => {
      const mockCart = {
        items: [{ id: 1, productId: 5, quantity: 5 }],
        totalAmount: 250,
      };
      apiClient.put.mockResolvedValue({ data: mockCart });

      const result = await store.dispatch(updateCartItem({ itemId: 1, quantity: 5 }));

      expect(apiClient.put).toHaveBeenCalledWith('/cart/items/1', { quantity: 5 });
      expect(result.type).toBe('cart/updateCartItem/fulfilled');
      expect(result.payload).toEqual(mockCart);
    });

    it('should handle update failure with error response', async () => {
      const errorData = { message: 'Item not found' };
      apiClient.put.mockRejectedValue({ response: { data: errorData } });

      const result = await store.dispatch(updateCartItem({ itemId: 1, quantity: 5 }));

      expect(result.type).toBe('cart/updateCartItem/rejected');
      expect(result.payload).toEqual(errorData);
    });

    it('should handle update failure without error response', async () => {
      apiClient.put.mockRejectedValue(new Error('Network error'));

      const result = await store.dispatch(updateCartItem({ itemId: 1, quantity: 5 }));

      expect(result.type).toBe('cart/updateCartItem/rejected');
      expect(result.payload).toBe('Failed to update cart item');
    });
  });

  describe('removeCartItem', () => {
    it('should remove cart item successfully', async () => {
      const mockCart = { items: [], totalPrice: 0 };
      getUserId.mockReturnValue('user123');
      apiClient.delete.mockResolvedValue({ status: 204 });  // 204 No Content
      apiClient.get.mockResolvedValue({ data: mockCart });  // Refetch cart

      const result = await store.dispatch(removeCartItem('item-id-123'));

      expect(apiClient.delete).toHaveBeenCalledWith('/cart/items/item-id-123');
      expect(apiClient.get).toHaveBeenCalledWith('/cart/user123');
      expect(result.type).toBe('cart/removeCartItem/fulfilled');
      expect(result.payload).toEqual(mockCart);
    });

    it('should handle remove failure with error response', async () => {
      const errorData = { message: 'Item not found' };
      getUserId.mockReturnValue('user123');
      apiClient.delete.mockRejectedValue({ response: { data: errorData } });

      const result = await store.dispatch(removeCartItem('item-id-123'));

      expect(result.type).toBe('cart/removeCartItem/rejected');
      expect(result.payload).toEqual(errorData);
    });

    it('should handle remove failure without error response', async () => {
      getUserId.mockReturnValue('user123');
      apiClient.delete.mockRejectedValue(new Error('Network error'));

      const result = await store.dispatch(removeCartItem('item-id-123'));

      expect(result.type).toBe('cart/removeCartItem/rejected');
      expect(result.payload).toBe('Failed to remove cart item');
    });
  });

  describe('clearCart', () => {
    it('should clear cart successfully', async () => {
      getUserId.mockReturnValue('user123');
      apiClient.delete.mockResolvedValue({ status: 204 });  // 204 No Content

      const result = await store.dispatch(clearCart());

      expect(apiClient.delete).toHaveBeenCalledWith('/cart/user123');
      expect(result.type).toBe('cart/clearCart/fulfilled');
      expect(result.payload).toEqual({ items: [], totalPrice: 0 });
    });

    it('should handle clear failure with error response', async () => {
      const errorData = { message: 'Cart not found' };
      getUserId.mockReturnValue('user123');
      apiClient.delete.mockRejectedValue({ response: { data: errorData } });

      const result = await store.dispatch(clearCart());

      expect(result.type).toBe('cart/clearCart/rejected');
      expect(result.payload).toEqual(errorData);
    });

    it('should handle clear failure without error response', async () => {
      getUserId.mockReturnValue('user123');
      apiClient.delete.mockRejectedValue(new Error('Network error'));

      const result = await store.dispatch(clearCart());

      expect(result.type).toBe('cart/clearCart/rejected');
      expect(result.payload).toBe('Failed to clear cart');
    });
  });

  describe('Guest Cart Functionality', () => {
    it('should use guest cart when user is not logged in (fetchCart)', async () => {
      const mockGuestCart = { items: [], totalAmount: 0 };
      isGuestUser.mockReturnValue(true);
      guestCartUtils.getGuestCart = jest.fn().mockReturnValue(mockGuestCart);

      const result = await store.dispatch(fetchCart());

      expect(isGuestUser).toHaveBeenCalled();
      expect(guestCartUtils.getGuestCart).toHaveBeenCalled();
      expect(apiClient.get).not.toHaveBeenCalled();
      expect(result.type).toBe('cart/fetchCart/fulfilled');
      expect(result.payload).toEqual(mockGuestCart);
    });

    it('should use guest cart when user is not logged in (addToCart)', async () => {
      const mockProduct = { id: 1, name: 'Test Product', price: 100 };
      const mockGuestCart = { items: [{ productId: 1, quantity: 1 }], totalAmount: 100 };
      isGuestUser.mockReturnValue(true);
      guestCartUtils.addToGuestCart = jest.fn().mockReturnValue(mockGuestCart);

      const result = await store.dispatch(addToCart({ productId: 1, quantity: 1, product: mockProduct }));

      expect(isGuestUser).toHaveBeenCalled();
      expect(guestCartUtils.addToGuestCart).toHaveBeenCalledWith(mockProduct, 1);
      expect(apiClient.post).not.toHaveBeenCalled();
      expect(result.type).toBe('cart/addToCart/fulfilled');
      expect(result.payload).toEqual(mockGuestCart);
    });

    it('should use guest cart when user is not logged in (updateCartItem)', async () => {
      const mockGuestCart = { items: [{ id: '1', productId: 1, quantity: 3 }], totalAmount: 300 };
      isGuestUser.mockReturnValue(true);
      guestCartUtils.updateGuestCartItem = jest.fn().mockReturnValue(mockGuestCart);

      const result = await store.dispatch(updateCartItem({ itemId: '1', quantity: 3 }));

      expect(isGuestUser).toHaveBeenCalled();
      expect(guestCartUtils.updateGuestCartItem).toHaveBeenCalledWith('1', 3);
      expect(apiClient.put).not.toHaveBeenCalled();
      expect(result.type).toBe('cart/updateCartItem/fulfilled');
      expect(result.payload).toEqual(mockGuestCart);
    });

    it('should use guest cart when user is not logged in (removeCartItem)', async () => {
      const mockGuestCart = { items: [], totalAmount: 0 };
      isGuestUser.mockReturnValue(true);
      guestCartUtils.removeFromGuestCart = jest.fn().mockReturnValue(mockGuestCart);

      const result = await store.dispatch(removeCartItem('1'));

      expect(isGuestUser).toHaveBeenCalled();
      expect(guestCartUtils.removeFromGuestCart).toHaveBeenCalledWith('1');
      expect(apiClient.delete).not.toHaveBeenCalled();
      expect(result.type).toBe('cart/removeCartItem/fulfilled');
      expect(result.payload).toEqual(mockGuestCart);
    });

    it('should use guest cart when user is not logged in (clearCart)', async () => {
      isGuestUser.mockReturnValue(true);
      guestCartUtils.clearGuestCart = jest.fn();

      const result = await store.dispatch(clearCart());

      expect(isGuestUser).toHaveBeenCalled();
      expect(guestCartUtils.clearGuestCart).toHaveBeenCalled();
      expect(apiClient.delete).not.toHaveBeenCalled();
      expect(result.type).toBe('cart/clearCart/fulfilled');
      expect(result.payload).toEqual({ items: [], totalAmount: 0 });
    });

    it('should call backend API when user is logged in (addToCart)', async () => {
      const mockCart = { items: [{ id: 1, productId: 5, quantity: 2 }], totalAmount: 200 };
      isGuestUser.mockReturnValue(false);
      getUserId.mockReturnValue('user123');
      apiClient.post.mockResolvedValue({ data: mockCart });

      const result = await store.dispatch(addToCart({ productId: 5, quantity: 2 }));

      expect(isGuestUser).toHaveBeenCalled();
      expect(getUserId).toHaveBeenCalled();
      expect(apiClient.post).toHaveBeenCalledWith('/cart/items', {
        userId: 'user123',
        productId: 5,
        quantity: 2,
      });
      expect(result.type).toBe('cart/addToCart/fulfilled');
      expect(result.payload).toEqual(mockCart);
    });
  });
});
