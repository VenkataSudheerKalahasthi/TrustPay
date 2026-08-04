import api from './api';

/**
 * Profile Service
 * API endpoints for user profile management.
 */
export const profileService = {
  async getProfile() {
    const response = await api.get('/auth/me');
    return response.data;
  },

  async updateProfile(data) {
    const response = await api.put('/auth/profile', data);
    return response.data;
  },

  async changePassword(data) {
    const response = await api.post('/auth/change-password', data);
    return response.data;
  },
};
