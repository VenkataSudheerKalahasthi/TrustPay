import api from './api';

export const performanceService = {
  getOverview: async () => {
    const response = await api.get('/performance/overview');
    return response.data.data;
  },

  runBenchmark: async (data) => {
    const response = await api.post('/performance/benchmark', data);
    return response.data.data;
  },

  getCacheConfigs: async () => {
    const response = await api.get('/performance/cache');
    return response.data.data;
  },

  upsertCacheConfig: async (cacheKey, data) => {
    const response = await api.put(`/performance/cache/${cacheKey}`, data);
    return response.data.data;
  },

  runLoadTest: async (data) => {
    const response = await api.post('/performance/load-test', data);
    return response.data.data;
  },

  getReleaseCandidateStatus: async () => {
    const response = await api.get('/performance/release-candidate');
    return response.data.data;
  },
};
