import api from './api';

export const authService = {
  // Login user
  async login(email, password) {
    try {
      const response = await api.post('/api/login', { email, password });
      const { access_token, user } = response.data;
      
      // Store token in localStorage
      localStorage.setItem('auth_token', access_token);
      localStorage.setItem('user', JSON.stringify(user));
      
      return { success: true, user, token: access_token };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  },

  // Logout user
  async logout() {
    try {
      await api.post('/api/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage regardless of API call success
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
    }
  },

  // Get current user
  async getCurrentUser() {
    try {
      const response = await api.get('/api/user');
      return { success: true, user: response.data };
    } catch {
      return { success: false };
    }
  },

  // Check if user is logged in
  isAuthenticated() {
    const token = localStorage.getItem('auth_token');
    return !!token;
  },

  // Get stored user data
  getStoredUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
};
