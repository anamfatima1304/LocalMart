// src/pages/SignupPage.js
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import authService from '../services/authService';
import { handleApiError, validatePassword, redirectToDashboard } from '../utils/auth';

function SignupPage() {
  const [userType, setUserType] = useState('buyer');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordErrors, setPasswordErrors] = useState([]);

  // Redirect if already authenticated
  useEffect(() => {
    if (authService.isAuthenticated()) {
      redirectToDashboard();
    }
  }, []);

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    const validation = validatePassword(password);
    setPasswordErrors(validation.errors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formData = new FormData(e.target);
      const name = formData.get('name');
      const email = formData.get('email');
      const password = formData.get('password');
      const confirmPassword = formData.get('confirmPassword');

      // Client-side validation
      if (password !== confirmPassword) {
        throw new Error('Passwords do not match!');
      }

      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid) {
        throw new Error(passwordValidation.errors[0]);
      }

      const userData = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        userType
      };

      const response = await authService.register(userData);
      
      console.log('Registration successful:', response);
      
      // Redirect based on user type
      redirectToDashboard();
      
    } catch (error) {
      console.error('Registration failed:', error);
      setError(handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h2>Sign Up for LocalMart</h2>
            <p>Create an account to start using LocalMart</p>
          </div>

          {error && (
            <div className="error-message" style={{
              background: '#fee2e2',
              border: '1px solid #fecaca',
              color: '#dc2626',
              padding: '12px',
              borderRadius: '6px',
              marginBottom: '20px',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <div className="input-group">
                <i className="fas fa-user"></i>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  placeholder="Enter your full name" 
                  required 
                  disabled={loading}
                  minLength="2"
                  maxLength="50"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <div className="input-group">
                <i className="fas fa-envelope"></i>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  placeholder="Enter your email" 
                  required 
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-group">
                <i className="fas fa-lock"></i>
                <input 
                  type="password" 
                  id="password" 
                  name="password" 
                  placeholder="Enter your password" 
                  required 
                  disabled={loading}
                  onChange={handlePasswordChange}
                  minLength="6"
                />
              </div>
              {passwordErrors.length > 0 && (
                <div className="password-requirements" style={{
                  fontSize: '12px',
                  color: '#dc2626',
                  marginTop: '5px'
                }}>
                  {passwordErrors.map((error, index) => (
                    <div key={index}>• {error}</div>
                  ))}
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="input-group">
                <i className="fas fa-lock"></i>
                <input 
                  type="password" 
                  id="confirmPassword" 
                  name="confirmPassword" 
                  placeholder="Confirm your password" 
                  required 
                  disabled={loading}
                />
              </div>
            </div>

            <div className="user-type">
              <p>Select your user type:</p>
              <div className="type-options">
                <div
                  className={`type-option ${userType === 'buyer' ? 'active' : ''}`}
                  onClick={() => !loading && setUserType('buyer')}
                  style={{ cursor: loading ? 'not-allowed' : 'pointer' }}
                >
                  <i className="fas fa-shopping-bag"></i>
                  <h4>Buyer</h4>
                  <p style={{ fontSize: '12px', margin: '5px 0 0 0', color: '#666' }}>
                    Shop from local sellers
                  </p>
                </div>
                <div
                  className={`type-option ${userType === 'seller' ? 'active' : ''}`}
                  onClick={() => !loading && setUserType('seller')}
                  style={{ cursor: loading ? 'not-allowed' : 'pointer' }}
                >
                  <i className="fas fa-store"></i>
                  <h4>Seller</h4>
                  <p style={{ fontSize: '12px', margin: '5px 0 0 0', color: '#666' }}>
                    Sell products locally
                  </p>
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading || passwordErrors.length > 0}
              style={{
                opacity: (loading || passwordErrors.length > 0) ? 0.7 : 1,
                cursor: (loading || passwordErrors.length > 0) ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Already have an account? <a href="/login">Login</a>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default SignupPage;