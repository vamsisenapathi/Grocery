import productReducer from '../productReducer';
import {
  FETCH_PRODUCTS_REQUEST,
  FETCH_PRODUCTS_SUCCESS,
  FETCH_PRODUCTS_FAILURE,
  FETCH_PRODUCT_BY_ID_REQUEST,
  FETCH_PRODUCT_BY_ID_SUCCESS,
  FETCH_PRODUCT_BY_ID_FAILURE,
  SEARCH_PRODUCTS_REQUEST,
  SEARCH_PRODUCTS_SUCCESS,
  SEARCH_PRODUCTS_FAILURE,
} from '../../actionTypes';

describe('Product Reducer', () => {
  const initialState = {
    products: [],
    currentProduct: null,
    searchResults: [],
    loading: false,
    error: null,
  };

  it('should return the initial state', () => {
    expect(productReducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  describe('FETCH_PRODUCTS actions', () => {
    it('should handle FETCH_PRODUCTS_REQUEST', () => {
      const action = { type: FETCH_PRODUCTS_REQUEST };
      const expectedState = {
        ...initialState,
        loading: true,
        error: null,
      };
      expect(productReducer(initialState, action)).toEqual(expectedState);
    });

    it('should handle FETCH_PRODUCTS_SUCCESS', () => {
      const products = [
        { id: 1, name: 'Product 1', price: 100 },
        { id: 2, name: 'Product 2', price: 200 },
      ];
      const action = { type: FETCH_PRODUCTS_SUCCESS, payload: products };
      const expectedState = {
        ...initialState,
        loading: false,
        products: products,
      };
      expect(productReducer(initialState, action)).toEqual(expectedState);
    });

    it('should handle FETCH_PRODUCTS_FAILURE', () => {
      const errorMessage = 'Failed to fetch products';
      const action = { type: FETCH_PRODUCTS_FAILURE, payload: errorMessage };
      const expectedState = {
        ...initialState,
        loading: false,
        error: errorMessage,
      };
      expect(productReducer(initialState, action)).toEqual(expectedState);
    });
  });

  describe('FETCH_PRODUCT_BY_ID actions', () => {
    it('should handle FETCH_PRODUCT_BY_ID_REQUEST', () => {
      const action = { type: FETCH_PRODUCT_BY_ID_REQUEST };
      const expectedState = {
        ...initialState,
        loading: true,
        error: null,
      };
      expect(productReducer(initialState, action)).toEqual(expectedState);
    });

    it('should handle FETCH_PRODUCT_BY_ID_SUCCESS', () => {
      const product = { id: 1, name: 'Product 1', price: 100, description: 'Description' };
      const action = { type: FETCH_PRODUCT_BY_ID_SUCCESS, payload: product };
      const expectedState = {
        ...initialState,
        loading: false,
        currentProduct: product,
      };
      expect(productReducer(initialState, action)).toEqual(expectedState);
    });

    it('should handle FETCH_PRODUCT_BY_ID_FAILURE', () => {
      const errorMessage = 'Product not found';
      const action = { type: FETCH_PRODUCT_BY_ID_FAILURE, payload: errorMessage };
      const expectedState = {
        ...initialState,
        loading: false,
        error: errorMessage,
      };
      expect(productReducer(initialState, action)).toEqual(expectedState);
    });
  });

  describe('SEARCH_PRODUCTS actions', () => {
    it('should handle SEARCH_PRODUCTS_REQUEST', () => {
      const action = { type: SEARCH_PRODUCTS_REQUEST };
      const expectedState = {
        ...initialState,
        loading: true,
        error: null,
      };
      expect(productReducer(initialState, action)).toEqual(expectedState);
    });

    it('should handle SEARCH_PRODUCTS_SUCCESS', () => {
      const searchResults = [
        { id: 3, name: 'Matched Product', price: 150 },
      ];
      const action = { type: SEARCH_PRODUCTS_SUCCESS, payload: searchResults };
      const expectedState = {
        ...initialState,
        loading: false,
        searchResults: searchResults,
      };
      expect(productReducer(initialState, action)).toEqual(expectedState);
    });

    it('should handle SEARCH_PRODUCTS_FAILURE', () => {
      const errorMessage = 'Search failed';
      const action = { type: SEARCH_PRODUCTS_FAILURE, payload: errorMessage };
      const expectedState = {
        ...initialState,
        loading: false,
        error: errorMessage,
      };
      expect(productReducer(initialState, action)).toEqual(expectedState);
    });
  });

  it('should return current state for unknown action', () => {
    const action = { type: 'UNKNOWN_ACTION' };
    expect(productReducer(initialState, action)).toEqual(initialState);
  });
});
