import api from './api';

export const integrationService = {
  getIntegrations: async () => {
    const response = await api.get('/integrations');
    return response.data.data;
  },

  toggleIntegration: async (id, status) => {
    const response = await api.patch(`/integrations/${id}/status`, { status });
    return response.data.data;
  },

  connectIntegration: async (id, credentialData) => {
    const response = await api.post(`/integrations/${id}/connect`, credentialData);
    return response.data.data;
  },

  getApiKeys: async () => {
    const response = await api.get('/integrations/api-keys');
    return response.data.data;
  },

  generateApiKey: async (data) => {
    const response = await api.post('/integrations/api-keys', data);
    return response.data.data;
  },

  revokeApiKey: async (id) => {
    const response = await api.delete(`/integrations/api-keys/${id}`);
    return response.data.data;
  },

  getWebhooks: async () => {
    const response = await api.get('/integrations/webhooks');
    return response.data.data;
  },

  registerWebhook: async (data) => {
    const response = await api.post('/integrations/webhooks', data);
    return response.data.data;
  },

  deleteWebhook: async (id) => {
    const response = await api.delete(`/integrations/webhooks/${id}`);
    return response.data.data;
  },

  testWebhook: async (id) => {
    const response = await api.post(`/integrations/webhooks/${id}/test`);
    return response.data.data;
  },
};
