// ============ API ACTIONS INDEX ============
// Centralized export for all API modules

// Import all modules
import apiClient, { TokenService } from './baseApi';
import categoryAPI, { AVAILABLE_CATEGORIES, CATEGORY_DISPLAY_NAMES } from './categoryApi';
import productAPI from './productApi';
import authAPI from './authApi';
import cartAPI from './cartApi';

// Named exports
export { apiClient, TokenService };
export { categoryAPI, AVAILABLE_CATEGORIES, CATEGORY_DISPLAY_NAMES };
export { productAPI };
export { authAPI };
export { cartAPI };

// Legacy compatibility
export const legacyProductAPI = categoryAPI;

// Default export - API collection
const apiCollection = {
  apiClient,
  categoryAPI,
  productAPI,
  authAPI,
  cartAPI,
  TokenService,
  AVAILABLE_CATEGORIES,
  CATEGORY_DISPLAY_NAMES
};

export default apiCollection;