import {
  FETCH_CATEGORIES_REQUEST,
  FETCH_CATEGORIES_SUCCESS,
  FETCH_CATEGORIES_FAILURE,
  FETCH_CATEGORY_BY_ID_REQUEST,
  FETCH_CATEGORY_BY_ID_SUCCESS,
  FETCH_CATEGORY_BY_ID_FAILURE,
} from '../actionTypes';

const initialState = {
  categories: [],
  categoryProducts: {},
  loading: false,
  error: null,
};

const categoryReducer = (state = initialState, action) => {
  switch (action.type) {
    // ========== FETCH CATEGORIES ==========
    case FETCH_CATEGORIES_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case FETCH_CATEGORIES_SUCCESS:
      return {
        ...state,
        loading: false,
        categories: action.payload,
      };

    case FETCH_CATEGORIES_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // ========== FETCH CATEGORY PRODUCTS ==========
    case FETCH_CATEGORY_BY_ID_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case FETCH_CATEGORY_BY_ID_SUCCESS:
      const { categoryName, products } = action.payload;
      return {
        ...state,
        loading: false,
        categoryProducts: {
          ...state.categoryProducts,
          [categoryName]: products
        },
      };

    case FETCH_CATEGORY_BY_ID_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default categoryReducer;
