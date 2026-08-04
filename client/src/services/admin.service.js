import api from './api';

export const adminService = {
  // Existing Methods
  getOverviewMetrics: async () => {
    const response = await api.get('/admin/overview');
    return response.data.data;
  },

  getAnnouncements: async () => {
    const response = await api.get('/admin/announcements');
    return response.data.data;
  },

  createAnnouncement: async (data) => {
    const response = await api.post('/admin/announcements', data);
    return response.data.data;
  },

  getFeatureFlags: async () => {
    const response = await api.get('/admin/feature-flags');
    return response.data.data;
  },

  createFeatureFlag: async (data) => {
    const response = await api.post('/admin/feature-flags', data);
    return response.data.data;
  },

  toggleFeatureFlag: async (id, isEnabled) => {
    const response = await api.patch(`/admin/feature-flags/${id}/toggle`, { isEnabled });
    return response.data.data;
  },

  getPlatformSettings: async () => {
    const response = await api.get('/admin/settings');
    return response.data.data;
  },

  updatePlatformSetting: async (data) => {
    const response = await api.put('/admin/settings', data);
    return response.data.data;
  },

  // Phase 5 Part 1 Methods
  searchUsers: async (search = '', role = '') => {
    const response = await api.get('/admin/users/search', { params: { search, role } });
    return response.data.data;
  },

  toggleUserSuspension: async (userId, isSuspended) => {
    const response = await api.post('/admin/users/suspend', { userId, isSuspended });
    return response.data.data;
  },

  restrictUser: async (data) => {
    const response = await api.post('/admin/users/restrict', data);
    return response.data.data;
  },

  addUserNote: async (data) => {
    const response = await api.post('/admin/users/notes', data);
    return response.data.data;
  },

  getVerificationReviews: async () => {
    const response = await api.get('/admin/verifications');
    return response.data.data;
  },

  reviewVerification: async (id, data) => {
    const response = await api.patch(`/admin/verifications/${id}`, data);
    return response.data.data;
  },

  getContractsOversight: async () => {
    const response = await api.get('/admin/contracts/oversight');
    return response.data.data;
  },

  updateContractOversight: async (data) => {
    const response = await api.post('/admin/contracts/oversight', data);
    return response.data.data;
  },

  getWalletsOversight: async () => {
    const response = await api.get('/admin/wallets/oversight');
    return response.data.data;
  },

  updateWalletOversight: async (data) => {
    const response = await api.post('/admin/wallets/oversight', data);
    return response.data.data;
  },

  getBulkOperations: async () => {
    const response = await api.get('/admin/bulk-operations');
    return response.data.data;
  },

  executeBulkOperation: async (data) => {
    const response = await api.post('/admin/bulk-operations', data);
    return response.data.data;
  },

  getPlatformMetrics: async () => {
    const response = await api.get('/admin/metrics');
    return response.data.data;
  },

  getAdminActionHistory: async () => {
    const response = await api.get('/admin/audit-history');
    return response.data.data;
  },
};
