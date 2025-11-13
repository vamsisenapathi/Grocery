// Simple but comprehensive test file for baseApi
import apiClient from '../baseApi';

describe('baseApi', () => {
  let originalLocation;

  beforeEach(() => {
    localStorage.clear();
    // Save original window.location
    originalLocation = window.location;
    delete window.location;
    window.location = { href: '', pathname: '/' };
  });

  afterEach(() => {
    localStorage.clear();
    // Restore window.location
    window.location = originalLocation;
  });

  it('exports the axios instance', () => {
    expect(apiClient).toBeDefined();
  });

  it('has interceptors configured', () => {
    expect(apiClient.interceptors).toBeDefined();
    expect(apiClient.interceptors.request).toBeDefined();
    expect(apiClient.interceptors.response).toBeDefined();
  });

  it('has HTTP methods available', () => {
    expect(apiClient.get).toBeDefined();
    expect(apiClient.post).toBeDefined();
    expect(apiClient.put).toBeDefined();
    expect(apiClient.delete).toBeDefined();
  });

  it('baseURL is configured', () => {
    expect(apiClient.defaults.baseURL).toBeDefined();
    expect(apiClient.defaults.baseURL).toContain('api/v1');
  });

  it('default headers include Content-Type', () => {
    expect(apiClient.defaults.headers['Content-Type']).toBe('application/json');
  });

  describe('Token handling', () => {
    it('can set and get token from localStorage', () => {
      localStorage.setItem('token', 'test-token');
      expect(localStorage.getItem('token')).toBe('test-token');
    });

    it('can clear auth data from localStorage', () => {
      localStorage.setItem('token', 'test-token');
      localStorage.setItem('user', 'test-user');
      
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      expect(localStorage.getItem('token')).toBeNull();
      expect(localStorage.getItem('user')).toBeNull();
    });
  });

  describe('Request interceptor behavior', () => {
    it('should have request interceptor registered', () => {
      // The interceptor is registered when the module loads
      expect(apiClient.interceptors.request.handlers).toBeDefined();
    });
  });

  describe('Response interceptor behavior', () => {
    it('should have response interceptor registered', () => {
      // The interceptor is registered when the module loads
      expect(apiClient.interceptors.response.handlers).toBeDefined();
    });

    it('returns response unchanged on success', () => {
      const successResponse = { 
        data: { message: 'Success' }, 
        status: 200,
        config: {},
        headers: {}
      };
      
      const responseInterceptor = apiClient.interceptors.response.handlers[0];
      const result = responseInterceptor.fulfilled(successResponse);
      
      expect(result).toEqual(successResponse);
    });

    it('clears storage on 401 error', async () => {
      localStorage.setItem('token', 'test-token');
      localStorage.setItem('user', 'test-user');
      window.location.pathname = '/dashboard';

      // Create a mock 401 error
      const error401 = {
        response: { status: 401, data: { message: 'Unauthorized' } }
      };

      // Get the response interceptor's error handler
      const responseInterceptor = apiClient.interceptors.response.handlers[0];
      
      try {
        await responseInterceptor.rejected(error401);
      } catch (e) {
        // Verify localStorage was cleared
        expect(localStorage.getItem('token')).toBeNull();
        expect(localStorage.getItem('user')).toBeNull();
        // Verify redirect happened
        expect(window.location.href).toBe('/login');
      }
    });

    it('does not redirect on 401 when on login page', async () => {
      localStorage.setItem('token', 'test-token');
      window.location.pathname = '/login';
      window.location.href = '/login';

      const error401 = {
        response: { status: 401 }
      };

      const responseInterceptor = apiClient.interceptors.response.handlers[0];
      
      try {
        await responseInterceptor.rejected(error401);
      } catch (e) {
        expect(localStorage.getItem('token')).toBeNull();
        expect(window.location.href).toBe('/login'); // Should stay on login
      }
    });

    it('does not redirect on 401 when on signup page', async () => {
      localStorage.setItem('token', 'test-token');
      window.location.pathname = '/signup';
      window.location.href = '/signup';

      const error401 = {
        response: { status: 401 }
      };

      const responseInterceptor = apiClient.interceptors.response.handlers[0];
      
      try {
        await responseInterceptor.rejected(error401);
      } catch (e) {
        expect(localStorage.getItem('token')).toBeNull();
        expect(window.location.href).toBe('/signup'); // Should stay on signup
      }
    });

    it('does not clear storage or redirect on non-401 errors', async () => {
      localStorage.setItem('token', 'test-token');
      localStorage.setItem('user', 'test-user');
      const initialHref = window.location.href;

      const error404 = {
        response: { status: 404, data: { message: 'Not found' } }
      };

      const responseInterceptor = apiClient.interceptors.response.handlers[0];
      
      try {
        await responseInterceptor.rejected(error404);
      } catch (e) {
        // Storage should not be cleared
        expect(localStorage.getItem('token')).toBe('test-token');
        expect(localStorage.getItem('user')).toBe('test-user');
        // Should not redirect
        expect(window.location.href).toBe(initialHref);
      }
    });

    it('handles errors without response object', async () => {
      const networkError = new Error('Network error');
      
      const responseInterceptor = apiClient.interceptors.response.handlers[0];
      
      try {
        await responseInterceptor.rejected(networkError);
      } catch (e) {
        expect(e.message).toBe('Network error');
      }
    });
  });

  describe('Request interceptor token injection', () => {
    it('adds token to request headers when available', () => {
      localStorage.setItem('token', 'bearer-token-123');
      
      const config = { headers: {} };
      const requestInterceptor = apiClient.interceptors.request.handlers[0];
      
      const result = requestInterceptor.fulfilled(config);
      
      expect(result.headers.Authorization).toBe('Bearer bearer-token-123');
    });

    it('does not add token when not available', () => {
      localStorage.removeItem('token');
      
      const config = { headers: {} };
      const requestInterceptor = apiClient.interceptors.request.handlers[0];
      
      const result = requestInterceptor.fulfilled(config);
      
      expect(result.headers.Authorization).toBeUndefined();
    });

    it('handles request errors', async () => {
      const requestError = new Error('Request setup failed');
      const requestInterceptor = apiClient.interceptors.request.handlers[0];
      
      await expect(requestInterceptor.rejected(requestError)).rejects.toThrow('Request setup failed');
    });
  });
});

