import { fetchOrders, fetchOrderById, fetchOrderByOrderNumber, createOrder, cancelOrder } from '../orderApi';
import apiClient from '../baseApi';
import { getUserId } from '../../utils/userUtils';

jest.mock('../baseApi');
jest.mock('../../utils/userUtils');

describe('orderApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchOrders', () => {
    it('fetches orders successfully', async () => {
      const mockOrders = [{ id: '1', orderNumber: 'ORD-001' }];
      getUserId.mockReturnValue('user-123');
      apiClient.get.mockResolvedValue({ data: mockOrders });

      const dispatch = jest.fn();
      const thunk = fetchOrders();
      await thunk(dispatch, () => ({}), undefined);

      expect(apiClient.get).toHaveBeenCalledWith('/orders/user/user-123');
    });

    it('returns empty array when no data in response', async () => {
      getUserId.mockReturnValue('user-123');
      apiClient.get.mockResolvedValue({ data: null });

      const dispatch = jest.fn();
      const thunk = fetchOrders();
      const result = await thunk(dispatch, () => ({}), undefined);

      expect(result.payload).toEqual([]);
    });

    it('returns error when user not logged in', async () => {
      getUserId.mockReturnValue(null);

      const dispatch = jest.fn();
      const thunk = fetchOrders();
      const result = await thunk(dispatch, () => ({}), undefined);

      expect(result.payload).toBe('User not logged in');
    });

    it('handles fetch orders error', async () => {
      getUserId.mockReturnValue('user-123');
      apiClient.get.mockRejectedValue({
        response: { data: 'Server error' }
      });

      const dispatch = jest.fn();
      const thunk = fetchOrders();
      const result = await thunk(dispatch, () => ({}), undefined);

      expect(result.payload).toBe('Server error');
    });

    it('handles fetch orders error without response data', async () => {
      getUserId.mockReturnValue('user-123');
      apiClient.get.mockRejectedValue(new Error('Network error'));

      const dispatch = jest.fn();
      const thunk = fetchOrders();
      const result = await thunk(dispatch, () => ({}), undefined);

      expect(result.payload).toBe('Failed to fetch orders');
    });
  });

  describe('fetchOrderById', () => {
    it('fetches order by id successfully', async () => {
      const mockOrder = { id: '1', orderNumber: 'ORD-001' };
      apiClient.get.mockResolvedValue({ data: mockOrder });

      const dispatch = jest.fn();
      const thunk = fetchOrderById('1');
      await thunk(dispatch, () => ({}), undefined);

      expect(apiClient.get).toHaveBeenCalledWith('/orders/1');
    });

    it('handles fetch order by id error', async () => {
      apiClient.get.mockRejectedValue({
        response: { data: 'Order not found' }
      });

      const dispatch = jest.fn();
      const thunk = fetchOrderById('1');
      const result = await thunk(dispatch, () => ({}), undefined);

      expect(result.payload).toBe('Order not found');
    });

    it('handles fetch order by id error without response data', async () => {
      apiClient.get.mockRejectedValue(new Error('Network error'));

      const dispatch = jest.fn();
      const thunk = fetchOrderById('1');
      const result = await thunk(dispatch, () => ({}), undefined);

      expect(result.payload).toBe('Failed to fetch order');
    });
  });

  describe('fetchOrderByOrderNumber', () => {
    it('fetches order by order number successfully', async () => {
      const mockOrder = { id: '1', orderNumber: 'ORD-001' };
      apiClient.get.mockResolvedValue({ data: mockOrder });

      const dispatch = jest.fn();
      const thunk = fetchOrderByOrderNumber('ORD-001');
      await thunk(dispatch, () => ({}), undefined);

      expect(apiClient.get).toHaveBeenCalledWith('/orders/order-number/ORD-001');
    });

    it('handles fetch order by order number error', async () => {
      apiClient.get.mockRejectedValue({
        response: { data: 'Order not found' }
      });

      const dispatch = jest.fn();
      const thunk = fetchOrderByOrderNumber('ORD-001');
      const result = await thunk(dispatch, () => ({}), undefined);

      expect(result.payload).toBe('Order not found');
    });

    it('handles fetch order by order number error without response data', async () => {
      apiClient.get.mockRejectedValue(new Error('Network error'));

      const dispatch = jest.fn();
      const thunk = fetchOrderByOrderNumber('ORD-001');
      const result = await thunk(dispatch, () => ({}), undefined);

      expect(result.payload).toBe('Failed to fetch order');
    });
  });

  describe('createOrder', () => {
    it('creates order successfully', async () => {
      const orderData = { items: [], total: 100 };
      const createdOrder = { id: '1', ...orderData };
      getUserId.mockReturnValue('user-123');
      apiClient.post.mockResolvedValue({ data: createdOrder });

      const dispatch = jest.fn();
      const thunk = createOrder(orderData);
      await thunk(dispatch, () => ({}), undefined);

      expect(apiClient.post).toHaveBeenCalled();
    });

    it('returns error when user not logged in for createOrder', async () => {
      getUserId.mockReturnValue(null);

      const dispatch = jest.fn();
      const thunk = createOrder({ items: [] });
      const result = await thunk(dispatch, () => ({}), undefined);

      expect(result.payload).toBe('User not logged in');
    });

    it('handles create order error', async () => {
      getUserId.mockReturnValue('user-123');
      apiClient.post.mockRejectedValue({
        response: { data: 'Failed to create' }
      });

      const dispatch = jest.fn();
      const thunk = createOrder({ items: [] });
      const result = await thunk(dispatch, () => ({}), undefined);

      expect(result.payload).toBe('Failed to create');
    });

    it('handles create order error without response data', async () => {
      getUserId.mockReturnValue('user-123');
      apiClient.post.mockRejectedValue(new Error('Network error'));

      const dispatch = jest.fn();
      const thunk = createOrder({ items: [] });
      const result = await thunk(dispatch, () => ({}), undefined);

      expect(result.payload).toBe('Failed to create order');
    });
  });

  describe('cancelOrder', () => {
    it('cancels order successfully', async () => {
      const mockOrder = { id: '1', status: 'cancelled' };
      apiClient.post.mockResolvedValue({ data: mockOrder });

      const dispatch = jest.fn();
      const thunk = cancelOrder('1');
      await thunk(dispatch, () => ({}), undefined);

      expect(apiClient.post).toHaveBeenCalledWith('/orders/1/cancel');
    });

    it('handles cancel order error', async () => {
      apiClient.post.mockRejectedValue({
        response: { data: 'Cannot cancel order' }
      });

      const dispatch = jest.fn();
      const thunk = cancelOrder('1');
      const result = await thunk(dispatch, () => ({}), undefined);

      expect(result.payload).toBe('Cannot cancel order');
    });

    it('handles cancel order error without response data', async () => {
      apiClient.post.mockRejectedValue(new Error('Network error'));

      const dispatch = jest.fn();
      const thunk = cancelOrder('1');
      const result = await thunk(dispatch, () => ({}), undefined);

      expect(result.payload).toBe('Failed to cancel order');
    });
  });
});
