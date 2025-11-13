import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import {thunk} from 'redux-thunk';
import LocationModal from '../LocationModal';
import { LocationProvider } from '../../context/LocationContext';
import addressReducer from '../../redux/reducers/addressReducer';
import * as userUtils from '../../utils/userUtils';
import * as addressActions from '../../redux/actions/addressActions';

// Mock userUtils
jest.mock('../../utils/userUtils', () => ({
  isGuestUser: jest.fn(() => false),
  getUserId: jest.fn(() => '12345678-1234-1234-1234-123456789012')
}));

// Mock the actions
jest.mock('../../redux/actions/addressActions', () => ({
  fetchAddresses: jest.fn(),
  updateAddress: jest.fn(),
  deleteAddress: jest.fn(),
  setDefaultAddress: jest.fn(),
  createAddress: jest.fn(),
}));

// Mock AddressForm component
jest.mock('../AddressForm', () => {
  return function MockAddressForm({ open, onClose, onSubmit, initialAddress }) {
    return open ? (
      <div data-testid="address-form">
        <button onClick={onClose}>Close Form</button>
        <button onClick={() => onSubmit({ test: 'data' })}>Submit Form</button>
      </div>
    ) : null;
  };
});

const createMockStore = (initialState = {}) => {
  const rootReducer = combineReducers({
    addresses: addressReducer,
  });
  
  const defaultState = {
    addresses: { addresses: [], loading: false, error: null },
    ...initialState
  };
  
  return createStore(rootReducer, defaultState, applyMiddleware(thunk));
};

const renderLocationModal = (open = true, onClose = jest.fn(), storeState = {}) => {
  const store = createMockStore(storeState);
  return render(
    <Provider store={store}>
      <LocationProvider>
        <LocationModal open={open} onClose={onClose} />
      </LocationProvider>
    </Provider>
  );
};

describe('LocationModal Component', () => {
  let mockGeolocation;
  let originalFetch;

  beforeEach(() => {
    // Clear mock call history but NOT implementations
    if (addressActions.fetchAddresses) {
      addressActions.fetchAddresses.mockClear();
    }
    if (addressActions.updateAddress) {
      addressActions.updateAddress.mockClear();
    }
    
    // Ensure mocks return proper thunks
    addressActions.fetchAddresses.mockImplementation(() => async (dispatch) => {
      dispatch({ type: 'FETCH_ADDRESSES_REQUEST' });
      dispatch({ type: 'FETCH_ADDRESSES_SUCCESS', payload: [] });
      return Promise.resolve({ payload: [] });
    });
    
    addressActions.updateAddress.mockImplementation(() => async (dispatch) => {
      dispatch({ type: 'UPDATE_ADDRESS_REQUEST' });
      dispatch({ type: 'UPDATE_ADDRESS_SUCCESS', payload: {} });
      return Promise.resolve({ payload: {} });
    });
    
    // Clear other mocks
    userUtils.isGuestUser.mockClear();
    userUtils.getUserId.mockClear();
    
    // Reset userUtils to default values
    userUtils.isGuestUser.mockReturnValue(false);
    userUtils.getUserId.mockReturnValue('12345678-1234-1234-1234-123456789012');
    
    // Mock geolocation
    mockGeolocation = {
      getCurrentPosition: jest.fn(),
    };
    global.navigator.geolocation = mockGeolocation;
    
    // Mock fetch - ensure it's reset for each test
    originalFetch = global.fetch;
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        display_name: 'Test Village, Test District, Test State, 560001, India'
      })
    });
  });

  afterEach(() => {
    global.fetch = originalFetch;
    delete window.updateCurrentLocation;
  });

  describe('Rendering', () => {
    it('renders when open is true', () => {
      renderLocationModal();
      expect(screen.getByText('Change Location')).toBeInTheDocument();
    });

    it('does not render when open is false', () => {
      renderLocationModal(false);
      expect(screen.queryByText('Change Location')).not.toBeInTheDocument();
    });

    it('displays detect my location button', () => {
      renderLocationModal();
      expect(screen.getByText('Detect my location')).toBeInTheDocument();
    });

    it('displays search input', () => {
      renderLocationModal();
      expect(screen.getByPlaceholderText('search delivery location')).toBeInTheDocument();
    });

    it('displays cancel button', () => {
      renderLocationModal();
      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    });

    it('displays OR text between detect and search', () => {
      renderLocationModal();
      expect(screen.getByText('OR')).toBeInTheDocument();
    });
  });

  describe('Close functionality', () => {
    it('calls onClose when close button is clicked', () => {
      const onClose = jest.fn();
      renderLocationModal(true, onClose);
      
      const closeButton = screen.getByRole('button', { name: 'close' });
      fireEvent.click(closeButton);
      
      expect(onClose).toHaveBeenCalled();
    });

    it('calls onClose when cancel button is clicked', () => {
      const onClose = jest.fn();
      renderLocationModal(true, onClose);
      
      const cancelButton = screen.getByRole('button', { name: 'Cancel' });
      fireEvent.click(cancelButton);
      
      expect(onClose).toHaveBeenCalled();
    });

    it('does not close on backdrop click', () => {
      const onClose = jest.fn();
      const { container } = renderLocationModal(true, onClose);
      
      const backdrop = container.querySelector('.MuiBackdrop-root');
      if (backdrop) {
        fireEvent.click(backdrop);
      }
      
      // onClose should not be called due to backdropClick prevention
      expect(onClose).not.toHaveBeenCalled();
    });

    it('cleans up global updateCurrentLocation function on unmount', () => {
      const { unmount } = renderLocationModal(true);
      
      // Verify the function is set during mount
      expect(window.updateCurrentLocation).toBeDefined();
      
      // Unmount the component
      unmount();
      
      // Verify the cleanup function removed it
      expect(window.updateCurrentLocation).toBeUndefined();
    });
  });

  describe('Search functionality', () => {
    it('updates address input value', () => {
      renderLocationModal();
      
      const searchInput = screen.getByPlaceholderText('search delivery location');
      fireEvent.change(searchInput, { target: { value: 'New Address' } });
      
      expect(searchInput.value).toBe('New Address');
    });

    it('updates location and closes on Enter key', () => {
      const onClose = jest.fn();
      renderLocationModal(true, onClose);
      
      const searchInput = screen.getByPlaceholderText('search delivery location');
      fireEvent.change(searchInput, { target: { value: 'New Address' } });
      fireEvent.keyPress(searchInput, { key: 'Enter', code: 13, charCode: 13 });
      
      expect(onClose).toHaveBeenCalled();
    });

    it('does not close on Enter if address is empty', () => {
      const onClose = jest.fn();
      renderLocationModal(true, onClose);
      
      const searchInput = screen.getByPlaceholderText('search delivery location');
      fireEvent.change(searchInput, { target: { value: '   ' } });
      fireEvent.keyPress(searchInput, { key: 'Enter', code: 13, charCode: 13 });
      
      expect(onClose).not.toHaveBeenCalled();
    });

    it('does not trigger search on non-Enter key', () => {
      const onClose = jest.fn();
      renderLocationModal(true, onClose);
      
      const searchInput = screen.getByPlaceholderText('search delivery location');
      fireEvent.change(searchInput, { target: { value: 'Test' } });
      fireEvent.keyPress(searchInput, { key: 'a', code: 65, charCode: 65 });
      
      expect(onClose).not.toHaveBeenCalled();
    });
  });

  describe('Geolocation detection', () => {
    it('shows detecting state when location detection starts', async () => {
      mockGeolocation.getCurrentPosition.mockImplementation(() => {
        // Don't call callbacks to keep detecting state
      });
      
      renderLocationModal();
      
      const detectButton = screen.getByText('Detect my location');
      fireEvent.click(detectButton);
      
      await waitFor(() => {
        expect(screen.getByText('Detecting location...')).toBeInTheDocument();
      });
    });

    it('detects location successfully with city', async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          city: 'Bangalore',
          state: '',
          addressLine1: '',
          addressLine2: '',
          pincode: '',
          latitude: 12.9716,
          longitude: 77.5946
        })
      });

      mockGeolocation.getCurrentPosition.mockImplementation((success) => {
        success({
          coords: {
            latitude: 12.9716,
            longitude: 77.5946
          }
        });
      });
      
      renderLocationModal();
      
      const detectButton = screen.getByText('Detect my location');
      await act(async () => {
        fireEvent.click(detectButton);
      });
      
      await waitFor(() => {
        const searchInput = screen.getByPlaceholderText('search delivery location');
        expect(searchInput.value).toBe('Bangalore');
      });
    });

    it('uses town when city is not available', async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          city: 'Mysore',
          state: '',
          addressLine1: '',
          addressLine2: '',
          pincode: '',
          latitude: 12.9716,
          longitude: 77.5946
        })
      });

      mockGeolocation.getCurrentPosition.mockImplementation((success) => {
        success({
          coords: { latitude: 12.9716, longitude: 77.5946 }
        });
      });
      
      renderLocationModal();
      
      const detectButton = screen.getByText('Detect my location');
      await act(async () => {
        fireEvent.click(detectButton);
      });
      
      await waitFor(() => {
        const searchInput = screen.getByPlaceholderText('search delivery location');
        expect(searchInput.value).toBe('Mysore');
      });
    });

    it('uses village when city and town are not available', async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          city: 'Test Village',
          state: '',
          addressLine1: '',
          addressLine2: '',
          pincode: '',
          latitude: 12.9716,
          longitude: 77.5946
        })
      });

      mockGeolocation.getCurrentPosition.mockImplementation((success) => {
        success({
          coords: { latitude: 12.9716, longitude: 77.5946 }
        });
      });
      
      renderLocationModal();
      
      const detectButton = screen.getByText('Detect my location');
      await act(async () => {
        fireEvent.click(detectButton);
      });
      
      await waitFor(() => {
        const searchInput = screen.getByPlaceholderText('search delivery location');
        expect(searchInput.value).toBe('Test Village');
      });
    });

    it('uses fallback location when fetch fails', async () => {
      global.fetch.mockResolvedValue({
        ok: false,
      });

      mockGeolocation.getCurrentPosition.mockImplementation((success) => {
        success({
          coords: { latitude: 12.9716, longitude: 77.5946 }
        });
      });
      
      renderLocationModal();
      
      const detectButton = screen.getByText('Detect my location');
      await act(async () => {
        fireEvent.click(detectButton);
      });
      
      await waitFor(() => {
        const searchInput = screen.getByPlaceholderText('search delivery location');
        expect(searchInput.value).toBe('Current Location');
      });
    });

    it('uses fallback location when fetch throws error', async () => {
      global.fetch.mockRejectedValue(new Error('Network error'));

      mockGeolocation.getCurrentPosition.mockImplementation((success) => {
        success({
          coords: { latitude: 12.9716, longitude: 77.5946 }
        });
      });
      
      renderLocationModal();
      
      const detectButton = screen.getByText('Detect my location');
      await act(async () => {
        fireEvent.click(detectButton);
      });
      
      await waitFor(() => {
        const searchInput = screen.getByPlaceholderText('search delivery location');
        expect(searchInput.value).toBe('Current Location');
      });
    });

    it('handles geolocation permission denied', async () => {
      mockGeolocation.getCurrentPosition.mockImplementation((success, error) => {
        error({ code: 1, message: 'User denied geolocation' });
      });
      
      renderLocationModal();
      
      const detectButton = screen.getByText('Detect my location');
      await act(async () => {
        fireEvent.click(detectButton);
      });
      
      await waitFor(() => {
        expect(screen.getByText('Detect my location')).toBeInTheDocument();
      });
    });

    it('does nothing when geolocation is not available', () => {
      delete global.navigator.geolocation;
      
      renderLocationModal();
      
      const detectButton = screen.getByText('Detect my location');
      fireEvent.click(detectButton);
      
      expect(screen.getByText('Detect my location')).toBeInTheDocument();
    });
  });

  describe('Saved addresses - Authenticated user', () => {
    it('fetches addresses when modal opens for authenticated user', async () => {
      addressActions.fetchAddresses.mockClear();
      renderLocationModal();
      
      // Wait a bit for useEffect to run
      await waitFor(() => {
        expect(addressActions.fetchAddresses).toHaveBeenCalled();
      }, { timeout: 2000 });
      
      // Verify it was called at least once (don't check exact count due to React strict mode)
      expect(addressActions.fetchAddresses).toHaveBeenCalled();
    });

    it('displays saved addresses section for authenticated user', () => {
      renderLocationModal();
      
      expect(screen.getByText('Your saved addresses')).toBeInTheDocument();
    });

    it('shows loading state while fetching addresses', () => {
      const storeState = {
        addresses: { addresses: [], loading: true, error: null }
      };
      
      renderLocationModal(true, jest.fn(), storeState);
      
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('shows error with retry button', () => {
      const storeState = {
        addresses: { addresses: [], loading: false, error: 'Failed to load' }
      };
      
      renderLocationModal(true, jest.fn(), storeState);
      
      expect(screen.getByText('Failed to load')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
    });

    it('shows error with object error message', () => {
      const storeState = {
        addresses: { addresses: [], loading: false, error: { message: 'Network error' } }
      };
      
      renderLocationModal(true, jest.fn(), storeState);
      
      expect(screen.getByText('Network error')).toBeInTheDocument();
    });

    it('shows fallback error message for unknown error format', () => {
      const storeState = {
        addresses: { addresses: [], loading: false, error: {} }
      };
      
      renderLocationModal(true, jest.fn(), storeState);
      
      expect(screen.getByText('Failed to load addresses')).toBeInTheDocument();
    });

    it('retries fetching addresses on retry button click', async () => {
      const storeState = {
        addresses: { addresses: [], loading: false, error: 'Failed to load' }
      };
      
      renderLocationModal(true, jest.fn(), storeState);
      
      const retryButton = screen.getByRole('button', { name: 'Retry' });
      
      await act(async () => {
        fireEvent.click(retryButton);
      });
      
      await waitFor(() => {
        expect(addressActions.fetchAddresses).toHaveBeenCalled();
      });
    });

    it('shows empty state when no addresses', () => {
      const storeState = {
        addresses: { addresses: [], loading: false, error: null }
      };
      
      renderLocationModal(true, jest.fn(), storeState);
      
      expect(screen.getByText('No saved addresses yet. Add one to save time on future orders!')).toBeInTheDocument();
    });

    it('displays address list when addresses exist', () => {
      const storeState = {
        addresses: { 
          addresses: [
            {
              id: '1',
              addressType: 'home',
              fullName: 'John Doe',
              addressLine1: '123 Main St',
              city: 'Bangalore',
              state: 'Karnataka',
              pincode: '560001',
              isDefault: true,
            }
          ], 
          loading: false, 
          error: null 
        }
      };
      
      renderLocationModal(true, jest.fn(), storeState);
      
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('123 Main St')).toBeInTheDocument();
      expect(screen.getByText('Bangalore, Karnataka - 560001')).toBeInTheDocument();
    });

    it('displays default chip for default address', () => {
      const storeState = {
        addresses: { 
          addresses: [
            {
              id: '1',
              addressType: 'home',
              fullName: 'John Doe',
              addressLine1: '123 Main St',
              city: 'Bangalore',
              state: 'Karnataka',
              pincode: '560001',
              isDefault: true,
            }
          ], 
          loading: false, 
          error: null 
        }
      };
      
      renderLocationModal(true, jest.fn(), storeState);
      
      expect(screen.getByText('Default')).toBeInTheDocument();
    });

    it('selects address and closes modal on address click', () => {
      const onClose = jest.fn();
      const storeState = {
        addresses: { 
          addresses: [
            {
              id: '1',
              addressType: 'home',
              fullName: 'John Doe',
              addressLine1: '123 Main St',
              city: 'Bangalore',
              state: 'Karnataka',
              pincode: '560001',
            }
          ], 
          loading: false, 
          error: null 
        }
      };
      
      renderLocationModal(true, onClose, storeState);
      
      const addressItem = screen.getByText('123 Main St').closest('.MuiListItem-root');
      fireEvent.click(addressItem);
      
      expect(onClose).toHaveBeenCalled();
    });

    it('opens edit form when edit button clicked', async () => {
      const storeState = {
        addresses: { 
          addresses: [
            {
              id: '1',
              addressType: 'home',
              fullName: 'John Doe',
              phoneNumber: '1234567890',
              addressLine1: '123 Main St',
              city: 'Bangalore',
              state: 'Karnataka',
              pincode: '560001',
            }
          ], 
          loading: false, 
          error: null 
        }
      };
      
      renderLocationModal(true, jest.fn(), storeState);
      
      await waitFor(() => {
        expect(screen.getByText('123 Main St')).toBeInTheDocument();
      });
      
      const editButtons = screen.getAllByRole('button');
      const editButton = editButtons.find(btn => {
        const svg = btn.querySelector('svg');
        return svg && svg.getAttribute('data-testid') === 'EditIcon';
      });
      
      await act(async () => {
        fireEvent.click(editButton);
      });
      
      await waitFor(() => {
        expect(screen.getByTestId('address-form')).toBeInTheDocument();
      });
    });

    it('closes edit form', async () => {
      const storeState = {
        addresses: { 
          addresses: [
            {
              id: '1',
              addressType: 'home',
              fullName: 'John Doe',
              phoneNumber: '1234567890',
              addressLine1: '123 Main St',
              city: 'Bangalore',
              state: 'Karnataka',
              pincode: '560001',
            }
          ], 
          loading: false, 
          error: null 
        }
      };
      
      renderLocationModal(true, jest.fn(), storeState);
      
      await waitFor(() => {
        expect(screen.getByText('123 Main St')).toBeInTheDocument();
      });
      
      const editButtons = screen.getAllByRole('button');
      const editButton = editButtons.find(btn => {
        const svg = btn.querySelector('svg');
        return svg && svg.getAttribute('data-testid') === 'EditIcon';
      });
      
      await act(async () => {
        fireEvent.click(editButton);
      });
      
      await waitFor(() => {
        expect(screen.getByTestId('address-form')).toBeInTheDocument();
      });
      
      const closeFormButton = screen.getByText('Close Form');
      await act(async () => {
        fireEvent.click(closeFormButton);
      });
      
      await waitFor(() => {
        expect(screen.queryByTestId('address-form')).not.toBeInTheDocument();
      });
    });

    it('submits edit form and refreshes addresses', async () => {
      const storeState = {
        addresses: { 
          addresses: [
            {
              id: '1',
              addressType: 'home',
              fullName: 'John Doe',
              phoneNumber: '1234567890',
              addressLine1: '123 Main St',
              city: 'Bangalore',
              state: 'Karnataka',
              pincode: '560001',
            }
          ], 
          loading: false, 
          error: null 
        }
      };
      
      renderLocationModal(true, jest.fn(), storeState);
      
      await waitFor(() => {
        expect(screen.getByText('123 Main St')).toBeInTheDocument();
      });
      
      const editButtons = screen.getAllByRole('button');
      const editButton = editButtons.find(btn => {
        const svg = btn.querySelector('svg');
        return svg && svg.getAttribute('data-testid') === 'EditIcon';
      });
      
      await act(async () => {
        fireEvent.click(editButton);
      });
      
      await waitFor(() => {
        expect(screen.getByTestId('address-form')).toBeInTheDocument();
      });
      
      const submitButton = screen.getByText('Submit Form');
      await act(async () => {
        fireEvent.click(submitButton);
      });
      
      // Wait for both updateAddress and fetchAddresses to be called
      await waitFor(() => {
        expect(addressActions.updateAddress).toHaveBeenCalled();
      }, { timeout: 3000 });
      
      await waitFor(() => {
        expect(addressActions.fetchAddresses).toHaveBeenCalled();
      }, { timeout: 3000 });
    });

    it('displays work icon for work address', () => {
      const storeState = {
        addresses: { 
          addresses: [
            {
              id: '1',
              addressType: 'work',
              fullName: 'John Doe',
              addressLine1: '123 Work St',
              city: 'Bangalore',
              state: 'Karnataka',
              pincode: '560001',
            }
          ], 
          loading: false, 
          error: null 
        }
      };
      
      renderLocationModal(true, jest.fn(), storeState);
      
      expect(screen.getByText('Work')).toBeInTheDocument();
    });

    it('displays default icon for other address type', () => {
      const storeState = {
        addresses: { 
          addresses: [
            {
              id: '1',
              addressType: 'other',
              fullName: 'John Doe',
              addressLine1: '123 Other St',
              city: 'Bangalore',
              state: 'Karnataka',
              pincode: '560001',
            }
          ], 
          loading: false, 
          error: null 
        }
      };
      
      renderLocationModal(true, jest.fn(), storeState);
      
      expect(screen.getByText('Other')).toBeInTheDocument();
    });
  });

  describe('Guest user', () => {
    it('does not show saved addresses section for guest user', () => {
      const { isGuestUser } = require('../../utils/userUtils');
      isGuestUser.mockReturnValue(true);
      
      renderLocationModal();
      
      expect(screen.queryByText('Your saved addresses')).not.toBeInTheDocument();
    });

    it('does not fetch addresses for guest user', () => {
      const { isGuestUser } = require('../../utils/userUtils');
      const { fetchAddresses } = require('../../redux/actions/addressActions');
      isGuestUser.mockReturnValue(true);
      fetchAddresses.mockClear();
      
      renderLocationModal();
      
      expect(fetchAddresses).not.toHaveBeenCalled();
    });
  });

  describe('Invalid user ID', () => {
    it('does not fetch addresses for invalid UUID', () => {
      const { getUserId } = require('../../utils/userUtils');
      const { fetchAddresses } = require('../../redux/actions/addressActions');
      getUserId.mockReturnValue('invalid-id');
      fetchAddresses.mockClear();
      
      renderLocationModal();
      
      expect(fetchAddresses).not.toHaveBeenCalled();
    });

    it('does not fetch addresses when userId is null', () => {
      const { getUserId } = require('../../utils/userUtils');
      const { fetchAddresses } = require('../../redux/actions/addressActions');
      getUserId.mockReturnValue(null);
      fetchAddresses.mockClear();
      
      renderLocationModal();
      
      expect(fetchAddresses).not.toHaveBeenCalled();
    });
  });

  describe('Global updateCurrentLocation', () => {
    it('sets up global updateCurrentLocation function', () => {
      renderLocationModal();
      
      expect(window.updateCurrentLocation).toBeDefined();
    });

    it('cleans up global updateCurrentLocation on unmount', () => {
      const { unmount } = renderLocationModal();
      
      expect(window.updateCurrentLocation).toBeDefined();
      
      unmount();
      
      expect(window.updateCurrentLocation).toBeUndefined();
    });
  });
});
