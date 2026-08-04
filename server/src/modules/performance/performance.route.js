const express = require('express');
const router = express.Router();
const performanceController = require('./performance.controller');
const { authenticate, authorize } = require('../../middlewares/auth');
const { validate } = require('../../middlewares/validate');
const {
  executeBenchmarkSchema,
  cacheConfigSchema,
  runLoadTestSchema,
} = require('../../../../shared/src/validators/performance.validator');

router.use(authenticate);
router.use(authorize('ADMIN'));

router.get('/overview', performanceController.getOverview);
router.post('/benchmark', validate(executeBenchmarkSchema), performanceController.runBenchmark);
router.get('/cache', performanceController.getCacheConfigs);
router.put('/cache/:cacheKey', validate(cacheConfigSchema), performanceController.upsertCacheConfig);
router.post('/load-test', validate(runLoadTestSchema), performanceController.runLoadTest);
router.get('/release-candidate', performanceController.getReleaseCandidateStatus);

module.exports = router;
