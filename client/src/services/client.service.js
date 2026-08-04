import api from './api';

export const clientProfileService = {
  async getMyProfile() {
    const res = await api.get('/clients/me');
    return res.data.data;
  },

  async updateProfile(data) {
    const res = await api.put('/clients/me', data);
    return res.data.data;
  },

  async getFavoriteWorkers() {
    const res = await api.get('/clients/favorites');
    return res.data.data;
  },

  async addFavoriteWorker(workerProfileId) {
    const res = await api.post(`/clients/favorites/${workerProfileId}`);
    return res.data.data;
  },

  async removeFavoriteWorker(workerProfileId) {
    const res = await api.delete(`/clients/favorites/${workerProfileId}`);
    return res.data.data;
  },
};
