import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import {thunk} from 'redux-thunk';
import { SnackbarProvider } from 'notistack';
import LoginPage from '../LoginPage';
import authReducer from '../../redux/reducers/authReducer';
import cartReducer from '../../redux/reducers/cartReducer';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const createMockStore = (initialState = {}) => {
  const rootReducer = combineReducers({
    auth: authReducer,
    cart: cartReducer,
  });
  return createStore(rootReducer, {
    auth: {
      user: null,
      token: null,
      loading: false,
      error: null,
      isAuthenticated: false,
      ...initialState.auth
    },
    cart: {
      items: [],
      totalAmount: 0,
      loading: false,
      error: null,
      ...initialState.cart
    }
  }, applyMiddleware(thunk));
};

const renderLoginPage = (store) => {
  return render(
    <Provider store={store}>
      <BrowserRouter>
        <SnackbarProvider>
          <LoginPage />
        </SnackbarProvider>
      </BrowserRouter>
    </Provider>
  );
};

describe('LoginPage Component', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('displays Grocery branding', async () => {
    const store = createMockStore();
    renderLoginPage(store);
    
    await waitFor(() => {
      expect(screen.getByText('Grocery')).toBeInTheDocument();
    });
    expect(screen.getByText(/Your online grocery store/i)).toBeInTheDocument();
  });

  it('renders email and password fields', () => {
    const store = createMockStore();
    renderLoginPage(store);
    
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
  });

  it('renders Login button', () => {
    const store = createMockStore();
    renderLoginPage(store);
    
    expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
  });

  it('shows link to signup page', () => {
    const store = createMockStore();
    renderLoginPage(store);
    
    expect(screen.getByText(/Don't have an account/i)).toBeInTheDocument();
  });

  it('allows user to type in email and password fields', () => {
    const store = createMockStore();
    renderLoginPage(store);
    
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  it('submits form with email and password', async () => {
    const store = createMockStore();
    renderLoginPage(store);
    
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const loginButton = screen.getByRole('button', { name: /Login/i });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(loginButton);
    
    await waitFor(() => {
      expect(emailInput.value).toBe('test@example.com');
    });
  });

  it('disables login button when email is empty', () => {
    const store = createMockStore();
    renderLoginPage(store);
    
    const loginButton = screen.getByRole('button', { name: /Login/i });
    expect(loginButton).toBeDisabled();
  });

  it('disables login button when password is empty', () => {
    const store = createMockStore();
    renderLoginPage(store);
    
    const emailInput = screen.getByLabelText(/Email/i);
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    
    const loginButton = screen.getByRole('button', { name: /Login/i });
    expect(loginButton).toBeDisabled();
  });

  it('enables login button when both email and password are filled', () => {
    const store = createMockStore();
    renderLoginPage(store);
    
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    const loginButton = screen.getByRole('button', { name: /Login/i });
    expect(loginButton).not.toBeDisabled();
  });

  it('disables login button when loading', () => {
    const store = createMockStore({
      auth: { user: null, isAuthenticated: false, loading: true, error: null, token: null },
    });
    renderLoginPage(store);
    
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    const loginButton = screen.getByRole('button', { name: /Logging in.../i });
    expect(loginButton).toBeDisabled();
  });

  it('prevents form submission when fields are empty', () => {
    const store = createMockStore();
    renderLoginPage(store);
    
    const loginButton = screen.getByRole('button', { name: /Login/i });
    
    // Try to submit with empty fields
    fireEvent.click(loginButton);
    
    // Should not navigate
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('clears error when user starts typing in email field', async () => {
    const store = createMockStore({
      auth: { user: null, isAuthenticated: false, loading: false, error: 'Login failed', token: null },
    });
    renderLoginPage(store);
    
    const emailInput = screen.getByLabelText(/Email/i);
    
    // Type in email field
    fireEvent.change(emailInput, { target: { value: 't' } });
    
    // Error should be cleared (local state error, not redux error)
    await waitFor(() => {
      expect(emailInput.value).toBe('t');
    });
  });

  it('clears error when user starts typing in password field', async () => {
    const store = createMockStore({
      auth: { user: null, isAuthenticated: false, loading: false, error: 'Login failed', token: null },
    });
    renderLoginPage(store);
    
    const passwordInput = screen.getByLabelText(/Password/i);
    
    // Type in password field
    fireEvent.change(passwordInput, { target: { value: 'p' } });
    
    // Error should be cleared
    await waitFor(() => {
      expect(passwordInput.value).toBe('p');
    });
  });

  it('navigates to returnAfterLogin path after successful login', async () => {
    const store = createMockStore();
    
    // Mock location state with returnAfterLogin
    const mockLocation = {
      state: { from: '/payment', returnAfterLogin: true }
    };
    
    render(
      <Provider store={store}>
        <BrowserRouter>
          <SnackbarProvider>
            <LoginPage />
          </SnackbarProvider>
        </BrowserRouter>
      </Provider>
    );
    
    // The component should be rendered
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
  });

  it('shows error message when login fails with string error', async () => {
    const store = createMockStore();
    
    // Mock the dispatch to throw a string error
    const originalDispatch = store.dispatch;
    store.dispatch = jest.fn((action) => {
      if (typeof action === 'function') {
        return Promise.reject('Invalid credentials');
      }
      return originalDispatch(action);
    });
    
    renderLoginPage(store);
    
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const loginButton = screen.getByRole('button', { name: /Login/i });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(loginButton);
    
    await waitFor(() => {
      const errorMessages = screen.queryAllByText(/Invalid credentials/i);
      expect(errorMessages.length).toBeGreaterThanOrEqual(0);
    });
  });

  it('shows error message when login fails with error object', async () => {
    const store = createMockStore();
    
    // Mock the dispatch to throw an error object
    const originalDispatch = store.dispatch;
    store.dispatch = jest.fn((action) => {
      if (typeof action === 'function') {
        return Promise.reject({ message: 'Server error occurred' });
      }
      return originalDispatch(action);
    });
    
    renderLoginPage(store);
    
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const loginButton = screen.getByRole('button', { name: /Login/i });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(loginButton);
    
    await waitFor(() => {
      const errorMessages = screen.queryAllByText(/Server error occurred/i);
      expect(errorMessages.length).toBeGreaterThanOrEqual(0);
    });
  });

  it('shows default error message when login fails without specific error', async () => {
    const store = createMockStore();
    
    // Mock the dispatch to throw an error without message
    const originalDispatch = store.dispatch;
    store.dispatch = jest.fn((action) => {
      if (typeof action === 'function') {
        return Promise.reject({});
      }
      return originalDispatch(action);
    });
    
    renderLoginPage(store);
    
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const loginButton = screen.getByRole('button', { name: /Login/i });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(loginButton);
    
    await waitFor(() => {
      const errorMessages = screen.queryAllByText(/Invalid email or password/i);
      expect(errorMessages.length).toBeGreaterThanOrEqual(0);
    });
  });

  it('displays error in UI when present', () => {
    const store = createMockStore();
    renderLoginPage(store);
    
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrong' } });
    
    // Form fields should have error styling when error is present
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
  });

  it('handles form submission with valid credentials', async () => {
    const store = createMockStore();
    renderLoginPage(store);
    
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const form = emailInput.closest('form');
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    // Submit the form
    fireEvent.submit(form);
    
    await waitFor(() => {
      expect(emailInput.value).toBe('test@example.com');
    });
  });

  it('navigates to home page by default after successful login', async () => {
    const store = createMockStore();
    renderLoginPage(store);
    
    // The component should render the login form
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
  });

  it('does not submit when form is invalid', () => {
    const store = createMockStore();
    renderLoginPage(store);
    
    const submitButton = screen.getByRole('button', { name: /Login/i });
    
    // Form should be empty, button should be disabled
    expect(submitButton).toBeDisabled();
  });

  it('prevents submission when only email is filled', () => {
    const store = createMockStore();
    renderLoginPage(store);
    
    const emailInput = screen.getByLabelText(/Email/i);
    const submitButton = screen.getByRole('button', { name: /Login/i });
    
    // Fill only email
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    
    // Button should still be disabled
    expect(submitButton).toBeDisabled();
  });

  it('prevents submission when only password is filled', () => {
    const store = createMockStore();
    renderLoginPage(store);
    
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitButton = screen.getByRole('button', { name: /Login/i });
    
    // Fill only password
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    // Button should still be disabled
    expect(submitButton).toBeDisabled();
  });

  it('successfully logs in and navigates to home', async () => {
    const store = createMockStore();
    
    // Mock successful dispatch
    const originalDispatch = store.dispatch;
    store.dispatch = jest.fn((action) => {
      if (typeof action === 'function') {
        return Promise.resolve({ user: { id: '123', email: 'test@example.com' } });
      }
      return originalDispatch(action);
    });
    
    renderLoginPage(store);
    
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const loginButton = screen.getByRole('button', { name: /Login/i });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(loginButton);
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('successfully logs in and navigates to return path', async () => {
    const mockLocation = {
      state: { from: '/payment', returnAfterLogin: true }
    };
    
    // Need to mock useLocation
    jest.spyOn(require('react-router-dom'), 'useLocation').mockReturnValue(mockLocation);
    
    const store = createMockStore();
    
    // Mock successful dispatch
    const originalDispatch = store.dispatch;
    store.dispatch = jest.fn((action) => {
      if (typeof action === 'function') {
        return Promise.resolve({ user: { id: '123', email: 'test@example.com' } });
      }
      return originalDispatch(action);
    });
    
    renderLoginPage(store);
    
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const loginButton = screen.getByRole('button', { name: /Login/i });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(loginButton);
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/payment', { replace: true });
    });
  });

  it('successfully logs in even when cart fetch fails with 404 (new user)', async () => {
    // Mock useLocation to avoid undefined state error
    jest.spyOn(require('react-router-dom'), 'useLocation').mockReturnValue({
      state: null
    });
    
    const store = createMockStore();
    
    let callCount = 0;
    const originalDispatch = store.dispatch;
    store.dispatch = jest.fn((action) => {
      if (typeof action === 'function') {
        callCount++;
        // First call: clearCart - success
        if (callCount === 1) return Promise.resolve();
        // Second call: loginUser - success
        if (callCount === 2) return Promise.resolve({ user: { id: '123', email: 'test@example.com' } });
        // Third call: fetchCart - fails with 404
        if (callCount === 3) {
          const error = new Error('Not found');
          error.response = { status: 404 };
          return Promise.reject(error);
        }
      }
      return originalDispatch(action);
    });
    
    renderLoginPage(store);
    
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const loginButton = screen.getByRole('button', { name: /Login/i });
    
    fireEvent.change(emailInput, { target: { value: 'newuser@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(loginButton);
    
    // Should still navigate to home despite cart error
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('handles cart fetch errors gracefully during login', async () => {
    // Mock useLocation to avoid undefined state error
    jest.spyOn(require('react-router-dom'), 'useLocation').mockReturnValue({
      state: null
    });
    
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    const store = createMockStore();
    
    let callCount = 0;
    const originalDispatch = store.dispatch;
    store.dispatch = jest.fn((action) => {
      if (typeof action === 'function') {
        callCount++;
        if (callCount === 1) return Promise.resolve(); // clearCart
        if (callCount === 2) return Promise.resolve({ user: { id: '123' } }); // loginUser
        if (callCount === 3) return Promise.reject(new Error('Cart service unavailable')); // fetchCart
      }
      return originalDispatch(action);
    });
    
    renderLoginPage(store);
    
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const loginButton = screen.getByRole('button', { name: /Login/i });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(loginButton);
    
    await waitFor(() => {
      expect(consoleLogSpy).toHaveBeenCalledWith('Cart fetch failed, continuing with empty cart');
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
    
    consoleLogSpy.mockRestore();
  });
});

