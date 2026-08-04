import api from './api';

export const projectService = {
  searchProjects: async (params = {}) => {
    const response = await api.get('/projects', { params });
    return response.data.data;
  },

  getProjectById: async (id) => {
    const response = await api.get(`/projects/${id}`);
    return response.data.data;
  },

  createProject: async (projectData) => {
    const response = await api.post('/projects', projectData);
    return response.data.data;
  },

  updateProject: async (id, updateData) => {
    const response = await api.put(`/projects/${id}`, updateData);
    return response.data.data;
  },

  updateProjectStatus: async (id, status, reason = '') => {
    const response = await api.patch(`/projects/${id}/status`, { status, reason });
    return response.data.data;
  },

  addMilestone: async (projectId, milestoneData) => {
    const response = await api.post(`/projects/${projectId}/milestones`, milestoneData);
    return response.data.data;
  },

  updateMilestone: async (projectId, milestoneId, updateData) => {
    const response = await api.put(`/projects/${projectId}/milestones/${milestoneId}`, updateData);
    return response.data.data;
  },

  deleteMilestone: async (projectId, milestoneId) => {
    const response = await api.delete(`/projects/${projectId}/milestones/${milestoneId}`);
    return response.data.data;
  },

  addDeliverable: async (projectId, deliverableData) => {
    const response = await api.post(`/projects/${projectId}/deliverables`, deliverableData);
    return response.data.data;
  },

  submitDeliverable: async (projectId, deliverableId, submissionData) => {
    const response = await api.post(`/projects/${projectId}/deliverables/${deliverableId}/submit`, submissionData);
    return response.data.data;
  },

  reviewDeliverable: async (projectId, deliverableId, reviewData) => {
    const response = await api.patch(`/projects/${projectId}/deliverables/${deliverableId}/review`, reviewData);
    return response.data.data;
  },

  uploadEvidence: async (projectId, evidenceData) => {
    const response = await api.post(`/projects/${projectId}/evidence`, evidenceData);
    return response.data.data;
  },

  uploadAttachment: async (projectId, attachmentData) => {
    const response = await api.post(`/projects/${projectId}/attachments`, attachmentData);
    return response.data.data;
  },

  addComment: async (projectId, commentData) => {
    const response = await api.post(`/projects/${projectId}/comments`, commentData);
    return response.data.data;
  },
};
