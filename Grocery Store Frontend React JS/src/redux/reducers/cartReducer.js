import {
  FETCH_CART_REQUEST,
  FETCH_CART_SUCCESS,
  FETCH_CART_FAILURE,
  ADD_TO_CART_REQUEST,
  ADD_TO_CART_SUCCESS,
  ADD_TO_CART_FAILURE,
  UPDATE_CART_ITEM_REQUEST,
  UPDATE_CART_ITEM_SUCCESS,
  UPDATE_CART_ITEM_FAILURE,
  REMOVE_FROM_CART_REQUEST,
  REMOVE_FROM_CART_SUCCESS,
  REMOVE_FROM_CART_FAILURE,
  CLEAR_CART,
  CLEAR_CART_ERROR,
  ADD_ITEM_LOCALLY,
  UPDATE_ITEM_LOCALLY,
  REMOVE_ITEM_LOCALLY,
} from "../actionTypes";

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
    sum + (item.subtotal || (item.priceAtAdd || 0) * (item.quantity || 0)), 0
  );
  return { totalItems, totalAmount };
};

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    // 🔹 FETCH CART
    case FETCH_CART_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case FETCH_CART_SUCCESS:
      const fetchedItems = action.payload.items || [];
      return {
        ...state,
        loading: false,
        items: fetchedItems,
        totalItems: action.payload.totalItems || action.payload.totalQuantity || 0,
        totalAmount: action.payload.totalPrice || 0,
        lastUpdated: new Date().toISOString(),
        error: null,
      };

    case FETCH_CART_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // 🔹 ADD TO CART
    case ADD_TO_CART_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case ADD_TO_CART_SUCCESS:
      const { item, isUpdate } = action.payload;
      let updatedItems;
      
      if (isUpdate) {
        // Update existing item
        updatedItems = state.items.map(existingItem => 
          existingItem.productId === item.productId ? item : existingItem
        );
      } else {
        // Add new item
        updatedItems = [...state.items, item];
      }
      
      const addTotals = calculateTotals(updatedItems);
      return {
        ...state,
        loading: false,
        items: updatedItems,
        totalItems: addTotals.totalItems,
        totalAmount: addTotals.totalAmount,
        lastUpdated: new Date().toISOString(),
        error: null,
      };

    case ADD_TO_CART_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // 🔹 UPDATE CART ITEM
    case UPDATE_CART_ITEM_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case UPDATE_CART_ITEM_SUCCESS:
      const updatedItemsList = state.items.map(item => 
        item.id === action.payload.id ? { ...item, ...action.payload } : item
      );
      const updateTotals = calculateTotals(updatedItemsList);
      return {
        ...state,
        loading: false,
        items: updatedItemsList,
        totalItems: updateTotals.totalItems,
        totalAmount: updateTotals.totalAmount,
        lastUpdated: new Date().toISOString(),
        error: null,
      };

    case UPDATE_CART_ITEM_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // 🔹 REMOVE FROM CART
    case REMOVE_FROM_CART_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case REMOVE_FROM_CART_SUCCESS:
      const filteredItems = state.items.filter(item => item.id !== action.payload);
      const removeTotals = calculateTotals(filteredItems);
      return {
        ...state,
        loading: false,
        items: filteredItems,
        totalItems: removeTotals.totalItems,
        totalAmount: removeTotals.totalAmount,
        lastUpdated: new Date().toISOString(),
        error: null,
      };

    case REMOVE_FROM_CART_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // 🔹 LOCAL CART OPERATIONS
    case ADD_ITEM_LOCALLY:
      const { product, quantity = 1 } = action.payload;
      const existingItem = state.items.find(item => item.productId === product.id);
      let localAddItems;
      
      if (existingItem) {
        localAddItems = state.items.map(item => 
          item.productId === product.id 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        localAddItems = [...state.items, {
          id: Date.now(), // Temporary ID
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: quantity,
          image: product.image,
        }];
      }
      
      const localAddTotals = calculateTotals(localAddItems);
      return {
        ...state,
        items: localAddItems,
        totalItems: localAddTotals.totalItems,
        totalAmount: localAddTotals.totalAmount,
        lastUpdated: new Date().toISOString(),
      };

    case UPDATE_ITEM_LOCALLY:
      const { itemId, quantity: newQuantity } = action.payload;
      let localUpdateItems;
      
      if (newQuantity <= 0) {
        localUpdateItems = state.items.filter(item => item.id !== itemId);
      } else {
        localUpdateItems = state.items.map(item => 
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        );
      }
      
      const localUpdateTotals = calculateTotals(localUpdateItems);
      return {
        ...state,
        items: localUpdateItems,
        totalItems: localUpdateTotals.totalItems,
        totalAmount: localUpdateTotals.totalAmount,
        lastUpdated: new Date().toISOString(),
      };

    case REMOVE_ITEM_LOCALLY:
      const localRemoveItems = state.items.filter(item => item.id !== action.payload);
      const localRemoveTotals = calculateTotals(localRemoveItems);
      return {
        ...state,
        items: localRemoveItems,
        totalItems: localRemoveTotals.totalItems,
        totalAmount: localRemoveTotals.totalAmount,
        lastUpdated: new Date().toISOString(),
      };

    // 🔹 UTILITY ACTIONS
    case CLEAR_CART:
      return {
        ...state,
        items: [],
        totalItems: 0,
        totalAmount: 0,
        lastUpdated: null,
      };

    case CLEAR_CART_ERROR:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

export default cartReducer;