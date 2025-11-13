import configureMockStore from 'redux-mock-store';
import {thunk} from 'redux-thunk';
import * as cartActions from '../cartActions';
import {
  FETCH_CART_REQUEST,
  FETCH_CART_SUCCESS,
  FETCH_CART_FAILURE,
  ADD_TO_CART_REQUEST,
  ADD_TO_CART_SUCCESS,
  ADD_TO_CART_FAILURE,
  UPDATE_CART_ITEM_REQUEST,
  UPDATE_CART_ITEM_SUCCESS,
  UPDATE_CART_ITEM_FAILURE,
  REMOVE_CART_ITEM_REQUEST,
  REMOVE_CART_ITEM_SUCCESS,
  REMOVE_CART_ITEM_FAILURE,
  CLEAR_CART_REQUEST,
  CLEAR_CART_SUCCESS,
  CLEAR_CART_FAILURE,
} from '../../actionTypes';
import apiClient from '../../../apiActions/baseApi';
import { getUserId, isGuestUser } from '../../../utils/userUtils';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

jest.mock('../../../apiActions/baseApi');
jest.mock('../../../utils/userUtils');
jest.mock('../../../utils/userUtils', () => ({
  isGuestUser: jest.fn(() => false),
  getUserId: jest.fn(() => 'user123'),
}));

describe('Cart Actions', () => {
  let store;

  beforeEach(() => {
    store = mockStore({});
    jest.clearAllMocks();
  });

  describe('fetchCart', () => {
    it('should dispatch FETCH_CART_SUCCESS on successful fetch', async () => {
      const mockResponse = {
        data: {
          items: [
            { id: 1, productId: 'p1', quantity: 2, price: 100 },
            { id: 2, productId: 'p2', quantity: 1, price: 50 },
          ],
          totalAmount: 250,
        },
      };

      apiClient.get.mockResolvedValue(mockResponse);

      await store.dispatch(cartActions.fetchCart());

      const actions = store.getActions();
      expect(actions[0]).toEqual({ type: FETCH_CART_REQUEST });
      expect(actions[1]).toEqual({
        type: FETCH_CART_SUCCESS,
        payload: mockResponse.data,
      });
    });

    it('should dispatch FETCH_CART_FAILURE on error', async () => {
      apiClient.get.mockRejectedValue(new Error('Network error'));

      try {
        await store.dispatch(cartActions.fetchCart());
      } catch (error) {
        const actions = store.getActions();
        expect(actions[0]).toEqual({ type: FETCH_CART_REQUEST });
        expect(actions[1].type).toBe(FETCH_CART_FAILURE);
      }
    });

    it('should return empty cart on 404 error', async () => {
      getUserId.mockReturnValue('user123');
      isGuestUser.mockReturnValue(false);
      const error404 = new Error('Not found');
      error404.response = { status: 404 };
      apiClient.get.mockRejectedValue(error404);

      await store.dispatch(cartActions.fetchCart());

      const actions = store.getActions();
      expect(actions[1]).toEqual({
        type: FETCH_CART_SUCCESS,
        payload: { items: [], totalAmount: 0 },
      });
    });

    it('should return empty cart on 500 error', async () => {
      getUserId.mockReturnValue('user123');
      isGuestUser.mockReturnValue(false);
      const error500 = new Error('Server error');
      error500.response = { status: 500 };
      apiClient.get.mockRejectedValue(error500);

      await store.dispatch(cartActions.fetchCart());

      const actions = store.getActions();
      expect(actions[1]).toEqual({
        type: FETCH_CART_SUCCESS,
        payload: { items: [], totalAmount: 0 },
      });
    });

    it('should handle guest user fetch cart', async () => {
      isGuestUser.mockReturnValue(true);

      await store.dispatch(cartActions.fetchCart());

      const actions = store.getActions();
      expect(actions[0]).toEqual({ type: FETCH_CART_REQUEST });
      expect(actions[1].type).toBe(FETCH_CART_SUCCESS);
    });

    it('should return empty cart on network error without throwing', async () => {
      getUserId.mockReturnValue('user123');
      isGuestUser.mockReturnValue(false);
      const networkError = new Error('Network error');
      apiClient.get.mockRejectedValue(networkError);

      const result = await store.dispatch(cartActions.fetchCart());

      const actions = store.getActions();
      expect(actions[0]).toEqual({ type: FETCH_CART_REQUEST });
      expect(actions[1].type).toBe(FETCH_CART_FAILURE);
      expect(result.payload).toEqual({ items: [], totalAmount: 0 });
    });

    it('should return empty cart on 401 error without throwing', async () => {
      getUserId.mockReturnValue('user123');
      isGuestUser.mockReturnValue(false);
      const error401 = new Error('Unauthorized');
      error401.response = { status: 401, data: 'Unauthorized' };
      apiClient.get.mockRejectedValue(error401);

      const result = await store.dispatch(cartActions.fetchCart());

      const actions = store.getActions();
      expect(actions[0]).toEqual({ type: FETCH_CART_REQUEST });
      expect(actions[1].type).toBe(FETCH_CART_FAILURE);
      // Should not throw, just return empty cart
      expect(result.payload).toEqual({ items: [], totalAmount: 0 });
    });
  });

  describe('addToCart', () => {
    it('should dispatch ADD_TO_CART_SUCCESS on successful add', async () => {
      const mockResponse = {
        data: {
          cartItem: { id: 1, productId: 'p1', quantity: 1, price: 100 },
          totalAmount: 100,
        },
      };

      apiClient.post.mockResolvedValue(mockResponse);

      const cartData = {
        productId: 'p1',
        quantity: 1,
      };

      await store.dispatch(cartActions.addToCart(cartData));

      const actions = store.getActions();
      expect(actions[0]).toEqual({ type: ADD_TO_CART_REQUEST });
      expect(actions[1]).toEqual({
        type: ADD_TO_CART_SUCCESS,
        payload: mockResponse.data,
      });
    });

    it('should dispatch ADD_TO_CART_FAILURE on error', async () => {
      const errorResponse = {
        response: {
          data: {
            message: 'Product out of stock',
          },
        },
      };

      apiClient.post.mockRejectedValue(errorResponse);

      const cartData = {
        productId: 'p1',
        quantity: 1,
      };

      try {
        await store.dispatch(cartActions.addToCart({ productId: 'p1', quantity: 1 }));
      } catch (error) {
        const actions = store.getActions();
        expect(actions[0]).toEqual({ type: ADD_TO_CART_REQUEST });
        expect(actions[1]).toEqual({
          type: ADD_TO_CART_FAILURE,
          payload: { message: 'Product out of stock' },
        });
      }
    });

    it('should handle guest user add to cart', async () => {
      isGuestUser.mockReturnValue(true);
      const mockProduct = { id: 'p1', name: 'Product 1', price: 100 };
      
      await store.dispatch(cartActions.addToCart({ productId: 'p1', quantity: 2, product: mockProduct }));

      const actions = store.getActions();
      expect(actions[0]).toEqual({ type: ADD_TO_CART_REQUEST });
      expect(actions[1].type).toBe(ADD_TO_CART_SUCCESS);
    });
  });

  describe('updateCartItem', () => {
    it('should dispatch UPDATE_CART_ITEM_SUCCESS on successful update', async () => {
      const mockResponse = {
        data: {
          cartItem: { id: 1, productId: 'p1', quantity: 3, price: 100 },
          totalAmount: 300,
        },
      };

      apiClient.put.mockResolvedValue(mockResponse);

      const updateData = {
        itemId: 1,
        quantity: 3,
      };

      await store.dispatch(cartActions.updateCartItem(updateData));

      const actions = store.getActions();
      expect(actions[0]).toEqual({ type: UPDATE_CART_ITEM_REQUEST });
      expect(actions[1]).toEqual({
        type: UPDATE_CART_ITEM_SUCCESS,
        payload: mockResponse.data,
      });
    });

    it('should dispatch UPDATE_CART_ITEM_FAILURE on error', async () => {
      apiClient.put.mockRejectedValue(new Error('Update failed'));

      const updateData = {
        itemId: 1,
        quantity: 3,
      };

      try {
        await store.dispatch(cartActions.updateCartItem(updateData));
      } catch (error) {
        const actions = store.getActions();
        expect(actions[1].type).toBe(UPDATE_CART_ITEM_FAILURE);
      }
    });

    it('should handle guest user update cart item', async () => {
      isGuestUser.mockReturnValue(true);

      await store.dispatch(cartActions.updateCartItem({ itemId: 'item1', quantity: 5 }));

      const actions = store.getActions();
      expect(actions[0]).toEqual({ type: UPDATE_CART_ITEM_REQUEST });
      expect(actions[1].type).toBe(UPDATE_CART_ITEM_SUCCESS);
    });
  });

  describe('removeCartItem', () => {
    it('should dispatch REMOVE_CART_ITEM_SUCCESS on successful removal', async () => {
      const mockResponse = {
        data: {
          items: [],
          totalAmount: 0,
        },
      };

      apiClient.delete.mockResolvedValue({});
      apiClient.get.mockResolvedValue(mockResponse);

      await store.dispatch(cartActions.removeCartItem(1));

      const actions = store.getActions();
      expect(actions[0]).toEqual({ type: REMOVE_CART_ITEM_REQUEST });
      expect(actions[1]).toEqual({
        type: REMOVE_CART_ITEM_SUCCESS,
        payload: mockResponse.data,
      });
    });

    it('should dispatch REMOVE_CART_ITEM_FAILURE on error', async () => {
      apiClient.delete.mockRejectedValue(new Error('Delete failed'));

      try {
        await store.dispatch(cartActions.removeCartItem(1));
      } catch (error) {
        const actions = store.getActions();
        expect(actions[1].type).toBe(REMOVE_CART_ITEM_FAILURE);
      }
    });
  });

  describe('clearCart', () => {
    it('should dispatch CLEAR_CART_SUCCESS', async () => {
      getUserId.mockReturnValue('user123');
      isGuestUser.mockReturnValue(false);
      apiClient.delete.mockResolvedValue({});

      await store.dispatch(cartActions.clearCart());

      const actions = store.getActions();
      expect(actions[0]).toEqual({ type: CLEAR_CART_REQUEST });
      expect(actions[1]).toEqual({
        type: CLEAR_CART_SUCCESS,
        payload: { items: [], totalAmount: 0 },
      });
    });

    it('should dispatch CLEAR_CART_FAILURE on error', async () => {
      getUserId.mockReturnValue('user123');
      isGuestUser.mockReturnValue(false);
      apiClient.delete.mockRejectedValue(new Error('Clear failed'));

      try {
        await store.dispatch(cartActions.clearCart());
      } catch (error) {
        const actions = store.getActions();
        expect(actions[0]).toEqual({ type: CLEAR_CART_REQUEST });
        expect(actions[1].type).toBe(CLEAR_CART_FAILURE);
      }
    });
  });
});
