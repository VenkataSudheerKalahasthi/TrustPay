'use strict';

const { z } = require('zod');

const createFileAssetSchema = z.object({
  name: z.string().min(1, 'File name is required').max(255),
  mimeType: z.string().default('application/octet-stream'),
  sizeBytes: z.number().int().positive(),
  checksum: z.string().min(8, 'SHA-256 Checksum required'),
  storagePath: z.string().min(1),
  tags: z.string().optional(),
});

const createShareLinkSchema = z.object({
  fileAssetId: z.string().min(1),
  password: z.string().min(4).optional(),
  downloadLimit: z.number().int().positive().optional(),
  expiresInDays: z.number().int().positive().optional(),
});

const createSecurityIncidentSchema = z.object({
  title: z.string().min(3).max(150),
  description: z.string().min(5),
  severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).default('HIGH'),
});

const createSecretSchema = z.object({
  name: z.string().min(2).max(100),
  value: z.string().min(1),
});

const createExportRequestSchema = z.object({
  format: z.enum(['JSON', 'CSV', 'PDF']).default('JSON'),
});

module.exports = {
  createFileAssetSchema,
  createShareLinkSchema,
  createSecurityIncidentSchema,
  createSecretSchema,
  createExportRequestSchema,
};
