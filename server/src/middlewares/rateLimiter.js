'use strict';

const rateLimit = require('express-rate-limit');
const { env } = require('../config/env');
const { ApiError } = require('../utils/ApiError');

const isDev = env.NODE_ENV === 'development';

/**
 * Extract client IP address safely considering reverse proxies.
 * @param {import('express').Request} req
 * @returns {string}
 */
const getClientIp = (req) => {
  if (req.headers['x-forwarded-for']) {
    const forwarded = req.headers['x-forwarded-for'].split(',')[0].trim();
    if (forwarded) {
      return forwarded;
    }
  }
  return req.ip || req.socket?.remoteAddress || '127.0.0.1';
};

/**
 * Global API Rate Limiter
 * Provides high throughput for general API requests across the platform.
 */
const globalRateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000,
  max: isDev ? 1000 : (env.RATE_LIMIT_MAX_REQUESTS || 300),
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  keyGenerator: getClientIp,
  handler: (_req, _res, next) => {
    next(ApiError.tooManyRequests('Too many API requests. Please slow down and try again later.'));
  },
});

/**
 * Strict Authentication Brute-Force Rate Limiter
 * Protects sensitive endpoints (login, register, forgot-password, reset-password).
 *
 * Security & Enterprise Design:
 * - Only FAILED authentication attempts (4xx/5xx responses) increment the limit.
 * - Successful authentication (200/201 OK) automatically bypasses counting.
 * - Higher tolerance in development mode (50 failed attempts per 15 mins).
 * - Per-IP + target email composite keys prevent cross-account lockouts on shared networks.
 */
const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: isDev ? 50 : 10,       // 50 failed attempts in dev, 10 in prod
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Crucial: Successful logins do NOT count against brute-force limits
  keyGenerator: (req) => {
    const ip = getClientIp(req);
    const email = req.body?.email ? String(req.body.email).toLowerCase().trim() : '';
    return email ? `${ip}_${email}` : ip;
  },
  handler: (_req, _res, next) => {
    next(ApiError.tooManyRequests('Too many failed authentication attempts. Please try again in 15 minutes.'));
  },
});

/**
 * Refresh Token & Session Rate Limiter
 * Dedicated limiter for session token rotation (/auth/refresh) so background re-authentication
 * does not consume login brute-force attempts.
 */
const refreshRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isDev ? 500 : 100,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  keyGenerator: getClientIp,
  handler: (_req, _res, next) => {
    next(ApiError.tooManyRequests('Too many session refresh attempts. Please try logging in again.'));
  },
});

/**
 * Reset authentication rate limit hit counter for a given client IP & email upon successful login.
 * @param {import('express').Request} req
 */
const resetAuthRateLimit = (req) => {
  try {
    const ip = getClientIp(req);
    const email = req.body?.email ? String(req.body.email).toLowerCase().trim() : '';
    const key = email ? `${ip}_${email}` : ip;
    if (authRateLimiter.store && typeof authRateLimiter.store.resetKey === 'function') {
      authRateLimiter.store.resetKey(key);
      authRateLimiter.store.resetKey(ip);
    }
  } catch {
    // Non-blocking fallback
  }
};

module.exports = {
  globalRateLimiter,
  authRateLimiter,
  refreshRateLimiter,
  resetAuthRateLimit,
};

