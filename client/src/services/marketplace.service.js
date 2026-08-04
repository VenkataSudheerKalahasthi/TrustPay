import api from './api';

export const marketplaceService = {
  searchJobs: async (params = {}) => {
    const response = await api.get('/marketplace/jobs', { params });
    return response.data.data;
  },

  getJobDetails: async (slug) => {
    const response = await api.get(`/marketplace/jobs/${slug}`);
    return response.data.data;
  },

  createJob: async (data) => {
    const response = await api.post('/marketplace/jobs', data);
    return response.data.data;
  },

  submitProposal: async (data) => {
    const response = await api.post('/marketplace/proposals', data);
    return response.data.data;
  },

  getJobProposals: async (jobId) => {
    const response = await api.get(`/marketplace/jobs/${jobId}/proposals`);
    return response.data.data;
  },

  updateProposalStatus: async (id, status, currentVersion = 1) => {
    const response = await api.patch(`/marketplace/proposals/${id}/status`, { status, currentVersion });
    return response.data.data;
  },

  acceptOffer: async (offerId) => {
    const response = await api.post(`/marketplace/offers/${offerId}/accept`);
    return response.data.data;
  },
};
