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

const initialState = {
  products: [],
  filteredProducts: [],
  currentProduct: null,
  loading: false,
  error: null,
  filters: {
    searchTerm: '',
    category: '',
    sortBy: 'name', // 'name', 'price-asc', 'price-desc'
  },
  categories: [], // Will be loaded dynamically from backend
};

// Helper function to apply filters
const applyFilters = (products, filters) => {
  let filtered = [...products];

  // Apply search filter
  if (filters.searchTerm) {
    const searchTerm = filters.searchTerm.toLowerCase();
    filtered = filtered.filter(product =>
      product.name?.toLowerCase().includes(searchTerm) ||
      product.description?.toLowerCase().includes(searchTerm)
    );
  }

  // Apply category filter
  if (filters.category && filters.category !== 'All') {
    filtered = filtered.filter(product => 
      product.category === filters.category
    );
  }

  // Apply sorting
  switch (filters.sortBy) {
    case 'price-asc':
      filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
      break;
    case 'price-desc':
      filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
      break;
    case 'name':
    default:
      filtered.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
      break;
  }

  return filtered;
};

const productReducer = (state = initialState, action) => {
  switch (action.type) {
    // 🔹 FETCH ALL PRODUCTS
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
        filteredProducts: applyFilters(action.payload, state.filters),
        error: null,
      };

    case FETCH_PRODUCTS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // 🔹 FETCH SINGLE PRODUCT
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
        error: null,
      };

    case FETCH_PRODUCT_BY_ID_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // 🔹 FILTER ACTIONS
    case SET_SEARCH_TERM:
      const newFiltersSearch = {
        ...state.filters,
        searchTerm: action.payload,
      };
      return {
        ...state,
        filters: newFiltersSearch,
        filteredProducts: applyFilters(state.products, newFiltersSearch),
      };

    case SET_CATEGORY:
      const newFiltersCategory = {
        ...state.filters,
        category: action.payload,
      };
      return {
        ...state,
        filters: newFiltersCategory,
        filteredProducts: applyFilters(state.products, newFiltersCategory),
      };

    case SET_SORT_BY:
      const newFiltersSort = {
        ...state.filters,
        sortBy: action.payload,
      };
      return {
        ...state,
        filters: newFiltersSort,
        filteredProducts: applyFilters(state.products, newFiltersSort),
      };

    case CLEAR_FILTERS:
      const clearedFilters = {
        searchTerm: '',
        category: '',
        sortBy: 'name',
      };
      return {
        ...state,
        filters: clearedFilters,
        filteredProducts: applyFilters(state.products, clearedFilters),
      };

    case CLEAR_PRODUCT_ERROR:
      return {
        ...state,
        error: null,
      };

    // Category actions
    case FETCH_CATEGORIES_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case FETCH_CATEGORIES_SUCCESS:
      // Transform backend categories to frontend format
      const categories = ['All', ...action.payload.map(cat => cat.name)];
      return {
        ...state,
        loading: false,
        categories: categories,
        error: null,
      };

    case FETCH_CATEGORIES_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        categories: ['All'], // Fallback to basic categories
      };

    default:
      return state;
  }
};

export default productReducer;