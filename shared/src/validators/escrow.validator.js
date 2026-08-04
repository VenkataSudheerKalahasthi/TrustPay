'use strict';

const { z } = require('zod');

const createDepositOrderSchema = z.object({
  amount: z.number().min(100, 'Minimum deposit amount is ₹100'),
  currency: z.string().default('INR').optional(),
  contractId: z.string().optional().nullable(),
  idempotencyKey: z.string().optional(),
});

const verifyPaymentSchema = z.object({
  razorpayOrderId: z.string().min(1, 'Razorpay order ID is required'),
  razorpayPaymentId: z.string().min(1, 'Razorpay payment ID is required'),
  razorpaySignature: z.string().min(1, 'Razorpay signature is required'),
  idempotencyKey: z.string().optional(),
});

const releaseFundsSchema = z.object({
  contractId: z.string().min(1, 'Contract ID is required'),
  workerProfileId: z.string().min(1, 'Worker profile ID is required'),
  amount: z.number().min(1, 'Release amount must be greater than 0'),
  releaseType: z.enum(['FULL', 'PARTIAL']).default('FULL').optional(),
  notes: z.string().optional().nullable(),
  idempotencyKey: z.string().optional(),
});

const refundFundsSchema = z.object({
  contractId: z.string().min(1, 'Contract ID is required'),
  amount: z.number().min(1, 'Refund amount must be greater than 0'),
  reason: z.string().min(3, 'Reason for refund is required'),
  idempotencyKey: z.string().optional(),
});

const transactionQuerySchema = z.object({
  type: z.enum(['DEPOSIT', 'HOLD', 'RELEASE', 'REFUND', 'CANCEL', 'REVERSAL']).optional(),
  contractId: z.string().optional(),
  referenceNumber: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  sort: z.enum(['newest', 'oldest', 'amount_asc', 'amount_desc']).default('newest').optional(),
  page: z.coerce.number().min(1).default(1).optional(),
  limit: z.coerce.number().min(1).max(100).default(10).optional(),
});

module.exports = {
  createDepositOrderSchema,
  verifyPaymentSchema,
  releaseFundsSchema,
  refundFundsSchema,
  transactionQuerySchema,
};
