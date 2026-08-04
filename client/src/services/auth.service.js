import api from './api';

/**
 * Client Authentication & Profile API Service
 */
export const authService = {
  /**
   * Register a new user
   * @param {import('../types').RegisterFormData} data
   */
  async register(data) {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  /**
   * Login user
   * @param {import('../types').LoginFormData} credentials
   */
  async login(credentials) {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  /**
   * Logout user (current device)
   * @param {string} [refreshToken]
   */
  async logout(refreshToken) {
    const response = await api.post('/auth/logout', { refreshToken });
    return response.data;
  },

  /**
   * Logout all devices
   */
  async logoutAll() {
    const response = await api.post('/auth/logout-all');
    return response.data;
  },

  /**
   * Refresh session
   * @param {string} refreshToken
   */
  async refreshSession(refreshToken) {
    const response = await api.post('/auth/refresh', { refreshToken });
    return response.data;
  },

  /**
   * Request password reset email
   * @param {string} email
   */
  async forgotPassword(email) {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  /**
   * Reset password using token
   * @param {{ token: string, password: string }} data
   */
  async resetPassword(data) {
    const response = await api.post('/auth/reset-password', data);
    return response.data;
  },

  /**
   * Verify email address using token
   * @param {string} token
   */
  async verifyEmail(token) {
    const response = await api.post('/auth/verify-email', { token });
    return response.data;
  },

  /**
   * Change password for logged in user
   * @param {{ currentPassword: string, newPassword: string }} data
   */
  async changePassword(data) {
    const response = await api.post('/auth/change-password', data);
    return response.data;
  },

  /**
   * Get current authenticated user details
   */
  async getCurrentUser() {
    const response = await api.get('/auth/me');
    return response.data;
  },

  /**
   * Update profile
   * @param {object} data
   */
  async updateProfile(data) {
    const response = await api.put('/auth/profile', data);
    return response.data;
  },
};
