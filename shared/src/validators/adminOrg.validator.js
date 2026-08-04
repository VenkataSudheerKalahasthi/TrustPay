'use strict';

const { z } = require('zod');

const orgRoleEnum = z.enum(['OWNER', 'ADMIN', 'MANAGER', 'MEMBER', 'VIEWER']);

const createOrgSchema = z.object({
  name: z.string().min(2, 'Organization name is required').max(100),
  logo: z.string().optional(),
  primaryColor: z.string().optional(),
  companyAddress: z.string().optional(),
});

const inviteMemberSchema = z.object({
  email: z.string().email('Invalid email address'),
  role: orgRoleEnum.default('MEMBER'),
});

const createWorkspaceSchema = z.object({
  name: z.string().min(2).max(50),
});

const createApiKeySchema = z.object({
  name: z.string().min(2).max(50),
  scopes: z.enum(['READ_ONLY', 'FULL_ACCESS', 'WEBHOOKS_ONLY']).default('FULL_ACCESS'),
  ipRestrictions: z.string().optional(),
  expiresInDays: z.number().int().min(1).max(365).optional(),
});

const createWebhookSchema = z.object({
  name: z.string().min(2).max(50),
  url: z.string().url('Invalid webhook URL'),
  events: z.array(z.string()).min(1, 'Select at least one event'),
});

const createFeatureFlagSchema = z.object({
  key: z.string().min(2).max(50),
  name: z.string().min(2).max(100),
  description: z.string().optional(),
  isEnabled: z.boolean().default(true),
  rolloutPercentage: z.number().min(0).max(100).default(100),
});

const createAnnouncementSchema = z.object({
  title: z.string().min(2).max(150),
  message: z.string().min(5),
  targetRole: z.string().default('ALL').optional(),
});

module.exports = {
  createOrgSchema,
  inviteMemberSchema,
  createWorkspaceSchema,
  createApiKeySchema,
  createWebhookSchema,
  createFeatureFlagSchema,
  createAnnouncementSchema,
};
