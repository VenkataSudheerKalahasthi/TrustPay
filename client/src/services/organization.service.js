import api from './api';

export const organizationService = {
  createOrganization: async (data) => {
    const response = await api.post('/organizations', data);
    return response.data.data;
  },

  getOrganizations: async () => {
    const response = await api.get('/organizations');
    return response.data.data;
  },

  getOrganization: async (id) => {
    const response = await api.get(`/organizations/${id}`);
    return response.data.data;
  },

  inviteMember: async (orgId, data) => {
    const response = await api.post(`/organizations/${orgId}/invite`, data);
    return response.data.data;
  },

  updateMemberRole: async (orgId, memberUserId, role) => {
    const response = await api.patch(`/organizations/${orgId}/members/${memberUserId}/role`, { role });
    return response.data.data;
  },

  removeMember: async (orgId, memberUserId) => {
    const response = await api.delete(`/organizations/${orgId}/members/${memberUserId}`);
    return response.data.data;
  },

  createWorkspace: async (orgId, data) => {
    const response = await api.post(`/organizations/${orgId}/workspaces`, data);
    return response.data.data;
  },
};
