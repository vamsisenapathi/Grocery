import { createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from './baseApi';

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      const data = response.data;
      
      if (data.token) localStorage.setItem('token', data.token);
      if (data.userId) {
        // Store user object with userId
        const user = {
          userId: data.userId,
          id: data.userId,
          name: data.name,
          email: data.email,
          phoneNumber: data.phoneNumber,
          createdAt: data.createdAt
        };
        localStorage.setItem('user', JSON.stringify(user));
      }
      
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Login failed');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/auth/register', userData);
      const data = response.data;
      
      if (data.token) localStorage.setItem('token', data.token);
      if (data.userId) {
        // Store user object with userId
        const user = {
          userId: data.userId,
          id: data.userId,
          name: data.name,
          email: data.email,
          phoneNumber: data.phoneNumber,
          createdAt: data.createdAt
        };
        localStorage.setItem('user', JSON.stringify(user));
      }
      
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Registration failed');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return null;
  }
);
