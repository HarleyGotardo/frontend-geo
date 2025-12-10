import api from './api';

export const geoService = {
  // Get geolocation data (current IP or specific IP)
  async getGeo(ip = null) {
    try {
      const params = ip ? { ip } : {};
      const response = await api.get('/api/geo', { params });
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to fetch geolocation data',
        errors: error.response?.data?.errors || {}
      };
    }
  },

  // Get search history
  async getHistory() {
    try {
      const response = await api.get('/api/history');
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to fetch history'
      };
    }
  },

  // Delete history entries
  async deleteHistory(ids) {
    try {
      await api.post('/api/history/delete', { ids });
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to delete history',
        errors: error.response?.data?.errors || {}
      };
    }
  }
};
