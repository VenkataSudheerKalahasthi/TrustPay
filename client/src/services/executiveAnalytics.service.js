import api from './api';

export const executiveAnalyticsService = {
  getOverview: async () => {
    const response = await api.get('/executive-analytics/overview');
    return response.data.data;
  },

  getDashboards: async () => {
    const response = await api.get('/executive-analytics/dashboards');
    return response.data.data;
  },

  createDashboard: async (data) => {
    const response = await api.post('/executive-analytics/dashboards', data);
    return response.data.data;
  },

  updateDashboard: async (id, data) => {
    const response = await api.patch(`/executive-analytics/dashboards/${id}`, data);
    return response.data.data;
  },

  deleteDashboard: async (id) => {
    const response = await api.delete(`/executive-analytics/dashboards/${id}`);
    return response.data.data;
  },

  getReports: async (visibility = 'ADMIN') => {
    const response = await api.get(`/executive-analytics/reports?visibility=${visibility}`);
    return response.data.data;
  },

  getReportById: async (id) => {
    const response = await api.get(`/executive-analytics/reports/${id}`);
    return response.data.data;
  },

  createReport: async (data) => {
    const response = await api.post('/executive-analytics/reports', data);
    return response.data.data;
  },

  exportReport: async (id, format) => {
    const response = await api.post(`/executive-analytics/reports/${id}/export`, { format });
    return response.data.data;
  },

  getSubscriptions: async () => {
    const response = await api.get('/executive-analytics/subscriptions');
    return response.data.data;
  },

  createSubscription: async (data) => {
    const response = await api.post('/executive-analytics/subscriptions', data);
    return response.data.data;
  },

  getExecutionLogs: async () => {
    const response = await api.get('/executive-analytics/execution-logs');
    return response.data.data;
  },

  getKPIBenchmarks: async () => {
    const response = await api.get('/executive-analytics/kpi-benchmarks');
    return response.data.data;
  },

  upsertKPIBenchmark: async (code, data) => {
    const response = await api.put(`/executive-analytics/kpi-benchmarks/${code}`, data);
    return response.data.data;
  },

  getAlerts: async () => {
    const response = await api.get('/executive-analytics/alerts');
    return response.data.data;
  },

  createAlert: async (data) => {
    const response = await api.post('/executive-analytics/alerts', data);
    return response.data.data;
  },

  getAIInsight: async (reportKey = 'GLOBAL_EXECUTIVE_SUMMARY') => {
    const response = await api.get(`/executive-analytics/ai-insights?reportKey=${reportKey}`);
    return response.data.data;
  },
};
