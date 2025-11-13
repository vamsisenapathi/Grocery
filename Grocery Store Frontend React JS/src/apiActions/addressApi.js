import { createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from './baseApi';
import { getUserId } from '../utils/userUtils';

/**
 * Fetch all addresses for the current user
 */
export const fetchAddresses = createAsyncThunk(
  'addresses/fetchAddresses',
  async (_, { rejectWithValue }) => {
    try {
      const userId = getUserId();
      if (!userId) {
        return rejectWithValue('User not logged in');
      }
      
      // Validate that userId is a valid UUID, not a guest ID
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(userId)) {
        return rejectWithValue('Please login to view your saved addresses');
      }
      
      const response = await apiClient.get(`/addresses/user/${userId}`);
      return response.data || [];
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Failed to fetch addresses';
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * Fetch a single address by ID
 */
export const fetchAddressById = createAsyncThunk(
  'addresses/fetchAddressById',
  async (addressId, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/addresses/${addressId}`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Failed to fetch address';
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * Create a new address
 */
export const createAddress = createAsyncThunk(
  'addresses/createAddress',
  async (addressData, { rejectWithValue }) => {
    try {
      const userId = getUserId();
      if (!userId) {
        return rejectWithValue('User not logged in');
      }
      
      // Validate that userId is a valid UUID
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(userId)) {
        return rejectWithValue('Please login to save addresses');
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
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Failed to create address';
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * Update an existing address
 */
export const updateAddress = createAsyncThunk(
  'addresses/updateAddress',
  async ({ addressId, addressData }, { rejectWithValue }) => {
    try {
      const userId = getUserId();
      if (!userId) {
        return rejectWithValue('User not logged in');
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
      
      const response = await apiClient.put(`/addresses/${addressId}`, requestData);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Failed to update address';
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * Delete an address
 */
export const deleteAddress = createAsyncThunk(
  'addresses/deleteAddress',
  async (addressId, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/addresses/${addressId}`);
      return addressId;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Failed to delete address';
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * Set an address as default
 */
export const setDefaultAddress = createAsyncThunk(
  'addresses/setDefaultAddress',
  async (addressId, { rejectWithValue }) => {
    try {
      const userId = getUserId();
      if (!userId) {
        return rejectWithValue('User not logged in');
      }
      
      const response = await apiClient.patch(`/addresses/${addressId}/set-default`, null, {
        params: { userId }
      });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Failed to set default address';
      return rejectWithValue(errorMessage);
    }
  }
);
