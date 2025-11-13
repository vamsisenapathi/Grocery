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
  REMOVE_CART_ITEM_REQUEST,
  REMOVE_CART_ITEM_SUCCESS,
  REMOVE_CART_ITEM_FAILURE,
  CLEAR_CART_REQUEST,
  CLEAR_CART_SUCCESS,
  CLEAR_CART_FAILURE,
} from '../actionTypes';
import { LOGIN_SUCCESS, LOGOUT_SUCCESS } from '../actionTypes';

const initialState = {
  items: [],
  totalAmount: 0,
  loading: false,
  error: null,
};

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    // ========== FETCH CART ==========
    case FETCH_CART_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case FETCH_CART_SUCCESS:
      const fetchItems = action.payload.items || [];
      return {
        ...state,
        loading: false,
        items: fetchItems.map(item => ({
          ...item,
          id: item.cartItemId || item.id
        })),
        totalAmount: action.payload.totalPrice || action.payload.totalAmount || 0,
      };

    case FETCH_CART_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // ========== ADD TO CART ==========
    case ADD_TO_CART_REQUEST:
      return {
        ...state,
        error: null,
      };

    case ADD_TO_CART_SUCCESS:
      const addItems = action.payload.items || [];
      console.log('✅ Cart updated after add:', {
        itemsCount: addItems.length,
        items: addItems,
        totalAmount: action.payload.totalPrice || action.payload.totalAmount || 0
      });
      return {
        ...state,
        loading: false,
        items: addItems.map(item => ({
          ...item,
          id: item.cartItemId || item.id
        })),
        totalAmount: action.payload.totalPrice || action.payload.totalAmount || 0,
      };

    case ADD_TO_CART_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // ========== UPDATE CART ITEM ==========
    case UPDATE_CART_ITEM_REQUEST:
      return {
        ...state,
        error: null,
      };

    case UPDATE_CART_ITEM_SUCCESS:
      const updateItems = action.payload.items || [];
      return {
        ...state,
        loading: false,
        items: updateItems.map(item => ({
          ...item,
          id: item.cartItemId || item.id
        })),
        totalAmount: action.payload.totalPrice || action.payload.totalAmount || 0,
      };

    case UPDATE_CART_ITEM_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // ========== REMOVE CART ITEM ==========
    case REMOVE_CART_ITEM_REQUEST:
      return {
        ...state,
        error: null,
      };

    case REMOVE_CART_ITEM_SUCCESS:
      const removeItems = action.payload.items || [];
      return {
        ...state,
        loading: false,
        items: removeItems.map(item => ({
          ...item,
          id: item.cartItemId || item.id
        })),
        totalAmount: action.payload.totalPrice || action.payload.totalAmount || 0,
      };

    case REMOVE_CART_ITEM_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // ========== CLEAR CART ==========
    case CLEAR_CART_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case CLEAR_CART_SUCCESS:
      return {
        ...state,
        loading: false,
        items: [],
        totalAmount: 0,
      };

    case CLEAR_CART_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // ========== AUTH ACTIONS (Clear cart on logout) ==========
    case LOGIN_SUCCESS:

      return state;

    case LOGOUT_SUCCESS:

      return {
        ...state,
        items: [],
        totalAmount: 0,
        error: null,
      };

    default:
      return state;
  }
};

export default cartReducer;
