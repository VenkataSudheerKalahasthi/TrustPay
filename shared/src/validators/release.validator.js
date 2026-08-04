const { z } = require('zod');

const releaseCertificationSchema = z.object({
  version: z.string().min(1, 'Version is required'),
  stage: z.enum(['RC', 'GOLD', 'GA', 'PRODUCTION']).optional(),
  certifiedBy: z.string().optional(),
});

const executeRegressionSchema = z.object({
  suiteName: z.string().min(2, 'Suite name is required'),
  totalTests: z.number().int().min(1, 'Total tests count must be positive'),
});

const securityScanSchema = z.object({
  scanType: z.string().min(2, 'Scan type is required'),
});

const approveDeploymentSchema = z.object({
  approver: z.string().min(2, 'Approver name is required'),
  role: z.string().optional(),
});

const createSignoffSchema = z.object({
  stakeholder: z.string().min(2, 'Stakeholder name is required'),
  role: z.string().min(2, 'Stakeholder role is required'),
});

module.exports = {
  releaseCertificationSchema,
  executeRegressionSchema,
  securityScanSchema,
  approveDeploymentSchema,
  createSignoffSchema,
};
