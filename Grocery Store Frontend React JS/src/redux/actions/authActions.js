import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  REGISTER_FAILURE,
  LOGOUT_REQUEST,
  LOGOUT_SUCCESS,
  CLEAR_AUTH_ERROR,
  CLEAR_REGISTRATION_SUCCESS,
  UPDATE_TOKEN,
  FORCE_LOGOUT,
} from "../actionTypes";

import { authAPI, TokenService } from "../../apiActions";
import { fetchCart } from "./cartActions";

// ✅ Register User
export const registerUser = (userData) => {
  return async (dispatch) => {
    dispatch({ type: REGISTER_REQUEST });

    try {
      // Call the real API according to the JWT documentation
      const response = await authAPI.register(userData);
      
      // Store JWT token and user data
      TokenService.setToken(response.token);
      TokenService.setUser(response);
      
      dispatch({
        type: REGISTER_SUCCESS,
        payload: response,
      });
    } catch (error) {
      let errorMessage = "Registration failed";
      
      if (error.response?.status === 409) {
        errorMessage = "Email already registered";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.validationErrors) {
        const validationErrors = Object.values(error.response.data.validationErrors);
        errorMessage = validationErrors.join(", ");
      }
      
      dispatch({
        type: REGISTER_FAILURE,
        payload: errorMessage,
      });
    }
  };
};

// ✅ Login User
export const loginUser = (credentials) => {
  return async (dispatch) => {
    dispatch({ type: LOGIN_REQUEST });

    try {
      const response = await authAPI.login(credentials);
      
      // Store JWT token and user data according to new format
      TokenService.setToken(response.token);
      TokenService.setUser(response);
      
      dispatch({
        type: LOGIN_SUCCESS,
        payload: { 
          user: response,
          token: response.token 
        },
      });
      
      // Fetch cart after successful login
      if (response.userId) {
        dispatch(fetchCart(response.userId));
      }
    } catch (error) {
      let errorMessage = "Login failed";
      
      if (error.response?.status === 401) {
        errorMessage = "Invalid email or password";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      dispatch({
        type: LOGIN_FAILURE,
        payload: errorMessage,
      });
    }
  };
};

// ✅ Logout User
export const logoutUser = () => {
  return async (dispatch) => {
    dispatch({ type: LOGOUT_REQUEST });

    try {
      // Clear stored authentication data
      TokenService.clearAuth();
      
      dispatch({ type: LOGOUT_SUCCESS });
    } catch (error) {
      console.warn("Logout failed:", error);
      // Still clear local data
      TokenService.clearAuth();
      dispatch({ type: LOGOUT_SUCCESS });
    }
  };
};

// ✅ Clear Auth Error
export const clearAuthError = () => ({
  type: CLEAR_AUTH_ERROR,
});

// ✅ Clear Registration Success
export const clearRegistrationSuccess = () => ({
  type: CLEAR_REGISTRATION_SUCCESS,
});

// ✅ Update Token (for interceptor use)
export const updateToken = (token) => ({
  type: UPDATE_TOKEN,
  payload: token,
});

// ✅ Force Logout (for interceptor use)
export const forceLogout = () => ({
  type: FORCE_LOGOUT,
});