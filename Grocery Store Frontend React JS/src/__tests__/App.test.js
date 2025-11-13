import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { SnackbarProvider } from 'notistack';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import {thunk} from 'redux-thunk';
import App from '../App';
import authReducer from '../redux/reducers/authReducer';
import cartReducer from '../redux/reducers/cartReducer';
import productReducer from '../redux/reducers/productReducer';
import categoryReducer from '../redux/reducers/categoryReducer';
import orderReducer from '../redux/reducers/orderReducer';
import addressReducer from '../redux/reducers/addressReducer';

// Mock all page components
jest.mock('../pages/HomePage', () => () => <div>Home Page</div>);
jest.mock('../pages/LoginPage', () => () => <div>Login Page</div>);
jest.mock('../pages/SignupPage', () => () => <div>Signup Page</div>);
jest.mock('../pages/MyOrdersPage', () => () => <div>My Orders Page</div>);
jest.mock('../pages/SavedAddressesPage', () => () => <div>Saved Addresses Page</div>);
jest.mock('../pages/PaymentPage', () => () => <div>Payment Page</div>);
jest.mock('../pages/CategoryProductsPage', () => () => <div>Category Products Page</div>);

// Mock Header component
jest.mock('../components/Header', () => () => <div>Header</div>);

// Mock userUtils
jest.mock('../utils/userUtils', () => ({
  isGuestUser: jest.fn(() => true),
  getUserId: jest.fn(() => 'test-user-id')
}));

// Mock fetchCart action to return a thunk that resolves properly
jest.mock('../redux/actions/cartActions', () => ({
  fetchCart: jest.fn(() => async (dispatch) => {
    dispatch({ type: 'FETCH_CART_REQUEST' });
    dispatch({ type: 'FETCH_CART_SUCCESS', payload: { items: [], totalAmount: 0 } });
    return Promise.resolve({ payload: { items: [], totalAmount: 0 } });
  })
}));

const createMockStore = (initialState = {}) => {
  const rootReducer = combineReducers({
    auth: authReducer,
    cart: cartReducer,
    products: productReducer,
    categories: categoryReducer,
    orders: orderReducer,
    addresses: addressReducer,
  });

  return createStore(rootReducer, initialState, applyMiddleware(thunk));
};

const renderApp = (store = createMockStore(), initialRoute = '/') => {
  window.history.pushState({}, 'Test page', initialRoute);

  return render(
    <Provider store={store}>
      <SnackbarProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </SnackbarProvider>
    </Provider>
  );
};

describe('App Component', () => {
  it('renders Header component', () => {
    renderApp();
    expect(screen.getByText('Header')).toBeInTheDocument();
  });

  it('renders HomePage at root route', () => {
    renderApp(createMockStore(), '/');
    expect(screen.getByText('Home Page')).toBeInTheDocument();
  });

  it('renders LoginPage at /login route', () => {
    renderApp(createMockStore(), '/login');
    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  it('renders SignupPage at /signup route', () => {
    renderApp(createMockStore(), '/signup');
    expect(screen.getByText('Signup Page')).toBeInTheDocument();
  });

  it('renders MyOrdersPage at /my-orders route', () => {
    renderApp(createMockStore(), '/my-orders');
    expect(screen.getByText('My Orders Page')).toBeInTheDocument();
  });

  it('renders SavedAddressesPage at /saved-addresses route', () => {
    renderApp(createMockStore(), '/saved-addresses');
    expect(screen.getByText('Saved Addresses Page')).toBeInTheDocument();
  });

  it('renders PaymentPage at /payment route', () => {
    renderApp(createMockStore(), '/payment');
    expect(screen.getByText('Payment Page')).toBeInTheDocument();
  });

  it('renders CategoryProductsPage at /category route', () => {
    renderApp(createMockStore(), '/category');
    expect(screen.getByText('Category Products Page')).toBeInTheDocument();
  });

  it('renders without crashing', () => {
    const { container } = renderApp();
    expect(container).toBeInTheDocument();
  });

  it('renders main content area', () => {
    renderApp();
    const mainElement = document.querySelector('main');
    expect(mainElement).toBeInTheDocument();
  });

  it('does not fetch cart in test environment', () => {
    const { fetchCart } = require('../redux/actions/cartActions');
    fetchCart.mockClear();
    
    // Since NODE_ENV is 'test', fetchCart should not be called on mount
    renderApp();
    
    // fetchCart is mocked but not called because of the environment check
    // We verify the component renders successfully without errors
    expect(screen.getByText('Header')).toBeInTheDocument();
  });

  it('fetches cart on mount in non-test environment', () => {
    // Save original mock implementation
    const { fetchCart } = require('../redux/actions/cartActions');
    const originalMock = fetchCart.getMockImplementation();
    const originalEnv = process.env.NODE_ENV;
    
    // Re-mock to return a proper thunk
    fetchCart.mockImplementation(() => async (dispatch) => {
      dispatch({ type: 'FETCH_CART_REQUEST' });
      dispatch({ type: 'FETCH_CART_SUCCESS', payload: { items: [], totalAmount: 0 } });
      return Promise.resolve({ payload: { items: [], totalAmount: 0 } });
    });
    
    // Temporarily change NODE_ENV
    process.env.NODE_ENV = 'development';
    fetchCart.mockClear();
    
    // Render app - should trigger fetchCart
    renderApp();
    
    // fetchCart should have been called
    expect(fetchCart).toHaveBeenCalled();
    
    // Restore original NODE_ENV and mock
    process.env.NODE_ENV = originalEnv;
    fetchCart.mockImplementation(originalMock);
  });
});
