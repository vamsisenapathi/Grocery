import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  REGISTER_FAILURE,
  LOGOUT_REQUEST,
  LOGOUT_SUCCESS,
  LOGOUT_FAILURE,
  CLEAR_AUTH_ERROR,
} from '../actionTypes';

const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
  error: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    // ========== LOGIN ==========
    case LOGIN_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: {
          userId: action.payload.userId,
          id: action.payload.userId,
          name: action.payload.name,
          email: action.payload.email,
          phoneNumber: action.payload.phoneNumber,
          createdAt: action.payload.createdAt,
        },
        token: action.payload.token,
        error: null,
      };

    case LOGIN_FAILURE:
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        user: null,
        token: null,
        error: action.payload?.message || action.payload || 'Login failed',
      };

    // ========== REGISTER ==========
    case REGISTER_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case REGISTER_SUCCESS:
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: {
          userId: action.payload.userId,
          id: action.payload.userId,
          name: action.payload.name,
          email: action.payload.email,
          phoneNumber: action.payload.phoneNumber,
          createdAt: action.payload.createdAt,
        },
        token: action.payload.token,
        error: null,
      };

    case REGISTER_FAILURE:
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        user: null,
        token: null,
        error: action.payload?.message || action.payload || 'Registration failed',
      };

    // ========== LOGOUT ==========
    case LOGOUT_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case LOGOUT_SUCCESS:
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        user: null,
        token: null,
        error: null,
      };

    case LOGOUT_FAILURE:
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        user: null,
        token: null,
        error: action.payload,
      };

    // ========== CLEAR ERROR ==========
    case CLEAR_AUTH_ERROR:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

export default authReducer;
