'use strict';

const { z } = require('zod');

// Configuration Validation
const setPlatformConfigSchema = z.object({
  configKey: z.string().min(2, 'Configuration key is required'),
  configValue: z.string().min(1, 'Configuration value is required'),
  scope: z.enum(['GLOBAL', 'ORGANIZATION', 'WORKSPACE', 'USER']).optional(),
  scopeId: z.string().optional(),
  description: z.string().optional(),
  isEncrypted: z.boolean().optional(),
});

// Maintenance Schedule Validation
const createMaintenanceScheduleSchema = z.object({
  title: z.string().min(2, 'Maintenance title is required'),
  type: z.enum(['SCHEDULED', 'EMERGENCY', 'PLANNED']).optional(),
  startTime: z.string().or(z.date()),
  endTime: z.string().or(z.date()),
  description: z.string().optional(),
});

// Release Management Validation
const createApplicationVersionSchema = z.object({
  version: z.string().min(1, 'Version number is required'),
  buildNumber: z.string().min(1, 'Build number is required'),
  releaseDate: z.string().or(z.date()).optional(),
  isCurrent: z.boolean().optional(),
});

const createReleaseNoteSchema = z.object({
  applicationVersionId: z.string().min(1, 'Version ID is required'),
  title: z.string().min(2, 'Release note title is required'),
  category: z.string().optional(),
  content: z.string().min(5, 'Release note content must be detailed'),
});

// Diagnostics & Health Validation
const runDiagnosticSchema = z.object({
  component: z.string().optional(),
});

module.exports = {
  setPlatformConfigSchema,
  createMaintenanceScheduleSchema,
  createApplicationVersionSchema,
  createReleaseNoteSchema,
  runDiagnosticSchema,
};
