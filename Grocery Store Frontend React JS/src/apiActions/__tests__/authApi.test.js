import { configureStore } from '@reduxjs/toolkit';
import { loginUser, registerUser, logoutUser } from '../authApi';
import apiClient from '../baseApi';

jest.mock('../baseApi');

describe('authApi', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        test: (state = {}) => state,
      },
    });
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe('loginUser', () => {
    it('should login successfully and store token and user', async () => {
      const mockResponse = {
        data: {
          token: 'test-token-123',
          tokenType: 'Bearer',
          userId: '123e4567-e89b-12d3-a456-426614174000',
          name: 'Test User',
          email: 'test@test.com',
          phoneNumber: '1234567890',
          createdAt: '2025-11-07T13:30:00.000Z',
          message: 'Login successful'
        },
      };
      apiClient.post.mockResolvedValue(mockResponse);

      const result = await store.dispatch(
        loginUser({ email: 'test@test.com', password: 'password123' })
      );

      expect(apiClient.post).toHaveBeenCalledWith('/auth/login', {
        email: 'test@test.com',
        password: 'password123',
      });
      expect(result.type).toBe('auth/login/fulfilled');
      expect(result.payload).toEqual(mockResponse.data);
      expect(localStorage.getItem('token')).toBe('test-token-123');
      const storedUser = JSON.parse(localStorage.getItem('user'));
      expect(storedUser).toMatchObject({
        userId: '123e4567-e89b-12d3-a456-426614174000',
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Test User',
        email: 'test@test.com'
      });
    });

    it('should handle login without token', async () => {
      const mockResponse = {
        data: {
          userId: '123e4567-e89b-12d3-a456-426614174000',
          name: 'Test User',
          email: 'test@test.com',
          phoneNumber: '1234567890',
        },
      };
      apiClient.post.mockResolvedValue(mockResponse);

      const result = await store.dispatch(
        loginUser({ email: 'test@test.com', password: 'password123' })
      );

      expect(result.payload).toEqual(mockResponse.data);
      expect(localStorage.getItem('token')).toBeNull();
    });

    it('should handle login without user', async () => {
      const mockResponse = {
        data: {
          token: 'test-token',
        },
      };
      apiClient.post.mockResolvedValue(mockResponse);

      const result = await store.dispatch(
        loginUser({ email: 'test@test.com', password: 'password123' })
      );

      expect(result.payload).toEqual(mockResponse.data);
      expect(localStorage.getItem('user')).toBeNull();
    });

    it('should handle login failure with error response', async () => {
      const errorData = { message: 'Invalid credentials' };
      apiClient.post.mockRejectedValue({
        response: { data: errorData },
      });

      const result = await store.dispatch(
        loginUser({ email: 'test@test.com', password: 'wrong' })
      );

      expect(result.type).toBe('auth/login/rejected');
      expect(result.payload).toEqual(errorData);
    });

    it('should handle login failure without error response', async () => {
      apiClient.post.mockRejectedValue(new Error('Network error'));

      const result = await store.dispatch(
        loginUser({ email: 'test@test.com', password: 'wrong' })
      );

      expect(result.type).toBe('auth/login/rejected');
      expect(result.payload).toBe('Login failed');
    });
  });

  describe('registerUser', () => {
    it('should register successfully and store token and user', async () => {
      const userData = {
        email: 'newuser@test.com',
        password: 'password123',
        name: 'New User',
        phone: '1234567890',
      };
      const mockResponse = {
        data: {
          token: 'new-token-456',
          tokenType: 'Bearer',
          userId: '223e4567-e89b-12d3-a456-426614174001',
          name: 'New User',
          email: 'newuser@test.com',
          phoneNumber: '1234567890',
          createdAt: '2025-11-07T13:30:00.000Z',
          message: 'Registration successful'
        },
      };
      apiClient.post.mockResolvedValue(mockResponse);

      const result = await store.dispatch(registerUser(userData));

      expect(apiClient.post).toHaveBeenCalledWith('/auth/register', userData);
      expect(result.type).toBe('auth/register/fulfilled');
      expect(result.payload).toEqual(mockResponse.data);
      expect(localStorage.getItem('token')).toBe('new-token-456');
      const storedUser = JSON.parse(localStorage.getItem('user'));
      expect(storedUser).toMatchObject({
        userId: '223e4567-e89b-12d3-a456-426614174001',
        id: '223e4567-e89b-12d3-a456-426614174001',
        name: 'New User',
        email: 'newuser@test.com'
      });
    });

    it('should handle registration without token', async () => {
      const userData = { email: 'test@test.com', password: 'pass', name: 'Test' };
      const mockResponse = {
        data: {
          userId: '323e4567-e89b-12d3-a456-426614174002',
          name: 'Test',
          email: 'test@test.com',
        },
      };
      apiClient.post.mockResolvedValue(mockResponse);

      const result = await store.dispatch(registerUser(userData));

      expect(result.payload).toEqual(mockResponse.data);
      expect(localStorage.getItem('token')).toBeNull();
    });

    it('should handle registration without user', async () => {
      const userData = { email: 'test@test.com', password: 'pass' };
      const mockResponse = {
        data: {
          token: 'test-token',
        },
      };
      apiClient.post.mockResolvedValue(mockResponse);

      const result = await store.dispatch(registerUser(userData));

      expect(result.payload).toEqual(mockResponse.data);
      expect(localStorage.getItem('user')).toBeNull();
    });

    it('should handle registration failure with error response', async () => {
      const errorData = { message: 'Email already exists' };
      apiClient.post.mockRejectedValue({
        response: { data: errorData },
      });

      const result = await store.dispatch(
        registerUser({ email: 'existing@test.com', password: 'pass' })
      );

      expect(result.type).toBe('auth/register/rejected');
      expect(result.payload).toEqual(errorData);
    });

    it('should handle registration failure without error response', async () => {
      apiClient.post.mockRejectedValue(new Error('Network error'));

      const result = await store.dispatch(
        registerUser({ email: 'test@test.com', password: 'pass' })
      );

      expect(result.type).toBe('auth/register/rejected');
      expect(result.payload).toBe('Registration failed');
    });
  });

  describe('logoutUser', () => {
    it('should logout and clear localStorage', async () => {
      localStorage.setItem('token', 'test-token');
      localStorage.setItem('user', JSON.stringify({ id: 1, email: 'test@test.com' }));

      const result = await store.dispatch(logoutUser());

      expect(result.type).toBe('auth/logout/fulfilled');
      expect(result.payload).toBeNull();
      expect(localStorage.getItem('token')).toBeNull();
      expect(localStorage.getItem('user')).toBeNull();
    });

    it('should logout even when localStorage is empty', async () => {
      const result = await store.dispatch(logoutUser());

      expect(result.type).toBe('auth/logout/fulfilled');
      expect(result.payload).toBeNull();
    });
  });
});
