import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { SnackbarProvider } from 'notistack';
import { AuthProvider, useAuth } from '../AuthContext';

const mockEnqueueSnackbar = jest.fn();
jest.mock('notistack', () => ({
  ...jest.requireActual('notistack'),
  useSnackbar: () => ({ enqueueSnackbar: mockEnqueueSnackbar }),
  SnackbarProvider: ({ children }) => <div>{children}</div>,
}));

// Test component to access context
const TestComponent = () => {
  const { user, isLoggedIn, loading, login, logout } = useAuth();
  return (
    <div>
      <div data-testid="user">{user ? JSON.stringify(user) : 'null'}</div>
      <div data-testid="isLoggedIn">{isLoggedIn.toString()}</div>
      <div data-testid="loading">{loading.toString()}</div>
      <button onClick={() => login({ id: 1, name: 'Test User' }, 'test-token')}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
    mockEnqueueSnackbar.mockClear();
  });

  describe('useAuth hook', () => {
    it('throws error when used outside AuthProvider', () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      const TestComponentWithoutProvider = () => {
        try {
          useAuth();
          return <div>Should not render</div>;
        } catch (error) {
          return <div>{error.message}</div>;
        }
      };

      render(<TestComponentWithoutProvider />);
      expect(screen.getByText('useAuth must be used within AuthProvider')).toBeInTheDocument();
      
      consoleError.mockRestore();
    });

    it('should provide auth context when used within provider', () => {
      function TestComp() {
        const auth = useAuth();
        return <div>{auth ? 'Auth available' : 'No auth'}</div>;
      }

      const { getByText } = render(
        <SnackbarProvider>
          <AuthProvider>
            <TestComp />
          </AuthProvider>
        </SnackbarProvider>
      );

      expect(getByText('Auth available')).toBeInTheDocument();
    });
  });

  describe('AuthProvider initialization', () => {
    it('initializes with no user when localStorage is empty', async () => {
      render(
        <SnackbarProvider>
          <AuthProvider>
            <TestComponent />
          </AuthProvider>
        </SnackbarProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('false');
      });

      expect(screen.getByTestId('user')).toHaveTextContent('null');
      expect(screen.getByTestId('isLoggedIn')).toHaveTextContent('false');
    });

    it('loads user from localStorage on mount', async () => {
      const userData = { id: 1, name: 'Stored User', email: 'stored@test.com' };
      localStorage.setItem('token', 'stored-token');
      localStorage.setItem('user', JSON.stringify(userData));

      render(
        <SnackbarProvider>
          <AuthProvider>
            <TestComponent />
          </AuthProvider>
        </SnackbarProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('false');
      });

      expect(screen.getByTestId('user')).toHaveTextContent(JSON.stringify(userData));
      expect(screen.getByTestId('isLoggedIn')).toHaveTextContent('true');
    });

    it('handles corrupted localStorage data', async () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
      localStorage.setItem('token', 'corrupted-token');
      localStorage.setItem('user', 'invalid-json{');

      render(
        <SnackbarProvider>
          <AuthProvider>
            <TestComponent />
          </AuthProvider>
        </SnackbarProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('false');
      });

      expect(screen.getByTestId('user')).toHaveTextContent('null');
      expect(screen.getByTestId('isLoggedIn')).toHaveTextContent('false');
      expect(localStorage.getItem('token')).toBeNull();
      expect(localStorage.getItem('user')).toBeNull();
      expect(consoleError).toHaveBeenCalledWith('Error parsing user data:', expect.any(SyntaxError));

      consoleError.mockRestore();
    });

    it('handles token without user data', async () => {
      localStorage.setItem('token', 'orphaned-token');

      render(
        <SnackbarProvider>
          <AuthProvider>
            <TestComponent />
          </AuthProvider>
        </SnackbarProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('false');
      });

      expect(screen.getByTestId('user')).toHaveTextContent('null');
      expect(screen.getByTestId('isLoggedIn')).toHaveTextContent('false');
    });
  });

  describe('login function', () => {
    it('logs in user and stores data in localStorage', async () => {
      render(
        <SnackbarProvider>
          <AuthProvider>
            <TestComponent />
          </AuthProvider>
        </SnackbarProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('false');
      });

      const loginButton = screen.getByText('Login');
      act(() => {
        loginButton.click();
      });

      await waitFor(() => {
        expect(screen.getByTestId('isLoggedIn')).toHaveTextContent('true');
      });

      const userData = { id: 1, name: 'Test User' };
      expect(screen.getByTestId('user')).toHaveTextContent(JSON.stringify(userData));
      expect(localStorage.getItem('token')).toBe('test-token');
      expect(localStorage.getItem('user')).toBe(JSON.stringify(userData));
      expect(mockEnqueueSnackbar).toHaveBeenCalledWith('Welcome back!', { variant: 'success' });
    });
  });

  describe('logout function', () => {
    it('logs out user and clears localStorage', async () => {
      localStorage.setItem('token', 'existing-token');
      localStorage.setItem('user', JSON.stringify({ id: 1, name: 'User' }));
      localStorage.setItem('guestUserId', 'guest-123');

      render(
        <SnackbarProvider>
          <AuthProvider>
            <TestComponent />
          </AuthProvider>
        </SnackbarProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('false');
      });

      expect(screen.getByTestId('isLoggedIn')).toHaveTextContent('true');

      const logoutButton = screen.getByText('Logout');
      act(() => {
        logoutButton.click();
      });

      await waitFor(() => {
        expect(screen.getByTestId('isLoggedIn')).toHaveTextContent('false');
      });

      expect(screen.getByTestId('user')).toHaveTextContent('null');
      expect(localStorage.getItem('token')).toBeNull();
      expect(localStorage.getItem('user')).toBeNull();
      expect(localStorage.getItem('guestUserId')).toBeNull();
      expect(mockEnqueueSnackbar).toHaveBeenCalledWith('Logged out successfully', { variant: 'info' });
    });

    it('handles logout when not logged in', async () => {
      render(
        <SnackbarProvider>
          <AuthProvider>
            <TestComponent />
          </AuthProvider>
        </SnackbarProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('false');
      });

      const logoutButton = screen.getByText('Logout');
      act(() => {
        logoutButton.click();
      });

      await waitFor(() => {
        expect(mockEnqueueSnackbar).toHaveBeenCalledWith('Logged out successfully', { variant: 'info' });
      });

      expect(screen.getByTestId('user')).toHaveTextContent('null');
      expect(screen.getByTestId('isLoggedIn')).toHaveTextContent('false');
    });
  });
});
