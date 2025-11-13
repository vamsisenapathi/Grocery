import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import CategorySection from '../CategorySection';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import {thunk} from 'redux-thunk';
import authReducer from '../../redux/reducers/authReducer';
import cartReducer from '../../redux/reducers/cartReducer';

// Mock useNavigate
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

const mockProducts = [
  { id: 1, name: 'Product 1', price: 100, imageUrl: 'img1.jpg', stockQuantity: 10 },
  { id: 2, name: 'Product 2', price: 200, imageUrl: 'img2.jpg', stockQuantity: 5 },
];

const createMockStore = () => {
  const rootReducer = combineReducers({
    auth: authReducer,
    cart: cartReducer,
  });
  return createStore(rootReducer, applyMiddleware(thunk));
};

const renderCategorySection = (categoryName, products) => {
  const store = createMockStore();
  return render(
    <Provider store={store}>
      <BrowserRouter>
        <CategorySection categoryName={categoryName} products={products} />
      </BrowserRouter>
    </Provider>
  );
};

describe('CategorySection Component', () => {
  let mockNavigate;

  beforeEach(() => {
    mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders category name', () => {
    renderCategorySection('Dairy', mockProducts);
    expect(screen.getByText('Dairy')).toBeInTheDocument();
  });

  it('renders all products in the category', () => {
    renderCategorySection('Dairy', mockProducts);
    expect(screen.getByText('Product 1')).toBeInTheDocument();
    expect(screen.getByText('Product 2')).toBeInTheDocument();
  });

  it('renders see all link', () => {
    renderCategorySection('Dairy', mockProducts);
    expect(screen.getByText(/see all/i)).toBeInTheDocument();
  });

  it('returns null when no products', () => {
    const { container } = renderCategorySection('Dairy', []);
    expect(container.firstChild).toBeNull();
  });

  it('returns null when products is undefined', () => {
    const { container } = renderCategorySection('Dairy', undefined);
    expect(container.firstChild).toBeNull();
  });

  it('navigates to category page when see all is clicked', () => {
    renderCategorySection('Dairy & Bakery', mockProducts);
    const seeAllLink = screen.getByText(/see all/i);
    fireEvent.click(seeAllLink);
    expect(mockNavigate).toHaveBeenCalledWith('/category?category=Dairy%20%26%20Bakery');
  });
});
