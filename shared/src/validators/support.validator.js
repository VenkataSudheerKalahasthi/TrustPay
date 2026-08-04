'use strict';

const { z } = require('zod');

const createTicketSchema = z.object({
  subject: z.string().min(3, 'Subject is required').max(200),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  categoryId: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT', 'CRITICAL']).default('MEDIUM'),
  source: z.enum(['WEB', 'EMAIL', 'CHAT', 'SYSTEM', 'API']).default('WEB'),
  organizationId: z.string().optional(),
  contractId: z.string().optional(),
  projectId: z.string().optional(),
});

const updateTicketStatusSchema = z.object({
  status: z.enum(['OPEN', 'IN_PROGRESS', 'WAITING_CUSTOMER', 'ESCALATED', 'RESOLVED', 'CLOSED']),
  reason: z.string().optional(),
});

const createTicketMessageSchema = z.object({
  ticketId: z.string().min(1, 'Ticket ID is required'),
  body: z.string().min(1, 'Message body cannot be empty'),
  isInternal: z.boolean().default(false),
});

const assignTicketSchema = z.object({
  ticketId: z.string().min(1, 'Ticket ID is required'),
  assigneeUserId: z.string().min(1, 'Assignee User ID is required'),
});

const createSLAPolicySchema = z.object({
  name: z.string().min(3).max(100),
  description: z.string().optional(),
  firstResponseTimeMins: z.number().int().positive().default(120),
  resolutionTimeMins: z.number().int().positive().default(1440),
  isDefault: z.boolean().default(false),
});

const createKnowledgeArticleSchema = z.object({
  title: z.string().min(3).max(200),
  content: z.string().min(20, 'Article content must be at least 20 characters'),
  categoryId: z.string().optional(),
  status: z.enum(['DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
  tags: z.array(z.string()).default([]),
});

const updateKnowledgeArticleSchema = createKnowledgeArticleSchema.partial();

const createFeedbackSchema = z.object({
  type: z.enum(['BUG', 'FEATURE_REQUEST', 'GENERAL', 'SATISFACTION']).default('GENERAL'),
  rating: z.number().int().min(1).max(5).default(5),
  title: z.string().optional(),
  comment: z.string().optional(),
});

const submitCSATSchema = z.object({
  ticketId: z.string().optional(),
  csatScore: z.number().int().min(1).max(5).default(5),
  npsScore: z.number().int().min(0).max(10).optional(),
  feedbackText: z.string().optional(),
});

const createDisputeSchema = z.object({
  ticketId: z.string().optional(),
  contractId: z.string().optional(),
  projectId: z.string().optional(),
  targetUserId: z.string().optional(),
  amountDisputed: z.number().nonnegative().default(0),
  reason: z.string().min(10, 'Reason for dispute must be at least 10 characters'),
  evidenceUrls: z.array(z.string()).default([]),
});

const resolveDisputeSchema = z.object({
  disputeCaseId: z.string().min(1, 'Dispute Case ID is required'),
  notes: z.string().min(5, 'Resolution notes required'),
  refundAmount: z.number().nonnegative().default(0),
  releaseAmount: z.number().nonnegative().default(0),
});

module.exports = {
  createTicketSchema,
  updateTicketStatusSchema,
  createTicketMessageSchema,
  assignTicketSchema,
  createSLAPolicySchema,
  createKnowledgeArticleSchema,
  updateKnowledgeArticleSchema,
  createFeedbackSchema,
  submitCSATSchema,
  createDisputeSchema,
  resolveDisputeSchema,
};
