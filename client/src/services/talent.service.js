import api from './api';

export const talentService = {
  searchTalent: async (params = {}) => {
    const response = await api.get('/talent/search', { params });
    return response.data.data;
  },

  getTalentPools: async () => {
    const response = await api.get('/talent/pools');
    return response.data.data;
  },

  createTalentPool: async (data) => {
    const response = await api.post('/talent/pools', data);
    return response.data.data;
  },

  addCandidateToPool: async (poolId, workerUserId, notes) => {
    const response = await api.post(`/talent/pools/${poolId}/candidates`, { workerUserId, notes });
    return response.data.data;
  },

  inviteCandidate: async (data) => {
    const response = await api.post('/talent/invitations', data);
    return response.data.data;
  },

  compareCandidates: async (workerUserIds) => {
    const response = await api.post('/talent/compare', { workerUserIds });
    return response.data.data;
  },

  getAIRecommendations: async (jobDescription) => {
    const response = await api.get('/talent/recommendations', { params: { jobDescription } });
    return response.data.data;
  },
};
