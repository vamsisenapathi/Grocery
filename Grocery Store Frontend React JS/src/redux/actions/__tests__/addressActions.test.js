import configureMockStore from 'redux-mock-store';
import {thunk} from 'redux-thunk';
import * as addressActions from '../addressActions';
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
import apiClient from '../../../apiActions/baseApi';
import { getUserId } from '../../../utils/userUtils';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

jest.mock('../../../apiActions/baseApi');
jest.mock('../../../utils/userUtils');

describe('Address Actions', () => {
  let store;

  beforeEach(() => {
    store = mockStore({});
    jest.clearAllMocks();
    getUserId.mockReturnValue('550e8400-e29b-41d4-a716-446655440000'); // Valid UUID v4
    
    // Ensure all apiClient methods are mocked
    if (!apiClient.patch) {
      apiClient.patch = jest.fn();
    }
  });

  describe('fetchAddresses', () => {
    it('should dispatch FETCH_ADDRESSES_SUCCESS on successful fetch', async () => {
      const mockResponse = {
        data: [
          { id: 1, fullName: 'John Doe', street: '123 Main St', city: 'Mumbai' },
          { id: 2, fullName: 'Jane Doe', street: '456 Park Ave', city: 'Delhi' },
        ],
      };

      apiClient.get.mockResolvedValue(mockResponse);

      await store.dispatch(addressActions.fetchAddresses());

      const actions = store.getActions();
      expect(actions[0]).toEqual({ type: FETCH_ADDRESSES_REQUEST });
      expect(actions[1]).toEqual({
        type: FETCH_ADDRESSES_SUCCESS,
        payload: mockResponse.data,
      });
    });

    it('should dispatch FETCH_ADDRESSES_FAILURE on error', async () => {
      apiClient.get.mockRejectedValue(new Error('Network error'));

      try {
        await store.dispatch(addressActions.fetchAddresses());
      } catch (error) {
        const actions = store.getActions();
        expect(actions[1].type).toBe(FETCH_ADDRESSES_FAILURE);
      }
    });
  });

  describe('createAddress', () => {
    it('should dispatch ADD_ADDRESS_SUCCESS on successful creation', async () => {
      const mockResponse = {
        data: { id: 1, fullName: 'John Doe', street: '123 Main St' },
      };

      apiClient.post.mockResolvedValue(mockResponse);

      const addressData = {
        fullName: 'John Doe',
        street: '123 Main St',
        city: 'Mumbai',
        state: 'Maharashtra',
        postalCode: '400001',
      };

      await store.dispatch(addressActions.createAddress(addressData));

      const actions = store.getActions();
      expect(actions[0]).toEqual({ type: ADD_ADDRESS_REQUEST });
      expect(actions[1]).toEqual({
        type: ADD_ADDRESS_SUCCESS,
        payload: mockResponse.data,
      });
    });

    it('should dispatch ADD_ADDRESS_FAILURE on error', async () => {
      getUserId.mockReturnValue('user123');
      apiClient.post.mockRejectedValue(new Error('Creation failed'));

      const addressData = {
        fullName: 'John Doe',
        street: '123 Main St',
      };

      try {
        await store.dispatch(addressActions.createAddress(addressData));
      } catch (error) {
        const actions = store.getActions();
        expect(actions[1].type).toBe(ADD_ADDRESS_FAILURE);
      }
    });
  });

  describe('updateAddress', () => {
    it('should dispatch UPDATE_ADDRESS_SUCCESS on successful update', async () => {
      const mockResponse = {
        data: { id: 1, fullName: 'John Updated', street: '123 Main St' },
      };

      getUserId.mockReturnValue('550e8400-e29b-41d4-a716-446655440000');
      apiClient.put.mockResolvedValue(mockResponse);

      const updateData = {
        addressId: 1,
        addressData: { fullName: 'John Updated' },
      };

      await store.dispatch(addressActions.updateAddress(updateData));

      const actions = store.getActions();
      expect(actions[0]).toEqual({ type: UPDATE_ADDRESS_REQUEST });
      expect(actions[1]).toEqual({
        type: UPDATE_ADDRESS_SUCCESS,
        payload: mockResponse.data,
      });
    });

    it('should dispatch UPDATE_ADDRESS_FAILURE on error', async () => {
      getUserId.mockReturnValue('user123');
      apiClient.put.mockRejectedValue(new Error('Update failed'));

      const updateData = {
        addressId: 1,
        addressData: { fullName: 'John Updated' },
      };

      try {
        await store.dispatch(addressActions.updateAddress(updateData));
      } catch (error) {
        const actions = store.getActions();
        expect(actions[1].type).toBe(UPDATE_ADDRESS_FAILURE);
      }
    });
  });

  describe('deleteAddress', () => {
    it('should dispatch DELETE_ADDRESS_SUCCESS on successful deletion', async () => {
      const mockResponse = {
        data: { message: 'Address deleted successfully' },
      };

      apiClient.delete.mockResolvedValue(mockResponse);

      await store.dispatch(addressActions.deleteAddress(1));

      const actions = store.getActions();
      expect(actions[0]).toEqual({ type: DELETE_ADDRESS_REQUEST });
      expect(actions[1]).toEqual({
        type: DELETE_ADDRESS_SUCCESS,
        payload: 1,
      });
    });

    it('should dispatch DELETE_ADDRESS_FAILURE on error', async () => {
      apiClient.delete.mockRejectedValue(new Error('Delete failed'));

      try {
        await store.dispatch(addressActions.deleteAddress(1));
      } catch (error) {
        const actions = store.getActions();
        expect(actions[1].type).toBe(DELETE_ADDRESS_FAILURE);
      }
    });
  });

  describe('setDefaultAddress', () => {
    it('should dispatch SET_DEFAULT_ADDRESS_SUCCESS on successful update', async () => {
      const mockResponse = {
        data: { id: 1, isDefault: true },
      };

      apiClient.patch.mockResolvedValue(mockResponse);

      await store.dispatch(addressActions.setDefaultAddress(1));

      const actions = store.getActions();
      expect(actions[0]).toEqual({ type: SET_DEFAULT_ADDRESS_REQUEST });
      expect(actions[1]).toEqual({
        type: SET_DEFAULT_ADDRESS_SUCCESS,
        payload: mockResponse.data,
      });
      expect(apiClient.patch).toHaveBeenCalledWith('/addresses/1/set-default');
    });

    it('should dispatch SET_DEFAULT_ADDRESS_FAILURE on error', async () => {
      apiClient.patch.mockRejectedValue(new Error('Update failed'));

      try {
        await store.dispatch(addressActions.setDefaultAddress(1));
      } catch (error) {
        const actions = store.getActions();
        expect(actions[1].type).toBe(SET_DEFAULT_ADDRESS_FAILURE);
      }
    });
  });
});
