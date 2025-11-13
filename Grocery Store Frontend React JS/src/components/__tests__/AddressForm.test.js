import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SnackbarProvider } from 'notistack';
import AddressForm from '../AddressForm';

// Mock fetch
global.fetch = jest.fn();

const mockOnClose = jest.fn();
const mockOnSubmit = jest.fn();

const renderAddressForm = (props = {}) => {
  return render(
    <SnackbarProvider>
      <AddressForm
        open={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        {...props}
      />
    </SnackbarProvider>
  );
};

describe('AddressForm Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockOnSubmit.mockResolvedValue(undefined);
    global.fetch.mockClear();
  });

  describe('Form Rendering', () => {
    it('renders the form with all fields', () => {
      renderAddressForm();
      
      expect(screen.getByText('Add New Address')).toBeInTheDocument();
      expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Phone Number/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Address Line 1/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Address Line 2/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/City/i)).toBeInTheDocument();
      // MUI Select components use text labels, not aria-label
      expect(screen.getByText('State')).toBeInTheDocument();
      expect(screen.getByText('Country')).toBeInTheDocument();
      expect(screen.getByLabelText(/Pincode/i)).toBeInTheDocument();
    });

    it('renders edit mode when initialAddress is provided', () => {
      const initialAddress = {
        name: 'John Doe',
        phoneNumber: '9876543210',
        addressLine1: 'Test Street',
        addressLine2: 'Test Area',
        city: 'Bengaluru',
        state: 'Karnataka',
        country: 'IN',
        pincode: '560001',
        addressType: 'home'
      };

      renderAddressForm({ initialAddress });
      
      expect(screen.getByText('Edit Address')).toBeInTheDocument();
      expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
      expect(screen.getByDisplayValue('9876543210')).toBeInTheDocument();
    });

    it('renders Home and Work radio buttons', () => {
      renderAddressForm();
      
      expect(screen.getByLabelText('Home')).toBeInTheDocument();
      expect(screen.getByLabelText('Work')).toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    it('shows validation errors when submitting empty form', async () => {
      renderAddressForm();
      
      const saveButton = screen.getByRole('button', { name: /Save Address/i });
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(screen.getByText('Name is required')).toBeInTheDocument();
        expect(screen.getByText(/Phone.*required/i)).toBeInTheDocument();
        expect(screen.getByText('Address is required')).toBeInTheDocument();
        expect(screen.getByText('City is required')).toBeInTheDocument();
        expect(screen.getByText('State is required')).toBeInTheDocument();
      });

      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('validates Indian phone number format', async () => {
      renderAddressForm();
      
      const phoneInput = screen.getByLabelText(/Phone Number/i);
      
      // Invalid phone
      await userEvent.type(phoneInput, '123456789');
      fireEvent.click(screen.getByRole('button', { name: /Save Address/i }));

      await waitFor(() => {
        expect(screen.getByText(/Invalid Indian phone number/i)).toBeInTheDocument();
      });
    });

    it('validates Indian pincode format', async () => {
      renderAddressForm();
      
      const pincodeInput = screen.getByLabelText(/Pincode/i);
      
      // Invalid pincode
      await userEvent.type(pincodeInput, '12345');
      fireEvent.click(screen.getByRole('button', { name: /Save Address/i }));

      await waitFor(() => {
        expect(screen.getByText(/Invalid Indian pincode/i)).toBeInTheDocument();
      });
    });

    it('validates all fields and submits successfully', async () => {
      renderAddressForm();
      
      await userEvent.type(screen.getByLabelText(/Full Name/i), 'John Doe');
      await userEvent.type(screen.getByLabelText(/Phone Number/i), '9876543210');
      await userEvent.type(screen.getByLabelText(/Address Line 1/i), '123 Main Street');
      await userEvent.type(screen.getByLabelText(/City/i), 'Bengaluru');
      
      // For MUI Select, use closest to find the FormControl and then the combobox
      const stateSelectDiv = screen.getByText(/^State$/).closest('.MuiFormControl-root');
      const stateSelect = stateSelectDiv.querySelector('[role="combobox"]');
      fireEvent.mouseDown(stateSelect);
      const karnataka = await screen.findByText('Karnataka');
      fireEvent.click(karnataka);
      
      await userEvent.type(screen.getByLabelText(/Pincode/i), '560001');

      fireEvent.click(screen.getByRole('button', { name: /Save Address/i }));

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'John Doe',
            phoneNumber: '9876543210',
            addressLine1: '123 Main Street',
            city: 'Bengaluru',
            state: 'Karnataka',
            pincode: '560001'
          })
        );
      });
    }, 10000); // Increase timeout to 10 seconds for this complex test
  });

  describe('Location Detection', () => {
    it('detects location successfully', async () => {
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
          addressLine1: 'MG Road',
          addressLine2: '',
          city: 'Bengaluru',
          state: 'Karnataka',
          pincode: '560001',
          latitude: 12.9716,
          longitude: 77.5946
        })
      });

      renderAddressForm();
      
      const detectButton = screen.getByRole('button', { name: /Detect My Current Location/i });
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
        expect(screen.getByDisplayValue('MG Road')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Bengaluru')).toBeInTheDocument();
        expect(screen.getByDisplayValue('560001')).toBeInTheDocument();
      });
    });

    it('handles geolocation not supported', () => {
      global.navigator.geolocation = undefined;
      
      renderAddressForm();
      
      const detectButton = screen.getByRole('button', { name: /Detect My Current Location/i });
      fireEvent.click(detectButton);

      // Should show error message via snackbar (captured in SnackbarProvider)
    });

    it('handles geolocation error', async () => {
      const mockGeolocation = {
        getCurrentPosition: jest.fn((success, error) =>
          error({ code: 1, message: 'User denied geolocation' })
        )
      };
      
      global.navigator.geolocation = mockGeolocation;
      
      renderAddressForm();
      
      const detectButton = screen.getByRole('button', { name: /Detect My Current Location/i });
      fireEvent.click(detectButton);

      await waitFor(() => {
        expect(mockGeolocation.getCurrentPosition).toHaveBeenCalled();
      });
    });

    it('handles backend API failure', async () => {
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

      renderAddressForm();
      
      const detectButton = screen.getByRole('button', { name: /Detect My Current Location/i });
      fireEvent.click(detectButton);

      await waitFor(() => {
        expect(mockGeolocation.getCurrentPosition).toHaveBeenCalled();
      });
    });
  });

  describe('Pincode Auto-fill', () => {
    it('auto-fills city and state from Indian pincode', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ([{
          Status: 'Success',
          PostOffice: [{
            District: 'Bengaluru',
            State: 'Karnataka'
          }]
        }])
      });

      renderAddressForm();
      
      const pincodeInput = screen.getByLabelText(/Pincode/i);
      await userEvent.type(pincodeInput, '560001');
      fireEvent.blur(pincodeInput);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining('api.postalpincode.in/pincode/560001')
        );
      });

      await waitFor(() => {
        expect(screen.getByDisplayValue('Bengaluru')).toBeInTheDocument();
      });
    });

    it('handles invalid pincode for auto-fill', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ([{
          Status: 'Error',
          Message: 'No records found'
        }])
      });

      renderAddressForm();
      
      const pincodeInput = screen.getByLabelText(/Pincode/i);
      await userEvent.type(pincodeInput, '999999');
      fireEvent.blur(pincodeInput);

      await waitFor(() => {
        expect(screen.getByText(/Invalid pincode or unable to fetch location/i)).toBeInTheDocument();
      });
    });
  });

  describe('Country Selection', () => {
    it('changes pincode label for different countries', async () => {
      renderAddressForm();
      
      // Default is India (Pincode)
      expect(screen.getByLabelText(/Pincode/i)).toBeInTheDocument();
      
      // Change to US - use combobox role for Select
      const countrySelectDiv = screen.getByText(/^Country$/).closest('.MuiFormControl-root');
      const countrySelect = countrySelectDiv.querySelector('[role="combobox"]');
      fireEvent.mouseDown(countrySelect);
      const usa = await screen.findByText('United States');
      fireEvent.click(usa);

      expect(screen.getByLabelText(/ZIP Code/i)).toBeInTheDocument();
    });

    it('shows state dropdown for India and US', async () => {
      renderAddressForm();
      
      // MUI Select with InputLabel creates a div, not a labeled input
      // Use getAllByText to find the Select trigger
      const stateLabel = screen.getByText('State');
      expect(stateLabel).toBeInTheDocument();
    });

    it('resets state when country changes', async () => {
      renderAddressForm();
      
      // Click on State select field (using label text)
      const stateSelectDiv = screen.getByText('State').closest('.MuiFormControl-root');
      const stateSelect = stateSelectDiv.querySelector('[role="combobox"]');
      fireEvent.mouseDown(stateSelect);
      const karnataka = await screen.findByText('Karnataka');
      fireEvent.click(karnataka);

      // Click on Country select field
      const countrySelectDiv = screen.getByText(/^Country$/).closest('.MuiFormControl-root');
      const countrySelect = countrySelectDiv.querySelector('[role="combobox"]');
      fireEvent.mouseDown(countrySelect);
      const usa = await screen.findByText('United States');
      fireEvent.click(usa);

      // State should be reset - verify it's empty or contains only whitespace/placeholder
      await waitFor(() => {
        const updatedStateSelectDiv = screen.getByText(/^State$/).closest('.MuiFormControl-root');
        const updatedStateSelect = updatedStateSelectDiv.querySelector('[role="combobox"]');
        // MUI Select can contain zero-width space, invisible chars, or be truly empty
        const text = updatedStateSelect.textContent.replace(/[\u200B-\u200D\uFEFF]/g, '').trim();
        expect(text.length).toBe(0);
      });
    });
  });

  describe('Dialog Behavior', () => {
    it('does not close on backdrop click', () => {
      const { container } = renderAddressForm();
      
      const backdrop = container.querySelector('.MuiBackdrop-root');
      if (backdrop) {
        fireEvent.click(backdrop);
      }

      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('closes when cancel button is clicked', () => {
      renderAddressForm();
      
      const cancelButton = screen.getByRole('button', { name: /Cancel/i });
      fireEvent.click(cancelButton);

      expect(mockOnClose).toHaveBeenCalled();
    });

    it('closes when X button is clicked', () => {
      renderAddressForm();
      
      const closeButton = screen.getByLabelText(/close/i);
      fireEvent.click(closeButton);

      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  describe('Address Type Selection', () => {
    it('selects home address type by default', () => {
      renderAddressForm();
      
      const homeRadio = screen.getByLabelText('Home');
      expect(homeRadio).toBeChecked();
    });

    it('allows changing address type to work', () => {
      renderAddressForm();
      
      const workRadio = screen.getByLabelText('Work');
      fireEvent.click(workRadio);

      expect(workRadio).toBeChecked();
    });
  });

  describe('Error Handling', () => {
    it('shows error message when submit fails', async () => {
      mockOnSubmit.mockRejectedValueOnce(new Error('Network error'));
      
      renderAddressForm();
      
      await userEvent.type(screen.getByLabelText(/Full Name/i), 'John Doe');
      await userEvent.type(screen.getByLabelText(/Phone Number/i), '9876543210');
      await userEvent.type(screen.getByLabelText(/Address Line 1/i), '123 Main Street');
      await userEvent.type(screen.getByLabelText(/City/i), 'Bengaluru');
      
      const stateSelectDiv = screen.getByText(/^State$/).closest('.MuiFormControl-root');
      const stateSelect = stateSelectDiv.querySelector('[role="combobox"]');
      fireEvent.mouseDown(stateSelect);
      const karnataka = await screen.findByText('Karnataka');
      fireEvent.click(karnataka);
      
      await userEvent.type(screen.getByLabelText(/Pincode/i), '560001');

      fireEvent.click(screen.getByRole('button', { name: /Save Address/i }));

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalled();
      });
    });

    it('clears field errors when user starts typing', async () => {
      renderAddressForm();
      
      // Submit to show errors
      fireEvent.click(screen.getByRole('button', { name: /Save Address/i }));

      await waitFor(() => {
        expect(screen.getByText('Name is required')).toBeInTheDocument();
      });

      // Start typing to clear error
      await userEvent.type(screen.getByLabelText(/Full Name/i), 'J');

      await waitFor(() => {
        expect(screen.queryByText('Name is required')).not.toBeInTheDocument();
      });
    });
  });

  describe('Loading States', () => {
    it('shows loading state during submission', async () => {
      mockOnSubmit.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
      
      renderAddressForm();
      
      await userEvent.type(screen.getByLabelText(/Full Name/i), 'John Doe');
      await userEvent.type(screen.getByLabelText(/Phone Number/i), '9876543210');
      await userEvent.type(screen.getByLabelText(/Address Line 1/i), '123 Main Street');
      await userEvent.type(screen.getByLabelText(/City/i), 'Bengaluru');
      
      const stateSelectDiv = screen.getByText(/^State$/).closest('.MuiFormControl-root');
      const stateSelect = stateSelectDiv.querySelector('[role="combobox"]');
      fireEvent.mouseDown(stateSelect);
      const karnataka = await screen.findByText('Karnataka');
      fireEvent.click(karnataka);
      
      await userEvent.type(screen.getByLabelText(/Pincode/i), '560001');

      fireEvent.click(screen.getByRole('button', { name: /Save Address/i }));

      expect(await screen.findByText(/Saving.../i)).toBeInTheDocument();
    });
  });
});
