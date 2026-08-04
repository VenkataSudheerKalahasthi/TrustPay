'use strict';

const { z } = require('zod');

const aiActionEnum = z.enum([
  'CHAT',
  'SUMMARIZE',
  'REWRITE',
  'EXPAND',
  'SHORTEN',
  'PROFESSIONAL',
  'GRAMMAR',
  'EXTRACT_TASKS',
]);

const aiPromptSchema = z.object({
  prompt: z.string().min(1, 'Prompt is required').max(5000),
  conversationId: z.string().optional(),
  contextType: z.string().optional(), // PROJECT, CONTRACT, MESSAGE, WORKER, CLIENT
  contextId: z.string().optional(),
  action: aiActionEnum.default('CHAT'),
});

const aiFeedbackSchema = z.object({
  feedbackScore: z.number().int().min(-1).max(1), // 1 or -1
  feedbackText: z.string().max(1000).optional(),
});

const searchEntityTypeEnum = z.enum([
  'ALL',
  'PROJECT',
  'CONTRACT',
  'WORKER',
  'CLIENT',
  'MESSAGE',
  'INVOICE',
  'ESCROW',
  'NOTIFICATION',
  'ACTIVITY',
]);

const globalSearchSchema = z.object({
  query: z.string().min(1, 'Search query is required').max(200),
  entityType: searchEntityTypeEnum.default('ALL').optional(),
  sortBy: z.enum(['RELEVANCE', 'DATE', 'TITLE']).default('RELEVANCE').optional(),
  page: z.coerce.number().min(1).default(1).optional(),
  limit: z.coerce.number().min(1).max(100).default(20).optional(),
});

const savedSearchSchema = z.object({
  name: z.string().min(1).max(100),
  query: z.string().min(1).max(200),
  filters: z.record(z.any()).optional(),
  isFavorite: z.boolean().optional(),
});

const bookmarkSchema = z.object({
  entityType: searchEntityTypeEnum,
  entityId: z.string().min(1),
  title: z.string().min(1),
  linkUrl: z.string().min(1),
});

const pinnedItemSchema = z.object({
  entityType: searchEntityTypeEnum,
  entityId: z.string().min(1),
  title: z.string().min(1),
  linkUrl: z.string().min(1),
  orderIndex: z.number().int().optional(),
});

module.exports = {
  aiPromptSchema,
  aiFeedbackSchema,
  globalSearchSchema,
  savedSearchSchema,
  bookmarkSchema,
  pinnedItemSchema,
};
