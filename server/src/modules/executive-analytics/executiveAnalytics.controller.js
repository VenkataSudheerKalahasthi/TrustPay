const executiveAnalyticsService = require('./executiveAnalytics.service');
const ApiResponse = require('../../utils/ApiResponse');
const asyncHandler = require('../../utils/asyncHandler');

const getOverview = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const overview = await executiveAnalyticsService.getExecutiveDashboardOverview(userId);
  return res.status(200).json(new ApiResponse(200, overview, 'Executive overview retrieved successfully'));
});

const getDashboards = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const dashboards = await executiveAnalyticsService.getUserDashboards(userId);
  return res.status(200).json(new ApiResponse(200, dashboards, 'User dashboards retrieved successfully'));
});

const createDashboard = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const dashboard = await executiveAnalyticsService.createDashboard(userId, req.body);
  return res.status(201).json(new ApiResponse(201, dashboard, 'Executive dashboard created successfully'));
});

const updateDashboard = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const dashboard = await executiveAnalyticsService.updateDashboard(id, req.body);
  return res.status(200).json(new ApiResponse(200, dashboard, 'Dashboard updated successfully'));
});

const deleteDashboard = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await executiveAnalyticsService.deleteDashboard(id);
  return res.status(200).json(new ApiResponse(200, null, 'Dashboard deleted successfully'));
});

const getReports = asyncHandler(async (req, res) => {
  const reports = await executiveAnalyticsService.getReports(req.query.visibility || 'ADMIN');
  return res.status(200).json(new ApiResponse(200, reports, 'Executive reports retrieved successfully'));
});

const getReportById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const report = await executiveAnalyticsService.getReportById(id);
  return res.status(200).json(new ApiResponse(200, report, 'Executive report details retrieved'));
});

const createReport = asyncHandler(async (req, res) => {
  const authorId = req.user.id;
  const report = await executiveAnalyticsService.createReport(authorId, req.body);
  return res.status(201).json(new ApiResponse(201, report, 'Executive report generated successfully'));
});

const exportReport = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { format } = req.body;
  const exportRecord = await executiveAnalyticsService.exportReport(id, format || 'PDF');
  return res.status(200).json(new ApiResponse(200, exportRecord, 'Executive report export ready'));
});

const getSubscriptions = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const subs = await executiveAnalyticsService.getUserSubscriptions(userId);
  return res.status(200).json(new ApiResponse(200, subs, 'Report subscriptions retrieved'));
});

const createSubscription = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const sub = await executiveAnalyticsService.createSubscription(userId, req.body);
  return res.status(201).json(new ApiResponse(201, sub, 'Report subscription created successfully'));
});

const getKPIBenchmarks = asyncHandler(async (req, res) => {
  const benchmarks = await executiveAnalyticsService.getKPIBenchmarks();
  return res.status(200).json(new ApiResponse(200, benchmarks, 'KPI benchmarks retrieved'));
});

const upsertKPIBenchmark = asyncHandler(async (req, res) => {
  const { code } = req.params;
  const benchmark = await executiveAnalyticsService.upsertKPIBenchmark(code, req.body);
  return res.status(200).json(new ApiResponse(200, benchmark, 'KPI benchmark updated'));
});

const getAlerts = asyncHandler(async (req, res) => {
  const alerts = await executiveAnalyticsService.getExecutiveAlerts();
  return res.status(200).json(new ApiResponse(200, alerts, 'Executive alerts retrieved'));
});

const createAlert = asyncHandler(async (req, res) => {
  const alert = await executiveAnalyticsService.createExecutiveAlert(req.body);
  return res.status(201).json(new ApiResponse(201, alert, 'Executive alert created'));
});

const getAIInsight = asyncHandler(async (req, res) => {
  const insight = await executiveAnalyticsService.getAIExecutiveInsight(req.query.reportKey || 'GLOBAL_EXECUTIVE_SUMMARY');
  return res.status(200).json(new ApiResponse(200, insight, 'AI Executive Insight retrieved'));
});

const getExecutionLogs = asyncHandler(async (req, res) => {
  const logs = await executiveAnalyticsService.getExecutionLogs();
  return res.status(200).json(new ApiResponse(200, logs, 'Report execution logs retrieved'));
});

module.exports = {
  getOverview,
  getDashboards,
  createDashboard,
  updateDashboard,
  deleteDashboard,
  getReports,
  getReportById,
  createReport,
  exportReport,
  getSubscriptions,
  createSubscription,
  getKPIBenchmarks,
  upsertKPIBenchmark,
  getAlerts,
  createAlert,
  getAIInsight,
  getExecutionLogs,
};
