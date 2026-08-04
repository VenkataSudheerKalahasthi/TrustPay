'use strict';

const express = require('express');
const integrationController = require('./integration.controller');
const { authenticate } = require('../../middlewares/auth');
const { validate } = require('../../middlewares/validate');
const { createApiKeySchema, createWebhookSchema } = require('../../../../shared/src/validators/adminOrg.validator');

const router = express.Router();

router.use(authenticate);

// Integrations Hub Directory
router.get('/', integrationController.getIntegrations.bind(integrationController));
router.patch('/:id/status', integrationController.toggleIntegration.bind(integrationController));
router.post('/:id/connect', integrationController.connectIntegration.bind(integrationController));

// API Keys
router.get('/api-keys', integrationController.getApiKeys.bind(integrationController));
router.post('/api-keys', validate({ body: createApiKeySchema }), integrationController.generateApiKey.bind(integrationController));
router.delete('/api-keys/:id', integrationController.revokeApiKey.bind(integrationController));

// Webhooks
router.get('/webhooks', integrationController.getWebhooks.bind(integrationController));
router.post('/webhooks', validate({ body: createWebhookSchema }), integrationController.registerWebhook.bind(integrationController));
router.delete('/webhooks/:id', integrationController.deleteWebhook.bind(integrationController));
router.post('/webhooks/:id/test', integrationController.testWebhook.bind(integrationController));

module.exports = router;
