// Mock authentication data and functions
const MOCK_USERS_KEY = 'mockUsers';
const MOCK_CURRENT_USER_KEY = 'mockCurrentUser';

// Initialize with default users including some test accounts
const defaultUsers = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@grocery.com',
    password: 'admin123', // In real app, this would be hashed
    role: 'admin',
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
    role: 'user',
    createdAt: new Date().toISOString()
  },
  {
    id: 3,
    name: 'John Doe',
    email: 'john@example.com',
    password: 'test123',
    role: 'user',
    createdAt: new Date().toISOString()
  }
];

// Get all users from localStorage
export const getMockUsers = () => {
  const users = localStorage.getItem(MOCK_USERS_KEY);
  if (!users) {
    localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(defaultUsers));
    return defaultUsers;
  }
  return JSON.parse(users);
};

// Reset users to default (useful for testing)
export const resetMockUsers = () => {
  localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(defaultUsers));
  return defaultUsers;
};

// Save users to localStorage
export const saveMockUsers = (users) => {
  localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
};

// Get current logged-in user
export const getMockCurrentUser = () => {
  const user = localStorage.getItem(MOCK_CURRENT_USER_KEY);
  return user ? JSON.parse(user) : null;
};

// Save current user
export const saveMockCurrentUser = (user) => {
  localStorage.setItem(MOCK_CURRENT_USER_KEY, JSON.stringify(user));
};

// Clear current user
export const clearMockCurrentUser = () => {
  localStorage.removeItem(MOCK_CURRENT_USER_KEY);
};

// Mock registration function
export const mockRegister = async (userData) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const users = getMockUsers();
      
      // Check if email already exists
      const existingUser = users.find(user => user.email === userData.email);
      if (existingUser) {
        reject({
          response: {
            data: {
              message: 'Email already exists'
            }
          }
        });
        return;
      }

      // Create new user
      const newUser = {
        id: users.length + 1,
        name: userData.name,
        email: userData.email,
        password: userData.password, // In real app, this would be hashed
        role: 'user',
        createdAt: new Date().toISOString()
      };

      users.push(newUser);
      saveMockUsers(users);

      // Return success response (without password)
      const { password, ...userResponse } = newUser;
      resolve({
        data: {
          message: 'Registration successful',
          user: userResponse
        }
      });
    }, 1000); // Simulate network delay
  });
};

// Mock login function
export const mockLogin = async (credentials) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const users = getMockUsers();
        console.log('Available users:', users.map(u => ({ email: u.email, password: u.password })));
        console.log('Login attempt:', credentials);
        
        // Find user by email and password (case-insensitive email)
        const user = users.find(u => 
          u.email.toLowerCase() === credentials.email.toLowerCase() && 
          u.password === credentials.password
        );

        if (!user) {
          console.log('Login failed: User not found');
          reject({
            response: {
              data: {
                message: 'Invalid email or password'
              }
            }
          });
          return;
        }

        // Generate mock tokens
        const accessToken = `mock_access_token_${user.id}_${Date.now()}`;
        const refreshToken = `mock_refresh_token_${user.id}_${Date.now()}`;

        // Save current user
        const { password, ...userResponse } = user;
        saveMockCurrentUser(userResponse);

        console.log('Login successful:', userResponse);
        resolve({
          data: {
            accessToken,
            refreshToken,
            user: userResponse
          }
        });
      } catch (error) {
        console.error('Mock login error:', error);
        reject({
          response: {
            data: {
              message: 'Login system error'
            }
          }
        });
      }
    }, 1000); // Simulate network delay
  });
};

// Mock logout function
export const mockLogout = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      clearMockCurrentUser();
      resolve({
        data: {
          message: 'Logout successful'
        }
      });
    }, 500);
  });
};

// Mock refresh token function
export const mockRefreshToken = async (refreshToken) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const currentUser = getMockCurrentUser();
      
      if (!currentUser) {
        reject({
          response: {
            data: {
              message: 'Invalid refresh token'
            }
          }
        });
        return;
      }

      // Generate new tokens
      const newAccessToken = `mock_access_token_${currentUser.id}_${Date.now()}`;
      const newRefreshToken = `mock_refresh_token_${currentUser.id}_${Date.now()}`;

      resolve({
        data: {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken
        }
      });
    }, 500);
  });
};