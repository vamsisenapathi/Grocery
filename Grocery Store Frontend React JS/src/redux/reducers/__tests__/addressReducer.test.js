import addressReducer from '../addressReducer';
import {
  FETCH_ADDRESSES_REQUEST,
  FETCH_ADDRESSES_SUCCESS,
  FETCH_ADDRESSES_FAILURE,
  ADD_ADDRESS_REQUEST,
  ADD_ADDRESS_SUCCESS,
  ADD_ADDRESS_FAILURE,
  UPDATE_ADDRESS_REQUEST,
  UPDATE_ADDRESS_SUCCESS,
  UPDATE_ADDRESS_FAILURE,
  DELETE_ADDRESS_REQUEST,
  DELETE_ADDRESS_SUCCESS,
  DELETE_ADDRESS_FAILURE,
  SET_DEFAULT_ADDRESS_REQUEST,
  SET_DEFAULT_ADDRESS_SUCCESS,
  SET_DEFAULT_ADDRESS_FAILURE,
} from '../../actionTypes';

describe('Address Reducer', () => {
  const initialState = {
    addresses: [],
    currentAddress: null,
    loading: false,
    error: null,
  };

  it('should return the initial state', () => {
    expect(addressReducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  describe('FETCH_ADDRESSES actions', () => {
    it('should handle FETCH_ADDRESSES_REQUEST', () => {
      const action = { type: FETCH_ADDRESSES_REQUEST };
      const expectedState = {
        ...initialState,
        loading: true,
        error: null,
      };
      expect(addressReducer(initialState, action)).toEqual(expectedState);
    });

    it('should handle FETCH_ADDRESSES_SUCCESS', () => {
      const addresses = [
        { id: 1, street: '123 Main St', city: 'New York', isDefault: true },
        { id: 2, street: '456 Oak Ave', city: 'Boston', isDefault: false },
      ];
      const action = { type: FETCH_ADDRESSES_SUCCESS, payload: addresses };
      const expectedState = {
        ...initialState,
        loading: false,
        addresses: addresses,
      };
      expect(addressReducer(initialState, action)).toEqual(expectedState);
    });

    it('should handle FETCH_ADDRESSES_FAILURE', () => {
      const errorMessage = 'Failed to fetch addresses';
      const action = { type: FETCH_ADDRESSES_FAILURE, payload: errorMessage };
      const expectedState = {
        ...initialState,
        loading: false,
        error: errorMessage,
      };
      expect(addressReducer(initialState, action)).toEqual(expectedState);
    });
  });

  describe('ADD_ADDRESS actions', () => {
    it('should handle ADD_ADDRESS_REQUEST', () => {
      const action = { type: ADD_ADDRESS_REQUEST };
      const expectedState = {
        ...initialState,
        loading: true,
        error: null,
      };
      expect(addressReducer(initialState, action)).toEqual(expectedState);
    });

    it('should handle ADD_ADDRESS_SUCCESS', () => {
      const newAddress = { id: 3, street: '789 Pine Rd', city: 'Chicago', isDefault: false };
      const currentState = {
        addresses: [{ id: 1, street: '123 Main St', city: 'New York' }],
        currentAddress: null,
        loading: false,
        error: null,
      };
      const action = { type: ADD_ADDRESS_SUCCESS, payload: newAddress };
      const expectedState = {
        ...currentState,
        loading: false,
        addresses: [...currentState.addresses, newAddress],
      };
      expect(addressReducer(currentState, action)).toEqual(expectedState);
    });

    it('should handle ADD_ADDRESS_FAILURE', () => {
      const errorMessage = 'Failed to create address';
      const action = { type: ADD_ADDRESS_FAILURE, payload: errorMessage };
      const expectedState = {
        ...initialState,
        loading: false,
        error: errorMessage,
      };
      expect(addressReducer(initialState, action)).toEqual(expectedState);
    });
  });

  describe('UPDATE_ADDRESS actions', () => {
    it('should handle UPDATE_ADDRESS_REQUEST', () => {
      const action = { type: UPDATE_ADDRESS_REQUEST };
      const expectedState = {
        ...initialState,
        loading: true,
        error: null,
      };
      expect(addressReducer(initialState, action)).toEqual(expectedState);
    });

    it('should handle UPDATE_ADDRESS_SUCCESS', () => {
      const currentState = {
        addresses: [
          { id: 1, street: '123 Main St', city: 'New York' },
          { id: 2, street: '456 Oak Ave', city: 'Boston' },
        ],
        loading: false,
        error: null,
      };
      const updatedAddress = { id: 1, street: '123 Main St UPDATED', city: 'New York' };
      const action = { type: UPDATE_ADDRESS_SUCCESS, payload: updatedAddress };
      const expectedState = {
        ...currentState,
        loading: false,
        addresses: [
          updatedAddress,
          { id: 2, street: '456 Oak Ave', city: 'Boston' },
        ],
      };
      expect(addressReducer(currentState, action)).toEqual(expectedState);
    });

    it('should handle UPDATE_ADDRESS_FAILURE', () => {
      const errorMessage = 'Failed to update address';
      const action = { type: UPDATE_ADDRESS_FAILURE, payload: errorMessage };
      const expectedState = {
        ...initialState,
        loading: false,
        error: errorMessage,
      };
      expect(addressReducer(initialState, action)).toEqual(expectedState);
    });
  });

  describe('DELETE_ADDRESS actions', () => {
    it('should handle DELETE_ADDRESS_REQUEST', () => {
      const action = { type: DELETE_ADDRESS_REQUEST };
      const expectedState = {
        ...initialState,
        loading: true,
        error: null,
      };
      expect(addressReducer(initialState, action)).toEqual(expectedState);
    });

    it('should handle DELETE_ADDRESS_SUCCESS', () => {
      const currentState = {
        addresses: [
          { id: 1, street: '123 Main St', city: 'New York' },
          { id: 2, street: '456 Oak Ave', city: 'Boston' },
        ],
        loading: false,
        error: null,
      };
      const action = { type: DELETE_ADDRESS_SUCCESS, payload: 1 };
      const expectedState = {
        ...currentState,
        loading: false,
        addresses: [{ id: 2, street: '456 Oak Ave', city: 'Boston' }],
      };
      expect(addressReducer(currentState, action)).toEqual(expectedState);
    });

    it('should handle DELETE_ADDRESS_FAILURE', () => {
      const errorMessage = 'Failed to delete address';
      const action = { type: DELETE_ADDRESS_FAILURE, payload: errorMessage };
      const expectedState = {
        ...initialState,
        loading: false,
        error: errorMessage,
      };
      expect(addressReducer(initialState, action)).toEqual(expectedState);
    });
  });

  describe('SET_DEFAULT_ADDRESS actions', () => {
    it('should handle SET_DEFAULT_ADDRESS_REQUEST', () => {
      const action = { type: SET_DEFAULT_ADDRESS_REQUEST };
      const expectedState = {
        ...initialState,
        loading: true,
        error: null,
      };
      expect(addressReducer(initialState, action)).toEqual(expectedState);
    });

    it('should handle SET_DEFAULT_ADDRESS_SUCCESS', () => {
      const currentState = {
        addresses: [
          { id: 1, street: '123 Main St', city: 'New York', isDefault: true },
          { id: 2, street: '456 Oak Ave', city: 'Boston', isDefault: false },
        ],
        loading: false,
        error: null,
      };
      const action = { type: SET_DEFAULT_ADDRESS_SUCCESS, payload: { id: 2 } };
      const expectedState = {
        ...currentState,
        loading: false,
        addresses: [
          { id: 1, street: '123 Main St', city: 'New York', isDefault: false },
          { id: 2, street: '456 Oak Ave', city: 'Boston', isDefault: true },
        ],
      };
      expect(addressReducer(currentState, action)).toEqual(expectedState);
    });

    it('should handle SET_DEFAULT_ADDRESS_FAILURE', () => {
      const errorMessage = 'Failed to set default address';
      const action = { type: SET_DEFAULT_ADDRESS_FAILURE, payload: errorMessage };
      const expectedState = {
        ...initialState,
        loading: false,
        error: errorMessage,
      };
      expect(addressReducer(initialState, action)).toEqual(expectedState);
    });
  });

  it('should return current state for unknown action', () => {
    const action = { type: 'UNKNOWN_ACTION' };
    expect(addressReducer(initialState, action)).toEqual(initialState);
  });
});
