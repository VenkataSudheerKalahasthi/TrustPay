'use strict';

const organizationService = require('./organization.service');
const ApiResponse = require('../../utils/ApiResponse');

class OrganizationController {
  async createOrganization(req, res, next) {
    try {
      const userId = req.user.id;
      const org = await organizationService.createOrganization(userId, req.body);
      return ApiResponse.success(res, org, 'Organization created successfully');
    } catch (err) {
      next(err);
    }
  }

  async getOrganizations(req, res, next) {
    try {
      const userId = req.user.id;
      const organizations = await organizationService.getUserOrganizations(userId);
      return ApiResponse.success(res, { organizations }, 'Organizations retrieved');
    } catch (err) {
      next(err);
    }
  }

  async getOrganization(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const org = await organizationService.getOrganization(id, userId);
      return ApiResponse.success(res, { organization: org }, 'Organization details retrieved');
    } catch (err) {
      next(err);
    }
  }

  async inviteMember(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const invitation = await organizationService.inviteMember(id, userId, req.body);
      return ApiResponse.success(res, invitation, 'Member invitation sent');
    } catch (err) {
      next(err);
    }
  }

  async createWorkspace(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const workspace = await organizationService.createWorkspace(id, userId, req.body);
      return ApiResponse.success(res, workspace, 'Workspace created');
    } catch (err) {
      next(err);
    }
  }

  async updateMemberRole(req, res, next) {
    try {
      const { id, memberUserId } = req.params;
      const userId = req.user.id;
      const { role } = req.body;
      await organizationService.updateMemberRole(id, userId, memberUserId, role);
      return ApiResponse.success(res, { success: true }, 'Member role updated');
    } catch (err) {
      next(err);
    }
  }

  async removeMember(req, res, next) {
    try {
      const { id, memberUserId } = req.params;
      const userId = req.user.id;
      await organizationService.removeMember(id, userId, memberUserId);
      return ApiResponse.success(res, { success: true }, 'Member removed from organization');
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new OrganizationController();
