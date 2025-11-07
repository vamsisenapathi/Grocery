import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { productAPI } from '../../apiActions';

// Initial state
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
  categories: ['Fruits', 'Vegetables', 'Dairy', 'Snacks', 'Beverages', 'Meat'],
};

// Async thunks
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await productAPI.getAllProducts();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch products'
      );
    }
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await productAPI.getProductById(productId);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch product'
      );
    }
  }
);

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
  if (filters.category) {
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

// Slice
const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setSearchTerm: (state, action) => {
      state.filters.searchTerm = action.payload;
      state.filteredProducts = applyFilters(state.products, state.filters);
    },
    setCategory: (state, action) => {
      state.filters.category = action.payload;
      state.filteredProducts = applyFilters(state.products, state.filters);
    },
    setSortBy: (state, action) => {
      state.filters.sortBy = action.payload;
      state.filteredProducts = applyFilters(state.products, state.filters);
    },
    clearFilters: (state) => {
      state.filters = {
        searchTerm: '',
        category: '',
        sortBy: 'name',
      };
      state.filteredProducts = applyFilters(state.products, state.filters);
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
        state.filteredProducts = applyFilters(action.payload, state.filters);
        state.error = null;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch single product
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProduct = action.payload;
        state.error = null;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setSearchTerm,
  setCategory,
  setSortBy,
  clearFilters,
  clearError,
} = productSlice.actions;

export default productSlice.reducer;