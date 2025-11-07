import * as Yup from 'yup';

// Checkout form validation schema
export const checkoutSchema = Yup.object({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .required('Full name is required'),
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),
  phone: Yup.string()
    .matches(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits')
    .required('Phone number is required'),
  address: Yup.string()
    .min(10, 'Address must be at least 10 characters')
    .max(200, 'Address must be less than 200 characters')
    .required('Address is required'),
  city: Yup.string()
    .min(2, 'City must be at least 2 characters')
    .max(50, 'City must be less than 50 characters')
    .required('City is required'),
  state: Yup.string()
    .min(2, 'State must be at least 2 characters')
    .max(50, 'State must be less than 50 characters')
    .required('State is required'),
  zipCode: Yup.string()
    .matches(/^[0-9]{5,6}$/, 'ZIP code must be 5-6 digits')
    .required('ZIP code is required'),
  paymentMethod: Yup.string()
    .oneOf(['cash', 'card', 'upi'], 'Please select a valid payment method')
    .required('Payment method is required'),
});

// Address validation schema (for reusable address forms)
export const addressSchema = Yup.object({
  street: Yup.string()
    .min(5, 'Street address must be at least 5 characters')
    .max(100, 'Street address must be less than 100 characters')
    .required('Street address is required'),
  city: Yup.string()
    .min(2, 'City must be at least 2 characters')
    .max(50, 'City must be less than 50 characters')
    .required('City is required'),
  state: Yup.string()
    .min(2, 'State must be at least 2 characters')
    .max(50, 'State must be less than 50 characters')
    .required('State is required'),
  zipCode: Yup.string()
    .matches(/^[0-9]{5,6}$/, 'ZIP code must be 5-6 digits')
    .required('ZIP code is required'),
});

// Contact information validation schema
export const contactSchema = Yup.object({
  phone: Yup.string()
    .matches(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits')
    .required('Phone number is required'),
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),
});