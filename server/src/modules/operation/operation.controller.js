'use strict';

const operationService = require('./operation.service');
const ApiResponse = require('../../utils/ApiResponse');

class OperationController {
  async getOperations(req, res, next) {
    try {
      const operations = await operationService.getOperations();
      return ApiResponse.success(res, { operations }, 'System operation logs retrieved');
    } catch (err) {
      next(err);
    }
  }

  async getBackupJobs(req, res, next) {
    try {
      const backupJobs = await operationService.getBackupJobs();
      return ApiResponse.success(res, { backupJobs }, 'Backup jobs metadata retrieved');
    } catch (err) {
      next(err);
    }
  }

  async getComplianceReports(req, res, next) {
    try {
      const reports = await operationService.getComplianceReports();
      return ApiResponse.success(res, { reports }, 'Compliance reports retrieved');
    } catch (err) {
      next(err);
    }
  }

  async getExportRequests(req, res, next) {
    try {
      const userId = req.user.id;
      const requests = await operationService.getDataExportRequests(userId);
      return ApiResponse.success(res, { exportRequests: requests }, 'Data export requests retrieved');
    } catch (err) {
      next(err);
    }
  }

  async createExportRequest(req, res, next) {
    try {
      const userId = req.user.id;
      const request = await operationService.createExportRequest(userId);
      return ApiResponse.success(res, request, 'Data export request created');
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new OperationController();
