import {
  FETCH_ORDERS_REQUEST,
  FETCH_ORDERS_SUCCESS,
  FETCH_ORDERS_FAILURE,
  FETCH_ORDER_BY_ID_REQUEST,
  FETCH_ORDER_BY_ID_SUCCESS,
  FETCH_ORDER_BY_ID_FAILURE,
  CREATE_ORDER_REQUEST,
  CREATE_ORDER_SUCCESS,
  CREATE_ORDER_FAILURE,
  CANCEL_ORDER_REQUEST,
  CANCEL_ORDER_SUCCESS,
  CANCEL_ORDER_FAILURE,
} from '../actionTypes';

const initialState = {
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,
};

const orderReducer = (state = initialState, action) => {
  switch (action.type) {
    // ========== FETCH ORDERS ==========
    case FETCH_ORDERS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case FETCH_ORDERS_SUCCESS:
      return {
        ...state,
        loading: false,
        orders: action.payload,
      };

    case FETCH_ORDERS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // ========== FETCH ORDER BY ID ==========
    case FETCH_ORDER_BY_ID_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case FETCH_ORDER_BY_ID_SUCCESS:
      return {
        ...state,
        loading: false,
        currentOrder: action.payload,
      };

    case FETCH_ORDER_BY_ID_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // ========== CREATE ORDER ==========
    case CREATE_ORDER_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case CREATE_ORDER_SUCCESS:
      return {
        ...state,
        loading: false,
        orders: [action.payload, ...state.orders],
        currentOrder: action.payload,
      };

    case CREATE_ORDER_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // ========== CANCEL ORDER ==========
    case CANCEL_ORDER_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case CANCEL_ORDER_SUCCESS:
      const cancelIndex = state.orders.findIndex(order => order.id === action.payload.id);
      const updatedOrders = [...state.orders];
      if (cancelIndex !== -1) {
        updatedOrders[cancelIndex] = action.payload;
      }
      return {
        ...state,
        loading: false,
        orders: updatedOrders,
        currentOrder: state.currentOrder?.id === action.payload.id ? action.payload : state.currentOrder,
      };

    case CANCEL_ORDER_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default orderReducer;
