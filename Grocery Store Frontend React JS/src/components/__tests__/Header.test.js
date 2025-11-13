import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import {thunk} from 'redux-thunk';
import Header from '../Header';
import authReducer from '../../redux/reducers/authReducer';
import cartReducer from '../../redux/reducers/cartReducer';
import productReducer from '../../redux/reducers/productReducer';
import { LocationProvider } from '../../context/LocationContext';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const createMockStore = (initialState = {}) => {
  const rootReducer = combineReducers({
    auth: authReducer,
    cart: cartReducer,
    products: productReducer,
  });
  return createStore(rootReducer, initialState, applyMiddleware(thunk));
};

const renderHeader = (store) => {
  return render(
    <Provider store={store}>
      <BrowserRouter>
        <LocationProvider>
          <Header />
        </LocationProvider>
      </BrowserRouter>
    </Provider>
  );
};

describe('Header Component', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    localStorage.clear();
  });

  it('renders Grocery logo', () => {
    const store = createMockStore({
      products: { products: [], loading: false, error: null },
    });
    renderHeader(store);
    expect(screen.getByText(/Grocery/i)).toBeInTheDocument();
  });

  it('displays delivery location information', () => {
    const store = createMockStore({
      products: { products: [], loading: false, error: null },
    });
    renderHeader(store);
    expect(screen.getByText(/Delivery in/i)).toBeInTheDocument();
    expect(screen.getByText(/Brookefield/i)).toBeInTheDocument();
  });

  it('shows Login button when user is not authenticated', () => {
    const store = createMockStore({
      auth: { user: null, isAuthenticated: false, loading: false, error: null, token: null },
      products: { products: [], loading: false, error: null },
    });
    renderHeader(store);
    expect(screen.getByText(/Login/i)).toBeInTheDocument();
  });

  it('shows user name when authenticated', async () => {
    const store = createMockStore({
      auth: {
        user: { name: 'John Doe', email: 'john@example.com' },
        isAuthenticated: true,
        loading: false,
        error: null,
        token: 'mock-token',
      },
      products: { products: [], loading: false, error: null },
    });
    renderHeader(store);
    
    // Click the Account button to open the menu
    const accountButton = screen.getByRole('button', { name: /Account/i });
    fireEvent.click(accountButton);
    
    // Now the menu should be visible with the user name
    await waitFor(() => {
      expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
    });
  });

  it('displays cart icon with item count badge', () => {
    const store = createMockStore({
      cart: {
        items: [
          { cartItemId: 1, quantity: 2 },
          { cartItemId: 2, quantity: 3 },
        ],
        totalAmount: 100,
        loading: false,
        error: null,
      },
      products: { products: [], loading: false, error: null },
    });
    renderHeader(store);
    expect(screen.getByText('5')).toBeInTheDocument(); // Total quantity: 2 + 3
  });

  it('displays search box in header', () => {
    const store = createMockStore({
      products: { products: [], loading: false, error: null },
    });
    renderHeader(store);
    const searchBox = screen.getByRole('textbox');
    expect(searchBox).toBeInTheDocument();
  });

  it('shows search suggestions when typing', async () => {
    const store = createMockStore({
      products: {
        products: [
          { id: 1, name: 'Milk', categoryName: 'Dairy', imageUrl: '/milk.jpg' },
          { id: 2, name: 'Bread', categoryName: 'Bakery', imageUrl: '/bread.jpg' },
        ],
        loading: false,
        error: null,
      },
    });
    renderHeader(store);
    const searchBox = screen.getByRole('textbox');
    
    fireEvent.change(searchBox, { target: { value: 'mil' } });
    
    await waitFor(() => {
      expect(screen.getByText('Milk')).toBeInTheDocument();
    });
  });

  it('navigates to home when logo is clicked', () => {
    const store = createMockStore({
      products: { products: [], loading: false, error: null },
    });
    renderHeader(store);
    const logo = screen.getByText(/Grocery/i);
    fireEvent.click(logo);
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('navigates to login when Login button is clicked', () => {
    const store = createMockStore({
      auth: { user: null, isAuthenticated: false, loading: false, error: null, token: null },
      products: { products: [], loading: false, error: null },
    });
    renderHeader(store);
    const loginButton = screen.getByText(/Login/i);
    fireEvent.click(loginButton);
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('opens location modal when location area is clicked', () => {
    const store = createMockStore({
      products: { products: [], loading: false, error: null },
    });
    renderHeader(store);
    const locationArea = screen.getByText(/Delivery in/i).closest('div');
    fireEvent.click(locationArea);
    expect(screen.getByText(/Change Location/i)).toBeInTheDocument();
  });

  it('handles search form submission', async () => {
    const store = createMockStore({
      products: { products: [], loading: false, error: null },
    });
    renderHeader(store);
    const searchBox = screen.getByRole('textbox');
    
    fireEvent.change(searchBox, { target: { value: 'apple' } });
    fireEvent.submit(searchBox.closest('form'));
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/?search=apple');
    });
  });

  it('navigates when suggestion is clicked', async () => {
    const store = createMockStore({
      products: {
        products: [
          { id: 1, name: 'Milk', categoryName: 'Dairy', imageUrl: '/milk.jpg' },
        ],
        loading: false,
        error: null,
      },
    });
    renderHeader(store);
    const searchBox = screen.getByRole('textbox');
    
    fireEvent.change(searchBox, { target: { value: 'mil' } });
    
    await waitFor(() => {
      expect(screen.getByText('Milk')).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText('Milk'));
    
    expect(mockNavigate).toHaveBeenCalledWith('/?search=Milk');
  });

  it('clears suggestions when search query is empty', async () => {
    const store = createMockStore({
      products: {
        products: [
          { id: 1, name: 'Milk', categoryName: 'Dairy', imageUrl: '/milk.jpg' },
        ],
        loading: false,
        error: null,
      },
    });
    renderHeader(store);
    const searchBox = screen.getByRole('textbox');
    
    fireEvent.change(searchBox, { target: { value: 'mil' } });
    
    await waitFor(() => {
      expect(screen.getByText('Milk')).toBeInTheDocument();
    });
    
    fireEvent.change(searchBox, { target: { value: '' } });
    
    await waitFor(() => {
      expect(screen.queryByText('Milk')).not.toBeInTheDocument();
    });
  });

  it('shows suggestions on focus if query exists', async () => {
    const store = createMockStore({
      products: {
        products: [
          { id: 1, name: 'Milk', categoryName: 'Dairy', imageUrl: '/milk.jpg' },
        ],
        loading: false,
        error: null,
      },
    });
    renderHeader(store);
    const searchBox = screen.getByRole('textbox');
    
    // Type something
    fireEvent.change(searchBox, { target: { value: 'mil' } });
    
    await waitFor(() => {
      expect(screen.getByText('Milk')).toBeInTheDocument();
    });
    
    // Click away
    fireEvent.mouseDown(document.body);
    
    // Focus again - should show suggestions
    fireEvent.focus(searchBox);
    
    await waitFor(() => {
      expect(screen.getByText('Milk')).toBeInTheDocument();
    });
  });

  it('filters products by category name in search', async () => {
    const store = createMockStore({
      products: {
        products: [
          { id: 1, name: 'Milk', categoryName: 'Dairy', imageUrl: '/milk.jpg' },
          { id: 2, name: 'Cheese', categoryName: 'Dairy', imageUrl: '/cheese.jpg' },
          { id: 3, name: 'Bread', categoryName: 'Bakery', imageUrl: '/bread.jpg' },
        ],
        loading: false,
        error: null,
      },
    });
    renderHeader(store);
    const searchBox = screen.getByRole('textbox');
    
    fireEvent.change(searchBox, { target: { value: 'dairy' } });
    
    await waitFor(() => {
      expect(screen.getByText('Milk')).toBeInTheDocument();
      expect(screen.getByText('Cheese')).toBeInTheDocument();
      expect(screen.queryByText('Bread')).not.toBeInTheDocument();
    });
  });

  it('limits search suggestions to 8 items', async () => {
    const products = Array.from({ length: 15 }, (_, i) => ({
      id: i + 1,
      name: `Product ${i + 1}`,
      categoryName: 'Category',
      imageUrl: `/product${i + 1}.jpg`
    }));
    
    const store = createMockStore({
      products: {
        products,
        loading: false,
        error: null,
      },
    });
    renderHeader(store);
    const searchBox = screen.getByRole('textbox');
    
    fireEvent.change(searchBox, { target: { value: 'product' } });
    
    await waitFor(() => {
      const suggestions = screen.getAllByRole('button').filter(btn => btn.textContent.includes('Product'));
      expect(suggestions.length).toBeLessThanOrEqual(8);
    });
  });

  it('opens account menu when authenticated and Account is clicked', async () => {
    const store = createMockStore({
      auth: {
        user: { name: 'John Doe', email: 'john@example.com' },
        isAuthenticated: true,
        loading: false,
        error: null,
        token: 'mock-token',
      },
      products: { products: [], loading: false, error: null },
    });
    renderHeader(store);
    
    const accountButton = screen.getByRole('button', { name: /Account/i });
    fireEvent.click(accountButton);
    
    await waitFor(() => {
      expect(screen.getByText('My Orders')).toBeInTheDocument();
      expect(screen.getByText('Saved Addresses')).toBeInTheDocument();
      expect(screen.getByText('Log Out')).toBeInTheDocument();
    });
  });

  it('navigates to My Orders from account menu', async () => {
    const store = createMockStore({
      auth: {
        user: { name: 'John Doe', email: 'john@example.com' },
        isAuthenticated: true,
        loading: false,
        error: null,
        token: 'mock-token',
      },
      products: { products: [], loading: false, error: null },
    });
    renderHeader(store);
    
    const accountButton = screen.getByRole('button', { name: /Account/i });
    fireEvent.click(accountButton);
    
    await waitFor(() => {
      expect(screen.getByText('My Orders')).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText('My Orders'));
    
    expect(mockNavigate).toHaveBeenCalledWith('/my-orders');
  });

  it('navigates to Saved Addresses from account menu', async () => {
    const store = createMockStore({
      auth: {
        user: { name: 'John Doe', email: 'john@example.com' },
        isAuthenticated: true,
        loading: false,
        error: null,
        token: 'mock-token',
      },
      products: { products: [], loading: false, error: null },
    });
    renderHeader(store);
    
    const accountButton = screen.getByRole('button', { name: /Account/i });
    fireEvent.click(accountButton);
    
    await waitFor(() => {
      expect(screen.getByText('Saved Addresses')).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText('Saved Addresses'));
    
    expect(mockNavigate).toHaveBeenCalledWith('/saved-addresses');
  });

  it('dispatches logout and navigates home when Log Out is clicked', async () => {
    const store = createMockStore({
      auth: {
        user: { name: 'John Doe', email: 'john@example.com' },
        isAuthenticated: true,
        loading: false,
        error: null,
        token: 'mock-token',
      },
      products: { products: [], loading: false, error: null },
    });
    renderHeader(store);
    
    const accountButton = screen.getByRole('button', { name: /Account/i });
    fireEvent.click(accountButton);
    
    await waitFor(() => {
      expect(screen.getByText('Log Out')).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText('Log Out'));
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('opens cart drawer when cart icon is clicked', () => {
    const store = createMockStore({
      cart: { items: [], totalAmount: 0, loading: false, error: null },
      products: { products: [], loading: false, error: null },
    });
    renderHeader(store);
    
    const cartButton = screen.getByLabelText(/shopping cart/i);
    fireEvent.click(cartButton);
    
    expect(screen.getByText(/My Cart/i)).toBeInTheDocument();
  });

  it('displays user email when name is not available', async () => {
    const store = createMockStore({
      auth: {
        user: { email: 'john@example.com' },
        isAuthenticated: true,
        loading: false,
        error: null,
        token: 'mock-token',
      },
      products: { products: [], loading: false, error: null },
    });
    renderHeader(store);
    
    const accountButton = screen.getByRole('button', { name: /Account/i });
    fireEvent.click(accountButton);
    
    await waitFor(() => {
      expect(screen.getByText('john@example.com')).toBeInTheDocument();
    });
  });

  it('does not submit search when query is only whitespace', () => {
    const store = createMockStore({
      products: { products: [], loading: false, error: null },
    });
    renderHeader(store);
    const searchBox = screen.getByRole('textbox');
    
    fireEvent.change(searchBox, { target: { value: '   ' } });
    fireEvent.submit(searchBox.closest('form'));
    
    // Should not navigate
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('displays suggestion images when imageUrl is provided', async () => {
    const store = createMockStore({
      products: {
        products: [
          { id: 1, name: 'Milk', categoryName: 'Dairy', imageUrl: 'http://example.com/milk.jpg' },
        ],
        loading: false,
        error: null,
      },
    });
    renderHeader(store);
    const searchBox = screen.getByRole('textbox');
    
    fireEvent.change(searchBox, { target: { value: 'mil' } });
    
    await waitFor(() => {
      const img = screen.getByAltText('Milk');
      expect(img).toHaveAttribute('src', 'http://example.com/milk.jpg');
    });
  });

  it('displays suggestions without imageUrl gracefully', async () => {
    const store = createMockStore({
      products: {
        products: [
          { id: 1, name: 'Milk', categoryName: 'Dairy', imageUrl: null },
        ],
        loading: false,
        error: null,
      },
    });
    renderHeader(store);
    const searchBox = screen.getByRole('textbox');
    
    fireEvent.change(searchBox, { target: { value: 'mil' } });
    
    await waitFor(() => {
      expect(screen.getByText('Milk')).toBeInTheDocument();
    });
  });

  it('displays category information in suggestions when available', async () => {
    const store = createMockStore({
      products: {
        products: [
          { id: 1, name: 'Milk', categoryName: 'Dairy', imageUrl: '/milk.jpg' },
        ],
        loading: false,
        error: null,
      },
    });
    renderHeader(store);
    const searchBox = screen.getByRole('textbox');
    
    fireEvent.change(searchBox, { target: { value: 'mil' } });
    
    await waitFor(() => {
      expect(screen.getByText('in Dairy')).toBeInTheDocument();
    });
  });

  it('handles products without category gracefully', async () => {
    const store = createMockStore({
      products: {
        products: [
          { id: 1, name: 'Milk', categoryName: null, imageUrl: '/milk.jpg' },
        ],
        loading: false,
        error: null,
      },
    });
    renderHeader(store);
    const searchBox = screen.getByRole('textbox');
    
    fireEvent.change(searchBox, { target: { value: 'mil' } });
    
    await waitFor(() => {
      expect(screen.getByText('Milk')).toBeInTheDocument();
      expect(screen.queryByText(/^in /)).not.toBeInTheDocument();
    });
  });
});
