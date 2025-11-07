import apiClient from './baseApi';

// ============ AVAILABLE CATEGORIES ============
export const AVAILABLE_CATEGORIES = [
  'electronics', 'fashion', 'foods', 'fruits', 'home-appliances',
  'mobiles', 'snacks', 'toys', 'vegetables', 'dairy', 'bakery',
  'meat', 'beverages', 'frozen', 'household'
];

export const CATEGORY_DISPLAY_NAMES = {
  'electronics': 'Electronics',
  'fashion': 'Fashion',
  'foods': 'Foods',
  'fruits': 'Fruits',
  'home-appliances': 'Home Appliances',
  'mobiles': 'Mobiles',
  'snacks': 'Snacks',
  'toys': 'Toys',
  'vegetables': 'Vegetables',
  'dairy': 'Dairy',
  'bakery': 'Bakery',
  'meat': 'Meat',
  'beverages': 'Beverages',
  'frozen': 'Frozen',
  'household': 'Household'
};

// ============ CATEGORY API FUNCTIONS ============
export const categoryAPI = {
  // Get products for Electronics category
  getElectronicsProducts: async () => {
    try {
      const response = await apiClient.get('/categories/electronics');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch electronics: ${error.response?.data?.message || error.message}`);
    }
  },

  // Get products for Fashion category
  getFashionProducts: async () => {
    try {
      const response = await apiClient.get('/categories/fashion');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch fashion: ${error.response?.data?.message || error.message}`);
    }
  },

  // Get products for Foods category
  getFoodsProducts: async () => {
    try {
      const response = await apiClient.get('/categories/foods');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch foods: ${error.response?.data?.message || error.message}`);
    }
  },

  // Get products for Fruits category
  getFruitsProducts: async () => {
    try {
      const response = await apiClient.get('/categories/fruits');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch fruits: ${error.response?.data?.message || error.message}`);
    }
  },

  // Get products for Home Appliances category
  getHomeAppliancesProducts: async () => {
    try {
      const response = await apiClient.get('/categories/home-appliances');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch home appliances: ${error.response?.data?.message || error.message}`);
    }
  },

  // Get products for Mobiles category
  getMobilesProducts: async () => {
    try {
      const response = await apiClient.get('/categories/mobiles');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch mobiles: ${error.response?.data?.message || error.message}`);
    }
  },

  // Get products for Snacks category
  getSnacksProducts: async () => {
    try {
      const response = await apiClient.get('/categories/snacks');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch snacks: ${error.response?.data?.message || error.message}`);
    }
  },

  // Get products for Toys category
  getToysProducts: async () => {
    try {
      const response = await apiClient.get('/categories/toys');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch toys: ${error.response?.data?.message || error.message}`);
    }
  },

  // Get products for Vegetables category
  getVegetablesProducts: async () => {
    try {
      const response = await apiClient.get('/categories/vegetables');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch vegetables: ${error.response?.data?.message || error.message}`);
    }
  },

  // Get products for Dairy category
  getDairyProducts: async () => {
    try {
      const response = await apiClient.get('/categories/dairy');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch dairy products:', error);
      throw new Error(`Failed to fetch dairy products: ${error.response?.data?.message || error.message}`);
    }
  },

  // Get products for Bakery category
  getBakeryProducts: async () => {
    try {
      const response = await apiClient.get('/categories/bakery');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch bakery products:', error);
      throw new Error(`Failed to fetch bakery products: ${error.response?.data?.message || error.message}`);
    }
  },

  // Get products for Meat category
  getMeatProducts: async () => {
    try {
      const response = await apiClient.get('/categories/meat');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch meat products:', error);
      throw new Error(`Failed to fetch meat products: ${error.response?.data?.message || error.message}`);
    }
  },

  // Get products for Beverages category
  getBeveragesProducts: async () => {
    try {
      const response = await apiClient.get('/categories/beverages');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch beverages products:', error);
      throw new Error(`Failed to fetch beverages products: ${error.response?.data?.message || error.message}`);
    }
  },

  // Get products for Frozen category
  getFrozenProducts: async () => {
    try {
      const response = await apiClient.get('/categories/frozen');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch frozen products:', error);
      throw new Error(`Failed to fetch frozen products: ${error.response?.data?.message || error.message}`);
    }
  },

  // Get products for Household category
  getHouseholdProducts: async () => {
    try {
      const response = await apiClient.get('/categories/household');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch household products:', error);
      throw new Error(`Failed to fetch household products: ${error.response?.data?.message || error.message}`);
    }
  },

  // Generic function to get products by category
  getCategoryProducts: async (category) => {
    const categoryLower = category.toLowerCase();
    
    // Map category names to their respective functions
    const categoryFunctions = {
      'electronics': categoryAPI.getElectronicsProducts,
      'fashion': categoryAPI.getFashionProducts,
      'foods': categoryAPI.getFoodsProducts,
      'fruits': categoryAPI.getFruitsProducts,
      'home-appliances': categoryAPI.getHomeAppliancesProducts,
      'home appliances': categoryAPI.getHomeAppliancesProducts,
      'mobiles': categoryAPI.getMobilesProducts,
      'snacks': categoryAPI.getSnacksProducts,
      'toys': categoryAPI.getToysProducts,
      'vegetables': categoryAPI.getVegetablesProducts,
      'dairy': categoryAPI.getDairyProducts,
      'bakery': categoryAPI.getBakeryProducts,
      'meat': categoryAPI.getMeatProducts,
      'beverages': categoryAPI.getBeveragesProducts,
      'frozen': categoryAPI.getFrozenProducts,
      'household': categoryAPI.getHouseholdProducts
    };

    const fetchFunction = categoryFunctions[categoryLower];
    if (!fetchFunction) {
      throw new Error(`Unsupported category: ${category}`);
    }

    return await fetchFunction();
  }
};

export default categoryAPI;