import axios from 'axios';

// ============ BASE API CONFIGURATION ============
const API_BASE_URL = 'http://localhost:8081/api/v1';

// Create axios instance with optimized configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000, // Reduced timeout for faster response
  headers: {
    'Content-Type': 'application/json',
  },
});

// ============ TOKEN SERVICE ============
export const TokenService = {
  getToken: () => localStorage.getItem('authToken'),
  setToken: (token) => localStorage.setItem('authToken', token),
  removeToken: () => localStorage.removeItem('authToken'),
  
  getUserId: () => localStorage.getItem('userId'),
  setUserId: (userId) => localStorage.setItem('userId', userId),
  removeUserId: () => localStorage.removeItem('userId'),
  
  getUser: () => {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  },
  setUser: (user) => localStorage.setItem('userData', JSON.stringify(user)),
  removeUser: () => localStorage.removeItem('userData'),
  
  clearAll: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('userData');
  }
};

// ============ REQUEST INTERCEPTOR ============
apiClient.interceptors.request.use(
  (config) => {
    const token = TokenService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Only log in development for performance
    if (process.env.NODE_ENV === 'development') {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// ============ RESPONSE INTERCEPTOR ============
apiClient.interceptors.response.use(
  (response) => {
    // Only log in development for performance
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.data?.length || 'N/A'} items`);
    }
    return response;
  },
  (error) => {
    if (process.env.NODE_ENV === 'development') {
      console.error('❌ API Error:', error.response?.data || error.message);
    }
    
    // Handle authentication errors
    if (error.response?.status === 401) {
      TokenService.clearAll();
      // Don't redirect here, let components handle it
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;