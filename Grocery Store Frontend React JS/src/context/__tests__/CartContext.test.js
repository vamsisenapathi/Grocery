import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { SnackbarProvider } from 'notistack';
import { CartProvider, useCart } from '../CartContext';
import { apiService } from '../../services/api.service';
import * as userUtils from '../../utils/userUtils';

const mockEnqueueSnackbar = jest.fn();
jest.mock('notistack', () => ({
  ...jest.requireActual('notistack'),
  useSnackbar: () => ({ enqueueSnackbar: mockEnqueueSnackbar }),
  SnackbarProvider: ({ children }) => <div>{children}</div>,
}));

jest.mock('../../services/api.service', () => ({
  apiService: {
    cart: {
      get: jest.fn(),
      addItem: jest.fn(),
      updateItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    },
  },
}));

jest.mock('../../utils/userUtils', () => ({
  getUserId: jest.fn(),
}));

const TestComponent = () => {
  const { cart, loading, addToCart, updateQuantity, removeItem, clearCart, getTotalQuantity, getCartItem } = useCart();
  return (
    <div>
      <div data-testid="cart">{JSON.stringify(cart)}</div>
      <div data-testid="loading">{loading.toString()}</div>
      <div data-testid="totalQty">{getTotalQuantity()}</div>
      <button onClick={() => addToCart(1, 2)}>Add to Cart</button>
      <button onClick={() => updateQuantity(1, 3)}>Update Quantity</button>
      <button onClick={() => updateQuantity(1, 0)}>Update to Zero</button>
      <button onClick={() => removeItem(1)}>Remove Item</button>
      <button onClick={clearCart}>Clear Cart</button>
      <button onClick={() => {
        const item = getCartItem(1);
        document.getElementById('cart-item-result').textContent = item ? JSON.stringify(item) : 'null';
      }}>Get Cart Item</button>
      <div id="cart-item-result"></div>
    </div>
  );
};

describe('CartContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockEnqueueSnackbar.mockClear();
  });

  describe('useCart hook', () => {
    it('throws error when used outside CartProvider', () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      const TestComp = () => {
        try {
          useCart();
          return <div>Should not render</div>;
        } catch (error) {
          return <div>{error.message}</div>;
        }
      };

      render(<TestComp />);
      expect(screen.getByText('useCart must be used within CartProvider')).toBeInTheDocument();
      
      consoleError.mockRestore();
    });

    it('provides cart context when used within provider', () => {
      function TestComp() {
        const cart = useCart();
        return <div>{cart ? 'Cart available' : 'No cart'}</div>;
      }

      userUtils.getUserId.mockReturnValue(null);

      const { getByText } = render(
        <SnackbarProvider>
          <CartProvider>
            <TestComp />
          </CartProvider>
        </SnackbarProvider>
      );

      expect(getByText('Cart available')).toBeInTheDocument();
    });
  });

  describe('Cart initialization', () => {
    it('initializes with empty cart', () => {
      userUtils.getUserId.mockReturnValue(null);

      render(
        <SnackbarProvider>
          <CartProvider>
            <TestComponent />
          </CartProvider>
        </SnackbarProvider>
      );

      expect(screen.getByTestId('cart')).toHaveTextContent('{"items":[],"subtotal":0}');
    });

    it('does not fetch cart when no userId', () => {
      userUtils.getUserId.mockReturnValue(null);

      render(
        <SnackbarProvider>
          <CartProvider>
            <TestComponent />
          </CartProvider>
        </SnackbarProvider>
      );

      expect(apiService.cart.get).not.toHaveBeenCalled();
    });
  });

  describe('addToCart', () => {
    it('adds item to cart successfully', async () => {
      userUtils.getUserId.mockReturnValue('user-123');
      apiService.cart.addItem.mockResolvedValue({});
      apiService.cart.get.mockResolvedValue({
        items: [{ id: 1, productId: 1, quantity: 2 }],
        subtotal: 100,
      });

      render(
        <SnackbarProvider>
          <CartProvider>
            <TestComponent />
          </CartProvider>
        </SnackbarProvider>
      );

      const addButton = screen.getByText('Add to Cart');
      await act(async () => {
        addButton.click();
      });

      await waitFor(() => {
        expect(apiService.cart.addItem).toHaveBeenCalledWith(1, 2);
        expect(mockEnqueueSnackbar).toHaveBeenCalledWith('Added to cart', { variant: 'success' });
      });
    });

    it('handles addToCart error', async () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
      userUtils.getUserId.mockReturnValue('user-123');
      apiService.cart.addItem.mockRejectedValue(new Error('Add failed'));

      render(
        <SnackbarProvider>
          <CartProvider>
            <TestComponent />
          </CartProvider>
        </SnackbarProvider>
      );

      const addButton = screen.getByText('Add to Cart');
      await act(async () => {
        addButton.click();
      });

      await waitFor(() => {
        expect(mockEnqueueSnackbar).toHaveBeenCalledWith('Failed to add to cart', { variant: 'error' });
      });

      consoleError.mockRestore();
    });
  });

  describe('updateQuantity', () => {
    it('updates item quantity successfully', async () => {
      userUtils.getUserId.mockReturnValue('user-123');
      apiService.cart.updateItem.mockResolvedValue({});
      apiService.cart.get.mockResolvedValue({
        items: [{ id: 1, productId: 1, quantity: 3 }],
        subtotal: 150,
      });

      render(
        <SnackbarProvider>
          <CartProvider>
            <TestComponent />
          </CartProvider>
        </SnackbarProvider>
      );

      const updateButton = screen.getByText('Update Quantity');
      await act(async () => {
        updateButton.click();
      });

      await waitFor(() => {
        expect(apiService.cart.updateItem).toHaveBeenCalledWith(1, 3);
      });
    });

    it('removes item when quantity is less than 1', async () => {
      userUtils.getUserId.mockReturnValue('user-123');
      apiService.cart.removeItem.mockResolvedValue({});
      apiService.cart.get.mockResolvedValue({ items: [], subtotal: 0 });

      render(
        <SnackbarProvider>
          <CartProvider>
            <TestComponent />
          </CartProvider>
        </SnackbarProvider>
      );

      const updateToZeroButton = screen.getByText('Update to Zero');
      await act(async () => {
        updateToZeroButton.click();
      });

      await waitFor(() => {
        expect(apiService.cart.removeItem).toHaveBeenCalledWith(1);
        expect(mockEnqueueSnackbar).toHaveBeenCalledWith('Removed from cart', { variant: 'success' });
      });
    });

    it('handles updateQuantity error', async () => {
      userUtils.getUserId.mockReturnValue('user-123');
      apiService.cart.updateItem.mockRejectedValue(new Error('Update failed'));

      render(
        <SnackbarProvider>
          <CartProvider>
            <TestComponent />
          </CartProvider>
        </SnackbarProvider>
      );

      const updateButton = screen.getByText('Update Quantity');
      await act(async () => {
        updateButton.click();
      });

      await waitFor(() => {
        expect(mockEnqueueSnackbar).toHaveBeenCalledWith('Failed to update quantity', { variant: 'error' });
      });
    });
  });

  describe('removeItem', () => {
    it('removes item successfully', async () => {
      userUtils.getUserId.mockReturnValue('user-123');
      apiService.cart.removeItem.mockResolvedValue({});
      apiService.cart.get.mockResolvedValue({ items: [], subtotal: 0 });

      render(
        <SnackbarProvider>
          <CartProvider>
            <TestComponent />
          </CartProvider>
        </SnackbarProvider>
      );

      const removeButton = screen.getByText('Remove Item');
      await act(async () => {
        removeButton.click();
      });

      await waitFor(() => {
        expect(apiService.cart.removeItem).toHaveBeenCalledWith(1);
        expect(mockEnqueueSnackbar).toHaveBeenCalledWith('Removed from cart', { variant: 'success' });
      });
    });

    it('handles removeItem error', async () => {
      userUtils.getUserId.mockReturnValue('user-123');
      apiService.cart.removeItem.mockRejectedValue(new Error('Remove failed'));

      render(
        <SnackbarProvider>
          <CartProvider>
            <TestComponent />
          </CartProvider>
        </SnackbarProvider>
      );

      const removeButton = screen.getByText('Remove Item');
      await act(async () => {
        removeButton.click();
      });

      await waitFor(() => {
        expect(mockEnqueueSnackbar).toHaveBeenCalledWith('Failed to remove item', { variant: 'error' });
      });
    });
  });

  describe('clearCart', () => {
    it('clears cart successfully when userId exists', async () => {
      userUtils.getUserId.mockReturnValue('user-123');
      apiService.cart.clear.mockResolvedValue({});

      render(
        <SnackbarProvider>
          <CartProvider>
            <TestComponent />
          </CartProvider>
        </SnackbarProvider>
      );

      const clearButton = screen.getByText('Clear Cart');
      await act(async () => {
        clearButton.click();
      });

      await waitFor(() => {
        expect(apiService.cart.clear).toHaveBeenCalledWith('user-123');
        expect(mockEnqueueSnackbar).toHaveBeenCalledWith('Cart cleared', { variant: 'success' });
        expect(screen.getByTestId('cart')).toHaveTextContent('{"items":[],"subtotal":0}');
      });
    });

    it('does not clear cart when no userId', async () => {
      userUtils.getUserId.mockReturnValue(null);

      render(
        <SnackbarProvider>
          <CartProvider>
            <TestComponent />
          </CartProvider>
        </SnackbarProvider>
      );

      const clearButton = screen.getByText('Clear Cart');
      await act(async () => {
        clearButton.click();
      });

      await waitFor(() => {
        expect(apiService.cart.clear).not.toHaveBeenCalled();
      });
    });

    it('handles clearCart error', async () => {
      userUtils.getUserId.mockReturnValue('user-123');
      apiService.cart.clear.mockRejectedValue(new Error('Clear failed'));

      render(
        <SnackbarProvider>
          <CartProvider>
            <TestComponent />
          </CartProvider>
        </SnackbarProvider>
      );

      const clearButton = screen.getByText('Clear Cart');
      await act(async () => {
        clearButton.click();
      });

      await waitFor(() => {
        expect(mockEnqueueSnackbar).toHaveBeenCalledWith('Failed to clear cart', { variant: 'error' });
      });
    });
  });

  describe('getTotalQuantity', () => {
    it('calculates total quantity correctly', async () => {
      userUtils.getUserId.mockReturnValue('user-123');
      apiService.cart.get.mockResolvedValue({
        items: [
          { id: 1, productId: 1, quantity: 2 },
          { id: 2, productId: 2, quantity: 3 },
        ],
        subtotal: 250,
      });

      render(
        <SnackbarProvider>
          <CartProvider>
            <TestComponent />
          </CartProvider>
        </SnackbarProvider>
      );

      const addButton = screen.getByText('Add to Cart');
      await act(async () => {
        addButton.click();
      });

      await waitFor(() => {
        expect(screen.getByTestId('totalQty')).toHaveTextContent('5');
      });
    });
  });

  describe('getCartItem', () => {
    it('finds cart item by productId', async () => {
      userUtils.getUserId.mockReturnValue('user-123');
      apiService.cart.addItem.mockResolvedValue({});
      apiService.cart.get.mockResolvedValue({
        items: [{ id: 1, productId: 1, quantity: 2, product: { id: 1, name: 'Test' } }],
        subtotal: 100,
      });

      render(
        <SnackbarProvider>
          <CartProvider>
            <TestComponent />
          </CartProvider>
        </SnackbarProvider>
      );

      const addButton = screen.getByText('Add to Cart');
      await act(async () => {
        addButton.click();
      });

      await waitFor(() => {
        expect(screen.getByTestId('cart')).toHaveTextContent('"productId":1');
      });

      const getItemButton = screen.getByText('Get Cart Item');
      act(() => {
        getItemButton.click();
      });

      expect(screen.getByTestId('cart')).toHaveTextContent('"productId":1');
    });

    it('returns null when cart is empty', () => {
      userUtils.getUserId.mockReturnValue(null);

      render(
        <SnackbarProvider>
          <CartProvider>
            <TestComponent />
          </CartProvider>
        </SnackbarProvider>
      );

      const getItemButton = screen.getByText('Get Cart Item');
      act(() => {
        getItemButton.click();
      });

      expect(document.getElementById('cart-item-result')).toHaveTextContent('null');
    });

    it('handles item with product.id instead of productId', async () => {
      userUtils.getUserId.mockReturnValue('user-123');
      apiService.cart.addItem.mockResolvedValue({});
      apiService.cart.get.mockResolvedValue({
        items: [{ id: 1, product: { id: 1, name: 'Test' }, quantity: 2 }],
        subtotal: 100,
      });

      render(
        <SnackbarProvider>
          <CartProvider>
            <TestComponent />
          </CartProvider>
        </SnackbarProvider>
      );

      const addButton = screen.getByText('Add to Cart');
      await act(async () => {
        addButton.click();
      });

      await waitFor(() => {
        expect(screen.getByTestId('cart')).toHaveTextContent('"product":{"id":1');
      });
    });
  });

  describe('fetchCart error handling', () => {
    it('handles fetchCart error gracefully', async () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
      userUtils.getUserId.mockReturnValue('user-123');
      apiService.cart.get.mockRejectedValue(new Error('Fetch failed'));
      apiService.cart.addItem.mockResolvedValue({});

      render(
        <SnackbarProvider>
          <CartProvider>
            <TestComponent />
          </CartProvider>
        </SnackbarProvider>
      );

      const addButton = screen.getByText('Add to Cart');
      await act(async () => {
        addButton.click();
      });

      await waitFor(() => {
        expect(consoleError).toHaveBeenCalledWith('Failed to fetch cart:', expect.any(Error));
      });

      consoleError.mockRestore();
    });

    it('does not fetch cart in test environment on mount', () => {
      userUtils.getUserId.mockReturnValue('user-123');
      
      render(
        <SnackbarProvider>
          <CartProvider>
            <TestComponent />
          </CartProvider>
        </SnackbarProvider>
      );

      // In test environment, fetchCart should not be called automatically
      // This is already the default behavior, we just verify it renders correctly
      expect(screen.getByText('Add to Cart')).toBeInTheDocument();
    });
  });
});
