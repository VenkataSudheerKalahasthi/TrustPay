'use strict';

const { z } = require('zod');

// User Administration & Restriction Validation
const restrictUserSchema = z.object({
  targetUserId: z.string().min(1, 'Target user ID is required'),
  type: z.enum(['WARNING', 'LIMITED_ACCESS', 'SUSPENDED', 'BANNED']),
  reason: z.string().min(5, 'Restriction reason is required'),
  expiresAt: z.string().or(z.date()).optional(),
});

const addUserNoteSchema = z.object({
  targetUserId: z.string().min(1, 'Target user ID is required'),
  noteText: z.string().min(2, 'Note text is required'),
});

// Verification Review Validation
const reviewVerificationSchema = z.object({
  targetUserId: z.string().min(1, 'Target user ID is required'),
  status: z.enum(['PENDING', 'VERIFIED', 'REJECTED']),
  notes: z.string().optional(),
});

// Bulk Operation Validation
const bulkOperationSchema = z.object({
  operationType: z.string().min(1, 'Operation type is required'),
  targetUserIds: z.array(z.string()).min(1, 'At least one target user ID required'),
  payload: z.record(z.any()).optional(),
});

// Administrative Announcements Validation
const createAnnouncementSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  content: z.string().min(5, 'Content is required'),
  targetRole: z.string().optional(),
  isBanner: z.boolean().optional(),
});

// Contract & Wallet Oversight Validation
const updateContractOversightSchema = z.object({
  contractId: z.string().min(1, 'Contract ID is required'),
  statusNote: z.string().optional(),
  isFlagged: z.boolean().optional(),
  flagReason: z.string().optional(),
});

const updateWalletOversightSchema = z.object({
  walletId: z.string().min(1, 'Wallet ID is required'),
  isFrozen: z.boolean().optional(),
  freezeReason: z.string().optional(),
});

module.exports = {
  restrictUserSchema,
  addUserNoteSchema,
  reviewVerificationSchema,
  bulkOperationSchema,
  createAnnouncementSchema,
  updateContractOversightSchema,
  updateWalletOversightSchema,
};
