// src/services/authService.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class AuthService {
  // Register a new user
  async register(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Store token and user data
      if (data.data.token) {
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
      }

      return data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  // Login user
  async login(credentials) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store token and user data
      if (data.data.token) {
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
      }

      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Logout user
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }

  // Get current user profile
  async getProfile() {
    try {
      const token = this.getToken();
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          this.logout();
        }
        throw new Error(data.message || 'Failed to fetch profile');
      }

      // Update stored user data
      localStorage.setItem('user', JSON.stringify(data.data.user));

      return data;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  }

  // Update user profile
  async updateProfile(profileData) {
    try {
      const token = this.getToken();
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          this.logout();
        }
        throw new Error(data.message || 'Failed to update profile');
      }

      // Update stored user data
      localStorage.setItem('user', JSON.stringify(data.data.user));

      return data;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }

  // Change password
  async changePassword(passwordData) {
    try {
      const token = this.getToken();
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(passwordData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          this.logout();
        }
        throw new Error(data.message || 'Failed to change password');
      }

      return data;
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  }

  // Get stored token
  getToken() {
    return localStorage.getItem('token');
  }

  // Get stored user data
  getCurrentUser() {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  }

  // Check if user is authenticated
  isAuthenticated() {
    const token = this.getToken();
    const user = this.getCurrentUser();
    return !!(token && user);
  }

  // Check if user is a seller
  isSeller() {
    const user = this.getCurrentUser();
    return user && user.userType === 'seller';
  }

  // Check if user is a buyer
  isBuyer() {
    const user = this.getCurrentUser();
    return user && user.userType === 'buyer';
  }

  // Get user type
  getUserType() {
    const user = this.getCurrentUser();
    return user ? user.userType : null;
  }
}

export default new AuthService();