'use strict';

const { z } = require('zod');

// Existing schemas
const analyticsQuerySchema = z.object({
  period: z.enum(['7d', '30d', '90d', '1y']).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

const reportGenerationSchema = z.object({
  format: z.enum(['PDF', 'CSV', 'EXCEL']).optional(),
  type: z.string().optional(),
});

const updateDashboardPreferenceSchema = z.object({
  layout: z.string().optional(),
  theme: z.string().optional(),
});

// Phase 4 Part 6 BI Schemas
const createExecutiveDashboardSchema = z.object({
  title: z.string().min(2, 'Dashboard title must be at least 2 characters'),
  description: z.string().optional(),
  visibility: z.enum(['PRIVATE', 'ORGANIZATION', 'ADMIN']).optional(),
  isDefault: z.boolean().optional(),
});

const createDashboardWidgetSchema = z.object({
  dashboardId: z.string().min(1, 'Dashboard ID is required'),
  title: z.string().min(2, 'Widget title is required'),
  type: z.enum(['CHART', 'TABLE', 'KPI', 'METRIC', 'SUMMARY']).optional(),
  metricKey: z.string().min(1, 'Metric key is required'),
  configJson: z.string().optional(),
  gridX: z.number().int().nonnegative().optional(),
  gridY: z.number().int().nonnegative().optional(),
  gridW: z.number().int().positive().optional(),
  gridH: z.number().int().positive().optional(),
});

const createKPIDefinitionSchema = z.object({
  code: z.string().min(2, 'KPI code is required'),
  name: z.string().min(2, 'KPI name is required'),
  description: z.string().optional(),
  category: z.string().optional(),
  unit: z.string().optional(),
  targetValue: z.number().nonnegative(),
  currentValue: z.number().nonnegative().optional(),
});

const createForecastRequestSchema = z.object({
  name: z.string().min(2, 'Forecast name is required'),
  type: z.enum(['REVENUE', 'WORKFORCE', 'MARKETPLACE', 'FINANCE', 'OPERATIONS']).optional(),
  algorithm: z.string().optional(),
  confidence: z.number().min(50).max(99.9).optional(),
});

const createReportScheduleSchema = z.object({
  title: z.string().min(2, 'Report schedule title is required'),
  frequency: z.enum(['DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY']).optional(),
  recipients: z.array(z.string().email('Invalid email recipient')).optional(),
  nextRunAt: z.string().or(z.date()),
});

const createBusinessGoalSchema = z.object({
  title: z.string().min(2, 'Goal title is required'),
  description: z.string().optional(),
  targetValue: z.number().positive('Target value must be positive'),
  unit: z.string().optional(),
  startDate: z.string().or(z.date()),
  targetDate: z.string().or(z.date()),
});

const updateGoalProgressSchema = z.object({
  value: z.number(),
  notes: z.string().optional(),
});

module.exports = {
  analyticsQuerySchema,
  reportGenerationSchema,
  updateDashboardPreferenceSchema,
  createExecutiveDashboardSchema,
  createDashboardWidgetSchema,
  createKPIDefinitionSchema,
  createForecastRequestSchema,
  createReportScheduleSchema,
  createBusinessGoalSchema,
  updateGoalProgressSchema,
};
