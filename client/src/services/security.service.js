import api from './api';

export const securityService = {
  getDashboard: async () => {
    const response = await api.get('/security/dashboard');
    return response.data.data;
  },

  revokeSession: async (sessionId) => {
    const response = await api.delete(`/security/sessions/${sessionId}`);
    return response.data.data;
  },

  reportIncident: async (data) => {
    const response = await api.post('/security/incidents', data);
    return response.data.data;
  },
};
