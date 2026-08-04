'use strict';

const adminService = require('./admin.service');
const ApiResponse = require('../../utils/ApiResponse');

class AdminController {
  // Existing Methods
  async getOverviewMetrics(req, res, next) {
    try {
      const metrics = await adminService.getOverviewMetrics();
      return ApiResponse.success(res, { metrics }, 'Executive admin overview metrics retrieved');
    } catch (err) {
      next(err);
    }
  }

  async getAnnouncements(req, res, next) {
    try {
      const announcements = await adminService.getAnnouncements();
      return ApiResponse.success(res, { announcements }, 'Admin announcements retrieved');
    } catch (err) {
      next(err);
    }
  }

  async createAnnouncement(req, res, next) {
    try {
      const createdById = req.user.id;
      const announcement = await adminService.createAnnouncement(createdById, req.body);
      return ApiResponse.success(res, announcement, 'Announcement published');
    } catch (err) {
      next(err);
    }
  }

  async getFeatureFlags(req, res, next) {
    try {
      const flags = await adminService.getFeatureFlags();
      return ApiResponse.success(res, { featureFlags: flags }, 'Feature flags retrieved');
    } catch (err) {
      next(err);
    }
  }

  async toggleFeatureFlag(req, res, next) {
    try {
      const { id } = req.params;
      const { isEnabled } = req.body;
      const updated = await adminService.toggleFeatureFlag(id, isEnabled);
      return ApiResponse.success(res, updated, 'Feature flag status updated');
    } catch (err) {
      next(err);
    }
  }

  async createFeatureFlag(req, res, next) {
    try {
      const flag = await adminService.createFeatureFlag(req.body);
      return ApiResponse.success(res, flag, 'Feature flag created');
    } catch (err) {
      next(err);
    }
  }

  async getPlatformSettings(req, res, next) {
    try {
      const settings = await adminService.getPlatformSettings();
      return ApiResponse.success(res, { settings }, 'Platform settings retrieved');
    } catch (err) {
      next(err);
    }
  }

  async updatePlatformSetting(req, res, next) {
    try {
      const { key, value } = req.body;
      const updated = await adminService.updatePlatformSetting(key, value);
      return ApiResponse.success(res, updated, 'Platform setting updated');
    } catch (err) {
      next(err);
    }
  }

  // Phase 5 Part 1 Administration Handlers
  async searchUsers(req, res, next) {
    try {
      const users = await adminService.searchUsers(req.query.search, req.query.role);
      return ApiResponse.success(res, users, 'User search results retrieved');
    } catch (err) {
      next(err);
    }
  }

  async toggleUserSuspension(req, res, next) {
    try {
      const { userId, isSuspended } = req.body;
      const user = await adminService.toggleUserSuspension(userId, isSuspended, req.user.id);
      return ApiResponse.success(res, user, `User suspension updated to ${isSuspended}`);
    } catch (err) {
      next(err);
    }
  }

  async restrictUser(req, res, next) {
    try {
      const restriction = await adminService.restrictUser(req.body, req.user.id);
      return ApiResponse.success(res, restriction, 'User restriction applied', 201);
    } catch (err) {
      next(err);
    }
  }

  async addUserNote(req, res, next) {
    try {
      const note = await adminService.addUserNote(req.body, req.user.id);
      return ApiResponse.success(res, note, 'Administrative note added', 201);
    } catch (err) {
      next(err);
    }
  }

  async getVerificationReviews(req, res, next) {
    try {
      const reviews = await adminService.getVerificationReviews();
      return ApiResponse.success(res, reviews, 'Verification reviews retrieved');
    } catch (err) {
      next(err);
    }
  }

  async reviewVerification(req, res, next) {
    try {
      const { id } = req.params;
      const { status, notes } = req.body;
      const review = await adminService.reviewVerification(id, req.user.id, status, notes);
      return ApiResponse.success(res, review, 'Verification review updated');
    } catch (err) {
      next(err);
    }
  }

  async getContractsOversight(req, res, next) {
    try {
      const contracts = await adminService.getContractsOversight();
      return ApiResponse.success(res, contracts, 'Contract oversight directory retrieved');
    } catch (err) {
      next(err);
    }
  }

  async updateContractOversight(req, res, next) {
    try {
      const oversight = await adminService.updateContractOversight(req.body, req.user.id);
      return ApiResponse.success(res, oversight, 'Contract oversight updated');
    } catch (err) {
      next(err);
    }
  }

  async getWalletsOversight(req, res, next) {
    try {
      const wallets = await adminService.getWalletsOversight();
      return ApiResponse.success(res, wallets, 'Wallet oversight directory retrieved');
    } catch (err) {
      next(err);
    }
  }

  async updateWalletOversight(req, res, next) {
    try {
      const oversight = await adminService.updateWalletOversight(req.body, req.user.id);
      return ApiResponse.success(res, oversight, 'Wallet oversight updated');
    } catch (err) {
      next(err);
    }
  }

  async executeBulkOperation(req, res, next) {
    try {
      const op = await adminService.executeBulkOperation(req.body, req.user.id);
      return ApiResponse.success(res, op, 'Bulk operation completed', 201);
    } catch (err) {
      next(err);
    }
  }

  async getBulkOperations(req, res, next) {
    try {
      const ops = await adminService.getBulkOperations();
      return ApiResponse.success(res, ops, 'Bulk operations history retrieved');
    } catch (err) {
      next(err);
    }
  }

  async getPlatformMetrics(req, res, next) {
    try {
      const metrics = await adminService.getPlatformMetrics();
      return ApiResponse.success(res, metrics, 'Platform metrics retrieved');
    } catch (err) {
      next(err);
    }
  }

  async getAdminActionHistory(req, res, next) {
    try {
      const history = await adminService.getAdminActionHistory();
      return ApiResponse.success(res, history, 'Admin action audit history retrieved');
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AdminController();
