const axios = require('axios');

async function testAPI() {
  try {
    console.log('🧪 Testing Mock API...');
    
    // Test health endpoint
    console.log('\n📊 Testing health endpoint...');
    try {
      const healthResponse = await axios.get('http://localhost:8081/api/v1/health');
      console.log('Health Status:', healthResponse.status);
      console.log('Health Response:', healthResponse.data);
    } catch (error) {
      console.log('Health Error:', error.response?.status, error.response?.data || error.message);
    }
    
    // Test products endpoint
    console.log('\n🛒 Testing products endpoint...');
    try {
      const productsResponse = await axios.get('http://localhost:8081/api/v1/products');
      console.log('Products Status:', productsResponse.status);
      console.log('Products Count:', productsResponse.data.length);
    } catch (error) {
      console.log('Products Error:', error.response?.status, error.response?.data || error.message);
    }
    
    // Test electronics category
    console.log('\n📱 Testing electronics category...');
    try {
      const electronicsResponse = await axios.get('http://localhost:8081/api/v1/categories/electronics');
      console.log('Electronics Status:', electronicsResponse.status);
      console.log('Electronics Count:', electronicsResponse.data.length);
      console.log('Sample Electronics:', electronicsResponse.data.slice(0, 2));
    } catch (error) {
      console.log('Electronics Error:', error.response?.status, error.response?.data || error.message);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testAPI();