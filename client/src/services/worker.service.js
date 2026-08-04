import api from './api';

export const workerService = {
  async getMyProfile() {
    const res = await api.get('/workers/me');
    return res.data.data;
  },

  async updateProfile(data) {
    const res = await api.put('/workers/me', data);
    return res.data.data;
  },

  async getPublicProfile(slugOrId) {
    const res = await api.get(`/workers/public/${slugOrId}`);
    return res.data.data;
  },

  async searchWorkers(params) {
    const res = await api.get('/workers/search', { params });
    return res.data.data;
  },

  async addPortfolioProject(data) {
    const res = await api.post('/workers/portfolio', data);
    return res.data.data;
  },

  async deletePortfolioProject(id) {
    const res = await api.delete(`/workers/portfolio/${id}`);
    return res.data.data;
  },

  async uploadFile(file, category = 'profile-photos') {
    const formData = new FormData();
    formData.append('file', file);
    const res = await api.post(`/workers/upload?category=${category}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.data;
  },

  async submitVerificationDocument(data) {
    const res = await api.post('/workers/verification-docs', data);
    return res.data.data;
  },
};
