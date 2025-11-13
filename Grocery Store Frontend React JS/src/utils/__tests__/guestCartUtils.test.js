import {
  getGuestCart,
  saveGuestCart,
  clearGuestCart,
  addToGuestCart,
  updateGuestCartItem,
  removeFromGuestCart,
} from '../guestCartUtils';

describe('guestCartUtils', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('getGuestCart', () => {
    it('returns empty cart when no cart exists', () => {
      const cart = getGuestCart();

      expect(cart).toEqual({
        items: [],
        totalAmount: 0,
      });
    });

    it('returns saved cart from localStorage', () => {
      const mockCart = {
        items: [{ id: 1, productId: 1, quantity: 2 }],
        totalAmount: 100,
      };
      localStorage.setItem('guestCart', JSON.stringify(mockCart));

      const cart = getGuestCart();

      expect(cart).toEqual(mockCart);
    });

    it('returns empty cart when localStorage contains invalid JSON', () => {
      localStorage.setItem('guestCart', 'invalid json');

      const cart = getGuestCart();

      expect(cart).toEqual({
        items: [],
        totalAmount: 0,
      });
    });
  });

  describe('saveGuestCart', () => {
    it('saves cart to localStorage', () => {
      const cart = {
        items: [{ id: 1, productId: 1, quantity: 2 }],
        totalAmount: 100,
      };

      saveGuestCart(cart);

      const saved = JSON.parse(localStorage.getItem('guestCart'));
      expect(saved).toEqual(cart);
    });

    it('handles localStorage errors gracefully', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const mockSetItem = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('Storage full');
      });

      saveGuestCart({ items: [], totalAmount: 0 });

      expect(consoleSpy).toHaveBeenCalledWith('Error saving guest cart:', expect.any(Error));

      consoleSpy.mockRestore();
      mockSetItem.mockRestore();
    });
  });

  describe('clearGuestCart', () => {
    it('removes cart from localStorage', () => {
      localStorage.setItem('guestCart', JSON.stringify({ items: [], totalAmount: 0 }));

      clearGuestCart();

      expect(localStorage.getItem('guestCart')).toBeNull();
    });

    it('handles localStorage errors gracefully', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const mockRemoveItem = jest.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
        throw new Error('Storage error');
      });

      clearGuestCart();

      expect(consoleSpy).toHaveBeenCalledWith('Error clearing guest cart:', expect.any(Error));

      consoleSpy.mockRestore();
      mockRemoveItem.mockRestore();
    });
  });

  describe('addToGuestCart', () => {
    const product = {
      id: 1,
      name: 'Test Product',
      price: 50,
      imageUrl: 'test.jpg',
      stock: 10,
    };

    beforeEach(() => {
      localStorage.clear();
    });

    it('adds new item to empty cart', () => {
      const cart = addToGuestCart(product, 2);

      expect(cart.items).toHaveLength(1);
      expect(cart.items[0].productId).toBe(1);
      expect(cart.items[0].quantity).toBe(2);
      expect(cart.items[0].product.name).toBe('Test Product');
      expect(cart.totalAmount).toBe(100);
    });

    it('updates quantity when product already exists', () => {
      addToGuestCart(product, 2);
      const cart = addToGuestCart(product, 3);

      expect(cart.items).toHaveLength(1);
      expect(cart.items[0].quantity).toBe(5);
      expect(cart.totalAmount).toBe(250);
    });

    it('uses default quantity of 1 when not specified', () => {
      const cart = addToGuestCart(product);

      expect(cart.items[0].quantity).toBe(1);
      expect(cart.totalAmount).toBe(50);
    });

    it('generates unique ID for new items', () => {
      const product1 = { id: 1, name: 'Product 1', price: 10, imageUrl: 'test.jpg', stock: 10 };
      const product2 = { id: 2, name: 'Product 2', price: 20, imageUrl: 'test.jpg', stock: 10 };

      addToGuestCart(product1);
      const cart2 = addToGuestCart(product2);

      expect(cart2.items).toHaveLength(2);
      expect(cart2.items[0].id).toContain('guest-');
      expect(cart2.items[1].id).toContain('guest-');
      expect(cart2.items[0].id).not.toBe(cart2.items[1].id);
    });
  });

  describe('updateGuestCartItem', () => {
    const product = {
      id: 1,
      name: 'Test Product',
      price: 50,
      imageUrl: 'test.jpg',
      stock: 10,
    };

    beforeEach(() => {
      localStorage.clear();
    });

    it('updates item quantity', () => {
      const cart = addToGuestCart(product, 2);
      const itemId = cart.items[0].id;

      const updatedCart = updateGuestCartItem(itemId, 5);

      expect(updatedCart.items[0].quantity).toBe(5);
      expect(updatedCart.totalAmount).toBe(250);
    });

    it('removes item when quantity is 0', () => {
      const cart = addToGuestCart(product, 2);
      const itemId = cart.items[0].id;

      const updatedCart = updateGuestCartItem(itemId, 0);

      expect(updatedCart.items).toHaveLength(0);
      expect(updatedCart.totalAmount).toBe(0);
    });

    it('removes item when quantity is negative', () => {
      const cart = addToGuestCart(product, 2);
      const itemId = cart.items[0].id;

      const updatedCart = updateGuestCartItem(itemId, -1);

      expect(updatedCart.items).toHaveLength(0);
      expect(updatedCart.totalAmount).toBe(0);
    });

    it('does nothing when item not found', () => {
      addToGuestCart(product, 2);
      
      const updatedCart = updateGuestCartItem('nonexistent-id', 5);

      expect(updatedCart.items).toHaveLength(1);
      expect(updatedCart.items[0].quantity).toBe(2);
    });
  });

  describe('removeFromGuestCart', () => {
    const product1 = { id: 1, name: 'Product 1', price: 50, imageUrl: 'test.jpg', stock: 10 };
    const product2 = { id: 2, name: 'Product 2', price: 30, imageUrl: 'test.jpg', stock: 10 };

    beforeEach(() => {
      localStorage.clear();
    });

    it('removes specific item from cart', () => {
      addToGuestCart(product1, 2);
      const cart = addToGuestCart(product2, 1);
      const product1ItemId = cart.items.find(item => item.productId === 1).id;

      const updatedCart = removeFromGuestCart(product1ItemId);

      expect(updatedCart.items).toHaveLength(1);
      expect(updatedCart.items[0].productId).toBe(2);
      expect(updatedCart.totalAmount).toBe(30);
    });

    it('handles removing non-existent item', () => {
      addToGuestCart(product1, 2);
      addToGuestCart(product2, 1);

      const updatedCart = removeFromGuestCart('nonexistent-id');

      expect(updatedCart.items).toHaveLength(2);
      expect(updatedCart.totalAmount).toBe(130);
    });

    it('recalculates total amount correctly', () => {
      addToGuestCart(product1, 2);
      const cart = addToGuestCart(product2, 1);
      const product1ItemId = cart.items.find(item => item.productId === 1).id;

      const firstRemoved = removeFromGuestCart(product1ItemId);

      expect(firstRemoved.items).toHaveLength(1);
      expect(firstRemoved.totalAmount).toBe(30);
    });
  });
});
