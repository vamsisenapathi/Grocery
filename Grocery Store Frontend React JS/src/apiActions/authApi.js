import apiClient, { TokenService } from './baseApi';

// ============ AUTHENTICATION API FUNCTIONS ============
export const authAPI = {
  // User registration
  register: async (userData) => {
    try {
      const response = await apiClient.post('/auth/register', userData);
      
      // Handle successful registration response
      if (response.data.token) {
        TokenService.setToken(response.data.token);
        TokenService.setUserId(response.data.userId);
        TokenService.setUser({
          id: response.data.userId,
          name: response.data.name,
          email: response.data.email,
          phoneNumber: response.data.phoneNumber
        });
      }
      
      return response.data;
    } catch (error) {
      console.error('Registration failed:', error);
      throw new Error(`Registration failed: ${error.response?.data?.message || error.message}`);
    }
  },

  // User login
  login: async (credentials) => {
    try {
      const response = await apiClient.post('/auth/login', credentials);
      
      // Handle successful login response
      if (response.data.token) {
        TokenService.setToken(response.data.token);
        TokenService.setUserId(response.data.userId);
        TokenService.setUser({
          id: response.data.userId,
          name: response.data.name,
          email: response.data.email,
          phoneNumber: response.data.phoneNumber
        });
      }
      
      return response.data;
    } catch (error) {
      console.error('Login failed:', error);
      throw new Error(`Login failed: ${error.response?.data?.message || error.message}`);
    }
  },

  // User logout
  logout: async () => {
    try {
      // Call logout endpoint if available
      await apiClient.post('/auth/logout');
      
      // Clear local storage
      TokenService.clearAll();
      
      return { success: true, message: 'Logged out successfully' };
    } catch (error) {
      // Even if the API call fails, clear local storage
      TokenService.clearAll();
      console.error('Logout error:', error);
      return { success: true, message: 'Logged out successfully' };
    }
  },

  // Verify token
  verifyToken: async () => {
    try {
      const response = await apiClient.get('/auth/verify');
      return response.data;
    } catch (error) {
      console.error('Token verification failed:', error);
      TokenService.clearAll();
      throw new Error(`Token verification failed: ${error.response?.data?.message || error.message}`);
    }
  },

  // Get current user profile
  getCurrentUser: async () => {
    try {
      const response = await apiClient.get('/auth/me');
      
      // Update stored user data
      if (response.data) {
        TokenService.setUser(response.data);
      }
      
      return response.data;
    } catch (error) {
      console.error('Failed to get current user:', error);
      throw new Error(`Failed to get user profile: ${error.response?.data?.message || error.message}`);
    }
  },

  // Update user profile
  updateProfile: async (userData) => {
    try {
      const response = await apiClient.put('/auth/profile', userData);
      
      // Update stored user data
      if (response.data) {
        TokenService.setUser(response.data);
      }
      
      return response.data;
    } catch (error) {
      console.error('Failed to update profile:', error);
      throw new Error(`Failed to update profile: ${error.response?.data?.message || error.message}`);
    }
  },

  // Change password
  changePassword: async (passwordData) => {
    try {
      const response = await apiClient.put('/auth/change-password', passwordData);
      return response.data;
    } catch (error) {
      console.error('Failed to change password:', error);
      throw new Error(`Failed to change password: ${error.response?.data?.message || error.message}`);
    }
  }
};

export default authAPI;