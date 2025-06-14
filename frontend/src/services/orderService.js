const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class OrderService {
  // Get auth token from localStorage
  getAuthToken() {
    return localStorage.getItem('token');
  }

  // Get auth headers
  getAuthHeaders() {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getAuthToken()}`
    };
  }

  // Create new order
  async createOrder(orderData) {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/create`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(orderData)
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to create order');
      }

      return result;
      
    } catch (error) {
      console.error('Create order error:', error);
      throw error;
    }
  }

  // Get user orders
  async getUserOrders(userId, params = {}) {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const url = `${API_BASE_URL}/orders/user/${userId}${queryParams ? `?${queryParams}` : ''}`;
      
      const response = await fetch(url, {
        headers: this.getAuthHeaders()
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch orders');
      }

      return result;
      
    } catch (error) {
      console.error('Get user orders error:', error);
      throw error;
    }
  }

  // Get order by ID
  async getOrderById(orderId) {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
        headers: this.getAuthHeaders()
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch order');
      }

      return result;
      
    } catch (error) {
      console.error('Get order error:', error);
      throw error;
    }
  }

  // Cancel order
  async cancelOrder(orderId, reason = '') {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}/cancel`, {
        method: 'PATCH',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ reason })
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to cancel order');
      }

      return result;
      
    } catch (error) {
      console.error('Cancel order error:', error);
      throw error;
    }
  }
}

export const orderService = new OrderService();