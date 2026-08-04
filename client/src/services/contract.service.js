import api from './api';

export const contractService = {
  getTemplates: async () => {
    const response = await api.get('/contracts/templates');
    return response.data.data;
  },

  searchContracts: async (params) => {
    const response = await api.get('/contracts', { params });
    return response.data.data;
  },

  getContractById: async (id) => {
    const response = await api.get(`/contracts/${id}`);
    return response.data.data;
  },

  createContract: async (contractData) => {
    const response = await api.post('/contracts', contractData);
    return response.data.data;
  },

  updateContract: async (id, updateData) => {
    const response = await api.put(`/contracts/${id}`, updateData);
    return response.data.data;
  },

  signContract: async (id, signatureData = {}) => {
    const response = await api.post(`/contracts/${id}/sign`, signatureData);
    return response.data.data;
  },

  updateStatus: async (id, status, reason) => {
    const response = await api.patch(`/contracts/${id}/status`, { status, reason });
    return response.data.data;
  },

  downloadPdf: async (id) => {
    const response = await api.get(`/contracts/${id}/pdf`, {
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `contract-${id}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  },
};
