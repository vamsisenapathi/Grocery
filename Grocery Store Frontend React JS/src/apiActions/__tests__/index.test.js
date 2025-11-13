import * as apiActions from '../index';

describe('apiActions index', () => {
  it('exports productApi functions', () => {
    expect(apiActions.fetchProducts).toBeDefined();
    expect(apiActions.fetchProductById).toBeDefined();
    expect(apiActions.searchProducts).toBeDefined();
  });

  it('exports categoryApi functions', () => {
    expect(apiActions.fetchCategories).toBeDefined();
    expect(apiActions.fetchCategoryProducts).toBeDefined();
  });

  it('exports cartApi functions', () => {
    expect(apiActions.addToCart).toBeDefined();
    expect(apiActions.removeCartItem).toBeDefined();
    expect(apiActions.updateCartItem).toBeDefined();
    expect(apiActions.clearCart).toBeDefined();
    expect(apiActions.fetchCart).toBeDefined();
  });

  it('exports authApi functions', () => {
    expect(apiActions.loginUser).toBeDefined();
    expect(apiActions.registerUser).toBeDefined();
    expect(apiActions.logoutUser).toBeDefined();
  });
});
