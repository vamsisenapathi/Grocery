import { fetchAddresses, fetchAddressById, createAddress, updateAddress, deleteAddress, setDefaultAddress } from '../addressApi';
import apiClient from '../baseApi';
import { getUserId } from '../../utils/userUtils';

jest.mock('../baseApi', () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  patch: jest.fn(),
  delete: jest.fn()
}));
jest.mock('../../utils/userUtils');

describe('addressApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchAddresses', () => {
    it('fetches addresses successfully', async () => {
      const mockAddresses = [{ id: '1', address: '123 Main St' }];
      getUserId.mockReturnValue('123e4567-e89b-12d3-a456-426614174000');
      apiClient.get.mockResolvedValue({ data: mockAddresses });

      const dispatch = jest.fn();
      const thunk = fetchAddresses();
      await thunk(dispatch, () => ({}), undefined);

      expect(apiClient.get).toHaveBeenCalledWith('/addresses/user/123e4567-e89b-12d3-a456-426614174000');
    });

    it('returns error when user not logged in', async () => {
      getUserId.mockReturnValue(null);

      const dispatch = jest.fn();
      const thunk = fetchAddresses();
      const result = await thunk(dispatch, () => ({}), undefined);

      expect(result.payload).toBe('User not logged in');
    });

    it('returns error for invalid UUID', async () => {
      getUserId.mockReturnValue('invalid-id');

      const dispatch = jest.fn();
      const thunk = fetchAddresses();
      const result = await thunk(dispatch, () => ({}), undefined);

      expect(result.payload).toBe('Please login to view your saved addresses');
    });

    it('handles API error', async () => {
      getUserId.mockReturnValue('123e4567-e89b-12d3-a456-426614174000');
      apiClient.get.mockRejectedValue({
        response: { data: { message: 'Fetch failed' } }
      });

      const dispatch = jest.fn();
      const thunk = fetchAddresses();
      const result = await thunk(dispatch, () => ({}), undefined);

      expect(result.payload).toBe('Fetch failed');
    });

    it('handles error with error field in response.data', async () => {
      getUserId.mockReturnValue('123e4567-e89b-12d3-a456-426614174000');
      apiClient.get.mockRejectedValue({
        response: { data: { error: 'Custom fetch error' } }
      });

      const dispatch = jest.fn();
      const thunk = fetchAddresses();
      const result = await thunk(dispatch, () => ({}), undefined);

      expect(result.payload).toBe('Custom fetch error');
    });

    it('handles error with just error.message', async () => {
      getUserId.mockReturnValue('123e4567-e89b-12d3-a456-426614174000');
      apiClient.get.mockRejectedValue(new Error('Connection timeout'));

      const dispatch = jest.fn();
      const thunk = fetchAddresses();
      const result = await thunk(dispatch, () => ({}), undefined);

      expect(result.payload).toBe('Connection timeout');
    });

    it('falls back to default error message when no message available', async () => {
      getUserId.mockReturnValue('123e4567-e89b-12d3-a456-426614174000');
      apiClient.get.mockRejectedValue(new Error());

      const dispatch = jest.fn();
      const thunk = fetchAddresses();
      const result = await thunk(dispatch, () => ({}), undefined);

      expect(result.payload).toBe('Failed to fetch addresses');
    });

    it('returns empty array when response.data is undefined', async () => {
      getUserId.mockReturnValue('123e4567-e89b-12d3-a456-426614174000');
      apiClient.get.mockResolvedValue({ data: undefined });

      const dispatch = jest.fn();
      const thunk = fetchAddresses();
      const result = await thunk(dispatch, () => ({}), undefined);

      expect(result.payload).toEqual([]);
    });
  });

  describe('fetchAddressById', () => {
    it('fetches address by id successfully', async () => {
      const mockAddress = { id: '1', address: '123 Main St' };
      apiClient.get.mockResolvedValue({ data: mockAddress });

      const dispatch = jest.fn();
      const thunk = fetchAddressById('1');
      await thunk(dispatch, () => ({}), undefined);

      expect(apiClient.get).toHaveBeenCalledWith('/addresses/1');
    });

    it('handles error with message in response.data.message', async () => {
      apiClient.get.mockRejectedValue({
        response: { data: { message: 'Address not found' } }
      });

      const dispatch = jest.fn();
      const thunk = fetchAddressById('1');
      const result = await thunk(dispatch, () => ({}), undefined);

      expect(result.payload).toBe('Address not found');
    });

    it('handles error with error in response.data.error', async () => {
      apiClient.get.mockRejectedValue({
        response: { data: { error: 'Custom error' } }
      });

      const dispatch = jest.fn();
      const thunk = fetchAddressById('1');
      const result = await thunk(dispatch, () => ({}), undefined);

      expect(result.payload).toBe('Custom error');
    });

    it('handles error with plain error message', async () => {
      apiClient.get.mockRejectedValue(new Error('Network error'));

      const dispatch = jest.fn();
      const thunk = fetchAddressById('1');
      const result = await thunk(dispatch, () => ({}), undefined);

      expect(result.payload).toBe('Network error');
    });

    it('handles error without response and falls back to default message', async () => {
      apiClient.get.mockRejectedValue(new Error());

      const dispatch = jest.fn();
      const thunk = fetchAddressById('1');
      const result = await thunk(dispatch, () => ({}), undefined);

      expect(result.payload).toBe('Failed to fetch address');
    });
  });

  describe('createAddress', () => {
    it('creates address successfully', async () => {
      const newAddress = { address: '123 Main St' };
      const createdAddress = { id: '1', ...newAddress };
      getUserId.mockReturnValue('123e4567-e89b-12d3-a456-426614174000');
      apiClient.post.mockResolvedValue({ data: createdAddress });

      const dispatch = jest.fn();
      const thunk = createAddress(newAddress);
      await thunk(dispatch, () => ({}), undefined);

      expect(apiClient.post).toHaveBeenCalled();
    });

    it('returns error when user not logged in', async () => {
      getUserId.mockReturnValue(null);

      const dispatch = jest.fn();
      const thunk = createAddress({});
      const result = await thunk(dispatch, () => ({}), undefined);

      expect(result.payload).toBe('User not logged in');
    });

    it('returns error for invalid UUID', async () => {
      getUserId.mockReturnValue('invalid-guest-id');

      const dispatch = jest.fn();
      const thunk = createAddress({});
      const result = await thunk(dispatch, () => ({}), undefined);

      expect(result.payload).toBe('Please login to save addresses');
    });

    it('handles API error', async () => {
      getUserId.mockReturnValue('123e4567-e89b-12d3-a456-426614174000');
      apiClient.post.mockRejectedValue({
        response: { data: { message: 'Invalid address data' } }
      });

      const dispatch = jest.fn();
      const thunk = createAddress({});
      const result = await thunk(dispatch, () => ({}), undefined);

      expect(result.payload).toBe('Invalid address data');
    });

    it('handles error with error field in response.data', async () => {
      getUserId.mockReturnValue('123e4567-e89b-12d3-a456-426614174000');
      apiClient.post.mockRejectedValue({
        response: { data: { error: 'Validation failed' } }
      });

      const dispatch = jest.fn();
      const thunk = createAddress({});
      const result = await thunk(dispatch, () => ({}), undefined);

      expect(result.payload).toBe('Validation failed');
    });

    it('falls back to default error message', async () => {
      getUserId.mockReturnValue('123e4567-e89b-12d3-a456-426614174000');
      apiClient.post.mockRejectedValue(new Error());

      const dispatch = jest.fn();
      const thunk = createAddress({});
      const result = await thunk(dispatch, () => ({}), undefined);

      expect(result.payload).toBe('Failed to create address');
    });
  });

  describe('updateAddress', () => {
    it('updates address successfully', async () => {
      const updatedAddress = { id: '1', address: '456 Oak St' };
      const addressData = {
        name: 'John Doe',
        phoneNumber: '1234567890',
        addressLine1: '456 Oak St',
        city: 'New York',
        state: 'NY',
        pincode: '10001',
        addressType: 'home'
      };
      getUserId.mockReturnValue('123e4567-e89b-12d3-a456-426614174000');
      apiClient.put.mockResolvedValue({ data: updatedAddress });

      const dispatch = jest.fn();
      const thunk = updateAddress({ addressId: '1', addressData });
      await thunk(dispatch, () => ({}), undefined);

      expect(apiClient.put).toHaveBeenCalled();
      expect(getUserId).toHaveBeenCalled();
    });

    it('returns error when user not logged in', async () => {
      getUserId.mockReturnValue(null);

      const dispatch = jest.fn();
      const thunk = updateAddress({ addressId: '1', addressData: {} });
      const result = await thunk(dispatch, () => ({}), undefined);

      expect(result.payload).toBe('User not logged in');
    });

    it('handles API error', async () => {
      getUserId.mockReturnValue('123e4567-e89b-12d3-a456-426614174000');
      apiClient.put.mockRejectedValue({
        response: { data: { error: 'Update failed' } }
      });

      const dispatch = jest.fn();
      const thunk = updateAddress({ addressId: '1', addressData: {} });
      const result = await thunk(dispatch, () => ({}), undefined);

      expect(result.payload).toBe('Update failed');
    });

    it('handles error with message field in response.data', async () => {
      getUserId.mockReturnValue('123e4567-e89b-12d3-a456-426614174000');
      apiClient.put.mockRejectedValue({
        response: { data: { message: 'Not found' } }
      });

      const dispatch = jest.fn();
      const thunk = updateAddress({ addressId: '1', addressData: {} });
      const result = await thunk(dispatch, () => ({}), undefined);

      expect(result.payload).toBe('Not found');
    });

    it('falls back to default error message', async () => {
      getUserId.mockReturnValue('123e4567-e89b-12d3-a456-426614174000');
      apiClient.put.mockRejectedValue(new Error());

      const dispatch = jest.fn();
      const thunk = updateAddress({ addressId: '1', addressData: {} });
      const result = await thunk(dispatch, () => ({}), undefined);

      expect(result.payload).toBe('Failed to update address');
    });
  });

  describe('deleteAddress', () => {
    it('deletes address successfully', async () => {
      apiClient.delete.mockResolvedValue({ data: { success: true } });

      const dispatch = jest.fn();
      const thunk = deleteAddress('1');
      await thunk(dispatch, () => ({}), undefined);

      expect(apiClient.delete).toHaveBeenCalledWith('/addresses/1');
    });

    it('handles API error', async () => {
      apiClient.delete.mockRejectedValue(new Error('Delete failed'));

      const dispatch = jest.fn();
      const thunk = deleteAddress('1');
      const result = await thunk(dispatch, () => ({}), undefined);

      expect(result.payload).toBe('Delete failed');
    });

    it('handles error with response.data.message', async () => {
      apiClient.delete.mockRejectedValue({
        response: { data: { message: 'Address in use' } }
      });

      const dispatch = jest.fn();
      const thunk = deleteAddress('1');
      const result = await thunk(dispatch, () => ({}), undefined);

      expect(result.payload).toBe('Address in use');
    });

    it('handles error with response.data.error', async () => {
      apiClient.delete.mockRejectedValue({
        response: { data: { error: 'Cannot delete default address' } }
      });

      const dispatch = jest.fn();
      const thunk = deleteAddress('1');
      const result = await thunk(dispatch, () => ({}), undefined);

      expect(result.payload).toBe('Cannot delete default address');
    });

    it('falls back to default error message', async () => {
      apiClient.delete.mockRejectedValue(new Error());

      const dispatch = jest.fn();
      const thunk = deleteAddress('1');
      const result = await thunk(dispatch, () => ({}), undefined);

      expect(result.payload).toBe('Failed to delete address');
    });
  });

  describe('setDefaultAddress', () => {
    it('sets default address successfully', async () => {
      const mockAddress = { id: '1', isDefault: true };
      getUserId.mockReturnValue('123e4567-e89b-12d3-a456-426614174000');
      apiClient.patch.mockResolvedValue({ data: mockAddress });

      const dispatch = jest.fn();
      const thunk = setDefaultAddress('1');
      await thunk(dispatch, () => ({}), undefined);

      expect(apiClient.patch).toHaveBeenCalledWith(
        '/addresses/1/set-default',
        null,
        { params: { userId: '123e4567-e89b-12d3-a456-426614174000' } }
      );
    });

    it('returns error when user not logged in', async () => {
      getUserId.mockReturnValue(null);

      const dispatch = jest.fn();
      const thunk = setDefaultAddress('1');
      const result = await thunk(dispatch, () => ({}), undefined);

      expect(result.payload).toBe('User not logged in');
    });

    it('handles API error', async () => {
      getUserId.mockReturnValue('123e4567-e89b-12d3-a456-426614174000');
      apiClient.patch.mockRejectedValue({
        response: { data: { message: 'Set default failed' } }
      });

      const dispatch = jest.fn();
      const thunk = setDefaultAddress('1');
      const result = await thunk(dispatch, () => ({}), undefined);

      expect(result.payload).toBe('Set default failed');
    });

    it('handles error with response.data.error', async () => {
      getUserId.mockReturnValue('123e4567-e89b-12d3-a456-426614174000');
      apiClient.patch.mockRejectedValue({
        response: { data: { error: 'Address not found' } }
      });

      const dispatch = jest.fn();
      const thunk = setDefaultAddress('1');
      const result = await thunk(dispatch, () => ({}), undefined);

      expect(result.payload).toBe('Address not found');
    });

    it('falls back to default error message', async () => {
      getUserId.mockReturnValue('123e4567-e89b-12d3-a456-426614174000');
      apiClient.patch.mockRejectedValue(new Error());

      const dispatch = jest.fn();
      const thunk = setDefaultAddress('1');
      const result = await thunk(dispatch, () => ({}), undefined);

      expect(result.payload).toBe('Failed to set default address');
    });
  });
});
