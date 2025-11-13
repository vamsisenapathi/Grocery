import configureMockStore from 'redux-mock-store';
import {thunk} from 'redux-thunk';
import * as orderActions from '../orderActions';
import {
  FETCH_ORDERS_REQUEST,
  FETCH_ORDERS_SUCCESS,
  FETCH_ORDERS_FAILURE,
  FETCH_ORDER_BY_ID_REQUEST,
  FETCH_ORDER_BY_ID_SUCCESS,
  FETCH_ORDER_BY_ID_FAILURE,
  CREATE_ORDER_REQUEST,
  CREATE_ORDER_SUCCESS,
  CREATE_ORDER_FAILURE,
  CANCEL_ORDER_REQUEST,
  CANCEL_ORDER_SUCCESS,
  CANCEL_ORDER_FAILURE,
} from '../../actionTypes';
import apiClient from '../../../apiActions/baseApi';
import { getUserId } from '../../../utils/userUtils';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

jest.mock('../../../apiActions/baseApi');
jest.mock('../../../utils/userUtils');

describe('Order Actions', () => {
  let store;

  beforeEach(() => {
    store = mockStore({});
    jest.clearAllMocks();
    getUserId.mockReturnValue('550e8400-e29b-41d4-a716-446655440000'); // Valid UUID v4
  });

  describe('fetchOrders', () => {
    it('should dispatch FETCH_ORDERS_SUCCESS on successful fetch', async () => {
      const mockResponse = {
        data: [
          { id: 1, orderNumber: 'ORD001', totalAmount: 500, status: 'DELIVERED' },
          { id: 2, orderNumber: 'ORD002', totalAmount: 300, status: 'PENDING' },
        ],
      };

      getUserId.mockReturnValue('user123');
      apiClient.get.mockResolvedValue(mockResponse);

      await store.dispatch(orderActions.fetchOrders());

      const actions = store.getActions();
      expect(actions[0]).toEqual({ type: FETCH_ORDERS_REQUEST });
      expect(actions[1]).toEqual({
        type: FETCH_ORDERS_SUCCESS,
        payload: mockResponse.data,
      });
    });

    it('should handle undefined response.data', async () => {
      getUserId.mockReturnValue('user123');
      apiClient.get.mockResolvedValue({ data: undefined });

      await store.dispatch(orderActions.fetchOrders());

      const actions = store.getActions();
      expect(actions[0]).toEqual({ type: FETCH_ORDERS_REQUEST });
      expect(actions[1]).toEqual({
        type: FETCH_ORDERS_SUCCESS,
        payload: [],
      });
    });

    it('should throw error when user not logged in', async () => {
      getUserId.mockReturnValue(null);

      try {
        await store.dispatch(orderActions.fetchOrders());
        fail('Should have thrown error');
      } catch (error) {
        expect(error.message).toBe('User not logged in');
        const actions = store.getActions();
        expect(actions[0]).toEqual({ type: FETCH_ORDERS_REQUEST });
        expect(actions[1]).toEqual({
          type: FETCH_ORDERS_FAILURE,
          payload: 'Failed to fetch orders',
        });
      }
    });

    it('should dispatch FETCH_ORDERS_FAILURE on error', async () => {
      getUserId.mockReturnValue('user123');
      apiClient.get.mockRejectedValue(new Error('Network error'));

      try {
        await store.dispatch(orderActions.fetchOrders());
      } catch (error) {
        const actions = store.getActions();
        expect(actions[1].type).toBe(FETCH_ORDERS_FAILURE);
      }
    });

    it('should handle error with response.data', async () => {
      getUserId.mockReturnValue('user123');
      apiClient.get.mockRejectedValue({
        response: { data: 'Server error' },
      });

      try {
        await store.dispatch(orderActions.fetchOrders());
      } catch (error) {
        const actions = store.getActions();
        expect(actions[1]).toEqual({
          type: FETCH_ORDERS_FAILURE,
          payload: 'Server error',
        });
      }
    });

    it('should fallback to default error message', async () => {
      getUserId.mockReturnValue('user123');
      apiClient.get.mockRejectedValue(new Error());

      try {
        await store.dispatch(orderActions.fetchOrders());
      } catch (error) {
        const actions = store.getActions();
        expect(actions[1]).toEqual({
          type: FETCH_ORDERS_FAILURE,
          payload: 'Failed to fetch orders',
        });
      }
    });
  });

  describe('fetchOrderById', () => {
    it('should dispatch FETCH_ORDER_BY_ID_SUCCESS on successful fetch', async () => {
      const mockResponse = {
        data: { id: 1, orderNumber: 'ORD001', totalAmount: 500 },
      };

      apiClient.get.mockResolvedValue(mockResponse);

      await store.dispatch(orderActions.fetchOrderById(1));

      const actions = store.getActions();
      expect(actions[0]).toEqual({ type: FETCH_ORDER_BY_ID_REQUEST });
      expect(actions[1]).toEqual({
        type: FETCH_ORDER_BY_ID_SUCCESS,
        payload: mockResponse.data,
      });
    });

    it('should dispatch FETCH_ORDER_BY_ID_FAILURE on error', async () => {
      apiClient.get.mockRejectedValue(new Error('Order not found'));

      try {
        await store.dispatch(orderActions.fetchOrderById(999));
      } catch (error) {
        const actions = store.getActions();
        expect(actions[1].type).toBe(FETCH_ORDER_BY_ID_FAILURE);
      }
    });

    it('should handle error with response.data', async () => {
      apiClient.get.mockRejectedValue({
        response: { data: 'Order not accessible' },
      });

      try {
        await store.dispatch(orderActions.fetchOrderById(999));
      } catch (error) {
        const actions = store.getActions();
        expect(actions[1]).toEqual({
          type: FETCH_ORDER_BY_ID_FAILURE,
          payload: 'Order not accessible',
        });
      }
    });

    it('should fallback to default error message', async () => {
      apiClient.get.mockRejectedValue(new Error());

      try {
        await store.dispatch(orderActions.fetchOrderById(999));
      } catch (error) {
        const actions = store.getActions();
        expect(actions[1]).toEqual({
          type: FETCH_ORDER_BY_ID_FAILURE,
          payload: 'Failed to fetch order',
        });
      }
    });
  });

  describe('fetchOrderByOrderNumber', () => {
    it('should dispatch FETCH_ORDER_BY_ID_SUCCESS on successful fetch', async () => {
      const mockResponse = {
        data: { id: 1, orderNumber: 'ORD001', totalAmount: 500 },
      };

      apiClient.get.mockResolvedValue(mockResponse);

      await store.dispatch(orderActions.fetchOrderByOrderNumber('ORD001'));

      const actions = store.getActions();
      expect(actions[0]).toEqual({ type: FETCH_ORDER_BY_ID_REQUEST });
      expect(actions[1]).toEqual({
        type: FETCH_ORDER_BY_ID_SUCCESS,
        payload: mockResponse.data,
      });
    });

    it('should dispatch FETCH_ORDER_BY_ID_FAILURE on error', async () => {
      apiClient.get.mockRejectedValue(new Error('Order not found'));

      try {
        await store.dispatch(orderActions.fetchOrderByOrderNumber('INVALID'));
      } catch (error) {
        const actions = store.getActions();
        expect(actions[1].type).toBe(FETCH_ORDER_BY_ID_FAILURE);
      }
    });

    it('should handle error with response.data', async () => {
      apiClient.get.mockRejectedValue({
        response: { data: 'Invalid order number' },
      });

      try {
        await store.dispatch(orderActions.fetchOrderByOrderNumber('INVALID'));
      } catch (error) {
        const actions = store.getActions();
        expect(actions[1]).toEqual({
          type: FETCH_ORDER_BY_ID_FAILURE,
          payload: 'Invalid order number',
        });
      }
    });

    it('should fallback to default error message', async () => {
      apiClient.get.mockRejectedValue(new Error());

      try {
        await store.dispatch(orderActions.fetchOrderByOrderNumber('INVALID'));
      } catch (error) {
        const actions = store.getActions();
        expect(actions[1]).toEqual({
          type: FETCH_ORDER_BY_ID_FAILURE,
          payload: 'Failed to fetch order',
        });
      }
    });
  });

  describe('createOrder', () => {
    it('should dispatch CREATE_ORDER_SUCCESS on successful creation', async () => {
      const mockResponse = {
        data: {
          id: 1,
          orderNumber: 'ORD001',
          totalAmount: 500,
          status: 'PENDING',
        },
      };

      getUserId.mockReturnValue('user123');
      apiClient.post.mockResolvedValue(mockResponse);

      const orderData = {
        items: [{ productId: 'p1', quantity: 2 }],
        paymentMethod: 'COD',
        deliveryAddressId: 1,
      };

      await store.dispatch(orderActions.createOrder(orderData));

      const actions = store.getActions();
      expect(actions[0]).toEqual({ type: CREATE_ORDER_REQUEST });
      expect(actions[1]).toEqual({
        type: CREATE_ORDER_SUCCESS,
        payload: mockResponse.data,
      });
    });

    it('should throw error when user not logged in', async () => {
      getUserId.mockReturnValue(null);

      try {
        await store.dispatch(orderActions.createOrder({}));
        fail('Should have thrown error');
      } catch (error) {
        expect(error.message).toBe('User not logged in');
        const actions = store.getActions();
        expect(actions[0]).toEqual({ type: CREATE_ORDER_REQUEST });
        expect(actions[1]).toEqual({
          type: CREATE_ORDER_FAILURE,
          payload: 'Failed to create order',
        });
      }
    });

    it('should dispatch CREATE_ORDER_FAILURE on error', async () => {
      const errorResponse = {
        response: {
          data: {
            message: 'Insufficient stock',
          },
        },
      };

      getUserId.mockReturnValue('user123');
      apiClient.post.mockRejectedValue(errorResponse);

      const orderData = {
        items: [{ productId: 'p1', quantity: 100 }],
        paymentMethod: 'COD',
      };

      try {
        await store.dispatch(orderActions.createOrder(orderData));
      } catch (error) {
        const actions = store.getActions();
        expect(actions[1]).toEqual({
          type: CREATE_ORDER_FAILURE,
          payload: { message: 'Insufficient stock' },
        });
      }
    });

    it('should handle error with response.data string', async () => {
      const errorResponse = {
        response: {
          data: 'Payment failed',
        },
      };

      getUserId.mockReturnValue('user123');
      apiClient.post.mockRejectedValue(errorResponse);

      try {
        await store.dispatch(orderActions.createOrder({}));
      } catch (error) {
        const actions = store.getActions();
        expect(actions[1]).toEqual({
          type: CREATE_ORDER_FAILURE,
          payload: 'Payment failed',
        });
      }
    });

    it('should fallback to default error message', async () => {
      getUserId.mockReturnValue('user123');
      apiClient.post.mockRejectedValue(new Error());

      try {
        await store.dispatch(orderActions.createOrder({}));
      } catch (error) {
        const actions = store.getActions();
        expect(actions[1]).toEqual({
          type: CREATE_ORDER_FAILURE,
          payload: 'Failed to create order',
        });
      }
    });
  });

  describe('cancelOrder', () => {
    it('should dispatch CANCEL_ORDER_SUCCESS on successful cancellation', async () => {
      const mockResponse = {
        data: { id: 1, status: 'CANCELLED' },
      };

      apiClient.post.mockResolvedValue(mockResponse);

      await store.dispatch(orderActions.cancelOrder(1));

      const actions = store.getActions();
      expect(actions[0]).toEqual({ type: CANCEL_ORDER_REQUEST });
      expect(actions[1]).toEqual({
        type: CANCEL_ORDER_SUCCESS,
        payload: mockResponse.data,
      });
    });

    it('should dispatch CANCEL_ORDER_FAILURE on error', async () => {
      const errorResponse = {
        response: {
          data: 'Order already shipped',
        },
      };

      apiClient.post.mockRejectedValue(errorResponse);

      try {
        await store.dispatch(orderActions.cancelOrder(1));
      } catch (error) {
        const actions = store.getActions();
        expect(actions[1]).toEqual({
          type: CANCEL_ORDER_FAILURE,
          payload: 'Order already shipped',
        });
      }
    });

    it('should fallback to default error message', async () => {
      apiClient.post.mockRejectedValue(new Error());

      try {
        await store.dispatch(orderActions.cancelOrder(1));
      } catch (error) {
        const actions = store.getActions();
        expect(actions[1]).toEqual({
          type: CANCEL_ORDER_FAILURE,
          payload: 'Failed to cancel order',
        });
      }
    });
  });
});
