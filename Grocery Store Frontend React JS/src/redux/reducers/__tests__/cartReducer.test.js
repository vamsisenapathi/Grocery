import cartReducer from '../cartReducer';
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
  CLEAR_CART_SUCCESS,
} from '../../actionTypes';

describe('Cart Reducer', () => {
  const initialState = {
    items: [],
    totalAmount: 0,
    loading: false,
    error: null,
  };

  it('should return the initial state', () => {
    expect(cartReducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  describe('FETCH_CART actions', () => {
    it('should handle FETCH_CART_REQUEST', () => {
      const action = { type: FETCH_CART_REQUEST };
      const expectedState = {
        ...initialState,
        loading: true,
        error: null,
      };
      expect(cartReducer(initialState, action)).toEqual(expectedState);
    });

    it('should handle FETCH_CART_SUCCESS', () => {
      const cartData = {
        items: [
          { id: 1, productId: 'p1', quantity: 2, price: 100 },
        ],
        totalAmount: 200,
      };
      const action = { type: FETCH_CART_SUCCESS, payload: cartData };
      const expectedState = {
        ...initialState,
        loading: false,
        items: cartData.items,
        totalAmount: cartData.totalAmount,
      };
      expect(cartReducer(initialState, action)).toEqual(expectedState);
    });

    it('should handle FETCH_CART_FAILURE', () => {
      const errorMessage = 'Failed to fetch cart';
      const action = { type: FETCH_CART_FAILURE, payload: errorMessage };
      const expectedState = {
        ...initialState,
        loading: false,
        error: errorMessage,
      };
      expect(cartReducer(initialState, action)).toEqual(expectedState);
    });
  });

  describe('ADD_TO_CART actions', () => {
    it('should handle ADD_TO_CART_REQUEST', () => {
      const action = { type: ADD_TO_CART_REQUEST };
      const expectedState = {
        ...initialState,
        error: null,
      };
      expect(cartReducer(initialState, action)).toEqual(expectedState);
    });

    it('should handle ADD_TO_CART_SUCCESS', () => {
      const cartData = {
        items: [{ id: 1, productId: 'p1', quantity: 1, price: 100 }],
        totalAmount: 100,
      };
      const action = { type: ADD_TO_CART_SUCCESS, payload: cartData };
      const expectedState = {
        ...initialState,
        loading: false,
        items: cartData.items,
        totalAmount: cartData.totalAmount,
      };
      expect(cartReducer(initialState, action)).toEqual(expectedState);
    });

    it('should handle ADD_TO_CART_FAILURE', () => {
      const errorMessage = 'Product out of stock';
      const action = { type: ADD_TO_CART_FAILURE, payload: errorMessage };
      const expectedState = {
        ...initialState,
        loading: false,
        error: errorMessage,
      };
      expect(cartReducer(initialState, action)).toEqual(expectedState);
    });
  });

  describe('UPDATE_CART_ITEM actions', () => {
    it('should handle UPDATE_CART_ITEM_REQUEST', () => {
      const action = { type: UPDATE_CART_ITEM_REQUEST };
      const expectedState = {
        ...initialState,
        error: null,
      };
      expect(cartReducer(initialState, action)).toEqual(expectedState);
    });

    it('should handle UPDATE_CART_ITEM_SUCCESS', () => {
      const currentState = {
        items: [{ id: 1, productId: 'p1', quantity: 1, price: 100 }],
        totalAmount: 100,
        loading: false,
        error: null,
      };
      const updatedData = {
        items: [{ id: 1, productId: 'p1', quantity: 3, price: 100 }],
        totalAmount: 300,
      };
      const action = { type: UPDATE_CART_ITEM_SUCCESS, payload: updatedData };
      const expectedState = {
        ...currentState,
        loading: false,
        items: updatedData.items,
        totalAmount: updatedData.totalAmount,
      };
      expect(cartReducer(currentState, action)).toEqual(expectedState);
    });

    it('should handle UPDATE_CART_ITEM_FAILURE', () => {
      const errorMessage = 'Update failed';
      const action = { type: UPDATE_CART_ITEM_FAILURE, payload: errorMessage };
      const expectedState = {
        ...initialState,
        loading: false,
        error: errorMessage,
      };
      expect(cartReducer(initialState, action)).toEqual(expectedState);
    });
  });

  describe('REMOVE_CART_ITEM actions', () => {
    it('should handle REMOVE_CART_ITEM_REQUEST', () => {
      const action = { type: REMOVE_CART_ITEM_REQUEST };
      const expectedState = {
        ...initialState,
        error: null,
      };
      expect(cartReducer(initialState, action)).toEqual(expectedState);
    });

    it('should handle REMOVE_CART_ITEM_SUCCESS', () => {
      const cartData = {
        items: [],
        totalAmount: 0,
      };
      const action = { type: REMOVE_CART_ITEM_SUCCESS, payload: cartData };
      const expectedState = {
        ...initialState,
        loading: false,
        items: [],
        totalAmount: 0,
      };
      expect(cartReducer(initialState, action)).toEqual(expectedState);
    });

    it('should handle REMOVE_CART_ITEM_FAILURE', () => {
      const errorMessage = 'Remove failed';
      const action = { type: REMOVE_CART_ITEM_FAILURE, payload: errorMessage };
      const expectedState = {
        ...initialState,
        loading: false,
        error: errorMessage,
      };
      expect(cartReducer(initialState, action)).toEqual(expectedState);
    });
  });

  describe('CLEAR_CART action', () => {
    it('should handle CLEAR_CART_SUCCESS and reset cart', () => {
      const stateWithItems = {
        items: [{ id: 1, productId: 'p1', quantity: 2 }],
        totalAmount: 200,
        loading: false,
        error: null,
      };
      const action = { type: CLEAR_CART_SUCCESS };
      expect(cartReducer(stateWithItems, action)).toEqual(initialState);
    });
  });

  it('should return current state for unknown action', () => {
    const action = { type: 'UNKNOWN_ACTION' };
    expect(cartReducer(initialState, action)).toEqual(initialState);
  });
});
