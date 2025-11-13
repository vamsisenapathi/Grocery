import configureMockStore from 'redux-mock-store';
import {thunk} from 'redux-thunk';
import * as authActions from '../authActions';
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
import apiClient from '../../../apiActions/baseApi';

// Create mock store
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

// Mock apiClient
jest.mock('../../../apiActions/baseApi');

describe('Auth Actions', () => {
  let store;

  beforeEach(() => {
    store = mockStore({});
    jest.clearAllMocks();
    // Clear localStorage
    localStorage.clear();
  });

  describe('loginUser', () => {
    it('should dispatch LOGIN_SUCCESS on successful login', async () => {
      const mockResponse = {
        data: {
          userId: 'user123',
          name: 'Test User',
          email: 'test@example.com',
          phoneNumber: '+919876543210',
          token: 'mock-token-123',
        },
      };

      apiClient.post.mockResolvedValue(mockResponse);

      const credentials = {
        email: 'test@example.com',
        password: 'password123',
      };

      await store.dispatch(authActions.loginUser(credentials));

      const actions = store.getActions();
      expect(actions[0]).toEqual({ type: LOGIN_REQUEST });
      expect(actions[1]).toEqual({
        type: LOGIN_SUCCESS,
        payload: mockResponse.data,
      });
      expect(localStorage.getItem('token')).toBe('mock-token-123');
    });

    it('should handle login without token', async () => {
      const mockResponse = {
        data: {
          userId: 'user123',
          name: 'Test User',
          email: 'test@example.com',
          phoneNumber: '+919876543210',
          // No token
        },
      };

      apiClient.post.mockResolvedValue(mockResponse);

      const credentials = {
        email: 'test@example.com',
        password: 'password123',
      };

      await store.dispatch(authActions.loginUser(credentials));

      const actions = store.getActions();
      expect(actions[0]).toEqual({ type: LOGIN_REQUEST });
      expect(actions[1]).toEqual({
        type: LOGIN_SUCCESS,
        payload: mockResponse.data,
      });
      expect(localStorage.getItem('token')).toBeNull();
    });

    it('should handle login without userId', async () => {
      const mockResponse = {
        data: {
          name: 'Test User',
          email: 'test@example.com',
          token: 'mock-token-123',
          // No userId
        },
      };

      apiClient.post.mockResolvedValue(mockResponse);

      const credentials = {
        email: 'test@example.com',
        password: 'password123',
      };

      await store.dispatch(authActions.loginUser(credentials));

      const actions = store.getActions();
      expect(actions[0]).toEqual({ type: LOGIN_REQUEST });
      expect(actions[1]).toEqual({
        type: LOGIN_SUCCESS,
        payload: mockResponse.data,
      });
      expect(localStorage.getItem('token')).toBe('mock-token-123');
      expect(localStorage.getItem('user')).toBeNull();
    });

    it('should dispatch LOGIN_FAILURE on login error', async () => {
      const errorResponse = {
        response: {
          data: {
            message: 'Invalid credentials',
          },
        },
      };

      apiClient.post.mockRejectedValue(errorResponse);

      const credentials = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      try {
        await store.dispatch(authActions.loginUser(credentials));
      } catch (error) {
        const actions = store.getActions();
        expect(actions[0]).toEqual({ type: LOGIN_REQUEST });
        expect(actions[1]).toEqual({
          type: LOGIN_FAILURE,
          payload: 'Invalid credentials',
        });
      }
    });

    it('should handle network errors', async () => {
      apiClient.post.mockRejectedValue(new Error('Network error'));

      const credentials = {
        email: 'test@example.com',
        password: 'password123',
      };

      try {
        await store.dispatch(authActions.loginUser(credentials));
      } catch (error) {
        const actions = store.getActions();
        expect(actions[1].type).toBe(LOGIN_FAILURE);
        expect(actions[1].payload).toBe('Login failed');
      }
    });

    it('should handle error with response.data.error field', async () => {
      const errorResponse = {
        response: {
          data: {
            error: 'Authentication failed',
          },
        },
      };

      apiClient.post.mockRejectedValue(errorResponse);

      const credentials = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      try {
        await store.dispatch(authActions.loginUser(credentials));
      } catch (error) {
        const actions = store.getActions();
        expect(actions[1].type).toBe(LOGIN_FAILURE);
        expect(actions[1].payload).toBe('Authentication failed');
      }
    });

    it('should handle error with plain response.data', async () => {
      const errorResponse = {
        response: {
          data: 'Access denied',
        },
      };

      apiClient.post.mockRejectedValue(errorResponse);

      const credentials = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      try {
        await store.dispatch(authActions.loginUser(credentials));
      } catch (error) {
        const actions = store.getActions();
        expect(actions[1].type).toBe(LOGIN_FAILURE);
        expect(actions[1].payload).toBe('Access denied');
      }
    });
  });

  describe('registerUser', () => {
    it('should dispatch REGISTER_SUCCESS on successful registration', async () => {
      const mockResponse = {
        data: {
          userId: 'user123',
          name: 'Test User',
          email: 'test@example.com',
          phoneNumber: '+919876543210',
          message: 'Registration successful',
        },
      };

      apiClient.post.mockResolvedValue(mockResponse);

      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        phoneNumber: '+919876543210',
        password: 'password123',
      };

      await store.dispatch(authActions.registerUser(userData));

      const actions = store.getActions();
      expect(actions[0]).toEqual({ type: REGISTER_REQUEST });
      expect(actions[1]).toEqual({
        type: REGISTER_SUCCESS,
        payload: mockResponse.data,
      });
    });

    it('should handle registration without token', async () => {
      const mockResponse = {
        data: {
          userId: 'user123',
          name: 'Test User',
          email: 'test@example.com',
          phoneNumber: '+919876543210',
          message: 'Registration successful',
          // No token
        },
      };

      apiClient.post.mockResolvedValue(mockResponse);

      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        phoneNumber: '+919876543210',
        password: 'password123',
      };

      await store.dispatch(authActions.registerUser(userData));

      const actions = store.getActions();
      expect(actions[0]).toEqual({ type: REGISTER_REQUEST });
      expect(actions[1]).toEqual({
        type: REGISTER_SUCCESS,
        payload: mockResponse.data,
      });
      expect(localStorage.getItem('token')).toBeNull();
    });

    it('should handle registration without userId', async () => {
      const mockResponse = {
        data: {
          name: 'Test User',
          email: 'test@example.com',
          token: 'mock-token-123',
          message: 'Registration successful',
          // No userId
        },
      };

      apiClient.post.mockResolvedValue(mockResponse);

      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        phoneNumber: '+919876543210',
        password: 'password123',
      };

      await store.dispatch(authActions.registerUser(userData));

      const actions = store.getActions();
      expect(actions[0]).toEqual({ type: REGISTER_REQUEST });
      expect(actions[1]).toEqual({
        type: REGISTER_SUCCESS,
        payload: mockResponse.data,
      });
      expect(localStorage.getItem('token')).toBe('mock-token-123');
      expect(localStorage.getItem('user')).toBeNull();
    });

    it('should dispatch REGISTER_FAILURE on registration error', async () => {
      const errorResponse = {
        response: {
          data: {
            message: 'Email already exists',
          },
        },
      };

      apiClient.post.mockRejectedValue(errorResponse);

      const userData = {
        name: 'Test User',
        email: 'existing@example.com',
        phoneNumber: '+919876543210',
        password: 'password123',
      };

      try {
        await store.dispatch(authActions.registerUser(userData));
      } catch (error) {
        const actions = store.getActions();
        expect(actions[0]).toEqual({ type: REGISTER_REQUEST });
        expect(actions[1]).toEqual({
          type: REGISTER_FAILURE,
          payload: 'Email already exists',
        });
      }
    });

    it('should handle error with response.data.error field', async () => {
      const errorResponse = {
        response: {
          data: {
            error: 'Validation error',
          },
        },
      };

      apiClient.post.mockRejectedValue(errorResponse);

      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        phoneNumber: 'invalid',
        password: 'password123',
      };

      try {
        await store.dispatch(authActions.registerUser(userData));
      } catch (error) {
        const actions = store.getActions();
        expect(actions[1].type).toBe(REGISTER_FAILURE);
        expect(actions[1].payload).toBe('Validation error');
      }
    });

    it('should handle error with plain response.data', async () => {
      const errorResponse = {
        response: {
          data: 'Server error',
        },
      };

      apiClient.post.mockRejectedValue(errorResponse);

      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        phoneNumber: '+919876543210',
        password: 'password123',
      };

      try {
        await store.dispatch(authActions.registerUser(userData));
      } catch (error) {
        const actions = store.getActions();
        expect(actions[1].type).toBe(REGISTER_FAILURE);
        expect(actions[1].payload).toBe('Server error');
      }
    });

    it('should handle network error with fallback message', async () => {
      apiClient.post.mockRejectedValue(new Error('Network timeout'));

      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        phoneNumber: '+919876543210',
        password: 'password123',
      };

      try {
        await store.dispatch(authActions.registerUser(userData));
      } catch (error) {
        const actions = store.getActions();
        expect(actions[1].type).toBe(REGISTER_FAILURE);
        expect(actions[1].payload).toBe('Registration failed');
      }
    });
  });

  describe('logoutUser', () => {
    it('should dispatch LOGOUT and clear localStorage', async () => {
      localStorage.setItem('token', 'test-token');
      localStorage.setItem('user', 'test-user');

      await store.dispatch(authActions.logoutUser());

      const actions = store.getActions();
      expect(actions[0]).toEqual({ type: LOGOUT_REQUEST });
      expect(actions[1]).toEqual({ type: LOGOUT_SUCCESS });
      expect(localStorage.getItem('token')).toBeNull();
      expect(localStorage.getItem('user')).toBeNull();
    });

    it('should handle logout errors with error message', async () => {
      // Mock localStorage.removeItem to throw an error
      const originalRemoveItem = Storage.prototype.removeItem;
      Storage.prototype.removeItem = jest.fn(() => {
        throw new Error('Storage access denied');
      });

      try {
        await store.dispatch(authActions.logoutUser());
      } catch (error) {
        const actions = store.getActions();
        expect(actions[0]).toEqual({ type: LOGOUT_REQUEST });
        expect(actions[1]).toEqual({
          type: LOGOUT_FAILURE,
          payload: 'Storage access denied',
        });
        expect(error.message).toBe('Storage access denied');
      }

      // Restore original removeItem
      Storage.prototype.removeItem = originalRemoveItem;
    });

    it('should handle logout errors without error message', async () => {
      // Mock localStorage.removeItem to throw an error without message
      const originalRemoveItem = Storage.prototype.removeItem;
      Storage.prototype.removeItem = jest.fn(() => {
        const error = new Error();
        error.message = '';
        throw error;
      });

      try {
        await store.dispatch(authActions.logoutUser());
      } catch (error) {
        const actions = store.getActions();
        expect(actions[0]).toEqual({ type: LOGOUT_REQUEST });
        expect(actions[1]).toEqual({
          type: LOGOUT_FAILURE,
          payload: 'Logout failed',
        });
      }

      // Restore original removeItem
      Storage.prototype.removeItem = originalRemoveItem;
    });
  });

  describe('clearAuthError', () => {
    it('should dispatch CLEAR_AUTH_ERROR', () => {
      store.dispatch(authActions.clearAuthError());

      const actions = store.getActions();
      expect(actions[0]).toEqual({ type: CLEAR_AUTH_ERROR });
    });
  });
});
