import api from './api';

export const releaseService = {
  getOverview: async () => {
    const response = await api.get('/release/overview');
    return response.data.data;
  },

  certifyRelease: async (data) => {
    const response = await api.post('/release/certify', data);
    return response.data.data;
  },

  runRegressionSuite: async (data) => {
    const response = await api.post('/release/regression', data);
    return response.data.data;
  },

  runSecurityScan: async (data) => {
    const response = await api.post('/release/security-scan', data);
    return response.data.data;
  },

  approveDeployment: async (data) => {
    const response = await api.post('/release/approve-deployment', data);
    return response.data.data;
  },

  createSignoff: async (data) => {
    const response = await api.post('/release/signoff', data);
    return response.data.data;
  },
};
