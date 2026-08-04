import api from './api';

export const platformService = {
  // Configurations
  getConfigurations: async (scope = 'GLOBAL') => {
    const res = await api.get('/platform/configuration', { params: { scope } });
    return res.data.data;
  },

  setConfiguration: async (data) => {
    const res = await api.post('/platform/configuration', data);
    return res.data.data;
  },

  getModuleConfigurations: async () => {
    const res = await api.get('/platform/configuration/modules');
    return res.data.data;
  },

  // Health
  getHealthStatus: async () => {
    const res = await api.get('/platform/health');
    return res.data.data;
  },

  getHealthHistory: async () => {
    const res = await api.get('/platform/health/history');
    return res.data.data;
  },

  // Diagnostics
  runDiagnostics: async (component = 'DATABASE') => {
    const res = await api.post('/platform/diagnostics/run', { component });
    return res.data.data;
  },

  getDiagnosticHistory: async () => {
    const res = await api.get('/platform/diagnostics/history');
    return res.data.data;
  },

  // Releases & Versions
  getVersions: async () => {
    const res = await api.get('/platform/releases/versions');
    return res.data.data;
  },

  createVersion: async (data) => {
    const res = await api.post('/platform/releases/versions', data);
    return res.data.data;
  },

  addReleaseNote: async (data) => {
    const res = await api.post('/platform/releases/notes', data);
    return res.data.data;
  },

  // Governance & Maintenance
  getGovernanceSummary: async () => {
    const res = await api.get('/platform/governance/summary');
    return res.data.data;
  },

  getRunbooks: async () => {
    const res = await api.get('/platform/runbooks');
    return res.data.data;
  },

  getMaintenanceSchedules: async () => {
    const res = await api.get('/platform/maintenance');
    return res.data.data;
  },

  scheduleMaintenance: async (data) => {
    const res = await api.post('/platform/maintenance', data);
    return res.data.data;
  },
};
