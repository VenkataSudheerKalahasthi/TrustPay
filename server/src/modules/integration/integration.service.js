'use strict';

const integrationRepository = require('./integration.repository');

class IntegrationService {
  async getIntegrations(userId) {
    return integrationRepository.getIntegrations(userId);
  }

  async toggleStatus(id, status) {
    return integrationRepository.toggleIntegrationStatus(id, status);
  }

  async connectIntegration(integrationId, userId, credentialData) {
    return integrationRepository.saveCredentials(integrationId, userId, credentialData);
  }
}

module.exports = new IntegrationService();
