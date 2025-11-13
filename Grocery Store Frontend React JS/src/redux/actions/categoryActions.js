import {
  FETCH_CATEGORIES_REQUEST,
  FETCH_CATEGORIES_SUCCESS,
  FETCH_CATEGORIES_FAILURE,
  FETCH_CATEGORY_BY_ID_REQUEST,
  FETCH_CATEGORY_BY_ID_SUCCESS,
  FETCH_CATEGORY_BY_ID_FAILURE,
} from '../actionTypes';
import apiClient from '../../apiActions/baseApi';

// ========== FETCH CATEGORIES ==========
export const fetchCategories = () => {
  return async (dispatch) => {
    dispatch({ type: FETCH_CATEGORIES_REQUEST });
    try {
      // WORKAROUND: Backend /categories endpoint missing from compiled JAR
      // Extract unique categories from all products instead
      const response = await apiClient.get('/products');
      const products = response.data || [];
      
      // Extract unique category names from products
      const categorySet = new Set();
      products.forEach(product => {
        if (product.categoryName) {
          categorySet.add(product.categoryName);
        }
      });
      
      const categoryNames = Array.from(categorySet).sort();
      
      // Convert category names to category objects with name and displayName
      const categories = categoryNames.map(name => ({
        name: name.toLowerCase(),
        displayName: name
      }));
      

      dispatch({ type: FETCH_CATEGORIES_SUCCESS, payload: categories });
      return { payload: categories };
    } catch (error) {
      console.error('❌ Failed to fetch categories:', error);
      const errorMessage = error.response?.data || 'Failed to fetch categories';
      dispatch({ type: FETCH_CATEGORIES_FAILURE, payload: errorMessage });
      throw error;
    }
  };
};

// ========== FETCH CATEGORY PRODUCTS ==========
export const fetchCategoryProducts = (categoryName) => {
  return async (dispatch) => {
    dispatch({ type: FETCH_CATEGORY_BY_ID_REQUEST });
    try {
      const response = await apiClient.get(`/categories/${categoryName}`);
      const result = { categoryName, products: response.data || [] };
      dispatch({ type: FETCH_CATEGORY_BY_ID_SUCCESS, payload: result });
      return { payload: result };
    } catch (error) {
      const errorMessage = error.response?.data || 'Failed to fetch category products';
      dispatch({ type: FETCH_CATEGORY_BY_ID_FAILURE, payload: errorMessage });
      throw error;
    }
  };
};
