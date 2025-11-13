import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Box, Paper, Typography, TextField, Button, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../redux/actions/authActions';
import { useSnackbar } from 'notistack';

const SignupPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  
  const storeData = useSelector((state) => {
    return {
      loading: state?.auth?.loading || false,
      error: state?.auth?.error,
    };
  });
  
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    phoneNumber: '', 
    password: '', 
    confirmPassword: '' 
  });
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: ''
  });

  // Validation functions
  const validateName = (name) => {
    if (!name || name.trim() === '') {
      return 'Full name is required.';
    }
    if (name.length < 3) {
      return 'Name must be at least 3 characters.';
    }
    if (name.length > 50) {
      return 'Name cannot exceed 50 characters.';
    }
    if (!/^[a-zA-Z\s]+$/.test(name)) {
      return 'Name cannot contain numbers or special characters.';
    }
    return '';
  };

  const validateEmail = (email) => {
    if (!email || email.trim() === '') {
      return 'Email is required.';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address.';
    }
    return '';
  };

  const validatePhoneNumber = (phone) => {
    if (!phone || phone.trim() === '') {
      return 'Phone number is required.';
    }
    if (!/^\d+$/.test(phone)) {
      return 'Only numbers are allowed in phone number.';
    }
    if (phone.length !== 10) {
      return 'Phone number must be 10 digits.';
    }
    if (!/^[6-9]\d{9}$/.test(phone)) {
      return 'Invalid phone number format.';
    }
    return '';
  };

  const validatePassword = (password) => {
    if (!password || password.trim() === '') {
      return 'Password is required.';
    }
    if (password.length < 8 || password.length > 13) {
      return 'Password must be between 8 and 13 characters.';
    }
    if (!/[A-Z]/.test(password)) {
      return 'Password must contain at least one uppercase letter.';
    }
    if (!/[0-9]/.test(password)) {
      return 'Password must contain at least one number.';
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return 'Password must contain at least one special character.';
    }
    return '';
  };

  const validateConfirmPassword = (confirmPassword, password) => {
    if (!confirmPassword || confirmPassword.trim() === '') {
      return 'Confirm password is required.';
    }
    if (confirmPassword !== password) {
      return 'Passwords do not match.';
    }
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // For phone number, ensure only digits and max 10
    if (name === 'phoneNumber') {
      const cleanedValue = value.replace(/\D/g, '').slice(0, 10);
      setFormData({ ...formData, [name]: cleanedValue });
      setFieldErrors({ ...fieldErrors, [name]: '' });
    } else {
      setFormData({ ...formData, [name]: value });
      setFieldErrors({ ...fieldErrors, [name]: '' });
    }
    setError('');
  };

  const handleBlur = (field) => {
    let error = '';
    switch (field) {
      case 'name':
        error = validateName(formData.name);
        break;
      case 'email':
        error = validateEmail(formData.email);
        break;
      case 'phoneNumber':
        error = validatePhoneNumber(formData.phoneNumber);
        break;
      case 'password':
        error = validatePassword(formData.password);
        break;
      case 'confirmPassword':
        error = validateConfirmPassword(formData.confirmPassword, formData.password);
        break;
      default:
        break;
    }
    setFieldErrors({ ...fieldErrors, [field]: error });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate all fields
    const nameErr = validateName(formData.name);
    const emailErr = validateEmail(formData.email);
    const phoneErr = validatePhoneNumber(formData.phoneNumber);
    const passwordErr = validatePassword(formData.password);
    const confirmPasswordErr = validateConfirmPassword(formData.confirmPassword, formData.password);

    setFieldErrors({
      name: nameErr,
      email: emailErr,
      phoneNumber: phoneErr,
      password: passwordErr,
      confirmPassword: confirmPasswordErr
    });

    // If any validation fails, stop submission
    if (nameErr || emailErr || phoneErr || passwordErr || confirmPasswordErr) {
      return;
    }

    try {
      // Create account directly without OTP - DO NOT auto-login
      await dispatch(registerUser({
        name: formData.name,
        email: formData.email,
        phoneNumber: `+91${formData.phoneNumber}`,
        password: formData.password
      }));
      
      enqueueSnackbar('Account created successfully! Please login with your new account.', { variant: 'success' });
      // Redirect to login page instead of auto-logging in
      navigate('/login');
    } catch (err) {
      // Map backend errors to user-friendly messages
      let errorMsg = 'Something went wrong. Please try again.';
      
      if (typeof err === 'string') {
        if (err.toLowerCase().includes('already exists') || err.toLowerCase().includes('already registered')) {
          errorMsg = 'User already exists with this email.';
        } else if (err.toLowerCase().includes('this email')) {
          errorMsg = 'This email is already registered.';
        } else if (err.toLowerCase().includes('unable to create')) {
          errorMsg = 'Unable to create account. Try again later.';
        } else {
          errorMsg = err;
        }
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
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>Create Account</Typography>
          <Typography variant="body2" color="text.secondary">
            Sign up to get started
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField 
            fullWidth 
            label="Full Name" 
            name="name" 
            value={formData.name} 
            onChange={handleChange}
            onBlur={() => handleBlur('name')}
            required 
            sx={{ mb: 2 }} 
            autoFocus
            error={!!fieldErrors.name}
            helperText={fieldErrors.name}
          />
          <TextField 
            fullWidth 
            label="Email" 
            name="email" 
            type="email" 
            value={formData.email} 
            onChange={handleChange}
            onBlur={() => handleBlur('email')}
            required 
            sx={{ mb: 2 }}
            error={!!fieldErrors.email}
            helperText={fieldErrors.email}
          />
          <TextField 
            fullWidth 
            label="Phone Number" 
            name="phoneNumber" 
            type="tel" 
            value={formData.phoneNumber} 
            onChange={handleChange}
            onBlur={() => handleBlur('phoneNumber')}
            required 
            placeholder="9876543210"
            helperText={fieldErrors.phoneNumber || "10 digits (e.g., 9876543210). +91 will be added automatically"}
            sx={{ mb: 2 }}
            error={!!fieldErrors.phoneNumber}
            InputProps={{
              startAdornment: (
                <Box component="span" sx={{ mr: 1, color: 'text.secondary' }}>+91</Box>
              ),
            }}
          />
          <TextField 
            fullWidth 
            label="Password" 
            name="password" 
            type="password" 
            value={formData.password} 
            onChange={handleChange}
            onBlur={() => handleBlur('password')}
            required 
            sx={{ mb: 2 }}
            error={!!fieldErrors.password}
            helperText={fieldErrors.password}
          />
          <TextField 
            fullWidth 
            label="Confirm Password" 
            name="confirmPassword" 
            type="password" 
            value={formData.confirmPassword} 
            onChange={handleChange}
            onBlur={() => handleBlur('confirmPassword')}
            required 
            sx={{ mb: 3 }}
            error={!!fieldErrors.confirmPassword}
            helperText={fieldErrors.confirmPassword}
          />

          {error && <Typography color="error" variant="body2" sx={{ mb: 2 }}>❌ {error}</Typography>}

          <Button 
            type="submit" 
            fullWidth 
            variant="contained" 
            size="large" 
            disabled={storeData.loading} 
            sx={{ py: 1.5, mb: 2, fontWeight: 600 }}
          >
            {storeData.loading ? 'Creating Account...' : 'Sign Up'}
          </Button>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2">
              Already have an account?{' '}
              <Link href="/login" sx={{ color: 'primary.main', fontWeight: 600, textDecoration: 'none', cursor: 'pointer' }}>
                Log in
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

export default SignupPage;
