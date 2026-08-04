'use strict';

const { z } = require('zod');
const { emailSchema, passwordSchema, phoneSchema } = require('../../../../shared/src/validators/common');
const { USER_ROLES } = require('../../../../shared/src/constants');

/**
 * Zod validation schemas for Authentication & Profile endpoints.
 */

const registerSchema = z.object({
  firstName: z
    .string({ required_error: 'First name is required' })
    .trim()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name cannot exceed 50 characters'),
  lastName: z
    .string({ required_error: 'Last name is required' })
    .trim()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name cannot exceed 50 characters'),
  email: emailSchema,
  password: passwordSchema,
  phone: phoneSchema,
  role: z.enum([USER_ROLES.CLIENT, USER_ROLES.WORKER, USER_ROLES.ADMIN], {
    invalid_type_error: 'Role must be CLIENT, WORKER, or ADMIN',
  }).default(USER_ROLES.CLIENT),
});

const loginSchema = z.object({
  email: emailSchema,
  password: z.string({ required_error: 'Password is required' }).min(1, 'Password is required'),
});

const forgotPasswordSchema = z.object({
  email: emailSchema,
});

const resetPasswordSchema = z.object({
  token: z.string({ required_error: 'Reset token is required' }).min(1, 'Reset token is required'),
  password: passwordSchema,
});

const verifyEmailSchema = z.object({
  token: z.string({ required_error: 'Verification token is required' }).min(1, 'Verification token is required'),
});

const changePasswordSchema = z.object({
  currentPassword: z.string({ required_error: 'Current password is required' }).min(1, 'Current password is required'),
  newPassword: passwordSchema,
});

const updateProfileSchema = z.object({
  firstName: z.string().trim().min(2, 'First name must be at least 2 characters').max(50).optional(),
  lastName: z.string().trim().min(2, 'Last name must be at least 2 characters').max(50).optional(),
  phone: phoneSchema,
  avatar: z.string().nullable().optional(),
});

module.exports = {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyEmailSchema,
  changePasswordSchema,
  updateProfileSchema,
};
