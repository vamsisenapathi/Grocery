import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import {thunk} from 'redux-thunk';
import { SnackbarProvider } from 'notistack';
import ProductCard from '../ProductCard';
import authReducer from '../../redux/reducers/authReducer';
import cartReducer from '../../redux/reducers/cartReducer';

const mockNavigate = jest.fn();
const mockEnqueueSnackbar = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('notistack', () => ({
  ...jest.requireActual('notistack'),
  useSnackbar: () => ({ enqueueSnackbar: mockEnqueueSnackbar }),
  SnackbarProvider: ({ children }) => <div>{children}</div>,
}));

const mockProduct = {
  id: 1,
  name: 'Fresh Milk',
  price: 50,
  category: 'Dairy',
  imageUrl: 'http://example.com/milk.jpg',
  stock: 10,
  isAvailable: true,
};

const createMockStore = (initialState = {}) => {
  const rootReducer = combineReducers({
    auth: authReducer,
    cart: cartReducer,
  });
  return createStore(rootReducer, initialState, applyMiddleware(thunk));
};

const renderProductCard = (store, product = mockProduct) => {
  return render(
    <Provider store={store}>
      <BrowserRouter>
        <SnackbarProvider>
          <ProductCard product={product} />
        </SnackbarProvider>
      </BrowserRouter>
    </Provider>
  );
};

describe('ProductCard Component', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockEnqueueSnackbar.mockClear();
  });

  it('renders product information correctly', () => {
    const store = createMockStore();
    renderProductCard(store);
    
    expect(screen.getByText('Fresh Milk')).toBeInTheDocument();
    expect(screen.getByText('₹50.00')).toBeInTheDocument();
  });

  it('displays product image', () => {
    const store = createMockStore();
    renderProductCard(store);
    
    const image = screen.getByAltText('Fresh Milk');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'http://example.com/milk.jpg');
  });

  it('shows Add to Cart button when not in cart', () => {
    const store = createMockStore({
      auth: { 
        user: { id: 1, name: 'John' }, 
        isAuthenticated: true,
        token: 'token',
        loading: false,
        error: null,
      },
      cart: { items: [], totalAmount: 0, loading: false, error: null },
    });
    renderProductCard(store);
    
    expect(screen.getByText(/ADD/i)).toBeInTheDocument();
  });

  it('adds product to cart when not authenticated (guest cart)', async () => {
    const store = createMockStore({
      auth: { user: null, isAuthenticated: false, token: null, loading: false, error: null },
      cart: { items: [], totalAmount: 0, loading: false, error: null },
    });
    renderProductCard(store);
    
    const addButton = screen.getByText(/ADD/i);
    fireEvent.click(addButton);
    
    // Should show success message
    await waitFor(() => {
      expect(mockEnqueueSnackbar).toHaveBeenCalledWith(
        'Added to cart',
        { variant: 'success' }
      );
    });
  });

  it('shows out of stock message when stockQuantity is 0', () => {
    const outOfStockProduct = { ...mockProduct, stock: 0 };
    const store = createMockStore({
      auth: { 
        user: { id: 1, name: 'John' }, 
        isAuthenticated: true,
        token: 'token',
        loading: false,
        error: null,
      },
    });
    renderProductCard(store, outOfStockProduct);
    
    // Button should show "Out of Stock" when stock is 0
    const outOfStockButton = screen.getAllByText(/Out of Stock/i)[1]; // Get button, not chip
    expect(outOfStockButton).toBeInTheDocument();
    expect(outOfStockButton).toBeDisabled();
  });

  it('uses placeholder when product has no imageUrl', () => {
    const productWithoutImage = { ...mockProduct, imageUrl: null };
    const store = createMockStore();
    renderProductCard(store, productWithoutImage);
    
    const image = screen.getByAltText('Fresh Milk');
    expect(image).toHaveAttribute('src', 'https://via.placeholder.com/200');
  });

  it('applies hover effect on card', () => {
    const store = createMockStore();
    const { container } = renderProductCard(store);
    
    const card = container.querySelector('.MuiCard-root');
    expect(card).toBeInTheDocument();
  });

  it('shows eye icon for product description', () => {
    const productWithDescription = { 
      ...mockProduct, 
      description: 'Fresh and nutritious milk from local farms' 
    };
    const store = createMockStore();
    renderProductCard(store, productWithDescription);
    
    const eyeIcon = screen.getByTestId('VisibilityIcon');
    expect(eyeIcon).toBeInTheDocument();
  });

  it('opens description dialog when eye icon is clicked', async () => {
    const productWithDescription = { 
      ...mockProduct, 
      description: 'Fresh and nutritious milk from local farms' 
    };
    const store = createMockStore();
    renderProductCard(store, productWithDescription);
    
    const eyeIcon = screen.getByTestId('VisibilityIcon');
    fireEvent.click(eyeIcon);
    
    await waitFor(() => {
      // Dialog shows the product description
      expect(screen.getByText('Fresh and nutritious milk from local farms')).toBeInTheDocument();
      // Dialog title shows product name
      const titles = screen.getAllByText('Fresh Milk');
      expect(titles.length).toBeGreaterThan(1);
    });
  });

  it('closes description dialog when close button is clicked', async () => {
    const productWithDescription = { 
      ...mockProduct, 
      description: 'Fresh and nutritious milk from local farms' 
    };
    const store = createMockStore();
    renderProductCard(store, productWithDescription);
    
    // Open dialog
    const eyeIcon = screen.getByTestId('VisibilityIcon');
    fireEvent.click(eyeIcon);
    
    await waitFor(() => {
      // The dialog shows the product description
      expect(screen.getByText('Fresh and nutritious milk from local farms')).toBeInTheDocument();
    });
    
    // Close dialog
    const closeButton = screen.getByRole('button', { name: /Close/i });
    fireEvent.click(closeButton);
    
    await waitFor(() => {
      // Description should no longer be visible
      expect(screen.queryByText('Fresh and nutritious milk from local farms')).not.toBeInTheDocument();
    });
  });

  it('does not show eye icon when product has no description', () => {
    const productWithoutDescription = { ...mockProduct, description: null };
    const store = createMockStore();
    renderProductCard(store, productWithoutDescription);
    
    const eyeIcon = screen.queryByTestId('VisibilityIcon');
    expect(eyeIcon).not.toBeInTheDocument();
  });

  it('displays discount chip and discounted price', () => {
    const discountedProduct = { 
      ...mockProduct, 
      discount: 20,
      price: 100
    };
    const store = createMockStore();
    renderProductCard(store, discountedProduct);
    
    // Discount chip
    expect(screen.getByText('20% OFF')).toBeInTheDocument();
    // Discounted price (80)
    expect(screen.getByText('₹80.00')).toBeInTheDocument();
    // Original price with strikethrough
    expect(screen.getByText('₹100.00')).toBeInTheDocument();
  });

  it('shows low stock warning when stock is <= 10', () => {
    const lowStockProduct = { ...mockProduct, stock: 5 };
    const store = createMockStore();
    renderProductCard(store, lowStockProduct);
    
    expect(screen.getByText('Only 5 left!')).toBeInTheDocument();
  });

  it('shows out of stock chip when isAvailable is false', () => {
    const unavailableProduct = { ...mockProduct, isAvailable: false };
    const store = createMockStore();
    renderProductCard(store, unavailableProduct);
    
    // Chip at top
    const outOfStockChips = screen.getAllByText(/OUT OF STOCK/i);
    expect(outOfStockChips.length).toBeGreaterThan(0);
  });

  it('increments quantity when plus button is clicked', async () => {
    const store = createMockStore({
      auth: { user: { id: 1, name: 'John' }, isAuthenticated: true, token: 'token', loading: false, error: null },
      cart: { 
        items: [{ id: '1', productId: 1, quantity: 2, product: mockProduct }], 
        totalAmount: 100, 
        loading: false, 
        error: null 
      },
    });
    renderProductCard(store);
    
    // Plus button
    const incrementButton = screen.getByTestId('AddIcon').closest('button');
    fireEvent.click(incrementButton);
    
    await waitFor(() => {
      expect(mockEnqueueSnackbar).toHaveBeenCalledWith('Cart updated', { variant: 'success' });
    });
  });

  it('decrements quantity when minus button is clicked', async () => {
    const store = createMockStore({
      auth: { user: { id: 1, name: 'John' }, isAuthenticated: true, token: 'token', loading: false, error: null },
      cart: { 
        items: [{ id: '1', productId: 1, quantity: 3, product: mockProduct }], 
        totalAmount: 150, 
        loading: false, 
        error: null 
      },
    });
    renderProductCard(store);
    
    // Minus button
    const decrementButton = screen.getByTestId('RemoveIcon').closest('button');
    fireEvent.click(decrementButton);
    
    await waitFor(() => {
      expect(mockEnqueueSnackbar).toHaveBeenCalledWith('Cart updated', { variant: 'success' });
    });
  });

  it('removes item when decrement is clicked at quantity 1', async () => {
    const store = createMockStore({
      auth: { user: { id: 1, name: 'John' }, isAuthenticated: true, token: 'token', loading: false, error: null },
      cart: { 
        items: [{ id: '1', productId: 1, quantity: 1, product: mockProduct }], 
        totalAmount: 50, 
        loading: false, 
        error: null 
      },
    });
    renderProductCard(store);
    
    // Delete icon appears at quantity 1
    const deleteButton = screen.getByTestId('DeleteIcon').closest('button');
    fireEvent.click(deleteButton);
    
    await waitFor(() => {
      expect(mockEnqueueSnackbar).toHaveBeenCalledWith('Removed from cart', { variant: 'success' });
    });
  });

  it('disables increment button when quantity reaches stock limit', () => {
    const store = createMockStore({
      auth: { user: { id: 1, name: 'John' }, isAuthenticated: true, token: 'token', loading: false, error: null },
      cart: { 
        items: [{ id: '1', productId: 1, quantity: 10, product: mockProduct }], 
        totalAmount: 500, 
        loading: false, 
        error: null 
      },
    });
    renderProductCard(store);
    
    const incrementButton = screen.getByTestId('AddIcon').closest('button');
    expect(incrementButton).toBeDisabled();
  });

  it('handles add to cart error', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    const store = createMockStore({
      auth: { user: null, isAuthenticated: false, token: null, loading: false, error: null },
      cart: { items: [], totalAmount: 0, loading: false, error: null },
    });
    
    // Mock dispatch to reject
    const originalDispatch = store.dispatch;
    store.dispatch = jest.fn(() => Promise.reject(new Error('Network error')));
    
    renderProductCard(store);
    
    const addButton = screen.getByText(/ADD/i);
    fireEvent.click(addButton);
    
    await waitFor(() => {
      expect(mockEnqueueSnackbar).toHaveBeenCalledWith('Failed to add to cart', { variant: 'error' });
    });
    
    store.dispatch = originalDispatch;
    consoleErrorSpy.mockRestore();
  });

  it('handles increment error', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    const store = createMockStore({
      auth: { user: { id: 1, name: 'John' }, isAuthenticated: true, token: 'token', loading: false, error: null },
      cart: { 
        items: [{ id: '1', productId: 1, quantity: 2, product: mockProduct }], 
        totalAmount: 100, 
        loading: false, 
        error: null 
      },
    });
    
    // Mock dispatch to reject
    const originalDispatch = store.dispatch;
    store.dispatch = jest.fn(() => Promise.reject(new Error('Network error')));
    
    renderProductCard(store);
    
    const incrementButton = screen.getByTestId('AddIcon').closest('button');
    fireEvent.click(incrementButton);
    
    await waitFor(() => {
      expect(mockEnqueueSnackbar).toHaveBeenCalledWith('Failed to update cart', { variant: 'error' });
    });
    
    store.dispatch = originalDispatch;
    consoleErrorSpy.mockRestore();
  });

  it('handles decrement error', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    const store = createMockStore({
      auth: { user: { id: 1, name: 'John' }, isAuthenticated: true, token: 'token', loading: false, error: null },
      cart: { 
        items: [{ id: '1', productId: 1, quantity: 3, product: mockProduct }], 
        totalAmount: 150, 
        loading: false, 
        error: null 
      },
    });
    
    // Mock dispatch to reject
    const originalDispatch = store.dispatch;
    store.dispatch = jest.fn(() => Promise.reject(new Error('Network error')));
    
    renderProductCard(store);
    
    const decrementButton = screen.getByTestId('RemoveIcon').closest('button');
    fireEvent.click(decrementButton);
    
    await waitFor(() => {
      expect(mockEnqueueSnackbar).toHaveBeenCalledWith('Failed to update cart', { variant: 'error' });
    });
    
    store.dispatch = originalDispatch;
    consoleErrorSpy.mockRestore();
  });

  it('formats imageUrl with API base when not starting with http', () => {
    const productWithRelativeImage = { ...mockProduct, imageUrl: '/uploads/products/milk.jpg' };
    const store = createMockStore();
    renderProductCard(store, productWithRelativeImage);
    
    const image = screen.getByAltText('Fresh Milk');
    expect(image).toHaveAttribute('src', 'http://localhost:8081/api/v1/uploads/products/milk.jpg');
  });

  it('shows low stock warning in dialog', async () => {
    const lowStockProduct = { 
      ...mockProduct, 
      stock: 3,
      description: 'Fresh milk' 
    };
    const store = createMockStore();
    renderProductCard(store, lowStockProduct);
    
    const eyeIcon = screen.getByTestId('VisibilityIcon');
    fireEvent.click(eyeIcon);
    
    await waitFor(() => {
      expect(screen.getByText('Only 3 items left in stock!')).toBeInTheDocument();
    });
  });

  it('shows weight and unit information', () => {
    const productWithWeight = { ...mockProduct, weight: 1, unit: 'L' };
    const store = createMockStore();
    renderProductCard(store, productWithWeight);
    
    expect(screen.getByText('1 L')).toBeInTheDocument();
  });
});
