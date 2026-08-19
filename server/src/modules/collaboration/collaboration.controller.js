'use strict';

const collaborationService = require('./collaboration.service');
const collaborationRepository = require('./collaboration.repository');

class CollaborationController {
  async requestCollaboration(req, res) {
    const result = await collaborationService.requestCollaboration(req.user.id, req.body);
    res.status(201).json({
      success: true,
      message: 'Collaboration request sent successfully',
      data: result,
    });
  }

  async getRequests(req, res) {
    const requests = await collaborationService.getRequests(req.user.id);
    res.json({
      success: true,
      data: requests,
    });
  }

  async getRequestById(req, res) {
    const request = await collaborationService.getRequestById(req.user.id, req.params.id);
    res.json({
      success: true,
      data: request,
    });
  }

  async respondToRequest(req, res) {
    const { action, rejectionReason } = req.body;
    const result = await collaborationService.respondToRequest(req.user.id, req.params.id, {
      action,
      rejectionReason,
    });
    res.json({
      success: true,
      message: `Collaboration request ${action.toLowerCase()}ed successfully`,
      data: result,
    });
  }

  async getWorkspaces(req, res) {
    const workspaces = await collaborationService.getWorkspaces(req.user.id);
    res.json({
      success: true,
      data: workspaces,
    });
  }

  async getWorkspaceById(req, res) {
    const workspace = await collaborationService.getWorkspaceById(req.user.id, req.params.id);
    res.json({
      success: true,
      data: workspace,
    });
  }

  async updatePlanningBoard(req, res) {
    const result = await collaborationService.updatePlanningBoard(req.user.id, req.params.id, req.body);
    res.json({
      success: true,
      message: 'Planning board updated successfully',
      data: result,
    });
  }

  async signContract(req, res) {
    const result = await collaborationService.signContract(req.user.id, req.params.id, req.body);
    res.json({
      success: true,
      message: 'Electronic signature recorded successfully',
      data: result,
    });
  }

  async fundEscrow(req, res) {
    const result = await collaborationService.fundEscrow(req.user.id, req.params.id, req.body);
    res.json({
      success: true,
      message: 'Escrow funded successfully',
      data: result,
    });
  }

  async updateExecutionProgress(req, res) {
    const result = await collaborationService.updateExecutionProgress(req.user.id, req.params.id, req.body);
    res.json({
      success: true,
      message: 'Execution progress updated successfully',
      data: result,
    });
  }

  async approveFinalDelivery(req, res) {
    const result = await collaborationService.approveFinalDelivery(req.user.id, req.params.id);
    res.json({
      success: true,
      message: 'Final delivery approved and Escrow funds released',
      data: result,
    });
  }

  async getCertificate(req, res) {
    const cert = await collaborationRepository.getCertificateByWorkspaceId(req.params.id);
    if (!cert) {
      return res.status(404).json({ success: false, message: 'Certificate not generated yet' });
    }
    res.json({
      success: true,
      data: cert,
    });
  }
}

module.exports = new CollaborationController();
