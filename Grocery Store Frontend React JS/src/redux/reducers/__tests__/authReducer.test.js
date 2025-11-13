import authReducer from '../authReducer';
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
} from '../../actionTypes';

describe('Auth Reducer', () => {
  const initialState = {
    user: null,
    token: null,
    loading: false,
    error: null,
    isAuthenticated: false,
  };

  it('should return the initial state', () => {
    expect(authReducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  describe('LOGIN actions', () => {
    it('should handle LOGIN_REQUEST', () => {
      const action = { type: LOGIN_REQUEST };
      const expectedState = {
        ...initialState,
        loading: true,
        error: null,
      };
      expect(authReducer(initialState, action)).toEqual(expectedState);
    });

    it('should handle LOGIN_SUCCESS', () => {
      const userData = {
        userId: 'user123',
        name: 'Test User',
        email: 'test@example.com',
        phoneNumber: '+919876543210',
        token: 'mock-token',
      };
      const action = { type: LOGIN_SUCCESS, payload: userData };
      const expectedState = {
        ...initialState,
        loading: false,
        isAuthenticated: true,
        user: {
          userId: userData.userId,
          id: userData.userId,
          name: userData.name,
          email: userData.email,
          phoneNumber: userData.phoneNumber,
          createdAt: undefined,
        },
        token: userData.token,
      };
      expect(authReducer(initialState, action)).toEqual(expectedState);
    });

    it('should handle LOGIN_FAILURE', () => {
      const errorMessage = 'Invalid credentials';
      const action = { type: LOGIN_FAILURE, payload: errorMessage };
      const expectedState = {
        ...initialState,
        loading: false,
        error: errorMessage,
      };
      expect(authReducer(initialState, action)).toEqual(expectedState);
    });
  });

  describe('REGISTER actions', () => {
    it('should handle REGISTER_REQUEST', () => {
      const action = { type: REGISTER_REQUEST };
      const expectedState = {
        ...initialState,
        loading: true,
        error: null,
      };
      expect(authReducer(initialState, action)).toEqual(expectedState);
    });

    it('should handle REGISTER_SUCCESS', () => {
      const userData = {
        userId: 'user123',
        name: 'New User',
        email: 'new@example.com',
        phoneNumber: '+919876543210',
        token: 'new-token',
      };
      const action = { type: REGISTER_SUCCESS, payload: userData };
      const expectedState = {
        ...initialState,
        loading: false,
        isAuthenticated: true,
        user: {
          userId: userData.userId,
          id: userData.userId,
          name: userData.name,
          email: userData.email,
          phoneNumber: userData.phoneNumber,
          createdAt: undefined,
        },
        token: userData.token,
      };
      expect(authReducer(initialState, action)).toEqual(expectedState);
    });

    it('should handle REGISTER_FAILURE', () => {
      const errorMessage = 'Email already exists';
      const action = { type: REGISTER_FAILURE, payload: errorMessage };
      const expectedState = {
        ...initialState,
        loading: false,
        error: errorMessage,
      };
      expect(authReducer(initialState, action)).toEqual(expectedState);
    });
  });

  describe('LOGOUT action', () => {
    it('should handle LOGOUT_SUCCESS and reset to initial state', () => {
      const loggedInState = {
        user: { userId: 'user123', name: 'Test User' },
        token: 'mock-token',
        loading: false,
        error: null,
        isAuthenticated: true,
      };
      const action = { type: LOGOUT_SUCCESS };
      const expectedState = {
        ...initialState,
        loading: false,
        isAuthenticated: false,
        user: null,
        token: null,
        error: null,
      };
      expect(authReducer(loggedInState, action)).toEqual(expectedState);
    });
  });

  describe('CLEAR_AUTH_ERROR action', () => {
    it('should clear the error', () => {
      const stateWithError = {
        ...initialState,
        error: 'Some error',
      };
      const action = { type: CLEAR_AUTH_ERROR };
      const expectedState = {
        ...initialState,
        error: null,
      };
      expect(authReducer(stateWithError, action)).toEqual(expectedState);
    });
  });

  it('should return current state for unknown action', () => {
    const action = { type: 'UNKNOWN_ACTION' };
    expect(authReducer(initialState, action)).toEqual(initialState);
  });
});
