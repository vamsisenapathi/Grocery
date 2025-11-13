import {
  FETCH_ADDRESSES_REQUEST,
  FETCH_ADDRESSES_SUCCESS,
  FETCH_ADDRESSES_FAILURE,
  ADD_ADDRESS_REQUEST,
  ADD_ADDRESS_SUCCESS,
  ADD_ADDRESS_FAILURE,
  UPDATE_ADDRESS_REQUEST,
  UPDATE_ADDRESS_SUCCESS,
  UPDATE_ADDRESS_FAILURE,
  DELETE_ADDRESS_REQUEST,
  DELETE_ADDRESS_SUCCESS,
  DELETE_ADDRESS_FAILURE,
  SET_DEFAULT_ADDRESS_REQUEST,
  SET_DEFAULT_ADDRESS_SUCCESS,
  SET_DEFAULT_ADDRESS_FAILURE,
} from '../actionTypes';

const initialState = {
  addresses: [],
  currentAddress: null,
  loading: false,
  error: null,
};

const addressReducer = (state = initialState, action) => {
  switch (action.type) {
    // ========== FETCH ADDRESSES ==========
    case FETCH_ADDRESSES_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case FETCH_ADDRESSES_SUCCESS:
      return {
        ...state,
        loading: false,
        addresses: action.payload,
      };

    case FETCH_ADDRESSES_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // ========== ADD ADDRESS ==========
    case ADD_ADDRESS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case ADD_ADDRESS_SUCCESS:
      return {
        ...state,
        loading: false,
        addresses: [...state.addresses, action.payload],
      };

    case ADD_ADDRESS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // ========== UPDATE ADDRESS ==========
    case UPDATE_ADDRESS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case UPDATE_ADDRESS_SUCCESS:
      const updateIndex = state.addresses.findIndex(addr => addr.id === action.payload.id);
      const updatedAddresses = [...state.addresses];
      if (updateIndex !== -1) {
        updatedAddresses[updateIndex] = action.payload;
      }
      return {
        ...state,
        loading: false,
        addresses: updatedAddresses,
        currentAddress: state.currentAddress?.id === action.payload.id ? action.payload : state.currentAddress,
      };

    case UPDATE_ADDRESS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // ========== DELETE ADDRESS ==========
    case DELETE_ADDRESS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case DELETE_ADDRESS_SUCCESS:
      return {
        ...state,
        loading: false,
        addresses: state.addresses.filter(addr => addr.id !== action.payload),
        currentAddress: state.currentAddress?.id === action.payload ? null : state.currentAddress,
      };

    case DELETE_ADDRESS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // ========== SET DEFAULT ADDRESS ==========
    case SET_DEFAULT_ADDRESS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case SET_DEFAULT_ADDRESS_SUCCESS:
      return {
        ...state,
        loading: false,
        addresses: state.addresses.map(addr => ({
          ...addr,
          isDefault: addr.id === action.payload.id
        })),
      };

    case SET_DEFAULT_ADDRESS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default addressReducer;
