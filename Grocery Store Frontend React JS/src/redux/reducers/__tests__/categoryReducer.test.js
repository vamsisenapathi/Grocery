import categoryReducer from '../categoryReducer';
import {
  FETCH_CATEGORIES_REQUEST,
  FETCH_CATEGORIES_SUCCESS,
  FETCH_CATEGORIES_FAILURE,
  FETCH_CATEGORY_BY_ID_REQUEST,
  FETCH_CATEGORY_BY_ID_SUCCESS,
  FETCH_CATEGORY_BY_ID_FAILURE,
} from '../../actionTypes';

describe('Category Reducer', () => {
  const initialState = {
    categories: [],
    categoryProducts: {},
    loading: false,
    error: null,
  };

  it('should return the initial state', () => {
    expect(categoryReducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  describe('FETCH_CATEGORIES actions', () => {
    it('should handle FETCH_CATEGORIES_REQUEST', () => {
      const action = { type: FETCH_CATEGORIES_REQUEST };
      const expectedState = {
        ...initialState,
        loading: true,
        error: null,
      };
      expect(categoryReducer(initialState, action)).toEqual(expectedState);
    });

    it('should handle FETCH_CATEGORIES_SUCCESS', () => {
      const categories = [
        { id: 1, name: 'Fruits', imageUrl: '/fruits.jpg' },
        { id: 2, name: 'Vegetables', imageUrl: '/vegetables.jpg' },
      ];
      const action = { type: FETCH_CATEGORIES_SUCCESS, payload: categories };
      const expectedState = {
        ...initialState,
        loading: false,
        categories: categories,
      };
      expect(categoryReducer(initialState, action)).toEqual(expectedState);
    });

    it('should handle FETCH_CATEGORIES_FAILURE', () => {
      const errorMessage = 'Failed to fetch categories';
      const action = { type: FETCH_CATEGORIES_FAILURE, payload: errorMessage };
      const expectedState = {
        ...initialState,
        loading: false,
        error: errorMessage,
      };
      expect(categoryReducer(initialState, action)).toEqual(expectedState);
    });
  });

  describe('FETCH_CATEGORY_PRODUCTS actions', () => {
    it('should handle FETCH_CATEGORY_BY_ID_REQUEST', () => {
      const action = { type: FETCH_CATEGORY_BY_ID_REQUEST };
      const expectedState = {
        ...initialState,
        loading: true,
        error: null,
      };
      expect(categoryReducer(initialState, action)).toEqual(expectedState);
    });

    it('should handle FETCH_CATEGORY_BY_ID_SUCCESS', () => {
      const products = [
        { id: 1, name: 'Apple', categoryId: 1, price: 50 },
        { id: 2, name: 'Banana', categoryId: 1, price: 30 },
      ];
      const action = {
        type: FETCH_CATEGORY_BY_ID_SUCCESS,
        payload: { categoryName: 'Fruits', products },
      };
      const expectedState = {
        ...initialState,
        loading: false,
        categoryProducts: {
          Fruits: products,
        },
      };
      expect(categoryReducer(initialState, action)).toEqual(expectedState);
    });

    it('should handle FETCH_CATEGORY_BY_ID_FAILURE', () => {
      const errorMessage = 'Failed to fetch category products';
      const action = { type: FETCH_CATEGORY_BY_ID_FAILURE, payload: errorMessage };
      const expectedState = {
        ...initialState,
        loading: false,
        error: errorMessage,
      };
      expect(categoryReducer(initialState, action)).toEqual(expectedState);
    });
  });

  it('should return current state for unknown action', () => {
    const action = { type: 'UNKNOWN_ACTION' };
    expect(categoryReducer(initialState, action)).toEqual(initialState);
  });
});
