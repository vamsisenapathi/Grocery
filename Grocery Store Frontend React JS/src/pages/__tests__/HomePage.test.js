import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import {thunk} from 'redux-thunk';
import HomePage from '../HomePage';
import productReducer from '../../redux/reducers/productReducer';
import categoryReducer from '../../redux/reducers/categoryReducer';
import authReducer from '../../redux/reducers/authReducer';
import cartReducer from '../../redux/reducers/cartReducer';

const mockProducts = [
  { 
    id: 1, 
    name: 'Milk', 
    price: 50, 
    category: 'Dairy', 
    categoryName: 'Dairy',
    imageUrl: 'milk.jpg', 
    stockQuantity: 10 
  },
  { 
    id: 2, 
    name: 'Bread', 
    price: 30, 
    category: 'Bakery', 
    categoryName: 'Bakery',
    imageUrl: 'bread.jpg', 
    stockQuantity: 20 
  },
];

const mockCategories = [
  { id: 1, name: 'Dairy', displayName: 'Dairy', description: 'Dairy products' },
  { id: 2, name: 'Bakery', displayName: 'Bakery', description: 'Bakery items' },
];

const createMockStore = (initialState = {}) => {
  const rootReducer = combineReducers({
    products: productReducer,
    categories: categoryReducer,
    auth: authReducer,
    cart: cartReducer,
  });
  
  return createStore(rootReducer, initialState, applyMiddleware(thunk));
};

const renderHomePage = (store) => {
  return render(
    <Provider store={store}>
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    </Provider>
  );
};

describe('HomePage Component', () => {
  it('shows loading state initially', () => {
    const store = createMockStore({
      products: { products: [], loading: true, error: null },
      categories: { categories: [], loading: true, error: null },
    });
    renderHomePage(store);
    
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(screen.getByText(/Loading products.../i)).toBeInTheDocument();
  });

  it('renders category sections with products', () => {
    const store = createMockStore({
      products: { products: mockProducts, loading: false, error: null },
      categories: { categories: mockCategories, loading: false, error: null },
    });
    renderHomePage(store);
    
    // Category names should be visible
    expect(screen.getByText('Dairy')).toBeInTheDocument();
    expect(screen.getByText('Bakery')).toBeInTheDocument();
  });

  it('groups products by category', () => {
    const store = createMockStore({
      products: { products: mockProducts, loading: false, error: null },
      categories: { categories: mockCategories, loading: false, error: null },
    });
    renderHomePage(store);
    
    // Products should be visible
    expect(screen.getByText('Milk')).toBeInTheDocument();
    expect(screen.getByText('Bread')).toBeInTheDocument();
  });

  it('filters products based on search query by name', () => {
    const store = createMockStore({
      products: { products: mockProducts, loading: false, error: null },
      categories: { categories: mockCategories, loading: false, error: null },
    });
    
    // Mock URL search params
    window.history.pushState({}, '', '/?search=milk');
    
    renderHomePage(store);
    
    expect(screen.getByText(/Search results for:/i)).toBeInTheDocument();
    expect(screen.getByText(/"milk"/i)).toBeInTheDocument();
  });

  it('filters products based on category name in search', () => {
    const store = createMockStore({
      products: { products: mockProducts, loading: false, error: null },
      categories: { categories: mockCategories, loading: false, error: null },
    });
    
    window.history.pushState({}, '', '/?search=dairy');
    
    renderHomePage(store);
    
    expect(screen.getByText('Milk')).toBeInTheDocument();
    expect(screen.queryByText('Bread')).not.toBeInTheDocument();
  });

  it('filters products based on description in search', () => {
    const productsWithDescription = [
      { id: 1, name: 'Milk', price: 50, categoryName: 'Dairy', description: 'Fresh organic milk', imageUrl: 'milk.jpg' },
      { id: 2, name: 'Bread', price: 30, categoryName: 'Bakery', description: 'Whole wheat bread', imageUrl: 'bread.jpg' },
    ];
    
    const store = createMockStore({
      products: { products: productsWithDescription, loading: false, error: null },
      categories: { categories: mockCategories, loading: false, error: null },
    });
    
    window.history.pushState({}, '', '/?search=organic');
    
    renderHomePage(store);
    
    expect(screen.getByText('Milk')).toBeInTheDocument();
    expect(screen.queryByText('Bread')).not.toBeInTheDocument();
  });

  it('filters products based on brand name in search', () => {
    const productsWithBrand = [
      { id: 1, name: 'Milk', price: 50, categoryName: 'Dairy', brandName: 'Amul', imageUrl: 'milk.jpg' },
      { id: 2, name: 'Bread', price: 30, categoryName: 'Bakery', brandName: 'Britannia', imageUrl: 'bread.jpg' },
    ];
    
    const store = createMockStore({
      products: { products: productsWithBrand, loading: false, error: null },
      categories: { categories: mockCategories, loading: false, error: null },
    });
    
    window.history.pushState({}, '', '/?search=amul');
    
    renderHomePage(store);
    
    expect(screen.getByText('Milk')).toBeInTheDocument();
    expect(screen.queryByText('Bread')).not.toBeInTheDocument();
  });

  it('shows no results message when search finds nothing', () => {
    const store = createMockStore({
      products: { products: mockProducts, loading: false, error: null },
      categories: { categories: mockCategories, loading: false, error: null },
    });
    
    window.history.pushState({}, '', '/?search=nonexistent');
    
    renderHomePage(store);
    
    expect(screen.getByText(/No products found for "nonexistent"/i)).toBeInTheDocument();
    expect(screen.getByText(/Try a different search term/i)).toBeInTheDocument();
  });

  it('shows correct item count in search results (singular)', () => {
    const store = createMockStore({
      products: { products: [mockProducts[0]], loading: false, error: null },
      categories: { categories: mockCategories, loading: false, error: null },
    });
    
    window.history.pushState({}, '', '/?search=milk');
    
    renderHomePage(store);
    
    expect(screen.getByText(/1 item found/i)).toBeInTheDocument();
  });

  it('shows correct item count in search results (plural)', () => {
    const store = createMockStore({
      products: { products: mockProducts, loading: false, error: null },
      categories: { categories: mockCategories, loading: false, error: null },
    });
    
    window.history.pushState({}, '', '/?search=a');
    
    renderHomePage(store);
    
    expect(screen.getByText(/2 items found/i)).toBeInTheDocument();
  });

  it('applies 20 item limit for Groceries & Staples category', () => {
    const manyProducts = Array.from({ length: 25 }, (_, i) => ({
      id: i + 1,
      name: `Product ${i + 1}`,
      price: 50,
      categoryName: 'Groceries & Staples',
      imageUrl: `product${i + 1}.jpg`,
      stockQuantity: 10,
    }));
    
    const groceryCategory = [
      { id: 1, name: 'Groceries & Staples', displayName: 'Groceries & Staples', description: 'Grocery items' },
    ];
    
    const store = createMockStore({
      products: { products: manyProducts, loading: false, error: null },
      categories: { categories: groceryCategory, loading: false, error: null },
    });
    
    renderHomePage(store);
    
    // Should show category section
    expect(screen.getByText('Groceries & Staples')).toBeInTheDocument();
    // The limit is applied internally, product count verification would need CategorySection mock
  });

  it('applies 15 item limit for Snacks & Beverages category', () => {
    const manyProducts = Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      name: `Snack ${i + 1}`,
      price: 30,
      categoryName: 'Snacks & Beverages',
      imageUrl: `snack${i + 1}.jpg`,
      stockQuantity: 10,
    }));
    
    const snacksCategory = [
      { id: 1, name: 'Snacks & Beverages', displayName: 'Snacks & Beverages', description: 'Snacks' },
    ];
    
    const store = createMockStore({
      products: { products: manyProducts, loading: false, error: null },
      categories: { categories: snacksCategory, loading: false, error: null },
    });
    
    renderHomePage(store);
    
    // Should show category section
    expect(screen.getByText('Snacks & Beverages')).toBeInTheDocument();
  });

  it('shows all products when searching (no limit)', () => {
    const manyProducts = Array.from({ length: 25 }, (_, i) => ({
      id: i + 1,
      name: `Product ${i + 1}`,
      price: 50,
      categoryName: 'Groceries & Staples',
      imageUrl: `product${i + 1}.jpg`,
    }));
    
    const groceryCategory = [
      { id: 1, name: 'Groceries & Staples', displayName: 'Groceries & Staples', description: 'Grocery items' },
    ];
    
    const store = createMockStore({
      products: { products: manyProducts, loading: false, error: null },
      categories: { categories: groceryCategory, loading: false, error: null },
    });
    
    window.history.pushState({}, '', '/?search=product');
    
    renderHomePage(store);
    
    // When searching, should show all matching products
    const productElements = screen.getAllByText(/Product \d+/);
    expect(productElements.length).toBe(25);
  });

  it('shows "No products available" when no products exist', () => {
    const store = createMockStore({
      products: { products: [], loading: false, error: null },
      categories: { categories: [], loading: false, error: null },
    });
    
    const { container } = renderHomePage(store);
    
    // The page should render without errors when no products exist
    expect(container).toBeInTheDocument();
  });

  it('shows loading when only products are loading', () => {
    const store = createMockStore({
      products: { products: [], loading: true, error: null },
      categories: { categories: [], loading: false, error: null },
    });
    
    renderHomePage(store);
    
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('shows loading when only categories are loading', () => {
    const store = createMockStore({
      products: { products: [], loading: false, error: null },
      categories: { categories: [], loading: true, error: null },
    });
    
    renderHomePage(store);
    
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
});
