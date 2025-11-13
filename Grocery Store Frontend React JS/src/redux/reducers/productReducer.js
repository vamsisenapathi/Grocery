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

const initialState = {
  products: [],
  currentProduct: null,
  searchResults: [],
  loading: false,
  error: null,
};

const productReducer = (state = initialState, action) => {
  switch (action.type) {
    // ========== FETCH PRODUCTS ==========
    case FETCH_PRODUCTS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case FETCH_PRODUCTS_SUCCESS:
      return {
        ...state,
        loading: false,
        products: action.payload,
      };

    case FETCH_PRODUCTS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // ========== FETCH PRODUCT BY ID ==========
    case FETCH_PRODUCT_BY_ID_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case FETCH_PRODUCT_BY_ID_SUCCESS:
      return {
        ...state,
        loading: false,
        currentProduct: action.payload,
      };

    case FETCH_PRODUCT_BY_ID_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // ========== SEARCH PRODUCTS ==========
    case SEARCH_PRODUCTS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case SEARCH_PRODUCTS_SUCCESS:
      return {
        ...state,
        loading: false,
        searchResults: action.payload,
      };

    case SEARCH_PRODUCTS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default productReducer;
