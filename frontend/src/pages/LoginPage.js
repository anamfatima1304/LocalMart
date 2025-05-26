// src/pages/LoginPage.js
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import authService from '../services/authService';
import { handleApiError, redirectToDashboard } from '../utils/auth';

function LoginPage() {
  const [userType, setUserType] = useState('buyer');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect if already authenticated
  useEffect(() => {
    if (authService.isAuthenticated()) {
      redirectToDashboard();
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const email = e.target.email.value;
      const password = e.target.password.value;

      const credentials = {
        email,
        password,
        userType // Send userType to verify account type
      };

      const response = await authService.login(credentials);
      
      console.log('Login successful:', response);
      
      // Redirect based on user type
      redirectToDashboard();
      
    } catch (error) {
      console.error('Login failed:', error);
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
            <h2>Login to LocalMart</h2>
            <p>Enter your credentials to access your account</p>
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
                />
              </div>
            </div>

            <div className="forgot-password">
              <a href="/forgot-password">Forgot password?</a>
            </div>

            <div className="user-type">
              <p>Login as:</p>
              <div className="type-options">
                <div
                  className={`type-option ${userType === 'buyer' ? 'active' : ''}`}
                  onClick={() => !loading && setUserType('buyer')}
                  style={{ cursor: loading ? 'not-allowed' : 'pointer' }}
                >
                  <i className="fas fa-shopping-bag"></i>
                  <h4>Buyer</h4>
                </div>
                <div
                  className={`type-option ${userType === 'seller' ? 'active' : ''}`}
                  onClick={() => !loading && setUserType('seller')}
                  style={{ cursor: loading ? 'not-allowed' : 'pointer' }}
                >
                  <i className="fas fa-store"></i>
                  <h4>Seller</h4>
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              style={{
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Don't have an account? <a href="/signup">Sign Up</a>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default LoginPage;