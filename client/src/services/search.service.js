import api from './api';

export const searchService = {
  search: async (params = {}) => {
    const response = await api.get('/search', { params });
    return response.data.data;
  },

  getSuggestions: async (q) => {
    const response = await api.get('/search/suggestions', { params: { q } });
    return response.data.data;
  },

  getRecentSearches: async () => {
    const response = await api.get('/search/recent');
    return response.data.data;
  },

  getSavedSearches: async () => {
    const response = await api.get('/search/saved');
    return response.data.data;
  },

  saveSearch: async (data) => {
    const response = await api.post('/search/saved', data);
    return response.data.data;
  },

  logClickAnalytics: async (data) => {
    const response = await api.post('/search/analytics/click', data);
    return response.data.data;
  },
};
