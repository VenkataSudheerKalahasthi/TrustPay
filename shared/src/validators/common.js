'use strict';

const { z } = require('zod');
const { LIMITS } = require('../constants');

/**
 * Shared Zod validation schemas.
 * Used by both the server (in validate middleware) and client (in React Hook Form).
 */

// ─── Primitives ───────────────────────────────────────────────────────────────
const emailSchema = z
  .string({ required_error: 'Email is required' })
  .email('Please enter a valid email address')
  .toLowerCase()
  .trim();

const passwordSchema = z
  .string({ required_error: 'Password is required' })
  .min(LIMITS.PASSWORD_MIN_LENGTH, `Password must be at least ${LIMITS.PASSWORD_MIN_LENGTH} characters`)
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/\d/, 'Password must contain at least one number')
  .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character');

const phoneSchema = z
  .string()
  .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number')
  .optional();

const uuidSchema = z.string().uuid('Invalid ID format');

const cuidSchema = z.string().cuid('Invalid ID format');

const amountSchema = z
  .number({ required_error: 'Amount is required' })
  .positive('Amount must be positive')
  .min(LIMITS.MIN_CONTRACT_AMOUNT, `Minimum amount is ₹${LIMITS.MIN_CONTRACT_AMOUNT}`)
  .max(LIMITS.MAX_CONTRACT_AMOUNT, `Maximum amount is ₹${LIMITS.MAX_CONTRACT_AMOUNT.toLocaleString('en-IN')}`);

// ─── Pagination ───────────────────────────────────────────────────────────────
const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  search: z.string().optional(),
});

// ─── Common ID param ─────────────────────────────────────────────────────────
const idParamSchema = z.object({
  id: cuidSchema,
});

module.exports = {
  emailSchema,
  passwordSchema,
  phoneSchema,
  uuidSchema,
  cuidSchema,
  amountSchema,
  paginationSchema,
  idParamSchema,
};
