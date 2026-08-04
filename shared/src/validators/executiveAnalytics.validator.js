const { z } = require('zod');

const createDashboardSchema = z.object({
  title: z.string().min(2, 'Dashboard title must be at least 2 characters'),
  type: z.enum(['EXECUTIVE', 'OPERATIONS', 'FINANCE', 'MARKETPLACE', 'WORKFORCE', 'SUPPORT', 'CUSTOM']).optional(),
  isDefault: z.boolean().optional(),
  layoutJson: z.string().optional(),
});

const updateDashboardSchema = createDashboardSchema.partial();

const configureWidgetSchema = z.object({
  dashboardId: z.string().min(1, 'Dashboard ID is required'),
  title: z.string().min(2, 'Widget title is required'),
  type: z.enum(['KPI', 'LINE_CHART', 'BAR_CHART', 'PIE_CHART', 'AREA_CHART', 'TABLE', 'HEATMAP']),
  metricKey: z.string().min(1, 'Metric key is required'),
  settingsJson: z.string().optional(),
  positionX: z.number().int().optional(),
  positionY: z.number().int().optional(),
  width: z.number().int().optional(),
  height: z.number().int().optional(),
});

const createExecutiveReportSchema = z.object({
  title: z.string().min(2, 'Report title is required'),
  visibility: z.enum(['PRIVATE', 'ORGANIZATION', 'ADMIN']).optional(),
  summary: z.string().optional(),
  sections: z.array(z.object({
    title: z.string(),
    orderIndex: z.number().int().optional(),
    contentJson: z.string(),
  })).optional(),
});

const scheduleReportSchema = z.object({
  frequency: z.enum(['DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY']).optional(),
  format: z.enum(['PDF', 'XLSX', 'CSV', 'JSON']).optional(),
  email: z.string().email('Valid email is required'),
});

const createKPIBenchmarkSchema = z.object({
  kpiCode: z.string().min(2, 'KPI code is required'),
  name: z.string().min(2, 'KPI name is required'),
  targetValue: z.number(),
  warningValue: z.number(),
  status: z.enum(['ABOVE_TARGET', 'ON_TARGET', 'BELOW_TARGET']).optional(),
  unit: z.string().optional(),
});

const exportReportSchema = z.object({
  reportId: z.string().min(1, 'Report ID is required'),
  format: z.enum(['PDF', 'XLSX', 'CSV', 'JSON']),
});

const createExecutiveAlertSchema = z.object({
  title: z.string().min(2, 'Alert title is required'),
  metricKey: z.string().min(1, 'Metric key is required'),
  severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
  message: z.string().min(2, 'Message is required'),
});

module.exports = {
  createDashboardSchema,
  updateDashboardSchema,
  configureWidgetSchema,
  createExecutiveReportSchema,
  scheduleReportSchema,
  createKPIBenchmarkSchema,
  exportReportSchema,
  createExecutiveAlertSchema,
};
