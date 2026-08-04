'use strict';

const { authLogger } = require('./logger');
const { parseRequestInfo } = require('./requestInfo');

/**
 * Authentication Audit Logging Constants (Supported Events).
 */
const AUDIT_EVENTS = Object.freeze({
  USER_REGISTRATION: 'USER_REGISTRATION',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILED: 'LOGIN_FAILED',
  LOGOUT: 'LOGOUT',
  LOGOUT_ALL_DEVICES: 'LOGOUT_ALL_DEVICES',
  REFRESH_TOKEN_ISSUED: 'REFRESH_TOKEN_ISSUED',
  REFRESH_TOKEN_ROTATED: 'REFRESH_TOKEN_ROTATED',
  PASSWORD_RESET_REQUESTED: 'PASSWORD_RESET_REQUESTED',
  PASSWORD_RESET_SUCCESS: 'PASSWORD_RESET_SUCCESS',
  PASSWORD_CHANGED: 'PASSWORD_CHANGED',
  EMAIL_VERIFICATION_SENT: 'EMAIL_VERIFICATION_SENT',
  EMAIL_VERIFIED_SUCCESS: 'EMAIL_VERIFIED_SUCCESS',
  UNAUTHORIZED_ACCESS: 'UNAUTHORIZED_ACCESS',
  FORBIDDEN_ACCESS: 'FORBIDDEN_ACCESS',
});

/**
 * Log structured authentication audit event to Winston authLogger.
 *
 * @param {object} params
 * @param {import('express').Request} [params.req] - Express request object (optional)
 * @param {string} params.eventType - One of AUDIT_EVENTS
 * @param {string} [params.userId] - User ID
 * @param {string} [params.email] - User email
 * @param {string} [params.role] - User role (CLIENT, WORKER, ADMIN)
 * @param {'SUCCESS'|'FAILED'} [params.status='SUCCESS'] - Status of authentication operation
 * @param {string} [params.errorMessage] - Error message if status is FAILED
 * @param {object} [params.customMeta] - Additional non-sensitive metadata
 */
function logAuthEvent({
  req,
  eventType,
  userId = null,
  email = null,
  role = null,
  status = 'SUCCESS',
  errorMessage = null,
  customMeta = {},
}) {
  const reqInfo = parseRequestInfo(req);

  const auditEntry = {
    eventType,
    userId: userId || (req && req.user ? req.user.id : null),
    email: email || (req && req.user ? req.user.email : null),
    role: role || (req && req.user ? req.user.role : null),
    timestamp: new Date().toISOString(),
    status,
    errorMessage: errorMessage || null,
    ipAddress: reqInfo.ipAddress,
    userAgent: reqInfo.userAgent,
    browser: reqInfo.browser,
    operatingSystem: reqInfo.operatingSystem,
    deviceType: reqInfo.deviceType,
    requestId: reqInfo.requestId,
    ...customMeta,
  };

  // Ensure strict security: Remove any sensitive keys if accidentally passed in customMeta
  delete auditEntry.password;
  delete auditEntry.passwordHash;
  delete auditEntry.token;
  delete auditEntry.refreshToken;
  delete auditEntry.accessToken;
  delete auditEntry.currentPassword;
  delete auditEntry.newPassword;

  // Log based on status/event severity using the pre-built winston authLogger
  if (status === 'FAILED' || eventType === AUDIT_EVENTS.UNAUTHORIZED_ACCESS || eventType === AUDIT_EVENTS.FORBIDDEN_ACCESS) {
    authLogger.warn(`AUTH AUDIT [${eventType}] - ${status}`, auditEntry);
  } else {
    authLogger.info(`AUTH AUDIT [${eventType}] - ${status}`, auditEntry);
  }

  return auditEntry;
}

module.exports = {
  AUDIT_EVENTS,
  logAuthEvent,
};
