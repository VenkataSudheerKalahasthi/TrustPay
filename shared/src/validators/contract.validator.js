'use strict';

const { z } = require('zod');

const createContractSchema = z.object({
  workerProfileId: z.string().min(1, 'Worker selection is required'),
  title: z.string().min(3, 'Contract title must be at least 3 characters').max(150),
  description: z.string().max(3000).optional().nullable(),
  scopeOfWork: z.string().min(10, 'Scope of work is required (min 10 characters)'),
  deliverables: z.string().min(10, 'Deliverables list is required (min 10 characters)'),
  termsAndConditions: z.string().min(10, 'Terms & conditions are required (min 10 characters)'),
  paymentTermsText: z.string().optional().nullable(),
  startDate: z.string().optional().nullable(),
  endDate: z.string().optional().nullable(),
  expirationDate: z.string().optional().nullable(),
});

const updateContractSchema = z.object({
  title: z.string().min(3).max(150).optional(),
  description: z.string().max(3000).optional().nullable(),
  scopeOfWork: z.string().min(10).optional(),
  deliverables: z.string().min(10).optional(),
  termsAndConditions: z.string().min(10).optional(),
  paymentTermsText: z.string().optional().nullable(),
  startDate: z.string().optional().nullable(),
  endDate: z.string().optional().nullable(),
  expirationDate: z.string().optional().nullable(),
  changeSummary: z.string().min(3, 'Change summary is required for versioning').optional(),
});

const signContractSchema = z.object({
  signatureHash: z.string().optional(),
});

const createTemplateSchema = z.object({
  title: z.string().min(3).max(150),
  category: z.string().min(2),
  description: z.string().optional().nullable(),
  scopeOfWork: z.string().min(10),
  deliverables: z.string().min(10),
  termsAndConditions: z.string().min(10),
});

const contractSearchQuerySchema = z.object({
  q: z.string().optional(),
  status: z.enum([
    'DRAFT',
    'PENDING_REVIEW',
    'PENDING_ACCEPTANCE',
    'ACCEPTED',
    'REJECTED',
    'CANCELLED',
    'EXPIRED',
    'ARCHIVED',
  ]).optional(),
  contractNumber: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  sort: z.enum(['newest', 'oldest', 'title', 'status']).default('newest').optional(),
  page: z.coerce.number().min(1).default(1).optional(),
  limit: z.coerce.number().min(1).max(100).default(10).optional(),
});

module.exports = {
  createContractSchema,
  updateContractSchema,
  signContractSchema,
  createTemplateSchema,
  contractSearchQuerySchema,
};
