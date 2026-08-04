import api from './api';

export const notificationService = {
  getUserNotifications: async (params = {}) => {
    const response = await api.get('/notifications', { params });
    return response.data.data;
  },

  markAsRead: async (id) => {
    const response = await api.patch(`/notifications/${id}/read`);
    return response.data.data;
  },

  bulkMarkAsRead: async (category = null) => {
    const response = await api.post('/notifications/mark-all-read', { category });
    return response.data.data;
  },

  bulkArchive: async (category = null) => {
    const response = await api.post('/notifications/archive-all', { category });
    return response.data.data;
  },

  deleteNotification: async (id) => {
    const response = await api.delete(`/notifications/${id}`);
    return response.data.data;
  },

  getActivityFeed: async (params = {}) => {
    const response = await api.get('/notifications/activities/feed', { params });
    return response.data.data;
  },

  getUserPreferences: async () => {
    const response = await api.get('/notifications/preferences/user');
    return response.data.data;
  },

  updateUserPreferences: async (preferencesData) => {
    const response = await api.put('/notifications/preferences/user', preferencesData);
    return response.data.data;
  },
};
