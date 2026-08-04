'use strict';

const jwt = require('jsonwebtoken');
const { env } = require('../config/env');
const authRepository = require('../modules/auth/auth.repository');
const { AuthenticationError, AuthorizationError } = require('../utils/ApiError');
const { logAuthEvent, AUDIT_EVENTS } = require('../utils/auditLogger');

/**
 * Authentication Middleware.
 * Verifies JWT Access Token and hydrates req.user.
 * Logs UNAUTHORIZED_ACCESS audit event if authentication fails.
 *
 * @type {import('express').RequestHandler}
 */
async function authenticate(req, _res, next) {
  try {
    let token = null;

    // Check Authorization header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else if (req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      logAuthEvent({
        req,
        eventType: AUDIT_EVENTS.UNAUTHORIZED_ACCESS,
        status: 'FAILED',
        errorMessage: 'Authentication token missing',
      });
      throw new AuthenticationError('Authentication token missing');
    }

    let decoded;
    try {
      decoded = jwt.verify(token, env.JWT_ACCESS_SECRET);
    } catch {
      logAuthEvent({
        req,
        eventType: AUDIT_EVENTS.UNAUTHORIZED_ACCESS,
        status: 'FAILED',
        errorMessage: 'Invalid or expired access token',
      });
      throw new AuthenticationError('Invalid or expired access token');
    }

    if (decoded.type !== 'access') {
      logAuthEvent({
        req,
        eventType: AUDIT_EVENTS.UNAUTHORIZED_ACCESS,
        status: 'FAILED',
        errorMessage: 'Invalid token type',
      });
      throw new AuthenticationError('Invalid token type');
    }

    const user = await authRepository.findById(decoded.sub);
    if (!user) {
      logAuthEvent({
        req,
        eventType: AUDIT_EVENTS.UNAUTHORIZED_ACCESS,
        userId: decoded.sub,
        status: 'FAILED',
        errorMessage: 'User account no longer exists',
      });
      throw new AuthenticationError('User account no longer exists');
    }

    if (!user.isActive) {
      logAuthEvent({
        req,
        eventType: AUDIT_EVENTS.UNAUTHORIZED_ACCESS,
        userId: user.id,
        email: user.email,
        role: user.role,
        status: 'FAILED',
        errorMessage: 'User account is disabled',
      });
      throw new AuthenticationError('User account is disabled');
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    next(error);
  }
}

/**
 * Role-Based Authorization Middleware Factory.
 * Checks if req.user has one of the required roles.
 * Logs FORBIDDEN_ACCESS audit event if authorization fails.
 *
 * @param {...string} allowedRoles
 * @returns {import('express').RequestHandler}
 */
function authorize(...allowedRoles) {
  return (req, _res, next) => {
    if (!req.user) {
      logAuthEvent({
        req,
        eventType: AUDIT_EVENTS.UNAUTHORIZED_ACCESS,
        status: 'FAILED',
        errorMessage: 'Authentication required',
      });
      return next(new AuthenticationError('Authentication required'));
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(req.user.role)) {
      const errorMsg = `Access denied. Allowed roles: ${allowedRoles.join(', ')}`;
      logAuthEvent({
        req,
        eventType: AUDIT_EVENTS.FORBIDDEN_ACCESS,
        userId: req.user.id,
        email: req.user.email,
        role: req.user.role,
        status: 'FAILED',
        errorMessage: errorMsg,
      });
      return next(new AuthorizationError(errorMsg));
    }

    next();
  };
}

module.exports = { authenticate, authorize };
