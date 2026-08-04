'use strict';

const projectService = require('./project.service');
const ApiResponse = require('../../utils/ApiResponse');

class ProjectController {
  _getAuditMeta(req) {
    return {
      requestId: req.id || req.headers['x-request-id'] || null,
      ipAddress: req.ip || req.headers['x-forwarded-for'] || '127.0.0.1',
      userAgent: req.headers['user-agent'] || 'Unknown',
    };
  }

  async createProject(req, res, next) {
    try {
      const userId = req.user.id;
      const role = req.user.role;
      const auditMeta = this._getAuditMeta(req);
      const project = await projectService.createProject(userId, role, req.body, auditMeta);
      return ApiResponse.created(res, project, 'Project created successfully');
    } catch (err) {
      next(err);
    }
  }

  async getProjectById(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const role = req.user.role;
      const project = await projectService.getProjectById(id, userId, role);
      return ApiResponse.success(res, project, 'Project details retrieved successfully');
    } catch (err) {
      next(err);
    }
  }

  async searchProjects(req, res, next) {
    try {
      const userId = req.user.id;
      const role = req.user.role;
      const result = await projectService.searchProjects(userId, role, req.query);
      return ApiResponse.success(res, result, 'Projects retrieved successfully');
    } catch (err) {
      next(err);
    }
  }

  async updateProject(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const role = req.user.role;
      const auditMeta = this._getAuditMeta(req);
      const project = await projectService.updateProject(id, userId, role, req.body, auditMeta);
      return ApiResponse.success(res, project, 'Project updated successfully');
    } catch (err) {
      next(err);
    }
  }

  async updateProjectStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status, reason } = req.body;
      const userId = req.user.id;
      const role = req.user.role;
      const auditMeta = this._getAuditMeta(req);
      const project = await projectService.updateProjectStatus(id, userId, role, status, reason, auditMeta);
      return ApiResponse.success(res, project, `Project status changed to ${status}`);
    } catch (err) {
      next(err);
    }
  }

  async addMilestone(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const role = req.user.role;
      const auditMeta = this._getAuditMeta(req);
      const milestone = await projectService.addMilestone(id, userId, role, req.body, auditMeta);
      return ApiResponse.created(res, milestone, 'Milestone created successfully');
    } catch (err) {
      next(err);
    }
  }

  async updateMilestone(req, res, next) {
    try {
      const { id, milestoneId } = req.params;
      const userId = req.user.id;
      const role = req.user.role;
      const auditMeta = this._getAuditMeta(req);
      const milestone = await projectService.updateMilestone(id, milestoneId, userId, role, req.body, auditMeta);
      return ApiResponse.success(res, milestone, 'Milestone updated successfully');
    } catch (err) {
      next(err);
    }
  }

  async deleteMilestone(req, res, next) {
    try {
      const { id, milestoneId } = req.params;
      const userId = req.user.id;
      const role = req.user.role;
      const auditMeta = this._getAuditMeta(req);
      await projectService.deleteMilestone(id, milestoneId, userId, role, auditMeta);
      return ApiResponse.success(res, null, 'Milestone deleted successfully');
    } catch (err) {
      next(err);
    }
  }

  async addDeliverable(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const role = req.user.role;
      const auditMeta = this._getAuditMeta(req);
      const deliverable = await projectService.addDeliverable(id, userId, role, req.body, auditMeta);
      return ApiResponse.created(res, deliverable, 'Deliverable created successfully');
    } catch (err) {
      next(err);
    }
  }

  async submitDeliverable(req, res, next) {
    try {
      const { id, deliverableId } = req.params;
      const userId = req.user.id;
      const role = req.user.role;
      const auditMeta = this._getAuditMeta(req);
      const result = await projectService.submitDeliverable(id, deliverableId, userId, role, req.body, auditMeta);
      return ApiResponse.success(res, result, 'Deliverable submitted successfully with new immutable version');
    } catch (err) {
      next(err);
    }
  }

  async reviewDeliverable(req, res, next) {
    try {
      const { id, deliverableId } = req.params;
      const userId = req.user.id;
      const role = req.user.role;
      const auditMeta = this._getAuditMeta(req);
      const result = await projectService.reviewDeliverable(id, deliverableId, userId, role, req.body, auditMeta);
      return ApiResponse.success(res, result, `Deliverable status updated to ${req.body.status}`);
    } catch (err) {
      next(err);
    }
  }

  async uploadEvidence(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const role = req.user.role;
      const auditMeta = this._getAuditMeta(req);
      const evidence = await projectService.uploadEvidence(id, userId, role, req.body, auditMeta);
      return ApiResponse.created(res, evidence, 'Evidence recorded with cryptographic integrity hash');
    } catch (err) {
      next(err);
    }
  }

  async uploadAttachment(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const role = req.user.role;
      const auditMeta = this._getAuditMeta(req);
      const attachment = await projectService.uploadAttachment(id, userId, role, req.body, auditMeta);
      return ApiResponse.created(res, attachment, 'Attachment uploaded successfully');
    } catch (err) {
      next(err);
    }
  }

  async addComment(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const role = req.user.role;
      const comment = await projectService.addComment(id, userId, role, req.body);
      return ApiResponse.created(res, comment, 'Comment added successfully');
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ProjectController();
