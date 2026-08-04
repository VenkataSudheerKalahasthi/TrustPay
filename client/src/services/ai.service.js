import api from './api';

export const aiService = {
  processPrompt: async (data) => {
    const response = await api.post('/ai/chat', data);
    return response.data.data;
  },

  summarize: async (data) => {
    const response = await api.post('/ai/summarize', data);
    return response.data.data;
  },

  assistWriting: async (data) => {
    const response = await api.post('/ai/assist-writing', data);
    return response.data.data;
  },

  getConversations: async (params = {}) => {
    const response = await api.get('/ai/conversations', { params });
    return response.data.data;
  },

  getConversation: async (id) => {
    const response = await api.get(`/ai/conversations/${id}`);
    return response.data.data;
  },

  togglePin: async (id, isPinned) => {
    const response = await api.patch(`/ai/conversations/${id}/pin`, { isPinned });
    return response.data.data;
  },

  toggleArchive: async (id, isArchived) => {
    const response = await api.patch(`/ai/conversations/${id}/archive`, { isArchived });
    return response.data.data;
  },

  submitFeedback: async (messageId, feedbackData) => {
    const response = await api.post(`/ai/messages/${messageId}/feedback`, feedbackData);
    return response.data.data;
  },

  getPromptTemplates: async (params = {}) => {
    const response = await api.get('/ai/templates', { params });
    return response.data.data;
  },
};
