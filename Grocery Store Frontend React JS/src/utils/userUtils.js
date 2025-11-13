export const getUserId = () => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  

  
  if (token && user) {
    try {
      const userData = JSON.parse(user);
      const userId = userData.userId || userData.id;
      if (userId) {

        return userId;
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
  }
  
  // If no valid user ID found, use guest ID
  let guestId = localStorage.getItem('guestUserId');
  if (!guestId) {
    guestId = 'guest_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('guestUserId', guestId);
  }

  return guestId;
};

export const isGuestUser = () => {
  const token = localStorage.getItem('token');
  const isGuest = !token;

  return isGuest;
};
