import apiClient from './baseApi';

// ============ PRODUCT API FUNCTIONS ============
export const productAPI = {
  // Get all products
  getAllProducts: async () => {
    try {
      const response = await apiClient.get('/products');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch all products:', error);
      throw new Error(`Failed to fetch products: ${error.response?.data?.message || error.message}`);
    }
  },

  // Get product by ID
  getProductById: async (productId) => {
    try {
      const response = await apiClient.get(`/products/${productId}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch product ${productId}:`, error);
      throw new Error(`Failed to fetch product: ${error.response?.data?.message || error.message}`);
    }
  },

  // Search products
  searchProducts: async (query) => {
    try {
      const response = await apiClient.get('/products', {
        params: { search: query }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to search products:', error);
      throw new Error(`Failed to search products: ${error.response?.data?.message || error.message}`);
    }
  },

  // Get featured products
  getFeaturedProducts: async () => {
    try {
      const response = await apiClient.get('/products', {
        params: { featured: true }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch featured products:', error);
      throw new Error(`Failed to fetch featured products: ${error.response?.data?.message || error.message}`);
    }
  },

  // Get products by price range
  getProductsByPriceRange: async (minPrice, maxPrice) => {
    try {
      const response = await apiClient.get('/products', {
        params: { 
          minPrice: minPrice,
          maxPrice: maxPrice
        }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch products by price range:', error);
      throw new Error(`Failed to fetch products by price range: ${error.response?.data?.message || error.message}`);
    }
  }
};

export default productAPI;