'use strict';

const adminRepository = require('./admin.repository');
const featureFlagService = require('./featureFlag.service');
const userAdministrationService = require('./userAdministration.service');
const contractAdministrationService = require('./contractAdministration.service');
const walletAdministrationService = require('./walletAdministration.service');
const bulkOperationService = require('./bulkOperation.service');
const platformMonitoringService = require('./platformMonitoring.service');

class AdminService {
  // Existing Methods
  async getOverviewMetrics() {
    return adminRepository.getOverviewMetrics();
  }

  async createAnnouncement(createdById, data) {
    return adminRepository.createAnnouncement(createdById, data);
  }

  async getAnnouncements() {
    return adminRepository.getAnnouncements();
  }

  async getFeatureFlags() {
    return featureFlagService.getFeatureFlags();
  }

  async toggleFeatureFlag(id, isEnabled) {
    return featureFlagService.toggleFlag(id, isEnabled);
  }

  async createFeatureFlag(data) {
    return featureFlagService.createFlag(data);
  }

  async getPlatformSettings() {
    return adminRepository.getPlatformSettings();
  }

  async updatePlatformSetting(key, value) {
    return adminRepository.updatePlatformSetting(key, value);
  }

  // Phase 5 Part 1 Delegated Sub-Services
  async searchUsers(search, role) {
    return userAdministrationService.searchUsers(search, role);
  }

  async toggleUserSuspension(userId, isSuspended, adminId) {
    return userAdministrationService.toggleUserSuspension(userId, isSuspended, adminId);
  }

  async restrictUser(data, adminId) {
    return userAdministrationService.restrictUser(data, adminId);
  }

  async addUserNote(data, adminId) {
    return userAdministrationService.addUserNote(data, adminId);
  }

  async getVerificationReviews() {
    return userAdministrationService.getVerificationReviews();
  }

  async reviewVerification(id, reviewerId, status, notes) {
    return userAdministrationService.reviewVerification(id, reviewerId, status, notes);
  }

  async getContractsOversight() {
    return contractAdministrationService.getContractsOversight();
  }

  async updateContractOversight(data, adminId) {
    return contractAdministrationService.updateContractOversight(data, adminId);
  }

  async getWalletsOversight() {
    return walletAdministrationService.getWalletsOversight();
  }

  async updateWalletOversight(data, adminId) {
    return walletAdministrationService.updateWalletOversight(data, adminId);
  }

  async executeBulkOperation(data, adminId) {
    return bulkOperationService.executeBulkOperation(data, adminId);
  }

  async getBulkOperations() {
    return bulkOperationService.getBulkOperations();
  }

  async getPlatformMetrics() {
    return platformMonitoringService.getMetrics();
  }

  async getAdminActionHistory() {
    return adminRepository.getAdminActionHistory();
  }
}

module.exports = new AdminService();
