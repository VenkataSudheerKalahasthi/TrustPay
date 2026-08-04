import api from './api';

export const chatService = {
  getUserConversations: async (params = {}) => {
    const response = await api.get('/chat/conversations', { params });
    return response.data.data;
  },

  createConversation: async (conversationData) => {
    const response = await api.post('/chat/conversations', conversationData);
    return response.data.data;
  },

  getConversationById: async (id, params = {}) => {
    const response = await api.get(`/chat/conversations/${id}`, { params });
    return response.data.data;
  },

  markAsRead: async (id) => {
    const response = await api.post(`/chat/conversations/${id}/read`);
    return response.data.data;
  },

  sendMessage: async (messageData) => {
    const response = await api.post('/chat/messages', messageData);
    return response.data.data;
  },

  editMessage: async (messageId, editData) => {
    const response = await api.put(`/chat/messages/${messageId}`, editData);
    return response.data.data;
  },

  deleteMessage: async (messageId, deleteData = {}) => {
    const response = await api.delete(`/chat/messages/${messageId}`, { data: deleteData });
    return response.data.data;
  },

  toggleReaction: async (messageId, emoji) => {
    const response = await api.post(`/chat/messages/${messageId}/reactions`, { emoji });
    return response.data.data;
  },
};
