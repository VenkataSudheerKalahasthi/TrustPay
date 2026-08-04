'use strict';

const { z } = require('zod');

const projectPriorityEnum = z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']);
const projectStatusEnum = z.enum(['DRAFT', 'ACTIVE', 'ON_HOLD', 'IN_REVIEW', 'COMPLETED', 'CANCELLED', 'ARCHIVED']);
const milestoneStatusEnum = z.enum(['PENDING', 'IN_PROGRESS', 'IN_REVIEW', 'COMPLETED', 'CANCELLED']);
const deliverableStatusEnum = z.enum(['DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REVISION_REQUESTED', 'REJECTED']);
const evidenceTypeEnum = z.enum(['IMAGE', 'VIDEO', 'PDF', 'ZIP', 'DOCUMENT', 'LINK', 'OTHER']);
const attachmentCategoryEnum = z.enum(['REQUIREMENT', 'DESIGN', 'REFERENCE', 'DELIVERABLE', 'OTHER']);

const createProjectSchema = z.object({
  title: z.string().min(3, 'Project title must be at least 3 characters').max(200),
  description: z.string().max(5000).optional().nullable(),
  category: z.string().optional().nullable(),
  workerProfileId: z.string().optional().nullable(),
  contractId: z.string().optional().nullable(),
  escrowWalletId: z.string().optional().nullable(),
  priority: projectPriorityEnum.default('MEDIUM').optional(),
  estimatedBudget: z.coerce.number().min(0).optional().nullable(),
  estimatedDuration: z.string().optional().nullable(),
  startDate: z.string().optional().nullable(),
  targetEndDate: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

const updateProjectSchema = z.object({
  title: z.string().min(3).max(200).optional(),
  description: z.string().max(5000).optional().nullable(),
  category: z.string().optional().nullable(),
  workerProfileId: z.string().optional().nullable(),
  contractId: z.string().optional().nullable(),
  escrowWalletId: z.string().optional().nullable(),
  priority: projectPriorityEnum.optional(),
  estimatedBudget: z.coerce.number().min(0).optional().nullable(),
  estimatedDuration: z.string().optional().nullable(),
  startDate: z.string().optional().nullable(),
  targetEndDate: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

const updateProjectStatusSchema = z.object({
  status: projectStatusEnum,
  reason: z.string().max(1000).optional().nullable(),
});

const createMilestoneSchema = z.object({
  title: z.string().min(3, 'Milestone title must be at least 3 characters').max(150),
  description: z.string().max(2000).optional().nullable(),
  dueDate: z.string().optional().nullable(),
  estimatedAmount: z.coerce.number().min(0).optional().nullable(),
  prerequisiteMilestoneId: z.string().optional().nullable(),
  order: z.coerce.number().int().min(1).default(1).optional(),
});

const updateMilestoneSchema = z.object({
  title: z.string().min(3).max(150).optional(),
  description: z.string().max(2000).optional().nullable(),
  dueDate: z.string().optional().nullable(),
  status: milestoneStatusEnum.optional(),
  estimatedAmount: z.coerce.number().min(0).optional().nullable(),
  prerequisiteMilestoneId: z.string().optional().nullable(),
  completionPercentage: z.coerce.number().min(0).max(100).optional(),
  order: z.coerce.number().int().min(1).optional(),
});

const createDeliverableSchema = z.object({
  milestoneId: z.string().optional().nullable(),
  title: z.string().min(3, 'Deliverable title must be at least 3 characters').max(150),
  description: z.string().max(2000).optional().nullable(),
});

const submitDeliverableSchema = z.object({
  description: z.string().min(5, 'Submission description or notes required').max(3000),
  fileUrls: z.array(z.string().url()).default([]).optional(),
});

const reviewDeliverableSchema = z.object({
  status: z.enum(['APPROVED', 'REVISION_REQUESTED', 'REJECTED']),
  clientFeedback: z.string().min(3, 'Feedback details required when reviewing deliverable').max(3000),
});

const createEvidenceSchema = z.object({
  milestoneId: z.string().optional().nullable(),
  deliverableId: z.string().optional().nullable(),
  title: z.string().min(3, 'Evidence title is required').max(150),
  description: z.string().max(1000).optional().nullable(),
  evidenceType: evidenceTypeEnum.default('DOCUMENT'),
  fileUrl: z.string().url('Valid file URL required'),
  fileName: z.string().min(1, 'File name required'),
  fileSize: z.coerce.number().optional().nullable(),
  mimeType: z.string().optional().nullable(),
  sha256Hash: z.string().optional().nullable(),
  externalUrl: z.string().url().optional().nullable(),
});

const createAttachmentSchema = z.object({
  deliverableId: z.string().optional().nullable(),
  category: attachmentCategoryEnum.default('OTHER'),
  fileName: z.string().min(1, 'File name required'),
  fileUrl: z.string().url('Valid file URL required'),
  fileType: z.string().optional().nullable(),
  fileSize: z.coerce.number().optional().nullable(),
});

const createCommentSchema = z.object({
  milestoneId: z.string().optional().nullable(),
  deliverableId: z.string().optional().nullable(),
  content: z.string().min(1, 'Comment content cannot be empty').max(2000),
});

const projectSearchQuerySchema = z.object({
  q: z.string().optional(),
  status: projectStatusEnum.optional(),
  priority: projectPriorityEnum.optional(),
  workerProfileId: z.string().optional(),
  clientProfileId: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  sortBy: z.enum(['newest', 'oldest', 'title', 'status', 'budget', 'startDate']).default('newest').optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc').optional(),
  page: z.coerce.number().min(1).default(1).optional(),
  limit: z.coerce.number().min(1).max(100).default(10).optional(),
});

module.exports = {
  createProjectSchema,
  updateProjectSchema,
  updateProjectStatusSchema,
  createMilestoneSchema,
  updateMilestoneSchema,
  createDeliverableSchema,
  submitDeliverableSchema,
  reviewDeliverableSchema,
  createEvidenceSchema,
  createAttachmentSchema,
  createCommentSchema,
  projectSearchQuerySchema,
};
