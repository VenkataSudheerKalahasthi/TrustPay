import api from './api';

export const collaborationService = {
  // Send Collaboration Request
  async requestCollaboration(payload) {
    const response = await api.post('/collaboration/requests', payload);
    return response.data;
  },

  // Get Requests for current user
  async getRequests() {
    const response = await api.get('/collaboration/requests');
    return response.data.data;
  },

  // Get single Request
  async getRequestById(id) {
    const response = await api.get(`/collaboration/requests/${id}`);
    return response.data.data;
  },

  // Respond to Request (ACCEPT / REJECT)
  async respondToRequest(id, action, rejectionReason = '') {
    const response = await api.post(`/collaboration/requests/${id}/respond`, {
      action,
      rejectionReason,
    });
    return response.data;
  },

  // Get Workspaces
  async getWorkspaces() {
    const response = await api.get('/collaboration/workspaces');
    return response.data.data;
  },

  // Get Workspace details by ID
  async getWorkspaceById(id) {
    const response = await api.get(`/collaboration/workspaces/${id}`);
    return response.data.data;
  },

  // Update Planning Board
  async updatePlanningBoard(workspaceId, data) {
    const response = await api.put(`/collaboration/workspaces/${workspaceId}/planning-board`, data);
    return response.data.data;
  },

  // Sign Digital Contract
  async signContract(workspaceId, signatureType, signatureData) {
    const response = await api.post(`/collaboration/workspaces/${workspaceId}/sign-contract`, {
      signatureType,
      signatureData,
    });
    return response.data.data;
  },

  // Fund Escrow
  async fundEscrow(workspaceId, amount) {
    const response = await api.post(`/collaboration/workspaces/${workspaceId}/fund-escrow`, { amount });
    return response.data.data;
  },

  // Update Execution Progress
  async updateExecutionProgress(workspaceId, payload) {
    const response = await api.post(`/collaboration/workspaces/${workspaceId}/execution-progress`, payload);
    return response.data.data;
  },

  // Approve Final Delivery & Release Escrow
  async approveFinalDelivery(workspaceId) {
    const response = await api.post(`/collaboration/workspaces/${workspaceId}/approve-completion`);
    return response.data;
  },

  // Get Certificate
  async getCertificate(workspaceId) {
    const response = await api.get(`/collaboration/workspaces/${workspaceId}/certificate`);
    return response.data.data;
  },
};
