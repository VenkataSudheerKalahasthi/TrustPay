import api from './api';

export const fileService = {
  createFileAsset: async (data) => {
    const response = await api.post('/files', data);
    return response.data.data;
  },

  getFiles: async (params = {}) => {
    const response = await api.get('/files', { params });
    return response.data.data;
  },

  getFileDetails: async (id) => {
    const response = await api.get(`/files/${id}`);
    return response.data.data;
  },

  addFileVersion: async (id, data) => {
    const response = await api.post(`/files/${id}/versions`, data);
    return response.data.data;
  },

  createShareLink: async (id, data) => {
    const response = await api.post(`/files/${id}/share`, data);
    return response.data.data;
  },

  toggleFavorite: async (id, isFavorite) => {
    const response = await api.patch(`/files/${id}/favorite`, { isFavorite });
    return response.data.data;
  },

  deleteFile: async (id) => {
    const response = await api.delete(`/files/${id}`);
    return response.data.data;
  },

  getStorageStats: async () => {
    const response = await api.get('/files/storage-stats');
    return response.data.data;
  },
};
