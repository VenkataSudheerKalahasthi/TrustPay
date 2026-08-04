'use strict';

const integrationService = require('./integration.service');
const apiKeyService = require('./apiKey.service');
const webhookService = require('./webhook.service');
const ApiResponse = require('../../utils/ApiResponse');

class IntegrationController {
  // Integrations Directory
  async getIntegrations(req, res, next) {
    try {
      const userId = req.user.id;
      const integrations = await integrationService.getIntegrations(userId);
      return ApiResponse.success(res, { integrations }, 'Integrations directory retrieved');
    } catch (err) {
      next(err);
    }
  }

  async toggleIntegration(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const updated = await integrationService.toggleStatus(id, status);
      return ApiResponse.success(res, updated, 'Integration status updated');
    } catch (err) {
      next(err);
    }
  }

  async connectIntegration(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const creds = await integrationService.connectIntegration(id, userId, req.body);
      return ApiResponse.success(res, creds, 'Integration OAuth connected');
    } catch (err) {
      next(err);
    }
  }

  // API Keys
  async getApiKeys(req, res, next) {
    try {
      const userId = req.user.id;
      const keys = await apiKeyService.getUserApiKeys(userId);
      return ApiResponse.success(res, { apiKeys: keys }, 'User API keys retrieved');
    } catch (err) {
      next(err);
    }
  }

  async generateApiKey(req, res, next) {
    try {
      const userId = req.user.id;
      const result = await apiKeyService.generateApiKey(userId, req.body);
      return ApiResponse.success(res, result, 'API key generated (Save this rawKey safely!)');
    } catch (err) {
      next(err);
    }
  }

  async revokeApiKey(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      await apiKeyService.revokeApiKey(id, userId);
      return ApiResponse.success(res, { success: true }, 'API key revoked');
    } catch (err) {
      next(err);
    }
  }

  // Webhooks
  async getWebhooks(req, res, next) {
    try {
      const userId = req.user.id;
      const webhooks = await webhookService.getUserWebhooks(userId);
      return ApiResponse.success(res, { webhooks }, 'Webhooks retrieved');
    } catch (err) {
      next(err);
    }
  }

  async registerWebhook(req, res, next) {
    try {
      const userId = req.user.id;
      const webhook = await webhookService.registerWebhook(userId, req.body);
      return ApiResponse.success(res, webhook, 'Webhook registered');
    } catch (err) {
      next(err);
    }
  }

  async deleteWebhook(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      await webhookService.deleteWebhook(id, userId);
      return ApiResponse.success(res, { success: true }, 'Webhook deleted');
    } catch (err) {
      next(err);
    }
  }

  async testWebhook(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const delivery = await webhookService.testWebhook(id, userId);
      return ApiResponse.success(res, delivery, 'Test webhook dispatched');
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new IntegrationController();
