'use strict';

const authService = require('./auth.service');
const { ApiResponse } = require('../../utils/ApiResponse');
const { resetAuthRateLimit } = require('../../middlewares/rateLimiter');

/**
 * Helper to set HTTP-only refresh token cookie for web browsers.
 * @param {import('express').Response} res
 * @param {string} refreshToken
 */
function setRefreshTokenCookie(res, refreshToken) {
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/api/v1/auth',
  });
}

/**
 * Clear refresh token cookie on logout.
 * @param {import('express').Response} res
 */
function clearRefreshTokenCookie(res) {
  res.cookie('refreshToken', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: new Date(0),
    path: '/api/v1/auth',
  });
}

/**
 * Auth Controller — Request handlers for authentication & user profile endpoints.
 */
class AuthController {
  /**
   * POST /api/v1/auth/register
   */
  async register(req, res) {
    const result = await authService.register(req.body, req);
    setRefreshTokenCookie(res, result.refreshToken);
    resetAuthRateLimit(req);

    return ApiResponse.created(
      res,
      result,
      'Registration successful! Please check your email to verify your account.'
    );
  }

  /**
   * POST /api/v1/auth/login
   */
  async login(req, res) {
    const result = await authService.login(req.body, req);
    setRefreshTokenCookie(res, result.refreshToken);
    resetAuthRateLimit(req);

    return ApiResponse.ok(res, result, 'Login successful');
  }

  /**
   * POST /api/v1/auth/refresh
   */
  async refresh(req, res) {
    const refreshToken = req.body.refreshToken || req.cookies?.refreshToken;
    const result = await authService.refreshSession(refreshToken, req);
    setRefreshTokenCookie(res, result.refreshToken);

    return ApiResponse.ok(res, result, 'Session refreshed');
  }

  /**
   * POST /api/v1/auth/logout
   */
  async logout(req, res) {
    const refreshToken = req.body.refreshToken || req.cookies?.refreshToken;
    await authService.logout(refreshToken, req);
    clearRefreshTokenCookie(res);

    return ApiResponse.ok(res, null, 'Logged out successfully');
  }

  /**
   * POST /api/v1/auth/logout-all
   */
  async logoutAll(req, res) {
    await authService.logoutAll(req.user.id, req);
    clearRefreshTokenCookie(res);

    return ApiResponse.ok(res, null, 'Logged out from all devices');
  }

  /**
   * POST /api/v1/auth/verify-email
   */
  async verifyEmail(req, res) {
    const result = await authService.verifyEmail(req.body.token, req);
    return ApiResponse.ok(res, result.user, result.message);
  }

  /**
   * POST /api/v1/auth/forgot-password
   */
  async forgotPassword(req, res) {
    const result = await authService.forgotPassword(req.body.email, req);
    return ApiResponse.ok(res, null, result.message);
  }

  /**
   * POST /api/v1/auth/reset-password
   */
  async resetPassword(req, res) {
    const result = await authService.resetPassword(req.body, req);
    clearRefreshTokenCookie(res);

    return ApiResponse.ok(res, null, result.message);
  }

  /**
   * POST /api/v1/auth/change-password
   */
  async changePassword(req, res) {
    const result = await authService.changePassword(req.user.id, req.body, req);
    clearRefreshTokenCookie(res);

    return ApiResponse.ok(res, null, result.message);
  }

  /**
   * GET /api/v1/auth/me
   */
  async getCurrentUser(req, res) {
    const user = await authService.getCurrentUser(req.user.id);
    return ApiResponse.ok(res, user, 'Current user retrieved');
  }

  /**
   * PUT /api/v1/auth/profile
   */
  async updateProfile(req, res) {
    const updatedUser = await authService.updateProfile(req.user.id, req.body);
    return ApiResponse.ok(res, updatedUser, 'Profile updated successfully');
  }
}

module.exports = new AuthController();
