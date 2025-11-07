import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  Card, 
  CardContent,
  Alert,
  CircularProgress 
} from '@mui/material';
import { productAPI, TokenService } from '../apiActions';

const APIDebugPanel = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check authentication status
    setToken(TokenService.getToken());
    setUser(TokenService.getUser());
  }, []);

  const testProductAPI = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔍 Testing Product API...');
      console.log('API Base URL:', 'http://localhost:8081/api/v1');
      console.log('Full URL:', 'http://localhost:8081/api/v1/products');
      console.log('Token:', TokenService.getToken());
      console.log('User:', TokenService.getUser());
      
      // First test basic connectivity
      const testUrl = 'http://localhost:8081/api/v1/products';
      console.log('Testing connectivity to:', testUrl);
      
      const response = await productAPI.getAllProducts();
      console.log('✅ Products API Response:', response);
      
      setProducts(response);
      setError(null);
    } catch (err) {
      console.error('❌ Products API Error:', err);
      console.error('Error details:', {
        name: err.name,
        message: err.message,
        code: err.code,
        response: err.response,
        stack: err.stack
      });
      
      let errorMessage = 'Failed to fetch products';
      
      if (err.code === 'ERR_NETWORK' || err.message.includes('Network Error')) {
        errorMessage = '🚫 Network Error: Cannot connect to backend server on localhost:8081. Please start your backend server.';
      } else if (err.code === 'ECONNREFUSED') {
        errorMessage = '🚫 Connection Refused: Backend server is not running on port 8081';
      } else if (err.response?.status === 401) {
        errorMessage = '🔐 Authentication Error: Please login first';
      } else if (err.response?.status === 404) {
        errorMessage = '📍 Endpoint Not Found: Check backend API endpoints';
      } else if (err.response?.data?.message) {
        errorMessage = `🔴 Backend Error: ${err.response.data.message}`;
      } else {
        errorMessage = `❌ Error: ${err.message}`;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const testConnectivity = async () => {
    try {
      console.log('🔗 Testing basic connectivity to backend...');
      console.log('Attempting connection to: http://localhost:8081/api/v1/health');
      
      const response = await fetch('http://localhost:8081/api/v1/health', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        mode: 'cors'
      });
      
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      
      if (response.ok) {
        const data = await response.text();
        console.log('✅ Backend is reachable! Response:', data);
        setError('✅ Backend connectivity: OK');
      } else {
        console.log('❌ Backend returned error:', response.status, response.statusText);
        setError(`❌ Backend error: ${response.status} ${response.statusText}`);
      }
    } catch (err) {
      console.error('❌ Connectivity test failed:', err);
      setError(`❌ Connection failed: ${err.message}`);
    }
  };

  const testAuthStatus = () => {
    console.log('🔍 Authentication Status:');
    console.log('Token:', TokenService.getToken());
    console.log('User:', TokenService.getUser());
    console.log('Is Authenticated:', !!TokenService.getToken());
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        API Debug Panel
      </Typography>
      
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Authentication Status
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Token: {token ? '✅ Present' : '❌ Missing'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            User: {user ? `✅ ${user.name} (${user.email})` : '❌ Not logged in'}
          </Typography>
          <Button 
            variant="outlined" 
            onClick={testAuthStatus}
            sx={{ mt: 1 }}
          >
            Check Auth Status
          </Button>
        </CardContent>
      </Card>

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Backend Connectivity Test
          </Typography>
          <Button 
            variant="outlined" 
            onClick={testConnectivity}
            sx={{ mb: 1 }}
          >
            Test Backend Connection
          </Button>
        </CardContent>
      </Card>

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Products API Test
          </Typography>
          
          <Button 
            variant="contained" 
            onClick={testProductAPI}
            disabled={loading}
            sx={{ mb: 2 }}
          >
            {loading ? <CircularProgress size={20} /> : 'Test Products API'}
          </Button>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {products.length > 0 && (
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                ✅ Found {products.length} products:
              </Typography>
              <Box sx={{ maxHeight: 200, overflow: 'auto' }}>
                {products.slice(0, 5).map((product, index) => (
                  <Typography key={index} variant="body2" sx={{ mb: 0.5 }}>
                    • {product.name} - {product.category} - ${product.price}
                  </Typography>
                ))}
                {products.length > 5 && (
                  <Typography variant="body2" color="text.secondary">
                    ... and {products.length - 5} more
                  </Typography>
                )}
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Expected Categories in Database:
          </Typography>
          <Typography variant="body2" component="div">
            • Electronics (89 products)<br/>
            • Fashion (89 products)<br/>
            • Foods (89 products)<br/>
            • Fruits (89 products)<br/>
            • Home Appliances (89 products)<br/>
            • Mobiles (89 products)<br/>
            • Snacks (89 products)<br/>
            • Toys (89 products)<br/>
            • Vegetables (89 products)
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default APIDebugPanel;