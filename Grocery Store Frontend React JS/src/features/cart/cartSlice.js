import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { cartAPI } from '../../apiActions';

// Initial state
const initialState = {
  items: [],
  loading: false,
  error: null,
  totalItems: 0,
  totalAmount: 0,
  lastUpdated: null,
};

// Helper function to calculate totals
const calculateTotals = (items) => {
  const totalItems = items.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const totalAmount = items.reduce((sum, item) => 
    sum + ((item.price || 0) * (item.quantity || 0)), 0
  );
  return { totalItems, totalAmount };
};

// Async thunks
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await cartAPI.getCart(userId);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch cart'
      );
    }
  }
);

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ userId, product, quantity = 1 }, { rejectWithValue, getState }) => {
    try {
      // Check if item already exists in cart
      const { cart } = getState();
      const existingItem = cart.items.find(item => item.productId === product.id);
      
      if (existingItem) {
        // If item exists, update quantity
        const newQuantity = existingItem.quantity + quantity;
        const response = await cartAPI.updateItem(userId, existingItem.id, newQuantity);
        return { ...response.data, isUpdate: true };
      } else {
        // Add new item
        const cartItem = {
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: quantity,
          image: product.image,
        };
        const response = await cartAPI.addItem(userId, cartItem);
        return { ...response.data, isUpdate: false };
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to add item to cart'
      );
    }
  }
);

export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ userId, itemId, quantity }, { rejectWithValue }) => {
    try {
      const response = await cartAPI.updateItem(userId, itemId, quantity);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update cart item'
      );
    }
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async ({ userId, itemId }, { rejectWithValue }) => {
    try {
      await cartAPI.removeItem(userId, itemId);
      return itemId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to remove item from cart'
      );
    }
  }
);

// Slice
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.totalAmount = 0;
      state.lastUpdated = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    // Local cart operations (for optimistic updates)
    addItemLocally: (state, action) => {
      const { product, quantity = 1 } = action.payload;
      const existingItem = state.items.find(item => item.productId === product.id);
      
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({
          id: Date.now(), // Temporary ID
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: quantity,
          image: product.image,
        });
      }
      
      const totals = calculateTotals(state.items);
      state.totalItems = totals.totalItems;
      state.totalAmount = totals.totalAmount;
      state.lastUpdated = new Date().toISOString();
    },
    updateItemLocally: (state, action) => {
      const { itemId, quantity } = action.payload;
      const item = state.items.find(item => item.id === itemId);
      
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter(item => item.id !== itemId);
        } else {
          item.quantity = quantity;
        }
        
        const totals = calculateTotals(state.items);
        state.totalItems = totals.totalItems;
        state.totalAmount = totals.totalAmount;
        state.lastUpdated = new Date().toISOString();
      }
    },
    removeItemLocally: (state, action) => {
      const itemId = action.payload;
      state.items = state.items.filter(item => item.id !== itemId);
      
      const totals = calculateTotals(state.items);
      state.totalItems = totals.totalItems;
      state.totalAmount = totals.totalAmount;
      state.lastUpdated = new Date().toISOString();
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items || [];
        const totals = calculateTotals(state.items);
        state.totalItems = totals.totalItems;
        state.totalAmount = totals.totalAmount;
        state.lastUpdated = new Date().toISOString();
        state.error = null;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add to cart
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        const { isUpdate, ...itemData } = action.payload;
        
        if (isUpdate) {
          // Update existing item
          const existingItem = state.items.find(item => item.id === itemData.id);
          if (existingItem) {
            Object.assign(existingItem, itemData);
          }
        } else {
          // Add new item
          state.items.push(itemData);
        }
        
        const totals = calculateTotals(state.items);
        state.totalItems = totals.totalItems;
        state.totalAmount = totals.totalAmount;
        state.lastUpdated = new Date().toISOString();
        state.error = null;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update cart item
      .addCase(updateCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.loading = false;
        const updatedItem = action.payload;
        const existingItem = state.items.find(item => item.id === updatedItem.id);
        
        if (existingItem) {
          Object.assign(existingItem, updatedItem);
        }
        
        const totals = calculateTotals(state.items);
        state.totalItems = totals.totalItems;
        state.totalAmount = totals.totalAmount;
        state.lastUpdated = new Date().toISOString();
        state.error = null;
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Remove from cart
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false;
        const itemId = action.payload;
        state.items = state.items.filter(item => item.id !== itemId);
        
        const totals = calculateTotals(state.items);
        state.totalItems = totals.totalItems;
        state.totalAmount = totals.totalAmount;
        state.lastUpdated = new Date().toISOString();
        state.error = null;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearCart,
  clearError,
  addItemLocally,
  updateItemLocally,
  removeItemLocally,
} = cartSlice.actions;

export default cartSlice.reducer;