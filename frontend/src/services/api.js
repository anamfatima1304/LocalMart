// services/api.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Helper method to get auth token from localStorage
  getAuthToken() {
    return localStorage.getItem('token');
  }

  // Helper method for making API requests
  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getAuthToken();
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      defaultHeaders.Authorization = `Bearer ${token}`;
    }
    
    const config = {
      headers: { ...defaultHeaders, ...options.headers },
      ...options,
    };
    
    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }
      
      return data;
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  }

  // Auth methods
  async login(credentials) {
    return this.makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData) {
    return this.makeRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getUserProfile() {
    return this.makeRequest('/auth/profile');
  }

  // Shop methods
  async getAllShops(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/shops?${queryString}` : '/shops';
    return this.makeRequest(endpoint);
  }

  async getShopById(shopId) {
    return this.makeRequest(`/shops/${shopId}`);
  }

  async getCategoryStats() {
    return this.makeRequest('/shops/categories/stats');
  }

  // Menu methods
  async getMenuItems(sellerId) {
    return this.makeRequest(`/menu?seller=${sellerId}`);
  }

  async addMenuItem(menuData) {
    return this.makeRequest('/menu', {
      method: 'POST',
      body: JSON.stringify(menuData),
    });
  }

  async updateMenuItem(itemId, menuData) {
    return this.makeRequest(`/menu/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify(menuData),
    });
  }

  async deleteMenuItem(itemId) {
    return this.makeRequest(`/menu/${itemId}`, {
      method: 'DELETE',
    });
  }

  // Order methods
  async createOrder(orderData) {
    return this.makeRequest('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async getBuyerOrders() {
    return this.makeRequest('/orders/buyer');
  }

  async getSellerOrders() {
    return this.makeRequest('/orders/seller');
  }

  async updateOrderStatus(orderId, status) {
    return this.makeRequest(`/orders/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }
}

// Create a singleton instance
const apiService = new ApiService();

export default apiService;

// Export individual methods for easier imports
export const {
  login,
  register,
  getUserProfile,
  getAllShops,
  getShopById,
  getCategoryStats,
  getMenuItems,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  createOrder,
  getBuyerOrders,
  getSellerOrders,
  updateOrderStatus,
} = apiService;