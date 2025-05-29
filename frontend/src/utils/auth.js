// src/utils/auth.js
import authService from '../services/authService';
import React from 'react';

// Utility function to handle API errors
export const handleApiError = (error) => {
  if (error.response) {
    return error.response.data?.message || 'An error occurred';
  } else if (error.request) {
    return 'Network error. Please check your connection.';
  } else if (error.message) {
    return error.message;
  } else if (typeof error === 'string') {
    return error;
  } else {
    return 'An unexpected error occurred. Please try again.';
  }
};

// Redirect user based on role
export const redirectToDashboard = () => {
  const userType = authService.getUserType();
  if (userType === 'seller') {
    window.location.href = '/seller-dashboard';
  } else if (userType === 'buyer') {
    window.location.href = '/buyer-dashboard';
  } else {
    window.location.href = '/login';
  }
};

// Check auth and redirect if logged in
export const checkAuthAndRedirect = () => {
  if (authService.isAuthenticated()) {
    redirectToDashboard();
    return true;
  }
  return false;
};

// HOC: Protect route
export const withAuth = (WrappedComponent) => {
  return function AuthenticatedComponent(props) {
    const isAuthenticated = authService.isAuthenticated();
    if (!isAuthenticated) {
      window.location.href = '/login';
      return null;
    }
    return <WrappedComponent {...props} />;
  };
};

// HOC: Protect seller-only route
export const withSellerAuth = (WrappedComponent) => {
  return function SellerAuthenticatedComponent(props) {
    const isAuthenticated = authService.isAuthenticated();
    const isSeller = authService.isSeller();
    if (!isAuthenticated) {
      window.location.href = '/login';
      return null;
    }
    if (!isSeller) {
      window.location.href = '/buyer-dashboard';
      return null;
    }
    return <WrappedComponent {...props} />;
  };
};

// HOC: Protect buyer-only route
export const withBuyerAuth = (WrappedComponent) => {
  return function BuyerAuthenticatedComponent(props) {
    const isAuthenticated = authService.isAuthenticated();
    const isBuyer = authService.isBuyer();
    if (!isAuthenticated) {
      window.location.href = '/login';
      return null;
    }
    if (!isBuyer) {
      window.location.href = '/seller-dashboard';
      return null;
    }
    return <WrappedComponent {...props} />;
  };
};

// Password strength validation
export const validatePassword = (password) => {
  const minLength = 6;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const errors = [];

  if (password.length < minLength) {
    errors.push(`Password must be at least ${minLength} characters long`);
  }
  if (!hasUpperCase) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!hasLowerCase) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!hasNumbers) {
    errors.push('Password must contain at least one number');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Email format validation
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
