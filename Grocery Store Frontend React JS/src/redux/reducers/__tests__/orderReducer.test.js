import orderReducer from '../orderReducer';
import {
  FETCH_ORDERS_REQUEST,
  FETCH_ORDERS_SUCCESS,
  FETCH_ORDERS_FAILURE,
  FETCH_ORDER_BY_ID_REQUEST,
  FETCH_ORDER_BY_ID_SUCCESS,
  FETCH_ORDER_BY_ID_FAILURE,
  CREATE_ORDER_REQUEST,
  CREATE_ORDER_SUCCESS,
  CREATE_ORDER_FAILURE,
  CANCEL_ORDER_REQUEST,
  CANCEL_ORDER_SUCCESS,
  CANCEL_ORDER_FAILURE,
  CLEAR_ORDER_ERROR,
} from '../../actionTypes';

describe('Order Reducer', () => {
  const initialState = {
    orders: [],
    currentOrder: null,
    loading: false,
    error: null,
  };

  it('should return the initial state', () => {
    expect(orderReducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  describe('FETCH_ORDERS actions', () => {
    it('should handle FETCH_ORDERS_REQUEST', () => {
      const action = { type: FETCH_ORDERS_REQUEST };
      const expectedState = {
        ...initialState,
        loading: true,
        error: null,
      };
      expect(orderReducer(initialState, action)).toEqual(expectedState);
    });

    it('should handle FETCH_ORDERS_SUCCESS', () => {
      const orders = [
        { id: 1, total: 100, status: 'delivered', createdAt: '2024-01-01' },
        { id: 2, total: 200, status: 'pending', createdAt: '2024-01-02' },
      ];
      const action = { type: FETCH_ORDERS_SUCCESS, payload: orders };
      const expectedState = {
        ...initialState,
        loading: false,
        orders: orders,
      };
      expect(orderReducer(initialState, action)).toEqual(expectedState);
    });

    it('should handle FETCH_ORDERS_FAILURE', () => {
      const errorMessage = 'Failed to fetch orders';
      const action = { type: FETCH_ORDERS_FAILURE, payload: errorMessage };
      const expectedState = {
        ...initialState,
        loading: false,
        error: errorMessage,
      };
      expect(orderReducer(initialState, action)).toEqual(expectedState);
    });
  });

  describe('FETCH_ORDER_BY_ID actions', () => {
    it('should handle FETCH_ORDER_BY_ID_REQUEST', () => {
      const action = { type: FETCH_ORDER_BY_ID_REQUEST };
      const expectedState = {
        ...initialState,
        loading: true,
        error: null,
      };
      expect(orderReducer(initialState, action)).toEqual(expectedState);
    });

    it('should handle FETCH_ORDER_BY_ID_SUCCESS', () => {
      const order = {
        id: 1,
        total: 100,
        status: 'delivered',
        items: [{ productId: 'p1', quantity: 2 }],
      };
      const action = { type: FETCH_ORDER_BY_ID_SUCCESS, payload: order };
      const expectedState = {
        ...initialState,
        loading: false,
        currentOrder: order,
      };
      expect(orderReducer(initialState, action)).toEqual(expectedState);
    });

    it('should handle FETCH_ORDER_BY_ID_FAILURE', () => {
      const errorMessage = 'Order not found';
      const action = { type: FETCH_ORDER_BY_ID_FAILURE, payload: errorMessage };
      const expectedState = {
        ...initialState,
        loading: false,
        error: errorMessage,
      };
      expect(orderReducer(initialState, action)).toEqual(expectedState);
    });
  });

  describe('CREATE_ORDER actions', () => {
    it('should handle CREATE_ORDER_REQUEST', () => {
      const action = { type: CREATE_ORDER_REQUEST };
      const expectedState = {
        ...initialState,
        loading: true,
        error: null,
      };
      expect(orderReducer(initialState, action)).toEqual(expectedState);
    });

    it('should handle CREATE_ORDER_SUCCESS', () => {
      const newOrder = {
        id: 3,
        total: 300,
        status: 'pending',
        createdAt: '2024-01-03',
      };
      const currentState = {
        orders: [{ id: 1, total: 100, status: 'delivered' }],
        currentOrder: null,
        loading: false,
        error: null,
      };
      const action = { type: CREATE_ORDER_SUCCESS, payload: newOrder };
      const expectedState = {
        ...currentState,
        loading: false,
        orders: [newOrder, ...currentState.orders],
        currentOrder: newOrder,
      };
      expect(orderReducer(currentState, action)).toEqual(expectedState);
    });

    it('should handle CREATE_ORDER_FAILURE', () => {
      const errorMessage = 'Failed to create order';
      const action = { type: CREATE_ORDER_FAILURE, payload: errorMessage };
      const expectedState = {
        ...initialState,
        loading: false,
        error: errorMessage,
      };
      expect(orderReducer(initialState, action)).toEqual(expectedState);
    });
  });

  describe('CANCEL_ORDER actions', () => {
    it('should handle CANCEL_ORDER_REQUEST', () => {
      const action = { type: CANCEL_ORDER_REQUEST };
      const expectedState = {
        ...initialState,
        loading: true,
        error: null,
      };
      expect(orderReducer(initialState, action)).toEqual(expectedState);
    });

    it('should handle CANCEL_ORDER_SUCCESS', () => {
      const currentState = {
        orders: [
          { id: 1, total: 100, status: 'pending' },
          { id: 2, total: 200, status: 'delivered' },
        ],
        currentOrder: null,
        loading: false,
        error: null,
      };
      const cancelledOrder = { id: 1, total: 100, status: 'cancelled' };
      const action = { type: CANCEL_ORDER_SUCCESS, payload: cancelledOrder };
      const expectedState = {
        ...currentState,
        loading: false,
        orders: [
          cancelledOrder,
          { id: 2, total: 200, status: 'delivered' },
        ],
      };
      expect(orderReducer(currentState, action)).toEqual(expectedState);
    });

    it('should handle CANCEL_ORDER_FAILURE', () => {
      const errorMessage = 'Cannot cancel delivered order';
      const action = { type: CANCEL_ORDER_FAILURE, payload: errorMessage };
      const expectedState = {
        ...initialState,
        loading: false,
        error: errorMessage,
      };
      expect(orderReducer(initialState, action)).toEqual(expectedState);
    });
  });

  it('should return current state for unknown action', () => {
    const action = { type: 'UNKNOWN_ACTION' };
    expect(orderReducer(initialState, action)).toEqual(initialState);
  });
});
