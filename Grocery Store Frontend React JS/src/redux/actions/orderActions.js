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
} from '../actionTypes';
import apiClient from '../../apiActions/baseApi';
import { getUserId } from '../../utils/userUtils';

// ========== FETCH ORDERS ==========
export const fetchOrders = () => {
  return async (dispatch) => {
    dispatch({ type: FETCH_ORDERS_REQUEST });
    try {
      const userId = getUserId();
      if (!userId) {
        throw new Error('User not logged in');
      }
      
      const response = await apiClient.get(`/orders/user/${userId}`);
      dispatch({ type: FETCH_ORDERS_SUCCESS, payload: response.data || [] });
      return { payload: response.data || [] };
    } catch (error) {
      const errorMessage = error.response?.data || 'Failed to fetch orders';
      dispatch({ type: FETCH_ORDERS_FAILURE, payload: errorMessage });
      throw error;
    }
  };
};

// ========== FETCH ORDER BY ID ==========
export const fetchOrderById = (orderId) => {
  return async (dispatch) => {
    dispatch({ type: FETCH_ORDER_BY_ID_REQUEST });
    try {
      const response = await apiClient.get(`/orders/${orderId}`);
      dispatch({ type: FETCH_ORDER_BY_ID_SUCCESS, payload: response.data });
      return { payload: response.data };
    } catch (error) {
      const errorMessage = error.response?.data || 'Failed to fetch order';
      dispatch({ type: FETCH_ORDER_BY_ID_FAILURE, payload: errorMessage });
      throw error;
    }
  };
};

// ========== FETCH ORDER BY ORDER NUMBER ==========
export const fetchOrderByOrderNumber = (orderNumber) => {
  return async (dispatch) => {
    dispatch({ type: FETCH_ORDER_BY_ID_REQUEST });
    try {
      const response = await apiClient.get(`/orders/order-number/${orderNumber}`);
      dispatch({ type: FETCH_ORDER_BY_ID_SUCCESS, payload: response.data });
      return { payload: response.data };
    } catch (error) {
      const errorMessage = error.response?.data || 'Failed to fetch order';
      dispatch({ type: FETCH_ORDER_BY_ID_FAILURE, payload: errorMessage });
      throw error;
    }
  };
};

// ========== CREATE ORDER ==========
export const createOrder = (orderData) => {
  return async (dispatch) => {
    dispatch({ type: CREATE_ORDER_REQUEST });
    try {
      const userId = getUserId();
      if (!userId) {
        throw new Error('User not logged in');
      }
      
      const requestData = {
        userId,
        ...orderData
      };
      
      const response = await apiClient.post('/orders', requestData);
      dispatch({ type: CREATE_ORDER_SUCCESS, payload: response.data });
      return { payload: response.data };
    } catch (error) {
      const errorMessage = error.response?.data || 'Failed to create order';
      dispatch({ type: CREATE_ORDER_FAILURE, payload: errorMessage });
      throw error;
    }
  };
};

// ========== CANCEL ORDER ==========
export const cancelOrder = (orderId) => {
  return async (dispatch) => {
    dispatch({ type: CANCEL_ORDER_REQUEST });
    try {
      const response = await apiClient.post(`/orders/${orderId}/cancel`);
      dispatch({ type: CANCEL_ORDER_SUCCESS, payload: response.data });
      return { payload: response.data };
    } catch (error) {
      const errorMessage = error.response?.data || 'Failed to cancel order';
      dispatch({ type: CANCEL_ORDER_FAILURE, payload: errorMessage });
      throw error;
    }
  };
};
