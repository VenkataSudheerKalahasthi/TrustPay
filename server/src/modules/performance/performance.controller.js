const performanceService = require('./performance.service');
const ApiResponse = require('../../utils/ApiResponse');
const asyncHandler = require('../../utils/asyncHandler');

const getOverview = asyncHandler(async (req, res) => {
  const overview = await performanceService.getDashboardOverview();
  return res.status(200).json(new ApiResponse(200, overview, 'Performance overview retrieved successfully'));
});

const runBenchmark = asyncHandler(async (req, res) => {
  const { metricName, targetMs } = req.body;
  const benchmark = await performanceService.runBenchmark(metricName, targetMs);
  return res.status(201).json(new ApiResponse(201, benchmark, 'Performance benchmark executed successfully'));
});

const getCacheConfigs = asyncHandler(async (req, res) => {
  const configs = await performanceService.getCacheConfigurations();
  return res.status(200).json(new ApiResponse(200, configs, 'Cache configurations retrieved'));
});

const upsertCacheConfig = asyncHandler(async (req, res) => {
  const { cacheKey } = req.params;
  const config = await performanceService.upsertCacheConfiguration(cacheKey, req.body);
  return res.status(200).json(new ApiResponse(200, config, 'Cache configuration updated'));
});

const runLoadTest = asyncHandler(async (req, res) => {
  const { scenarioName, concurrentUsers, durationSec } = req.body;
  const result = await performanceService.runLoadTest(scenarioName, concurrentUsers, durationSec);
  return res.status(201).json(new ApiResponse(201, result, 'Load test scenario executed successfully'));
});

const getReleaseCandidateStatus = asyncHandler(async (req, res) => {
  const status = await performanceService.getReleaseCandidateStatus();
  return res.status(200).json(new ApiResponse(200, status, 'Release candidate status retrieved'));
});

module.exports = {
  getOverview,
  runBenchmark,
  getCacheConfigs,
  upsertCacheConfig,
  runLoadTest,
  getReleaseCandidateStatus,
};
