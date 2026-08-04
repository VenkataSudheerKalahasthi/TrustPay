import api from './api';

export const financeService = {
  // Subscriptions & Plans
  getPlans: async () => {
    const res = await api.get('/finance/plans');
    return res.data.data;
  },

  createPlan: async (data) => {
    const res = await api.post('/finance/plans', data);
    return res.data.data;
  },

  subscribeOrganization: async (data) => {
    const res = await api.post('/finance/subscribe', data);
    return res.data.data;
  },

  getUserSubscription: async () => {
    const res = await api.get('/finance/subscription');
    return res.data.data;
  },

  // Billing Profiles & Payment Methods
  getBillingProfile: async () => {
    const res = await api.get('/finance/billing-profile');
    return res.data.data;
  },

  updateBillingProfile: async (data) => {
    const res = await api.put('/finance/billing-profile', data);
    return res.data.data;
  },

  addPaymentMethod: async (data) => {
    const res = await api.post('/finance/payment-methods', data);
    return res.data.data;
  },

  // Commissions
  getCommissionRules: async () => {
    const res = await api.get('/finance/commissions/rules');
    return res.data.data;
  },

  createCommissionRule: async (data) => {
    const res = await api.post('/finance/commissions/rules', data);
    return res.data.data;
  },

  // Budgets
  getBudgets: async (params = {}) => {
    const res = await api.get('/finance/budgets', { params });
    return res.data.data;
  },

  createBudget: async (data) => {
    const res = await api.post('/finance/budgets', data);
    return res.data.data;
  },

  // Financial Reports
  getReports: async () => {
    const res = await api.get('/finance/reports');
    return res.data.data;
  },

  generateReport: async (data) => {
    const res = await api.post('/finance/reports', data);
    return res.data.data;
  },

  // Dashboard & AI Insights
  getDashboardSummary: async () => {
    const res = await api.get('/finance/dashboard');
    return res.data.data;
  },

  getAIInsights: async () => {
    const res = await api.get('/finance/ai-insights');
    return res.data.data;
  },
};
