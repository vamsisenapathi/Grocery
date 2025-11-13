import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { SnackbarProvider } from 'notistack';
import { configureStore } from '@reduxjs/toolkit';
import productReducer from '../redux/productSlice';
import categoryReducer from '../redux/categorySlice';
import cartReducer from '../redux/cartSlice';
import authReducer from '../redux/authSlice';
import theme from '../theme';

// Mock API service
jest.mock('../apiActions/baseApi');

// Create a test store factory
export const createTestStore = (preloadedState = {}) => {
  return configureStore({
    reducer: {
      products: productReducer,
      categories: categoryReducer,
      cart: cartReducer,
      auth: authReducer,
    },
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });
};

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

export const renderWithProviders = (ui, { route = '/', preloadedState = {}, store = createTestStore(preloadedState), ...renderOptions } = {}) => {
  window.history.pushState({}, 'Test page', route);

  const Wrapper = ({ children }) => (
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <SnackbarProvider>
            {children}
          </SnackbarProvider>
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  );

  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

export * from '@testing-library/react';
export { renderWithProviders as render };
