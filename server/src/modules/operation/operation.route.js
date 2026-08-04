'use strict';

const express = require('express');
const operationController = require('./operation.controller');
const { authenticate } = require('../../middlewares/auth');

const router = express.Router();

router.use(authenticate);

router.get('/logs', operationController.getOperations.bind(operationController));
router.get('/backups', operationController.getBackupJobs.bind(operationController));
router.get('/compliance', operationController.getComplianceReports.bind(operationController));
router.get('/exports', operationController.getExportRequests.bind(operationController));
router.post('/exports', operationController.createExportRequest.bind(operationController));

module.exports = router;
