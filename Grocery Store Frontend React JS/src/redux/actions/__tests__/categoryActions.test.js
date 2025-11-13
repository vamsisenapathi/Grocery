import configureMockStore from 'redux-mock-store';
import {thunk} from 'redux-thunk';
import * as categoryActions from '../categoryActions';
import {
  FETCH_CATEGORIES_REQUEST,
  FETCH_CATEGORIES_SUCCESS,
  FETCH_CATEGORIES_FAILURE,
  FETCH_CATEGORY_BY_ID_REQUEST,
  FETCH_CATEGORY_BY_ID_SUCCESS,
  FETCH_CATEGORY_BY_ID_FAILURE,
} from '../../actionTypes';
import apiClient from '../../../apiActions/baseApi';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

jest.mock('../../../apiActions/baseApi');

describe('Category Actions', () => {
  let store;

  beforeEach(() => {
    store = mockStore({});
    jest.clearAllMocks();
  });

  describe('fetchCategories', () => {
    it('should dispatch FETCH_CATEGORIES_SUCCESS on successful fetch', async () => {
      const mockResponse = {
        data: [
          { id: 'p1', categoryName: 'Dairy' },
          { id: 'p2', categoryName: 'Fruits' },
          { id: 'p3', categoryName: 'Dairy' },
        ],
      };

      apiClient.get.mockResolvedValue(mockResponse);

      await store.dispatch(categoryActions.fetchCategories());

      const actions = store.getActions();
      expect(actions[0]).toEqual({ type: FETCH_CATEGORIES_REQUEST });
      expect(actions[1]).toEqual({
        type: FETCH_CATEGORIES_SUCCESS,
        payload: [
          { name: 'dairy', displayName: 'Dairy' },
          { name: 'fruits', displayName: 'Fruits' },
        ],
      });
    });

    it('should handle empty products response', async () => {
      const mockResponse = {
        data: [],
      };

      apiClient.get.mockResolvedValue(mockResponse);

      await store.dispatch(categoryActions.fetchCategories());

      const actions = store.getActions();
      expect(actions[0]).toEqual({ type: FETCH_CATEGORIES_REQUEST });
      expect(actions[1]).toEqual({
        type: FETCH_CATEGORIES_SUCCESS,
        payload: [],
      });
    });

    it('should handle products without categoryName', async () => {
      const mockResponse = {
        data: [
          { id: 'p1', name: 'Product 1' }, // No categoryName
          { id: 'p2', categoryName: 'Dairy' },
          { id: 'p3', name: 'Product 3' }, // No categoryName
        ],
      };

      apiClient.get.mockResolvedValue(mockResponse);

      await store.dispatch(categoryActions.fetchCategories());

      const actions = store.getActions();
      expect(actions[0]).toEqual({ type: FETCH_CATEGORIES_REQUEST });
      expect(actions[1]).toEqual({
        type: FETCH_CATEGORIES_SUCCESS,
        payload: [
          { name: 'dairy', displayName: 'Dairy' },
        ],
      });
    });

    it('should handle undefined response.data', async () => {
      const mockResponse = {
        data: undefined,
      };

      apiClient.get.mockResolvedValue(mockResponse);

      await store.dispatch(categoryActions.fetchCategories());

      const actions = store.getActions();
      expect(actions[0]).toEqual({ type: FETCH_CATEGORIES_REQUEST });
      expect(actions[1]).toEqual({
        type: FETCH_CATEGORIES_SUCCESS,
        payload: [],
      });
    });

    it('should dispatch FETCH_CATEGORIES_FAILURE on error', async () => {
      apiClient.get.mockRejectedValue(new Error('Network error'));

      try {
        await store.dispatch(categoryActions.fetchCategories());
      } catch (error) {
        const actions = store.getActions();
        expect(actions[0]).toEqual({ type: FETCH_CATEGORIES_REQUEST });
        expect(actions[1].type).toBe(FETCH_CATEGORIES_FAILURE);
      }
    });

    it('should handle error with response.data', async () => {
      apiClient.get.mockRejectedValue({
        response: { data: 'Custom error message' },
      });

      try {
        await store.dispatch(categoryActions.fetchCategories());
      } catch (error) {
        const actions = store.getActions();
        expect(actions[0]).toEqual({ type: FETCH_CATEGORIES_REQUEST });
        expect(actions[1]).toEqual({
          type: FETCH_CATEGORIES_FAILURE,
          payload: 'Custom error message',
        });
      }
    });

    it('should fallback to default error message', async () => {
      apiClient.get.mockRejectedValue(new Error());

      try {
        await store.dispatch(categoryActions.fetchCategories());
      } catch (error) {
        const actions = store.getActions();
        expect(actions[0]).toEqual({ type: FETCH_CATEGORIES_REQUEST });
        expect(actions[1]).toEqual({
          type: FETCH_CATEGORIES_FAILURE,
          payload: 'Failed to fetch categories',
        });
      }
    });
  });

  describe('fetchCategoryProducts', () => {
    it('should dispatch FETCH_CATEGORY_BY_ID_SUCCESS on successful fetch', async () => {
      const mockResponse = {
        data: [
          { id: 'p1', name: 'Milk', categoryId: 'c1' },
          { id: 'p2', name: 'Cheese', categoryId: 'c1' },
        ],
      };

      apiClient.get.mockResolvedValue(mockResponse);

      await store.dispatch(categoryActions.fetchCategoryProducts('dairy'));

      const actions = store.getActions();
      expect(actions[0]).toEqual({ type: FETCH_CATEGORY_BY_ID_REQUEST });
      expect(actions[1]).toEqual({
        type: FETCH_CATEGORY_BY_ID_SUCCESS,
        payload: { categoryName: 'dairy', products: mockResponse.data },
      });
    });

    it('should handle undefined response.data', async () => {
      const mockResponse = {
        data: undefined,
      };

      apiClient.get.mockResolvedValue(mockResponse);

      await store.dispatch(categoryActions.fetchCategoryProducts('dairy'));

      const actions = store.getActions();
      expect(actions[0]).toEqual({ type: FETCH_CATEGORY_BY_ID_REQUEST });
      expect(actions[1]).toEqual({
        type: FETCH_CATEGORY_BY_ID_SUCCESS,
        payload: { categoryName: 'dairy', products: [] },
      });
    });

    it('should dispatch FETCH_CATEGORY_BY_ID_FAILURE on error', async () => {
      apiClient.get.mockRejectedValue(new Error('Failed to fetch products'));

      try {
        await store.dispatch(categoryActions.fetchCategoryProducts('invalid'));
      } catch (error) {
        const actions = store.getActions();
        expect(actions[1].type).toBe(FETCH_CATEGORY_BY_ID_FAILURE);
      }
    });

    it('should handle error with response.data', async () => {
      apiClient.get.mockRejectedValue({
        response: { data: 'Category not found' },
      });

      try {
        await store.dispatch(categoryActions.fetchCategoryProducts('invalid'));
      } catch (error) {
        const actions = store.getActions();
        expect(actions[0]).toEqual({ type: FETCH_CATEGORY_BY_ID_REQUEST });
        expect(actions[1]).toEqual({
          type: FETCH_CATEGORY_BY_ID_FAILURE,
          payload: 'Category not found',
        });
      }
    });

    it('should fallback to default error message', async () => {
      apiClient.get.mockRejectedValue(new Error());

      try {
        await store.dispatch(categoryActions.fetchCategoryProducts('invalid'));
      } catch (error) {
        const actions = store.getActions();
        expect(actions[0]).toEqual({ type: FETCH_CATEGORY_BY_ID_REQUEST });
        expect(actions[1]).toEqual({
          type: FETCH_CATEGORY_BY_ID_FAILURE,
          payload: 'Failed to fetch category products',
        });
      }
    });
  });
});