// User ID management for cart operations
export const getUserId = () => {
  // Check if user is logged in by looking for JWT token
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  if (!token || !user) {
    // User not logged in - return null to prevent cart operations
    return null;
  }
  
  try {
    const userData = JSON.parse(user);
    return userData.userId || userData.id || null;
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

export const setUserId = (id) => {
  localStorage.setItem('userId', id);
};

export const clearUserId = () => {
  localStorage.removeItem('userId');
};

export const isGuestUser = () => {
  return getUserId() === null;
};
