import apiClient from '../baseApi';

describe('baseApi', () => {
  let originalLocalStorage;

  beforeAll(() => {
    // Save original localStorage
    originalLocalStorage = global.localStorage;
  });

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    
    // Mock window.location
    delete window.location;
    window.location = { href: '' };
  });

  afterAll(() => {
    // Restore original localStorage
    global.localStorage = originalLocalStorage;
  });

  it('exports apiClient instance', () => {
    expect(apiClient).toBeDefined();
    expect(apiClient.defaults).toBeDefined();
  });

  it('has correct baseURL configuration', () => {
    expect(apiClient.defaults.baseURL).toBeDefined();
    expect(typeof apiClient.defaults.baseURL).toBe('string');
  });

  it('has correct headers configuration', () => {
    expect(apiClient.defaults.headers['Content-Type']).toBe('application/json');
  });

  describe('Request Interceptor', () => {
    it('should add authorization header when token exists', () => {
      const token = 'test-token-123';
      localStorage.setItem('token', token);

      const config = { headers: {} };
      
      // Get the request interceptor
      const requestInterceptor = apiClient.interceptors.request.handlers[0];
      const result = requestInterceptor.fulfilled(config);

      expect(result.headers.Authorization).toBe(`Bearer ${token}`);
    });

    it('should not add authorization header when token does not exist', () => {
      localStorage.removeItem('token');

      const config = { headers: {} };
      
      const requestInterceptor = apiClient.interceptors.request.handlers[0];
      const result = requestInterceptor.fulfilled(config);

      expect(result.headers.Authorization).toBeUndefined();
    });

    it('should reject on request error', async () => {
      const error = new Error('Request error');
      
      const requestInterceptor = apiClient.interceptors.request.handlers[0];
      
      await expect(requestInterceptor.rejected(error)).rejects.toThrow('Request error');
    });
  });

  describe('Response Interceptor', () => {
    it('should return response on success', () => {
      const response = { data: { message: 'success' }, status: 200 };
      
      const responseInterceptor = apiClient.interceptors.response.handlers[0];
      const result = responseInterceptor.fulfilled(response);

      expect(result).toEqual(response);
    });

    it('should clear storage and redirect on 401 error', async () => {
      localStorage.setItem('token', 'test-token');
      localStorage.setItem('user', JSON.stringify({ id: 1 }));

      const error = {
        response: {
          status: 401,
          data: { message: 'Unauthorized' }
        }
      };
      
      const responseInterceptor = apiClient.interceptors.response.handlers[0];
      
      try {
        await responseInterceptor.rejected(error);
      } catch (e) {
        expect(e).toEqual(error);
      }

      expect(localStorage.getItem('token')).toBeNull();
      expect(localStorage.getItem('user')).toBeNull();
      expect(window.location.href).toBe('/login');
    });

    it('should reject error for non-401 status codes', async () => {
      localStorage.setItem('token', 'test-token');
      const initialToken = localStorage.getItem('token');

      const error = {
        response: {
          status: 500,
          data: { message: 'Server error' }
        }
      };
      
      const responseInterceptor = apiClient.interceptors.response.handlers[0];
      
      await expect(responseInterceptor.rejected(error)).rejects.toEqual(error);
      
      // Should not clear storage or redirect
      expect(localStorage.getItem('token')).toBe(initialToken);
      expect(window.location.href).toBe('');
    });

    it('should reject error when response is undefined', async () => {
      localStorage.setItem('token', 'test-token');
      const initialToken = localStorage.getItem('token');

      const error = new Error('Network error');
      
      const responseInterceptor = apiClient.interceptors.response.handlers[0];
      
      await expect(responseInterceptor.rejected(error)).rejects.toEqual(error);
      
      // Should not clear storage or redirect
      expect(localStorage.getItem('token')).toBe(initialToken);
      expect(window.location.href).toBe('');
    });
  });
});
