import {
  FETCH_PRODUCTS_REQUEST,
  FETCH_PRODUCTS_SUCCESS,
  FETCH_PRODUCTS_FAILURE,
  FETCH_PRODUCT_BY_ID_REQUEST,
  FETCH_PRODUCT_BY_ID_SUCCESS,
  FETCH_PRODUCT_BY_ID_FAILURE,
  SET_SEARCH_TERM,
  SET_CATEGORY,
  SET_SORT_BY,
  CLEAR_FILTERS,
  CLEAR_PRODUCT_ERROR,
  FETCH_CATEGORIES_REQUEST,
  FETCH_CATEGORIES_SUCCESS,
  FETCH_CATEGORIES_FAILURE,
} from "../actionTypes";

import { categoryAPI, productAPI, apiClient } from "../../apiActions";

// ✅ Fetch All Products
export const fetchProducts = () => {
  return async (dispatch) => {
    dispatch({ type: FETCH_PRODUCTS_REQUEST });

    try {
      console.log('🔍 Fetching all products from API...');
      
      const response = await productAPI.getAllProducts();
      
      console.log('✅ Products API response:', response);
      console.log('Number of products:', response?.length || 0);
      
      dispatch({
        type: FETCH_PRODUCTS_SUCCESS,
        payload: response,
      });
    } catch (error) {
      console.error("❌ Error fetching products:", error);
      console.error("Error response:", error.response);
      console.error("Error message:", error.message);
      
      dispatch({
        type: FETCH_PRODUCTS_FAILURE,
        payload: error.response?.data?.message || "Failed to fetch products",
      });
    }
  };
};

// ✅ Fetch Products by Category (uses dedicated category endpoints)
export const fetchProductsByCategory = (category) => {
  return async (dispatch) => {
    dispatch({ type: FETCH_PRODUCTS_REQUEST });

    try {
      console.log('🔍 Fetching products by category from dedicated endpoint:', category);
      
      // Use dedicated category endpoints as per new API documentation
      const response = await categoryAPI.getCategoryProducts(category);
      
      console.log('✅ Category products API response:', response);
      console.log('Number of products in category:', response?.length || 0);
      
      dispatch({
        type: FETCH_PRODUCTS_SUCCESS,
        payload: response,
      });
    } catch (error) {
      console.error("❌ Error fetching products by category:", error);
      
      // Provide more specific error messages
      let errorMessage = "Failed to fetch products by category";
      if (error.message.includes('Unsupported category')) {
        errorMessage = `Category "${category}" is not supported`;
      } else if (error.response?.status === 404) {
        errorMessage = `No products found in category "${category}"`;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      dispatch({
        type: FETCH_PRODUCTS_FAILURE,
        payload: errorMessage,
      });
    }
  };
};

// ✅ Fetch Product by ID
export const fetchProductById = (productId) => {
  return async (dispatch) => {
    dispatch({ type: FETCH_PRODUCT_BY_ID_REQUEST });

    try {
      const response = await productAPI.getById(productId);
      dispatch({
        type: FETCH_PRODUCT_BY_ID_SUCCESS,
        payload: response,
      });
    } catch (error) {
      console.error("Error fetching product by ID:", error);
      dispatch({
        type: FETCH_PRODUCT_BY_ID_FAILURE,
        payload: error.response?.data?.message || "Product not found",
      });
    }
  };
};

// ✅ Set Search Term
export const setSearchTerm = (searchTerm) => ({
  type: SET_SEARCH_TERM,
  payload: searchTerm,
});

// ✅ Set Category Filter
export const setCategory = (category) => ({
  type: SET_CATEGORY,
  payload: category,
});

// ✅ Fetch Categories from Backend
export const fetchCategories = () => {
  return async (dispatch) => {
    dispatch({ type: FETCH_CATEGORIES_REQUEST });

    try {
      console.log('📂 Fetching categories from backend...');
      const response = await apiClient.get('/categories');
      console.log('✅ Categories fetched successfully:', response.data);
      
      dispatch({
        type: FETCH_CATEGORIES_SUCCESS,
        payload: response.data,
      });
    } catch (error) {
      console.error('❌ Fetch categories failed:', error);
      let errorMessage = "Failed to fetch categories";
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.request) {
        errorMessage = "Cannot connect to server. Please check if the backend is running.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      dispatch({
        type: FETCH_CATEGORIES_FAILURE,
        payload: errorMessage,
      });
    }
  };
};

// ✅ Set Sort By
export const setSortBy = (sortBy) => ({
  type: SET_SORT_BY,
  payload: sortBy,
});

// ✅ Clear All Filters
export const clearFilters = () => ({
  type: CLEAR_FILTERS,
});

// ✅ Clear Product Error
export const clearProductError = () => ({
  type: CLEAR_PRODUCT_ERROR,
});