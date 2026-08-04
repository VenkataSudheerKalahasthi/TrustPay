import api from './api';

export const analyticsService = {
  getDashboard: async (params = {}) => {
    const response = await api.get('/analytics/dashboard', { params });
    return response.data.data;
  },

  getPreferences: async () => {
    const response = await api.get('/analytics/preferences');
    return response.data.data;
  },

  updatePreferences: async (prefData) => {
    const response = await api.put('/analytics/preferences', prefData);
    return response.data.data;
  },

  exportReport: async (exportData) => {
    const response = await api.post('/analytics/reports/export', exportData, {
      responseType: exportData.format === 'PDF' ? 'blob' : 'text',
    });
    return response.data;
  },

  // Phase 4 Part 6 Executive BI Endpoints
  getExecutiveDashboards: async () => {
    const res = await api.get('/analytics/bi/dashboards');
    return res.data.data;
  },

  createExecutiveDashboard: async (data) => {
    const res = await api.post('/analytics/bi/dashboards', data);
    return res.data.data;
  },

  addDashboardWidget: async (data) => {
    const res = await api.post('/analytics/bi/widgets', data);
    return res.data.data;
  },

  getKPIs: async () => {
    const res = await api.get('/analytics/kpis');
    return res.data.data;
  },

  createKPI: async (data) => {
    const res = await api.post('/analytics/kpis', data);
    return res.data.data;
  },

  getForecasts: async () => {
    const res = await api.get('/analytics/forecasts');
    return res.data.data;
  },

  generateForecast: async (data) => {
    const res = await api.post('/analytics/forecasts', data);
    return res.data.data;
  },

  getExecutiveReports: async () => {
    const res = await api.get('/analytics/reports/executive');
    return res.data.data;
  },

  generateExecutiveReport: async (data) => {
    const res = await api.post('/analytics/reports/executive', data);
    return res.data.data;
  },

  getReportSchedules: async () => {
    const res = await api.get('/analytics/reports/schedules');
    return res.data.data;
  },

  createReportSchedule: async (data) => {
    const res = await api.post('/analytics/reports/schedules', data);
    return res.data.data;
  },

  getScorecards: async () => {
    const res = await api.get('/analytics/scorecards');
    return res.data.data;
  },

  getBusinessGoals: async () => {
    const res = await api.get('/analytics/goals');
    return res.data.data;
  },

  createBusinessGoal: async (data) => {
    const res = await api.post('/analytics/goals', data);
    return res.data.data;
  },

  logGoalProgress: async (goalId, data) => {
    const res = await api.post(`/analytics/goals/${goalId}/progress`, data);
    return res.data.data;
  },

  getDecisionInsights: async () => {
    const res = await api.get('/analytics/insights');
    return res.data.data;
  },
};
