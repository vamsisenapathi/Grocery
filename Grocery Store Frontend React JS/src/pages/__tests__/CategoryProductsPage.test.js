import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import {thunk} from 'redux-thunk';
import CategoryProductsPage from '../CategoryProductsPage';
import productReducer from '../../redux/reducers/productReducer';
import cartReducer from '../../redux/reducers/cartReducer';

const mockProducts = [
  {
    id: '1',
    name: 'Milk',
    price: 50,
    categoryName: 'Dairy',
    imageUrl: 'milk.jpg',
    stock: 10,
    isAvailable: true,
  },
  {
    id: '2',
    name: 'Cheese',
    price: 150,
    categoryName: 'Dairy',
    imageUrl: 'cheese.jpg',
    stock: 5,
    isAvailable: true,
  },
  {
    id: '3',
    name: 'Bread',
    price: 30,
    categoryName: 'Bakery',
    imageUrl: 'bread.jpg',
    stock: 20,
    isAvailable: true,
  },
];

const createMockStore = (initialState = {}) => {
  const rootReducer = combineReducers({
    products: productReducer,
    cart: cartReducer,
  });
  return createStore(rootReducer, initialState, applyMiddleware(thunk));
};

const renderCategoryProductsPage = (category, store) => {
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[`/category?category=${category}`]}>
        <CategoryProductsPage />
      </MemoryRouter>
    </Provider>
  );
};

describe('CategoryProductsPage Component', () => {
  it('shows loading state initially', () => {
    const store = createMockStore({
      products: { products: [], loading: true, error: null },
      cart: { items: [], totalAmount: 0, loading: false, error: null },
    });
    renderCategoryProductsPage('Dairy', store);
    
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('displays category name', () => {
    const store = createMockStore({
      products: { products: mockProducts, loading: false, error: null },
      cart: { items: [], totalAmount: 0, loading: false, error: null },
    });
    renderCategoryProductsPage('Dairy', store);
    
    expect(screen.getByText('Dairy')).toBeInTheDocument();
  });

  it('filters and displays products from category', () => {
    const store = createMockStore({
      products: { products: mockProducts, loading: false, error: null },
      cart: { items: [], totalAmount: 0, loading: false, error: null },
    });
    renderCategoryProductsPage('Dairy', store);
    
    expect(screen.getByText('Milk')).toBeInTheDocument();
    expect(screen.getByText('Cheese')).toBeInTheDocument();
    expect(screen.queryByText('Bread')).not.toBeInTheDocument();
  });

  it('shows empty state when no products in category', () => {
    const store = createMockStore({
      products: { products: mockProducts, loading: false, error: null },
      cart: { items: [], totalAmount: 0, loading: false, error: null },
    });
    renderCategoryProductsPage('Electronics', store);
    
    expect(screen.getByText('No products found in this category')).toBeInTheDocument();
  });

  it('handles missing category parameter', () => {
    const store = createMockStore({
      products: { products: mockProducts, loading: false, error: null },
      cart: { items: [], totalAmount: 0, loading: false, error: null },
    });
    
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/category']}>
          <CategoryProductsPage />
        </MemoryRouter>
      </Provider>
    );
    
    expect(screen.getByText('No products found in this category')).toBeInTheDocument();
  });
});
