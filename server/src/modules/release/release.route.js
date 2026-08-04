const express = require('express');
const router = express.Router();
const releaseController = require('./release.controller');
const { authenticate, authorize } = require('../../middlewares/auth');
const { validate } = require('../../middlewares/validate');
const {
  releaseCertificationSchema,
  executeRegressionSchema,
  securityScanSchema,
  approveDeploymentSchema,
  createSignoffSchema,
} = require('../../../../shared/src/validators/release.validator');

router.use(authenticate);
router.use(authorize('ADMIN'));

router.get('/overview', releaseController.getOverview);
router.post('/certify', validate(releaseCertificationSchema), releaseController.certifyRelease);
router.post('/regression', validate(executeRegressionSchema), releaseController.runRegressionSuite);
router.post('/security-scan', validate(securityScanSchema), releaseController.runSecurityScan);
router.post('/approve-deployment', validate(approveDeploymentSchema), releaseController.approveDeployment);
router.post('/signoff', validate(createSignoffSchema), releaseController.createSignoff);

module.exports = router;
