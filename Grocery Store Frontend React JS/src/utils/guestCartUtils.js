const GUEST_CART_KEY = 'guestCart';

/**
 * Get guest cart from localStorage
 */
export const getGuestCart = () => {
  try {
    const cart = localStorage.getItem(GUEST_CART_KEY);
    return cart ? JSON.parse(cart) : { items: [], totalAmount: 0 };
  } catch (error) {
    console.error('Error reading guest cart:', error);
    return { items: [], totalAmount: 0 };
  }
};

/**
 * Save guest cart to localStorage
 */
export const saveGuestCart = (cart) => {
  try {
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cart));
  } catch (error) {
    console.error('Error saving guest cart:', error);
  }
};

/**
 * Clear guest cart from localStorage
 */
export const clearGuestCart = () => {
  try {
    localStorage.removeItem(GUEST_CART_KEY);
  } catch (error) {
    console.error('Error clearing guest cart:', error);
  }
};

/**
 * Add item to guest cart
 */
export const addToGuestCart = (product, quantity = 1) => {
  const cart = getGuestCart();
  const existingItemIndex = cart.items.findIndex(item => item.productId === product.id);

  if (existingItemIndex >= 0) {
    // Update existing item
    cart.items[existingItemIndex].quantity += quantity;
  } else {
    // Add new item
    cart.items.push({
      id: `guest-${Date.now()}-${product.id}`,
      productId: product.id,
      quantity,
      product: {
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        stock: product.stock,
      },
    });
  }

  // Recalculate total
  cart.totalAmount = cart.items.reduce((total, item) => 
    total + (item.product.price * item.quantity), 0
  );

  saveGuestCart(cart);
  return cart;
};

/**
 * Update guest cart item quantity
 */
export const updateGuestCartItem = (itemId, quantity) => {
  const cart = getGuestCart();
  const itemIndex = cart.items.findIndex(item => item.id === itemId);

  if (itemIndex >= 0) {
    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }

    // Recalculate total
    cart.totalAmount = cart.items.reduce((total, item) => 
      total + (item.product.price * item.quantity), 0
    );

    saveGuestCart(cart);
  }

  return cart;
};

/**
 * Remove item from guest cart
 */
export const removeFromGuestCart = (itemId) => {
  const cart = getGuestCart();
  cart.items = cart.items.filter(item => item.id !== itemId);

  // Recalculate total
  cart.totalAmount = cart.items.reduce((total, item) => 
    total + (item.product.price * item.quantity), 0
  );

  saveGuestCart(cart);
  return cart;
};
