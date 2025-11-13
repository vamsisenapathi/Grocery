import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { LocationProvider, useLocation } from '../LocationContext';

const TestComponent = () => {
  const { location, updateLocation } = useLocation();
  return (
    <div>
      <div data-testid="address">{location.address}</div>
      <div data-testid="delivery-time">{location.deliveryTime}</div>
      <button onClick={() => updateLocation({ address: 'New Address', deliveryTime: '10 minutes' })}>
        Update
      </button>
    </div>
  );
};

describe('LocationContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('provides default location', () => {
    render(
      <LocationProvider>
        <TestComponent />
      </LocationProvider>
    );

    expect(screen.getByTestId('address')).toHaveTextContent('Brookefield, Bengaluru, Karnataka');
    expect(screen.getByTestId('delivery-time')).toHaveTextContent('8 minutes');
  });

  it('updates location when updateLocation is called', () => {
    render(
      <LocationProvider>
        <TestComponent />
      </LocationProvider>
    );

    const button = screen.getByText('Update');
    act(() => {
      button.click();
    });

    expect(screen.getByTestId('address')).toHaveTextContent('New Address');
    expect(screen.getByTestId('delivery-time')).toHaveTextContent('10 minutes');
  });

  it('persists location to localStorage', () => {
    render(
      <LocationProvider>
        <TestComponent />
      </LocationProvider>
    );

    const button = screen.getByText('Update');
    act(() => {
      button.click();
    });

    const savedLocation = JSON.parse(localStorage.getItem('userLocation'));
    expect(savedLocation.address).toBe('New Address');
    expect(savedLocation.deliveryTime).toBe('10 minutes');
  });

  it('loads location from localStorage on mount', () => {
    const savedLocation = { address: 'Saved Address', deliveryTime: '15 minutes' };
    localStorage.setItem('userLocation', JSON.stringify(savedLocation));

    render(
      <LocationProvider>
        <TestComponent />
      </LocationProvider>
    );

    expect(screen.getByTestId('address')).toHaveTextContent('Saved Address');
    expect(screen.getByTestId('delivery-time')).toHaveTextContent('15 minutes');
  });

  it('throws error when useLocation is used outside provider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => {
      render(<TestComponent />);
    }).toThrow('useLocation must be used within LocationProvider');

    consoleError.mockRestore();
  });

  it('handles invalid JSON in localStorage gracefully', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    localStorage.setItem('userLocation', 'invalid-json{');

    render(
      <LocationProvider>
        <TestComponent />
      </LocationProvider>
    );

    // Should fallback to default location
    expect(screen.getByTestId('address')).toHaveTextContent('Brookefield, Bengaluru, Karnataka');
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error parsing saved location:', expect.any(Error));
    
    consoleErrorSpy.mockRestore();
  });

  it('handles multiple location updates correctly', () => {
    render(
      <LocationProvider>
        <TestComponent />
      </LocationProvider>
    );

    const button = screen.getByText('Update');
    
    act(() => {
      button.click();
    });
    expect(screen.getByTestId('address')).toHaveTextContent('New Address');
    
    act(() => {
      button.click();
    });
    expect(screen.getByTestId('address')).toHaveTextContent('New Address');
    expect(localStorage.getItem('userLocation')).toBe(
      JSON.stringify({ address: 'New Address', deliveryTime: '10 minutes' })
    );
  });
});
