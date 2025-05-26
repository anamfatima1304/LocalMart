// src/utils/auth.js
import authService from '../services/authService';

// Higher-order component for protecting routes
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

// Higher-order component for seller-only routes
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

// Higher-order component for buyer-only routes
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

// Utility function to redirect based on user type
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

// Utility function to validate password strength
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

// Utility function to validate email
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Utility function to handle API errors
export const handleApiError = (error) => {
  if (error.message) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  return 'An unexpected error occurred. Please try again.';
};

