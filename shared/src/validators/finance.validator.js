'use strict';

const { z } = require('zod');

const createSubscriptionPlanSchema = z.object({
  name: z.string().min(2, 'Plan name is required').max(100),
  code: z.string().min(2).max(50),
  description: z.string().optional(),
  priceMonthly: z.number().nonnegative().default(0),
  priceYearly: z.number().nonnegative().default(0),
  billingCycle: z.enum(['MONTHLY', 'QUARTERLY', 'YEARLY', 'CUSTOM']).default('MONTHLY'),
  maxProjects: z.number().int().positive().default(10),
  maxUsers: z.number().int().positive().default(5),
  features: z.array(z.string()).default([]),
  isPublic: z.boolean().default(true),
});

const subscribeOrganizationSchema = z.object({
  planId: z.string().min(1, 'Subscription Plan ID is required'),
  organizationId: z.string().optional(),
  billingCycle: z.enum(['MONTHLY', 'QUARTERLY', 'YEARLY', 'CUSTOM']).default('MONTHLY'),
});

const updateBillingProfileSchema = z.object({
  companyName: z.string().optional(),
  gstNumber: z.string().optional(),
  taxId: z.string().optional(),
  billingEmail: z.string().email('Valid email required'),
  billingAddress: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().default('India'),
  postalCode: z.string().optional(),
});

const addPaymentMethodSchema = z.object({
  type: z.enum(['CARD', 'BANK_ACCOUNT', 'UPI', 'WALLET']).default('CARD'),
  provider: z.string().default('RAZORPAY'),
  accountLast4: z.string().optional(),
  expiryMonth: z.number().int().min(1).max(12).optional(),
  expiryYear: z.number().int().min(2026).optional(),
  isDefault: z.boolean().default(false),
});

const createCommissionRuleSchema = z.object({
  name: z.string().min(3).max(100),
  code: z.string().min(2).max(50),
  type: z.enum(['PERCENTAGE', 'FIXED', 'HYBRID']).default('PERCENTAGE'),
  rate: z.number().nonnegative().default(5.0),
  fixedAmount: z.number().nonnegative().default(0.0),
  minCommission: z.number().nonnegative().default(0.0),
  maxCommission: z.number().nonnegative().optional(),
});

const createBudgetSchema = z.object({
  title: z.string().min(3).max(150),
  fiscalYear: z.number().int().default(2026),
  totalBudget: z.number().positive('Total budget must be greater than zero'),
  startDate: z.string().or(z.date()),
  endDate: z.string().or(z.date()),
  allocations: z.array(
    z.object({
      department: z.string().min(2),
      allocated: z.number().positive(),
    })
  ).default([]),
});

const generateFinancialReportSchema = z.object({
  title: z.string().min(3).max(150),
  reportType: z.enum(['REVENUE', 'EXPENSE', 'PROFIT_LOSS', 'CASH_FLOW', 'BUDGET']).default('PROFIT_LOSS'),
  startDate: z.string().or(z.date()),
  endDate: z.string().or(z.date()),
});

module.exports = {
  createSubscriptionPlanSchema,
  subscribeOrganizationSchema,
  updateBillingProfileSchema,
  addPaymentMethodSchema,
  createCommissionRuleSchema,
  createBudgetSchema,
  generateFinancialReportSchema,
};
