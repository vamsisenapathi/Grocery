import store from '../store';

describe('Redux Store', () => {
  it('should have auth reducer', () => {
    const state = store.getState();
    expect(state.auth).toBeDefined();
  });

  it('should have cart reducer', () => {
    const state = store.getState();
    expect(state.cart).toBeDefined();
  });

  it('should have products reducer', () => {
    const state = store.getState();
    expect(state.products).toBeDefined();
  });

  it('should have categories reducer', () => {
    const state = store.getState();
    expect(state.categories).toBeDefined();
  });

  it('should have initial state for all reducers', () => {
    const state = store.getState();
    
    expect(state.auth).toHaveProperty('isAuthenticated');
    expect(state.cart).toHaveProperty('items');
    expect(state.products).toHaveProperty('products');
    expect(state.categories).toHaveProperty('categories');
  });

  it('should be a valid Redux store', () => {
    expect(store.dispatch).toBeDefined();
    expect(store.getState).toBeDefined();
    expect(store.subscribe).toBeDefined();
  });
});
