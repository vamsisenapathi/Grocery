import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Box, Paper, Typography, TextField, Button, Link } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { loginUser } from '../redux/actions/authActions';
import { fetchCart, clearCart } from '../redux/actions/cartActions';
import { useSnackbar } from 'notistack';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  
  // Get the redirect path from location state
  const from = location.state?.from || '/';
  const returnAfterLogin = location.state?.returnAfterLogin || false;
  
  const storeData = useSelector((state) => {
    return {
      loading: state?.auth?.loading || false,
      error: state?.auth?.error,
    };
  });
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Email validation
  const validateEmail = (email) => {
    if (!email || email.trim() === '') {
      return 'Email is required.';
    }
    if (email.length < 5) {
      return 'Email must be at least 5 characters.';
    }
    if (email.length > 50) {
      return 'Email cannot exceed 50 characters.';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address.';
    }
    return '';
  };

  // Password validation
  const validatePassword = (password) => {
    if (!password || password.trim() === '') {
      return 'Password is required.';
    }
    if (password.length < 8 || password.length > 13) {
      return 'Password must be at least 8 to 13 characters.';
    }
    return '';
  };

  // Validate form fields
  const isFormValid = () => {
    const emailErr = validateEmail(email);
    const passwordErr = validatePassword(password);
    return !emailErr && !passwordErr;
  };

  const handleEmailBlur = () => {
    const err = validateEmail(email);
    setEmailError(err);
  };

  const handlePasswordBlur = () => {
    const err = validatePassword(password);
    setPasswordError(err);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields
    const emailErr = validateEmail(email);
    const passwordErr = validatePassword(password);
    
    setEmailError(emailErr);
    setPasswordError(passwordErr);
    
    // Prevent submission if form is invalid
    if (emailErr || passwordErr) {
      return;
    }
    
    setError('');

    try {
      // Clear any existing cart state before login
      await dispatch(clearCart());
      
      // Login directly without OTP
      await dispatch(loginUser({ email, password }));
      
      // Fetch the user's cart after successful login (ignore 404 errors for new users)
      try {
        await dispatch(fetchCart());
      } catch (cartError) {
        // Silently handle cart fetch errors (e.g., 404 for new users with no cart)
        console.log('Cart fetch failed, continuing with empty cart');
      }
      
      enqueueSnackbar('Login successful', { variant: 'success' });
      
      // Redirect back to the page user came from (e.g., payment page)
      if (returnAfterLogin && from !== '/') {
        navigate(from, { replace: true });
      } else {
        navigate('/');
      }
    } catch (err) {
      // Extract error message properly with backend-specific messages
      let errorMsg = 'Invalid email or password.';
      
      if (typeof err === 'string') {
        errorMsg = err;
        // Map backend errors to user-friendly messages
        if (err.toLowerCase().includes('not found') || err.toLowerCase().includes('does not exist')) {
          errorMsg = 'Account not found. Please sign up first.';
        } else if (err.toLowerCase().includes('incorrect password')) {
          errorMsg = 'Incorrect password. Please try again.';
        } else if (err.toLowerCase().includes('locked')) {
          errorMsg = 'Your account is temporarily locked.';
        } else if (err.toLowerCase().includes('too many')) {
          errorMsg = 'Too many failed attempts. Try again later.';
        }
      } else if (err?.message) {
        errorMsg = err.message;
      }
      
      setError(errorMsg);
      enqueueSnackbar(errorMsg, { variant: 'error' });
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: 'primary.main' }}>Grocery</Typography>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>Your online grocery store</Typography>
          <Typography variant="body2" color="text.secondary">
            Log in or Sign up
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError('');
              setEmailError('');
            }}
            onBlur={handleEmailBlur}
            required
            sx={{ mb: 2 }}
            autoFocus
            error={!!emailError}
            helperText={emailError}
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError('');
              setPasswordError('');
            }}
            onBlur={handlePasswordBlur}
            required
            sx={{ mb: 1 }}
            error={!!passwordError}
            helperText={passwordError}
          />

          {error && (
            <Typography color="error" variant="body2" sx={{ mb: 2, mt: 1 }}>
              ❌ {error}
            </Typography>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={storeData.loading || !isFormValid()}
            sx={{ py: 1.5, mb: 2, mt: 2, fontWeight: 600 }}
          >
            {storeData.loading ? 'Logging in...' : 'Login'}
          </Button>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2">
              Don't have an account?{' '}
              <Link href="/signup" sx={{ color: 'primary.main', fontWeight: 600, textDecoration: 'none', cursor: 'pointer' }}>
                Sign up
              </Link>
            </Typography>
          </Box>
        </Box>

        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 3 }}>
          By continuing, you agree to our Terms of service & Privacy policy
        </Typography>
      </Paper>
    </Container>
  );
};

export default LoginPage;
