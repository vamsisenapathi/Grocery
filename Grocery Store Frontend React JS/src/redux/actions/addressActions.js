import {
  FETCH_ADDRESSES_REQUEST,
  FETCH_ADDRESSES_SUCCESS,
  FETCH_ADDRESSES_FAILURE,
  ADD_ADDRESS_REQUEST,
  ADD_ADDRESS_SUCCESS,
  ADD_ADDRESS_FAILURE,
  UPDATE_ADDRESS_REQUEST,
  UPDATE_ADDRESS_SUCCESS,
  UPDATE_ADDRESS_FAILURE,
  DELETE_ADDRESS_REQUEST,
  DELETE_ADDRESS_SUCCESS,
  DELETE_ADDRESS_FAILURE,
  SET_DEFAULT_ADDRESS_REQUEST,
  SET_DEFAULT_ADDRESS_SUCCESS,
  SET_DEFAULT_ADDRESS_FAILURE,
} from '../actionTypes';
import apiClient from '../../apiActions/baseApi';
import { getUserId } from '../../utils/userUtils';

// ========== FETCH ADDRESSES ==========
export const fetchAddresses = () => {
  return async (dispatch) => {
    dispatch({ type: FETCH_ADDRESSES_REQUEST });
    try {
      const userId = getUserId();
      if (!userId) {
        throw new Error('User not logged in');
      }
      
      // Validate that userId is a valid UUID, not a guest ID
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(userId)) {
        throw new Error('Please login to view your saved addresses');
      }
      
      const response = await apiClient.get(`/addresses/user/${userId}`);
      dispatch({ type: FETCH_ADDRESSES_SUCCESS, payload: response.data || [] });
      return { payload: response.data || [] };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Failed to fetch addresses';
      dispatch({ type: FETCH_ADDRESSES_FAILURE, payload: errorMessage });
      throw error;
    }
  };
};

// ========== CREATE ADDRESS ==========
export const createAddress = (addressData) => {
  return async (dispatch) => {
    dispatch({ type: ADD_ADDRESS_REQUEST });
    try {
      const userId = getUserId();
      if (!userId) {
        throw new Error('User not logged in');
      }
      
      // Validate that userId is a valid UUID
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(userId)) {
        throw new Error('Please login to save addresses');
      }
      
      const requestData = {
        userId,
        fullName: addressData.name,
        phoneNumber: addressData.phoneNumber || addressData.phone,
        addressLine1: addressData.addressLine1,
        addressLine2: addressData.addressLine2 || '',
        city: addressData.city,
        state: addressData.state,
        pincode: addressData.pincode,
        addressType: addressData.addressType,
        latitude: addressData.latitude || null,
        longitude: addressData.longitude || null,
        isDefault: addressData.isDefault || false,
      };
      
      const response = await apiClient.post('/addresses', requestData);
      dispatch({ type: ADD_ADDRESS_SUCCESS, payload: response.data });
      return { payload: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Failed to create address';
      dispatch({ type: ADD_ADDRESS_FAILURE, payload: errorMessage });
      throw error;
    }
  };
};

// ========== UPDATE ADDRESS ==========
export const updateAddress = ({ addressId, addressData }) => {
  return async (dispatch) => {
    dispatch({ type: UPDATE_ADDRESS_REQUEST });
    try {
      const userId = getUserId();
      if (!userId) {
        throw new Error('User not logged in');
      }
      
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(userId)) {
        throw new Error('Please login to update addresses');
      }
      
      const requestData = {
        userId,
        fullName: addressData.name || addressData.fullName,
        phoneNumber: addressData.phoneNumber || addressData.phone,
        addressLine1: addressData.addressLine1,
        addressLine2: addressData.addressLine2 || '',
        city: addressData.city,
        state: addressData.state,
        pincode: addressData.pincode,
        addressType: addressData.addressType,
        latitude: addressData.latitude || null,
        longitude: addressData.longitude || null,
        isDefault: addressData.isDefault || false,
      };
      
      const response = await apiClient.put(`/addresses/${addressId}`, requestData);
      dispatch({ type: UPDATE_ADDRESS_SUCCESS, payload: response.data });
      return { payload: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Failed to update address';
      dispatch({ type: UPDATE_ADDRESS_FAILURE, payload: errorMessage });
      throw error;
    }
  };
};

// ========== DELETE ADDRESS ==========
export const deleteAddress = (addressId) => {
  return async (dispatch) => {
    dispatch({ type: DELETE_ADDRESS_REQUEST });
    try {
      await apiClient.delete(`/addresses/${addressId}`);
      dispatch({ type: DELETE_ADDRESS_SUCCESS, payload: addressId });
      return { payload: addressId };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Failed to delete address';
      dispatch({ type: DELETE_ADDRESS_FAILURE, payload: errorMessage });
      throw error;
    }
  };
};

// ========== SET DEFAULT ADDRESS ==========
export const setDefaultAddress = (addressId) => {
  return async (dispatch) => {
    dispatch({ type: SET_DEFAULT_ADDRESS_REQUEST });
    try {
      const response = await apiClient.patch(`/addresses/${addressId}/set-default`);
      dispatch({ type: SET_DEFAULT_ADDRESS_SUCCESS, payload: response.data });
      return { payload: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Failed to set default address';
      dispatch({ type: SET_DEFAULT_ADDRESS_FAILURE, payload: errorMessage });
      throw error;
    }
  };
};
