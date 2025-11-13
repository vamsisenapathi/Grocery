import { getUserId } from '../userUtils';

describe('userUtils', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('getUserId', () => {
    it('should return userId from localStorage user object', () => {
      const user = { userId: '123e4567-e89b-12d3-a456-426614174000', email: 'test@test.com', name: 'Test User' };
      localStorage.setItem('token', 'test-token');
      localStorage.setItem('user', JSON.stringify(user));

      const userId = getUserId();

      expect(userId).toBe('123e4567-e89b-12d3-a456-426614174000');
    });

    it('should return id from localStorage user object when userId is not present', () => {
      const user = { id: '223e4567-e89b-12d3-a456-426614174001', email: 'test@test.com', name: 'Test User' };
      localStorage.setItem('token', 'test-token');
      localStorage.setItem('user', JSON.stringify(user));

      const userId = getUserId();

      expect(userId).toBe('223e4567-e89b-12d3-a456-426614174001');
    });

    it('should return guest ID when user is not in localStorage', () => {
      const userId = getUserId();

      expect(userId).toMatch(/^guest_/);
      expect(localStorage.getItem('guestUserId')).toBe(userId);
    });

    it('should return guest ID when user object is invalid JSON', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      localStorage.setItem('token', 'test-token');
      localStorage.setItem('user', 'invalid-json{');

      const userId = getUserId();

      expect(userId).toMatch(/^guest_/);
      expect(consoleSpy).toHaveBeenCalledWith('Error parsing user data:', expect.any(Error));

      consoleSpy.mockRestore();
    });

    it('should return guest ID when user object has no id or userId', () => {
      const user = { email: 'test@test.com', name: 'Test User' };
      localStorage.setItem('token', 'test-token');
      localStorage.setItem('user', JSON.stringify(user));

      const userId = getUserId();

      expect(userId).toMatch(/^guest_/);
    });

    it('should handle user id as string', () => {
      const user = { id: '323e4567-e89b-12d3-a456-426614174002', email: 'test@test.com' };
      localStorage.setItem('token', 'test-token');
      localStorage.setItem('user', JSON.stringify(user));

      const userId = getUserId();

      expect(userId).toBe('323e4567-e89b-12d3-a456-426614174002');
    });

    it('should reuse existing guest ID if already generated', () => {
      const existingGuestId = 'guest_123456_abc';
      localStorage.setItem('guestUserId', existingGuestId);

      const userId = getUserId();

      expect(userId).toBe(existingGuestId);
    });
  });
});
