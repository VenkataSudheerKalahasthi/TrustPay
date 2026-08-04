import api from './api';

export const supportService = {
  // Tickets
  getTickets: async (params = {}) => {
    const res = await api.get('/support/tickets', { params });
    return res.data.data;
  },

  createTicket: async (data) => {
    const res = await api.post('/support/tickets', data);
    return res.data.data;
  },

  getTicketById: async (id) => {
    const res = await api.get(`/support/tickets/${id}`);
    return res.data.data;
  },

  addMessage: async (id, data) => {
    const res = await api.post(`/support/tickets/${id}/messages`, data);
    return res.data.data;
  },

  assignAgent: async (id, data) => {
    const res = await api.post(`/support/tickets/${id}/assign`, data);
    return res.data.data;
  },

  updateStatus: async (id, data) => {
    const res = await api.patch(`/support/tickets/${id}/status`, data);
    return res.data.data;
  },

  // SLA
  getSLAPolicies: async () => {
    const res = await api.get('/support/sla/policies');
    return res.data.data;
  },

  createSLAPolicy: async (data) => {
    const res = await api.post('/support/sla/policies', data);
    return res.data.data;
  },

  evaluateTicketSLA: async (id) => {
    const res = await api.get(`/support/sla/evaluate/${id}`);
    return res.data.data;
  },

  // Knowledge Base
  getKnowledgeArticles: async (params = {}) => {
    const res = await api.get('/support/knowledge/articles', { params });
    return res.data.data;
  },

  createKnowledgeArticle: async (data) => {
    const res = await api.post('/support/knowledge/articles', data);
    return res.data.data;
  },

  getKnowledgeArticleBySlug: async (slug) => {
    const res = await api.get(`/support/knowledge/articles/${slug}`);
    return res.data.data;
  },

  // Feedback & Customer Health
  submitFeedback: async (data) => {
    const res = await api.post('/support/feedback', data);
    return res.data.data;
  },

  getFeedbacks: async () => {
    const res = await api.get('/support/feedback');
    return res.data.data;
  },

  submitCSAT: async (data) => {
    const res = await api.post('/support/csat', data);
    return res.data.data;
  },

  getCustomerHealth: async (userId) => {
    const path = userId ? `/support/health/${userId}` : '/support/health';
    const res = await api.get(path);
    return res.data.data;
  },

  // Disputes
  getDisputes: async (params = {}) => {
    const res = await api.get('/support/disputes', { params });
    return res.data.data;
  },

  createDispute: async (data) => {
    const res = await api.post('/support/disputes', data);
    return res.data.data;
  },

  resolveDispute: async (id, data) => {
    const res = await api.post(`/support/disputes/${id}/resolve`, data);
    return res.data.data;
  },

  // AI Advisory Insights
  getAIInsights: async () => {
    const res = await api.get('/support/ai-insights');
    return res.data.data;
  },
};
