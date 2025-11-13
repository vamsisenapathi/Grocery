import { createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from './baseApi';
import { getUserId } from '../utils/userUtils';

/**
 * Fetch all orders for the current user
 */
export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      const userId = getUserId();
      if (!userId) {
        return rejectWithValue('User not logged in');
      }
      
      const response = await apiClient.get(`/orders/user/${userId}`);
      return response.data || [];
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch orders');
    }
  }
);

/**
 * Fetch a single order by ID
 */
export const fetchOrderById = createAsyncThunk(
  'orders/fetchOrderById',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/orders/${orderId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch order');
    }
  }
);

/**
 * Fetch order by order number
 */
export const fetchOrderByOrderNumber = createAsyncThunk(
  'orders/fetchOrderByOrderNumber',
  async (orderNumber, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/orders/order-number/${orderNumber}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch order');
    }
  }
);

/**
 * Create a new order from the current cart
 */
export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      const userId = getUserId();
      if (!userId) {
        return rejectWithValue('User not logged in');
      }
      
      const requestData = {
        userId,
        ...orderData
      };
      
      const response = await apiClient.post('/orders', requestData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to create order');
    }
  }
);

/**
 * Cancel an order
 */
export const cancelOrder = createAsyncThunk(
  'orders/cancelOrder',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(`/orders/${orderId}/cancel`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to cancel order');
    }
  }
);
