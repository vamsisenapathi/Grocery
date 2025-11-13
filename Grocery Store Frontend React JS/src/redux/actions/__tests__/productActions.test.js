import configureMockStore from 'redux-mock-store';
import {thunk} from 'redux-thunk';
import * as productActions from '../productActions';
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
import apiClient from '../../../apiActions/baseApi';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

jest.mock('../../../apiActions/baseApi');

describe('Product Actions', () => {
  let store;

  beforeEach(() => {
    store = mockStore({});
    jest.clearAllMocks();
  });

  describe('fetchProducts', () => {
    it('should dispatch FETCH_PRODUCTS_SUCCESS on successful fetch', async () => {
      const mockResponse = {
        data: [
          { id: 'p1', name: 'Product 1', price: 100 },
          { id: 'p2', name: 'Product 2', price: 200 },
        ],
      };

      apiClient.get.mockResolvedValue(mockResponse);

      await store.dispatch(productActions.fetchProducts());

      const actions = store.getActions();
      expect(actions[0]).toEqual({ type: FETCH_PRODUCTS_REQUEST });
      expect(actions[1]).toEqual({
        type: FETCH_PRODUCTS_SUCCESS,
        payload: mockResponse.data,
      });
    });

    it('should dispatch FETCH_PRODUCTS_FAILURE on error', async () => {
      apiClient.get.mockRejectedValue(new Error('Network error'));

      try {
        await store.dispatch(productActions.fetchProducts());
      } catch (error) {
        const actions = store.getActions();
        expect(actions[0]).toEqual({ type: FETCH_PRODUCTS_REQUEST });
        expect(actions[1].type).toBe(FETCH_PRODUCTS_FAILURE);
      }
    });

    it('should use empty array when response.data is undefined', async () => {
      const mockResponse = { data: undefined };
      apiClient.get.mockResolvedValue(mockResponse);

      await store.dispatch(productActions.fetchProducts());

      const actions = store.getActions();
      expect(actions[1]).toEqual({
        type: FETCH_PRODUCTS_SUCCESS,
        payload: [],
      });
    });
  });

  describe('fetchProductById', () => {
    it('should dispatch FETCH_PRODUCT_BY_ID_SUCCESS on successful fetch', async () => {
      const mockResponse = {
        data: { id: 'p1', name: 'Product 1', price: 100 },
      };

      apiClient.get.mockResolvedValue(mockResponse);

      await store.dispatch(productActions.fetchProductById('p1'));

      const actions = store.getActions();
      expect(actions[0]).toEqual({ type: FETCH_PRODUCT_BY_ID_REQUEST });
      expect(actions[1]).toEqual({
        type: FETCH_PRODUCT_BY_ID_SUCCESS,
        payload: mockResponse.data,
      });
    });

    it('should dispatch FETCH_PRODUCT_BY_ID_FAILURE on error', async () => {
      apiClient.get.mockRejectedValue(new Error('Product not found'));

      try {
        await store.dispatch(productActions.fetchProductById('invalid'));
      } catch (error) {
        const actions = store.getActions();
        expect(actions[1].type).toBe(FETCH_PRODUCT_BY_ID_FAILURE);
      }
    });
  });

  describe('searchProducts', () => {
    it('should dispatch SEARCH_PRODUCTS_SUCCESS on successful search', async () => {
      const mockResponse = {
        data: [
          { id: 'p1', name: 'Milk Product', price: 50 },
        ],
      };

      apiClient.get.mockResolvedValue(mockResponse);

      await store.dispatch(productActions.searchProducts('milk'));

      const actions = store.getActions();
      expect(actions[0]).toEqual({ type: SEARCH_PRODUCTS_REQUEST });
      expect(actions[1]).toEqual({
        type: SEARCH_PRODUCTS_SUCCESS,
        payload: mockResponse.data,
      });
    });

    it('should dispatch SEARCH_PRODUCTS_FAILURE on error', async () => {
      apiClient.get.mockRejectedValue(new Error('Search failed'));

      try {
        await store.dispatch(productActions.searchProducts('test'));
      } catch (error) {
        const actions = store.getActions();
        expect(actions[1].type).toBe(SEARCH_PRODUCTS_FAILURE);
      }
    });

    it('should use empty array when search response.data is undefined', async () => {
      const mockResponse = { data: null };
      apiClient.get.mockResolvedValue(mockResponse);

      await store.dispatch(productActions.searchProducts('milk'));

      const actions = store.getActions();
      expect(actions[1]).toEqual({
        type: SEARCH_PRODUCTS_SUCCESS,
        payload: [],
      });
    });
  });
});
