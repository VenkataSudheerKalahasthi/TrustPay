import api from './api';

export const operationService = {
  getOperations: async () => {
    const response = await api.get('/operations/logs');
    return response.data.data;
  },

  getBackupJobs: async () => {
    const response = await api.get('/operations/backups');
    return response.data.data;
  },

  getComplianceReports: async () => {
    const response = await api.get('/operations/compliance');
    return response.data.data;
  },

  getExportRequests: async () => {
    const response = await api.get('/operations/exports');
    return response.data.data;
  },

  createExportRequest: async () => {
    const response = await api.post('/operations/exports');
    return response.data.data;
  },
};
