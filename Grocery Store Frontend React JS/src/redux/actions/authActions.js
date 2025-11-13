import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  REGISTER_FAILURE,
  LOGOUT_REQUEST,
  LOGOUT_SUCCESS,
  LOGOUT_FAILURE,
  CLEAR_AUTH_ERROR,
} from '../actionTypes';
import apiClient from '../../apiActions/baseApi';

// ========== LOGIN ==========
export const loginUser = ({ email, password }) => {
  return async (dispatch) => {
    dispatch({ type: LOGIN_REQUEST });
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      const data = response.data;
      
      if (data.token) localStorage.setItem('token', data.token);
      if (data.userId) {
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
      
      dispatch({ type: LOGIN_SUCCESS, payload: data });
      return { payload: data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.response?.data || 'Login failed';
      dispatch({ type: LOGIN_FAILURE, payload: errorMessage });
      throw errorMessage;
    }
  };
};

// ========== REGISTER ==========
export const registerUser = (userData) => {
  return async (dispatch) => {
    dispatch({ type: REGISTER_REQUEST });
    try {
      const response = await apiClient.post('/auth/register', userData);
      const data = response.data;
      
      if (data.token) localStorage.setItem('token', data.token);
      if (data.userId) {
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
      
      dispatch({ type: REGISTER_SUCCESS, payload: data });
      return { payload: data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.response?.data || 'Registration failed';
      dispatch({ type: REGISTER_FAILURE, payload: errorMessage });
      throw errorMessage;
    }
  };
};

// ========== LOGOUT ==========
export const logoutUser = () => {
  return async (dispatch) => {
    dispatch({ type: LOGOUT_REQUEST });
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      dispatch({ type: LOGOUT_SUCCESS });
      return { payload: null };
    } catch (error) {
      const errorMessage = error.message || 'Logout failed';
      dispatch({ type: LOGOUT_FAILURE, payload: errorMessage });
      throw error;
    }
  };
};

// ========== CLEAR ERROR ==========
export const clearAuthError = () => ({
  type: CLEAR_AUTH_ERROR,
});
