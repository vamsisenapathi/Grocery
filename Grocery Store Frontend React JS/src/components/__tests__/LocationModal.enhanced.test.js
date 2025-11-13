import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import {thunk} from 'redux-thunk';
import LocationModal from '../LocationModal';
import { LocationProvider } from '../../context/LocationContext';
import addressReducer from '../../redux/reducers/addressReducer';

// Mock fetch
global.fetch = jest.fn();

const createMockStore = (initialState = {}) => {
  const defaultState = {
    addresses: [],
    loading: false,
    error: null,
    ...initialState.addresses,
  };
  return createStore(addressReducer, defaultState, applyMiddleware(thunk));
};

const renderLocationModal = (props = {}, storeState = {}) => {
  const store = createMockStore(storeState);
  return render(
    <Provider store={store}>
      <LocationProvider>
        <LocationModal open={true} onClose={jest.fn()} {...props} />
      </LocationProvider>
    </Provider>
  );
};

describe('LocationModal Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch.mockClear();
    delete window.updateCurrentLocation;
  });

  it('renders the modal when open', () => {
    renderLocationModal();
    
    expect(screen.getByText('Change Location')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Detect my location/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/search delivery location/i)).toBeInTheDocument();
  });

  it('handles location detection successfully with city name', async () => {
    const mockOnClose = jest.fn();
    const mockGeolocation = {
      getCurrentPosition: jest.fn((success) =>
        success({
          coords: {
            latitude: 12.9716,
            longitude: 77.5946
          }
        })
      )
    };
    
    global.navigator.geolocation = mockGeolocation;
    
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        city: 'Bengaluru',
        state: 'Karnataka',
        addressLine1: '',
        addressLine2: '',
        pincode: '',
        latitude: 12.9716,
        longitude: 77.5946
      })
    });

    renderLocationModal({ onClose: mockOnClose });
    
    const detectButton = screen.getByRole('button', { name: /Detect my location/i });
    fireEvent.click(detectButton);

    await waitFor(() => {
      expect(mockGeolocation.getCurrentPosition).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/geolocation/reverse-geocode')
      );
    });

    await waitFor(() => {
      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });

  it('handles location detection with town name', async () => {
    const mockOnClose = jest.fn();
    const mockGeolocation = {
      getCurrentPosition: jest.fn((success) =>
        success({
          coords: {
            latitude: 12.9716,
            longitude: 77.5946
          }
        })
      )
    };
    
    global.navigator.geolocation = mockGeolocation;
    
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        city: 'Mysuru',
        state: 'Karnataka',
        addressLine1: '',
        addressLine2: '',
        pincode: '',
        latitude: 12.9716,
        longitude: 77.5946
      })
    });

    renderLocationModal({ onClose: mockOnClose });
    
    const detectButton = screen.getByRole('button', { name: /Detect my location/i });
    fireEvent.click(detectButton);

    await waitFor(() => {
      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });

  it('handles location detection with village name', async () => {
    const mockOnClose = jest.fn();
    const mockGeolocation = {
      getCurrentPosition: jest.fn((success) =>
        success({
          coords: {
            latitude: 12.9716,
            longitude: 77.5946
          }
        })
      )
    };
    
    global.navigator.geolocation = mockGeolocation;
    
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        city: 'TestVillage',
        state: 'Karnataka',
        addressLine1: '',
        addressLine2: '',
        pincode: '',
        latitude: 12.9716,
        longitude: 77.5946
      })
    });

    renderLocationModal({ onClose: mockOnClose });
    
    const detectButton = screen.getByRole('button', { name: /Detect my location/i });
    fireEvent.click(detectButton);

    await waitFor(() => {
      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });

  it('handles backend API failure gracefully', async () => {
    const mockOnClose = jest.fn();
    const mockGeolocation = {
      getCurrentPosition: jest.fn((success) =>
        success({
          coords: {
            latitude: 12.9716,
            longitude: 77.5946
          }
        })
      )
    };
    
    global.navigator.geolocation = mockGeolocation;
    
    global.fetch.mockResolvedValueOnce({
      ok: false
    });

    renderLocationModal({ onClose: mockOnClose });
    
    const detectButton = screen.getByRole('button', { name: /Detect my location/i });
    fireEvent.click(detectButton);

    // Wait for geolocation to be called
    await waitFor(() => {
      expect(mockGeolocation.getCurrentPosition).toHaveBeenCalled();
    });
    
    // Modal should remain open (onClose not called due to geocoding failure)
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('shows detecting state while getting location', async () => {
    const mockGeolocation = {
      getCurrentPosition: jest.fn()
    };
    
    global.navigator.geolocation = mockGeolocation;

    renderLocationModal();
    
    const detectButton = screen.getByRole('button', { name: /Detect my location/i });
    fireEvent.click(detectButton);

    expect(screen.getByText(/Detecting location.../i)).toBeInTheDocument();
  });

  it('handles geolocation error', async () => {
    const mockGeolocation = {
      getCurrentPosition: jest.fn((success, error) =>
        error({ code: 1, message: 'User denied geolocation' })
      )
    };
    
    global.navigator.geolocation = mockGeolocation;

    renderLocationModal();
    
    const detectButton = screen.getByRole('button', { name: /Detect my location/i });
    fireEvent.click(detectButton);

    await waitFor(() => {
      expect(mockGeolocation.getCurrentPosition).toHaveBeenCalled();
    });
  });

  it('allows manual address search', async () => {
    const mockOnClose = jest.fn();
    renderLocationModal({ onClose: mockOnClose });
    
    const searchInput = screen.getByPlaceholderText(/search delivery location/i);
    await userEvent.type(searchInput, 'Koramangala, Bengaluru');
    
    const searchButton = screen.getByRole('button', { name: /Cancel/i });
    expect(searchButton).toBeInTheDocument();
  });

  it('handles enter key press in search field', async () => {
    const mockOnClose = jest.fn();
    renderLocationModal({ onClose: mockOnClose });
    
    const searchInput = screen.getByPlaceholderText(/search delivery location/i);
    await userEvent.type(searchInput, 'Koramangala{enter}');

    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it('closes modal on cancel button click', () => {
    const mockOnClose = jest.fn();
    renderLocationModal({ onClose: mockOnClose });
    
    const cancelButton = screen.getByRole('button', { name: /Cancel/i });
    fireEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('closes modal on close icon click', () => {
    const mockOnClose = jest.fn();
    renderLocationModal({ onClose: mockOnClose });
    
    const closeIcon = screen.getByLabelText(/close/i);
    fireEvent.click(closeIcon);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('sets up global updateCurrentLocation function', () => {
    renderLocationModal();
    
    expect(window.updateCurrentLocation).toBeDefined();
    expect(typeof window.updateCurrentLocation).toBe('function');
  });

  it('cleans up global function on unmount', () => {
    const { unmount } = renderLocationModal();
    
    expect(window.updateCurrentLocation).toBeDefined();
    
    unmount();
    
    expect(window.updateCurrentLocation).toBeUndefined();
  });

  it('handles fetch exception during location detection', async () => {
    const mockOnClose = jest.fn();
    const mockGeolocation = {
      getCurrentPosition: jest.fn((success) =>
        success({
          coords: {
            latitude: 12.9716,
            longitude: 77.5946
          }
        })
      )
    };
    
    global.navigator.geolocation = mockGeolocation;
    global.fetch.mockRejectedValueOnce(new Error('Network error'));

    renderLocationModal({ onClose: mockOnClose });
    
    const detectButton = screen.getByRole('button', { name: /Detect my location/i });
    fireEvent.click(detectButton);

    // Wait for geolocation to be called
    await waitFor(() => {
      expect(mockGeolocation.getCurrentPosition).toHaveBeenCalled();
    });
    
    // The modal should still be open (onClose not called due to error)
    expect(mockOnClose).not.toHaveBeenCalled();
  });
});
