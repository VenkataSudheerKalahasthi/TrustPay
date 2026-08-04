'use strict';

const { Router } = require('express');
const authController = require('./auth.controller');
const { validate } = require('../../middlewares/validate');
const { authenticate } = require('../../middlewares/auth');
const { authRateLimiter, refreshRateLimiter } = require('../../middlewares/rateLimiter');
const {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyEmailSchema,
  changePasswordSchema,
  updateProfileSchema,
} = require('./auth.validator');

const router = Router();

// ─── Public Authentication Routes ─────────────────────────────────────────────

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register a new Client or Worker user
 * @access  Public
 */
router.post('/register', authRateLimiter, validate({ body: registerSchema }), authController.register);

/**
 * @route   POST /api/v1/auth/login
 * @desc    Authenticate user credentials and issue tokens
 * @access  Public
 */
router.post('/login', authRateLimiter, validate({ body: loginSchema }), authController.login);

/**
 * @route   POST /api/v1/auth/refresh
 * @desc    Exchange Refresh Token for new Access Token (Token Rotation)
 * @access  Public
 */
router.post('/refresh', refreshRateLimiter, authController.refresh);

/**
 * @route   POST /api/v1/auth/logout
 * @desc    Revoke current refresh token & clear session
 * @access  Public
 */
router.post('/logout', authController.logout);

/**
 * @route   POST /api/v1/auth/verify-email
 * @desc    Verify email address using verification token
 * @access  Public
 */
router.post('/verify-email', validate({ body: verifyEmailSchema }), authController.verifyEmail);

/**
 * @route   POST /api/v1/auth/forgot-password
 * @desc    Request password reset email
 * @access  Public
 */
router.post('/forgot-password', authRateLimiter, validate({ body: forgotPasswordSchema }), authController.forgotPassword);

/**
 * @route   POST /api/v1/auth/reset-password
 * @desc    Reset password using reset token
 * @access  Public
 */
router.post('/reset-password', authRateLimiter, validate({ body: resetPasswordSchema }), authController.resetPassword);

// ─── Protected Routes (Requires JWT Authentication) ─────────────────────────

/**
 * @route   GET /api/v1/auth/me
 * @desc    Get current authenticated user profile
 * @access  Private
 */
router.get('/me', authenticate, authController.getCurrentUser);

/**
 * @route   PUT /api/v1/auth/profile
 * @desc    Update user profile details
 * @access  Private
 */
router.put('/profile', authenticate, validate({ body: updateProfileSchema }), authController.updateProfile);

/**
 * @route   POST /api/v1/auth/change-password
 * @desc    Change password for authenticated user
 * @access  Private
 */
router.post('/change-password', authenticate, validate({ body: changePasswordSchema }), authController.changePassword);

/**
 * @route   POST /api/v1/auth/logout-all
 * @desc    Revoke all active refresh tokens across all devices
 * @access  Private
 */
router.post('/logout-all', authenticate, authController.logoutAll);

module.exports = router;
