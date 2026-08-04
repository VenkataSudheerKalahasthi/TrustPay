'use strict';

const operationRepository = require('./operation.repository');

class OperationService {
  async getOperations() {
    return operationRepository.getOperations();
  }

  async getBackupJobs() {
    return operationRepository.getBackupJobs();
  }

  async getComplianceReports() {
    return operationRepository.getComplianceReports();
  }

  async getDataExportRequests(userId) {
    return operationRepository.getDataExportRequests(userId);
  }

  async createExportRequest(userId) {
    return operationRepository.createExportRequest(userId);
  }
}

module.exports = new OperationService();
