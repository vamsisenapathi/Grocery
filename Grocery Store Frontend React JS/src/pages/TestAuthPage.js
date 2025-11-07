import React, { useState } from 'react';
import {
  Container,
  Paper,
  Box,
  Typography,
  Button,
  Alert,
  Divider,
  Chip
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, loginUser } from '../redux/actions/authActions';

const TestAuthPage = () => {
  const dispatch = useDispatch();
  const [testResults, setTestResults] = useState([]);
  
  const storeData = useSelector((state) => {
    return {
      auth: state?.auth,
      loading: state?.auth?.loading,
      error: state?.auth?.error,
      isAuthenticated: state?.auth?.isAuthenticated,
      user: state?.auth?.user,
    };
  });

  const addTestResult = (test, result, message) => {
    setTestResults(prev => [...prev, { test, result, message, timestamp: new Date().toISOString() }]);
  };

  const testRegistration = async () => {
    const testUser = {
      name: 'Test User',
      email: `test${Date.now()}@example.com`,
      password: 'password123'
    };

    try {
      dispatch(registerUser(testUser));
      addTestResult('Registration', 'pending', 'Registration dispatched...');
      
      // Wait a bit and check results
      setTimeout(() => {
        if (storeData.auth?.registrationSuccess) {
          addTestResult('Registration', 'success', 'Registration successful!');
        } else if (storeData.auth?.error) {
          addTestResult('Registration', 'error', storeData.auth.error);
        }
      }, 2000);
    } catch (error) {
      addTestResult('Registration', 'error', error.message);
    }
  };

  const testLogin = async () => {
    const credentials = {
      email: 'admin@grocery.com',
      password: 'admin123'
    };

    try {
      dispatch(loginUser(credentials));
      addTestResult('Login', 'pending', 'Login dispatched...');
      
      // Wait a bit and check results
      setTimeout(() => {
        if (storeData.isAuthenticated) {
          addTestResult('Login', 'success', 'Login successful!');
        } else if (storeData.error) {
          addTestResult('Login', 'error', storeData.error);
        }
      }, 2000);
    } catch (error) {
      addTestResult('Login', 'error', error.message);
    }
  };

  const testBackendConnection = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/v1/products');
      if (response.ok) {
        addTestResult('Backend', 'success', 'Backend is accessible');
      } else {
        addTestResult('Backend', 'warning', `Backend returned ${response.status}`);
      }
    } catch (error) {
      addTestResult('Backend', 'error', 'Backend not accessible - using mock data');
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Authentication Diagnostic Tool
        </Typography>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>Current Auth State:</Typography>
          <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px', fontSize: '12px' }}>
            {JSON.stringify(storeData, null, 2)}
          </pre>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Button variant="contained" onClick={testBackendConnection}>
            Test Backend Connection
          </Button>
          <Button variant="contained" onClick={testRegistration}>
            Test Registration
          </Button>
          <Button variant="contained" onClick={testLogin}>
            Test Login (admin@grocery.com / admin123)
          </Button>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>Test Results:</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {testResults.map((result, index) => (
            <Alert 
              key={index} 
              severity={
                result.result === 'success' ? 'success' : 
                result.result === 'error' ? 'error' : 
                result.result === 'pending' ? 'info' : 'warning'
              }
            >
              <strong>{result.test}:</strong> {result.message}
              <Chip size="small" label={new Date(result.timestamp).toLocaleTimeString()} sx={{ ml: 1 }} />
            </Alert>
          ))}
        </Box>

        {testResults.length === 0 && (
          <Typography color="text.secondary">
            Click the buttons above to run authentication tests
          </Typography>
        )}
      </Paper>
    </Container>
  );
};

export default TestAuthPage;