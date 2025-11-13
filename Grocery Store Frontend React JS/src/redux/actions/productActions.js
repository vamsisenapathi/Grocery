import {
  FETCH_PRODUCTS_REQUEST,
  FETCH_PRODUCTS_SUCCESS,
  FETCH_PRODUCTS_FAILURE,
  FETCH_PRODUCT_BY_ID_REQUEST,
  FETCH_PRODUCT_BY_ID_SUCCESS,
  FETCH_PRODUCT_BY_ID_FAILURE,
  SEARCH_PRODUCTS_REQUEST,
  SEARCH_PRODUCTS_SUCCESS,
  SEARCH_PRODUCTS_FAILURE,
} from '../actionTypes';
import apiClient from '../../apiActions/baseApi';

// ========== FETCH PRODUCTS ==========
export const fetchProducts = () => {
  return async (dispatch) => {
    dispatch({ type: FETCH_PRODUCTS_REQUEST });
    try {
      const response = await apiClient.get('/products');
      dispatch({ type: FETCH_PRODUCTS_SUCCESS, payload: response.data || [] });
      return { payload: response.data || [] };
    } catch (error) {
      const errorMessage = error.response?.data || 'Failed to fetch products';
      dispatch({ type: FETCH_PRODUCTS_FAILURE, payload: errorMessage });
      throw error;
    }
  };
};

// ========== FETCH PRODUCT BY ID ==========
export const fetchProductById = (productId) => {
  return async (dispatch) => {
    dispatch({ type: FETCH_PRODUCT_BY_ID_REQUEST });
    try {
      const response = await apiClient.get(`/products/${productId}`);
      dispatch({ type: FETCH_PRODUCT_BY_ID_SUCCESS, payload: response.data });
      return { payload: response.data };
    } catch (error) {
      const errorMessage = error.response?.data || 'Failed to fetch product';
      dispatch({ type: FETCH_PRODUCT_BY_ID_FAILURE, payload: errorMessage });
      throw error;
    }
  };
};

// ========== SEARCH PRODUCTS ==========
export const searchProducts = (searchTerm) => {
  return async (dispatch) => {
    dispatch({ type: SEARCH_PRODUCTS_REQUEST });
    try {
      const response = await apiClient.get(`/products/search?q=${searchTerm}`);
      dispatch({ type: SEARCH_PRODUCTS_SUCCESS, payload: response.data || [] });
      return { payload: response.data || [] };
    } catch (error) {
      const errorMessage = error.response?.data || 'Failed to search products';
      dispatch({ type: SEARCH_PRODUCTS_FAILURE, payload: errorMessage });
      throw error;
    }
  };
};
