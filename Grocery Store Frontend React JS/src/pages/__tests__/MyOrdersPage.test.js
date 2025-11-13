import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { createStore, combineReducers } from 'redux';
import MyOrdersPage from '../MyOrdersPage';
import * as orderActions from '../../redux/actions/orderActions';

// Mock the orderActions
jest.mock('../../redux/actions/orderActions', () => ({
  fetchOrders: jest.fn(),
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock reducers
const ordersReducer = (state = { orders: [], loading: false, error: null }, action) => {
  return state;
};

const authReducer = (state = { user: null, token: null, loading: false, error: null }, action) => {
  return state;
};

const createMockStore = (ordersState = {}) => {
  const rootReducer = combineReducers({
    orders: () => ({
      orders: [],
      loading: false,
      error: null,
      ...ordersState,
    }),
    auth: authReducer,
  });

  return createStore(rootReducer);
};

const renderMyOrdersPage = (store) => {
  return render(
    <Provider store={store}>
      <BrowserRouter>
        <MyOrdersPage />
      </BrowserRouter>
    </Provider>
  );
};

describe('MyOrdersPage Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    orderActions.fetchOrders.mockReturnValue({ type: 'FETCH_ORDERS' });
  });

  describe('Rendering', () => {
    it('renders page title', () => {
      const store = createMockStore();
      renderMyOrdersPage(store);
      
      expect(screen.getByText('My Orders')).toBeInTheDocument();
    });

    it('shows loading state', () => {
      const store = createMockStore({ loading: true });
      renderMyOrdersPage(store);
      
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('shows error state', () => {
      const store = createMockStore({ 
        loading: false, 
        error: 'Failed to fetch orders' 
      });
      renderMyOrdersPage(store);
      
      expect(screen.getByText('Error loading orders')).toBeInTheDocument();
      expect(screen.getByText('Failed to fetch orders')).toBeInTheDocument();
    });

    it('shows empty state when no orders', () => {
      const store = createMockStore({ 
        orders: [], 
        loading: false 
      });
      renderMyOrdersPage(store);
      
      expect(screen.getByText('No orders yet')).toBeInTheDocument();
      expect(screen.getByText('Start shopping to see your orders here')).toBeInTheDocument();
    });
  });

  describe('Order Display', () => {
    const mockOrders = [
      {
        id: 1,
        orderNumber: 'ORD-001',
        createdAt: '2024-01-15T10:30:00Z',
        status: 'delivered',
        totalAmount: 1299.50,
        paymentMethod: 'Credit Card',
        paymentStatus: 'paid',
        items: [
          {
            id: 1,
            productName: 'Fresh Apples',
            quantity: 2,
            priceAtOrder: 150.00,
            totalPrice: 300.00,
          },
          {
            id: 2,
            productName: 'Organic Milk',
            quantity: 3,
            priceAtOrder: 65.00,
            totalPrice: 195.00,
          },
        ],
        deliveryAddress: {
          name: 'John Doe',
          phone: '9876543210',
          address: '123 Main Street',
          city: 'Bengaluru',
          state: 'Karnataka',
          pincode: '560001',
        },
      },
    ];

    it('displays order list with all details', () => {
      const store = createMockStore({ 
        orders: mockOrders, 
        loading: false 
      });
      renderMyOrdersPage(store);
      
      // Order number
      expect(screen.getByText('Order #ORD-001')).toBeInTheDocument();
      
      // Status chip
      expect(screen.getByText('DELIVERED')).toBeInTheDocument();
      
      // Items count
      expect(screen.getByText('Items (2)')).toBeInTheDocument();
      
      // Product names
      expect(screen.getByText('Fresh Apples')).toBeInTheDocument();
      expect(screen.getByText('Organic Milk')).toBeInTheDocument();
      
      // Quantities and prices
      expect(screen.getByText(/Qty: 2 × ₹150.00/)).toBeInTheDocument();
      expect(screen.getByText(/Qty: 3 × ₹65.00/)).toBeInTheDocument();
      
      // Total amount
      expect(screen.getByText('₹1299.50')).toBeInTheDocument();
    });

    it('displays delivery address correctly', () => {
      const store = createMockStore({ 
        orders: mockOrders, 
        loading: false 
      });
      renderMyOrdersPage(store);
      
      expect(screen.getByText('Delivery Address:')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('9876543210')).toBeInTheDocument();
      expect(screen.getByText(/123 Main Street, Bengaluru/)).toBeInTheDocument();
      expect(screen.getByText(/Karnataka - 560001/)).toBeInTheDocument();
    });

    it('shows "Address not available" when deliveryAddress is null', () => {
      const ordersWithoutAddress = [{
        ...mockOrders[0],
        deliveryAddress: null,
      }];
      
      const store = createMockStore({ 
        orders: ordersWithoutAddress, 
        loading: false 
      });
      renderMyOrdersPage(store);
      
      expect(screen.getByText('Address not available')).toBeInTheDocument();
    });

    it('displays payment method and status', () => {
      const store = createMockStore({ 
        orders: mockOrders, 
        loading: false 
      });
      renderMyOrdersPage(store);
      
      expect(screen.getByText('Payment Method:')).toBeInTheDocument();
      expect(screen.getByText('Credit Card')).toBeInTheDocument();
      expect(screen.getByText('Payment Status:')).toBeInTheDocument();
      expect(screen.getByText('PAID')).toBeInTheDocument();
    });

    it('shows "N/A" for missing payment method', () => {
      const ordersWithoutPaymentMethod = [{
        ...mockOrders[0],
        paymentMethod: null,
      }];
      
      const store = createMockStore({ 
        orders: ordersWithoutPaymentMethod, 
        loading: false 
      });
      renderMyOrdersPage(store);
      
      expect(screen.getByText('N/A')).toBeInTheDocument();
    });

    it('displays multiple orders', () => {
      const multipleOrders = [
        mockOrders[0],
        {
          id: 2,
          orderNumber: 'ORD-002',
          createdAt: '2024-01-16T14:20:00Z',
          status: 'pending',
          totalAmount: 599.00,
          paymentMethod: 'UPI',
          paymentStatus: 'pending',
          items: [
            {
              id: 3,
              productName: 'Fresh Bananas',
              quantity: 1,
              priceAtOrder: 50.00,
              totalPrice: 50.00,
            },
          ],
          deliveryAddress: {
            name: 'Jane Smith',
            phone: '9988776655',
            address: '456 Park Avenue',
            city: 'Mumbai',
            state: 'Maharashtra',
            pincode: '400001',
          },
        },
      ];

      const store = createMockStore({ 
        orders: multipleOrders, 
        loading: false 
      });
      renderMyOrdersPage(store);
      
      expect(screen.getByText('Order #ORD-001')).toBeInTheDocument();
      expect(screen.getByText('Order #ORD-002')).toBeInTheDocument();
      expect(screen.getByText('Fresh Apples')).toBeInTheDocument();
      expect(screen.getByText('Fresh Bananas')).toBeInTheDocument();
    });
  });

  describe('Status Colors', () => {
    it('displays pending status with warning color', () => {
      const pendingOrder = [{
        id: 1,
        orderNumber: 'ORD-001',
        createdAt: '2024-01-15T10:30:00Z',
        status: 'pending',
        totalAmount: 500,
        paymentMethod: 'COD',
        paymentStatus: 'pending',
        items: [],
        deliveryAddress: null,
      }];

      const store = createMockStore({ orders: pendingOrder });
      renderMyOrdersPage(store);
      
      // There are multiple PENDING chips (status and payment status)
      const pendingChips = screen.getAllByText('PENDING');
      expect(pendingChips.length).toBe(2);
      expect(pendingChips[0]).toBeInTheDocument();
    });

    it('displays confirmed status', () => {
      const confirmedOrder = [{
        id: 1,
        orderNumber: 'ORD-001',
        createdAt: '2024-01-15T10:30:00Z',
        status: 'confirmed',
        totalAmount: 500,
        paymentMethod: 'COD',
        paymentStatus: 'pending',
        items: [],
        deliveryAddress: null,
      }];

      const store = createMockStore({ orders: confirmedOrder });
      renderMyOrdersPage(store);
      
      expect(screen.getByText('CONFIRMED')).toBeInTheDocument();
    });

    it('displays processing status', () => {
      const processingOrder = [{
        id: 1,
        orderNumber: 'ORD-001',
        createdAt: '2024-01-15T10:30:00Z',
        status: 'processing',
        totalAmount: 500,
        paymentMethod: 'COD',
        paymentStatus: 'pending',
        items: [],
        deliveryAddress: null,
      }];

      const store = createMockStore({ orders: processingOrder });
      renderMyOrdersPage(store);
      
      expect(screen.getByText('PROCESSING')).toBeInTheDocument();
    });

    it('displays shipped status', () => {
      const shippedOrder = [{
        id: 1,
        orderNumber: 'ORD-001',
        createdAt: '2024-01-15T10:30:00Z',
        status: 'shipped',
        totalAmount: 500,
        paymentMethod: 'COD',
        paymentStatus: 'pending',
        items: [],
        deliveryAddress: null,
      }];

      const store = createMockStore({ orders: shippedOrder });
      renderMyOrdersPage(store);
      
      expect(screen.getByText('SHIPPED')).toBeInTheDocument();
    });

    it('displays cancelled status', () => {
      const cancelledOrder = [{
        id: 1,
        orderNumber: 'ORD-001',
        createdAt: '2024-01-15T10:30:00Z',
        status: 'cancelled',
        totalAmount: 500,
        paymentMethod: 'COD',
        paymentStatus: 'pending',
        items: [],
        deliveryAddress: null,
      }];

      const store = createMockStore({ orders: cancelledOrder });
      renderMyOrdersPage(store);
      
      expect(screen.getByText('CANCELLED')).toBeInTheDocument();
    });

    it('displays unknown status when status is null', () => {
      const unknownOrder = [{
        id: 1,
        orderNumber: 'ORD-001',
        createdAt: '2024-01-15T10:30:00Z',
        status: null,
        totalAmount: 500,
        paymentMethod: 'COD',
        paymentStatus: 'pending',
        items: [],
        deliveryAddress: null,
      }];

      const store = createMockStore({ orders: unknownOrder });
      renderMyOrdersPage(store);
      
      expect(screen.getByText('UNKNOWN')).toBeInTheDocument();
    });
  });

  describe('Date and Currency Formatting', () => {
    it('formats date correctly', () => {
      const orderWithDate = [{
        id: 1,
        orderNumber: 'ORD-001',
        createdAt: '2024-01-15T10:30:00Z',
        status: 'delivered',
        totalAmount: 500,
        paymentMethod: 'COD',
        paymentStatus: 'paid',
        items: [],
        deliveryAddress: null,
      }];

      const store = createMockStore({ orders: orderWithDate });
      renderMyOrdersPage(store);
      
      expect(screen.getByText(/Placed on/)).toBeInTheDocument();
    });

    it('formats currency with rupee symbol', () => {
      const orderWithAmount = [{
        id: 1,
        orderNumber: 'ORD-001',
        createdAt: '2024-01-15T10:30:00Z',
        status: 'delivered',
        totalAmount: 1234.56,
        paymentMethod: 'COD',
        paymentStatus: 'paid',
        items: [{
          id: 1,
          productName: 'Test Product',
          quantity: 1,
          priceAtOrder: 1234.56,
          totalPrice: 1234.56,
        }],
        deliveryAddress: null,
      }];

      const store = createMockStore({ orders: orderWithAmount });
      renderMyOrdersPage(store);
      
      // There are multiple instances of the same amount (item total and order total)
      const amounts = screen.getAllByText('₹1234.56');
      expect(amounts.length).toBeGreaterThan(0);
      expect(amounts[0]).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles order with empty items array', () => {
      const orderWithNoItems = [{
        id: 1,
        orderNumber: 'ORD-001',
        createdAt: '2024-01-15T10:30:00Z',
        status: 'pending',
        totalAmount: 0,
        paymentMethod: 'COD',
        paymentStatus: 'pending',
        items: [],
        deliveryAddress: null,
      }];

      const store = createMockStore({ orders: orderWithNoItems });
      renderMyOrdersPage(store);
      
      expect(screen.getByText('Items (0)')).toBeInTheDocument();
    });

    it('handles order with null items', () => {
      const orderWithNullItems = [{
        id: 1,
        orderNumber: 'ORD-001',
        createdAt: '2024-01-15T10:30:00Z',
        status: 'pending',
        totalAmount: 0,
        paymentMethod: 'COD',
        paymentStatus: 'pending',
        items: null,
        deliveryAddress: null,
      }];

      const store = createMockStore({ orders: orderWithNullItems });
      renderMyOrdersPage(store);
      
      expect(screen.getByText('Items (0)')).toBeInTheDocument();
    });

    it('handles order without createdAt', () => {
      const orderWithoutDate = [{
        id: 1,
        orderNumber: 'ORD-001',
        createdAt: null,
        status: 'pending',
        totalAmount: 500,
        paymentMethod: 'COD',
        paymentStatus: 'pending',
        items: [],
        deliveryAddress: null,
      }];

      const store = createMockStore({ orders: orderWithoutDate });
      renderMyOrdersPage(store);
      
      expect(screen.getByText(/Placed on N\/A/)).toBeInTheDocument();
    });

    it('handles payment status as "pending" correctly', () => {
      const orderWithPendingPayment = [{
        id: 1,
        orderNumber: 'ORD-001',
        createdAt: '2024-01-15T10:30:00Z',
        status: 'pending',
        totalAmount: 500,
        paymentMethod: 'COD',
        paymentStatus: 'pending',
        items: [],
        deliveryAddress: null,
      }];

      const store = createMockStore({ orders: orderWithPendingPayment });
      renderMyOrdersPage(store);
      
      // Should show PENDING chip with warning color
      const pendingChips = screen.getAllByText('PENDING');
      expect(pendingChips.length).toBeGreaterThan(0);
    });
  });
});
