const releaseService = require('./release.service');
const ApiResponse = require('../../utils/ApiResponse');
const asyncHandler = require('../../utils/asyncHandler');

const getOverview = asyncHandler(async (req, res) => {
  const overview = await releaseService.getReleaseOverview();
  return res.status(200).json(new ApiResponse(200, overview, 'Release overview retrieved successfully'));
});

const certifyRelease = asyncHandler(async (req, res) => {
  const { version, stage } = req.body;
  const cert = await releaseService.certifyRelease(version, stage);
  return res.status(200).json(new ApiResponse(200, cert, 'Release certified successfully'));
});

const runRegressionSuite = asyncHandler(async (req, res) => {
  const { suiteName, totalTests } = req.body;
  const suite = await releaseService.runRegressionSuite(suiteName, totalTests);
  return res.status(201).json(new ApiResponse(201, suite, 'Regression test suite executed successfully'));
});

const runSecurityScan = asyncHandler(async (req, res) => {
  const { scanType } = req.body;
  const scan = await releaseService.runSecurityScan(scanType);
  return res.status(201).json(new ApiResponse(201, scan, 'Security scan completed successfully'));
});

const approveDeployment = asyncHandler(async (req, res) => {
  const { approver, role } = req.body;
  const approval = await releaseService.approveDeployment(approver, role);
  return res.status(201).json(new ApiResponse(201, approval, 'Deployment approved successfully'));
});

const createSignoff = asyncHandler(async (req, res) => {
  const { stakeholder, role } = req.body;
  const signoff = await releaseService.createSignoff(stakeholder, role);
  return res.status(201).json(new ApiResponse(201, signoff, 'Release sign-off recorded successfully'));
});

module.exports = {
  getOverview,
  certifyRelease,
  runRegressionSuite,
  runSecurityScan,
  approveDeployment,
  createSignoff,
};
