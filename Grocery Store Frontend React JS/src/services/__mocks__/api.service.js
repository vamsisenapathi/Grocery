export const apiService = {
  products: {
    getAll: jest.fn(() => Promise.resolve([])),
    getById: jest.fn((id) => Promise.resolve(null)),
    getByCategory: jest.fn(() => Promise.resolve([])),
  },
  categories: {
    getAll: jest.fn(() => Promise.resolve([])),
  },
  cart: {
    get: jest.fn(() => Promise.resolve({ items: [], subtotal: 0 })),
    addItem: jest.fn((productId, quantity) => Promise.resolve({ items: [], subtotal: 0 })),
    updateItem: jest.fn((itemId, quantity) => Promise.resolve({ items: [], subtotal: 0 })),
    removeItem: jest.fn((itemId) => Promise.resolve({ items: [], subtotal: 0 })),
    clear: jest.fn((userId) => Promise.resolve({ items: [], subtotal: 0 })),
  },
  auth: {
    login: jest.fn((email, password) => 
      Promise.resolve({ user: { id: 1, email }, token: 'mock-token' })
    ),
    signup: jest.fn((userData) => 
      Promise.resolve({ user: { id: 1, ...userData }, token: 'mock-token' })
    ),
    logout: jest.fn(() => Promise.resolve()),
  },
};
