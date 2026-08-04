import api from './api';

export const productivityService = {
  getBookmarks: async () => {
    const response = await api.get('/productivity/bookmarks');
    return response.data.data;
  },

  addBookmark: async (data) => {
    const response = await api.post('/productivity/bookmarks', data);
    return response.data.data;
  },

  removeBookmark: async (id) => {
    const response = await api.delete(`/productivity/bookmarks/${id}`);
    return response.data.data;
  },

  getPinnedItems: async () => {
    const response = await api.get('/productivity/pinned');
    return response.data.data;
  },

  addPinnedItem: async (data) => {
    const response = await api.post('/productivity/pinned', data);
    return response.data.data;
  },

  reorderPinnedItems: async (itemsOrder) => {
    const response = await api.put('/productivity/pinned/reorder', { itemsOrder });
    return response.data.data;
  },

  removePinnedItem: async (id) => {
    const response = await api.delete(`/productivity/pinned/${id}`);
    return response.data.data;
  },

  getRecentlyViewed: async () => {
    const response = await api.get('/productivity/recent-viewed');
    return response.data.data;
  },

  recordRecentlyViewed: async (data) => {
    const response = await api.post('/productivity/recent-viewed', data);
    return response.data.data;
  },
};
