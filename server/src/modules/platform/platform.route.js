'use strict';

const express = require('express');
const platformController = require('./platform.controller');
const { authenticate } = require('../../middlewares/auth');
const { validate } = require('../../middlewares/validate');
const {
  setPlatformConfigSchema,
  createMaintenanceScheduleSchema,
  createApplicationVersionSchema,
  createReleaseNoteSchema,
  runDiagnosticSchema,
} = require('../../../../shared/src/validators/platform.validator');

const router = express.Router();

router.use(authenticate);

// Configurations
router.get('/configuration', platformController.getConfigurations.bind(platformController));
router.post('/configuration', validate({ body: setPlatformConfigSchema }), platformController.setConfiguration.bind(platformController));
router.get('/configuration/modules', platformController.getModuleConfigurations.bind(platformController));

// Health
router.get('/health', platformController.getHealthStatus.bind(platformController));
router.get('/health/history', platformController.getHealthHistory.bind(platformController));

// Diagnostics
router.post('/diagnostics/run', validate({ body: runDiagnosticSchema }), platformController.runDiagnostics.bind(platformController));
router.get('/diagnostics/history', platformController.getDiagnosticHistory.bind(platformController));

// Releases & Versions
router.get('/releases/versions', platformController.getVersions.bind(platformController));
router.post('/releases/versions', validate({ body: createApplicationVersionSchema }), platformController.createVersion.bind(platformController));
router.post('/releases/notes', validate({ body: createReleaseNoteSchema }), platformController.addReleaseNote.bind(platformController));

// Governance & Maintenance
router.get('/governance/summary', platformController.getGovernanceSummary.bind(platformController));
router.get('/runbooks', platformController.getRunbooks.bind(platformController));
router.get('/maintenance', platformController.getMaintenanceSchedules.bind(platformController));
router.post('/maintenance', validate({ body: createMaintenanceScheduleSchema }), platformController.scheduleMaintenance.bind(platformController));

module.exports = router;
