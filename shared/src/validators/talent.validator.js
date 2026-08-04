'use strict';

const { z } = require('zod');

const searchTalentSchema = z.object({
  query: z.string().optional(),
  skillId: z.string().optional(),
  minHourlyRate: z.number().positive().optional(),
  maxHourlyRate: z.number().positive().optional(),
  availability: z.enum(['AVAILABLE', 'BUSY', 'ON_VACATION', 'OFFLINE']).optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().default(20),
});

const createTalentPoolSchema = z.object({
  name: z.string().min(2, 'Pool name is required').max(100),
  description: z.string().optional(),
  visibility: z.enum(['PRIVATE', 'ORGANIZATION', 'PUBLIC']).default('PRIVATE'),
});

const inviteCandidateSchema = z.object({
  jobId: z.string().min(1),
  workerUserId: z.string().min(1),
  message: z.string().optional(),
});

const updateMatchingConfigSchema = z.object({
  skillWeight: z.number().min(0).max(100).default(40),
  experienceWeight: z.number().min(0).max(100).default(20),
  ratingWeight: z.number().min(0).max(100).default(20),
  availabilityWeight: z.number().min(0).max(100).default(20),
});

const compareCandidatesSchema = z.object({
  workerUserIds: z.array(z.string().min(1)).min(2).max(4),
});

module.exports = {
  searchTalentSchema,
  createTalentPoolSchema,
  inviteCandidateSchema,
  updateMatchingConfigSchema,
  compareCandidatesSchema,
};
