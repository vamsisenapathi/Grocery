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
  CLEAR_REGISTRATION_SUCCESS,
  UPDATE_TOKEN,
  FORCE_LOGOUT,
} from "../actionTypes";

import { TokenService } from "../../apiActions";

const initialState = {
  user: TokenService.getUser(),
  token: TokenService.getToken(),
  isAuthenticated: !!TokenService.getToken(),
  loading: false,
  error: null,
  registrationSuccess: false,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    // 🔹 REGISTER CASES
    case REGISTER_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        registrationSuccess: false,
      };

    case REGISTER_SUCCESS:
      return {
        ...state,
        loading: false,
        registrationSuccess: true,
        error: null,
      };

    case REGISTER_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        registrationSuccess: false,
      };

    // 🔹 LOGIN CASES
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
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        error: null,
      };

    case LOGIN_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        isAuthenticated: false,
        user: null,
        token: null,
      };

    // 🔹 LOGOUT CASES
    case LOGOUT_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case LOGOUT_SUCCESS:
    case FORCE_LOGOUT:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: action.type === FORCE_LOGOUT ? "Session expired. Please login again." : null,
      };

    case LOGOUT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // 🔹 UTILITY CASES
    case CLEAR_AUTH_ERROR:
      return {
        ...state,
        error: null,
      };

    case CLEAR_REGISTRATION_SUCCESS:
      return {
        ...state,
        registrationSuccess: false,
      };

    case UPDATE_TOKEN:
      return {
        ...state,
        token: action.payload,
        isAuthenticated: true,
      };

    default:
      return state;
  }
};

export default authReducer;