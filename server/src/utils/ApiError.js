'use strict';

/**
 * Custom application error class.
 *
 * Extends the native Error to carry HTTP status codes and
 * structured validation errors. The global error middleware
 * uses `isOperational` to distinguish expected errors
 * (e.g., validation, 404) from unexpected crashes.
 */
class ApiError extends Error {
  /**
   * @param {number}   statusCode    HTTP status code
   * @param {string}   message       Human-readable error message
   * @param {Array}    [errors]      Field-level validation errors
   * @param {string}   [stack]       Optional stack trace override
   */
  constructor(statusCode, message, errors = [], stack = '') {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.message = message;
    this.errors = errors;
    this.isOperational = true;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  // ─── Static Factory Methods ──────────────────────────────────────────────

  static badRequest(message = 'Bad Request', errors = []) {
    return new ApiError(400, message, errors);
  }

  static unauthorized(message = 'Unauthorized') {
    return new ApiError(401, message);
  }

  static forbidden(message = 'Forbidden') {
    return new ApiError(403, message);
  }

  static notFound(message = 'Resource not found') {
    return new ApiError(404, message);
  }

  static conflict(message = 'Conflict') {
    return new ApiError(409, message);
  }

  static unprocessable(message = 'Unprocessable Entity', errors = []) {
    return new ApiError(422, message, errors);
  }

  static tooManyRequests(message = 'Too many requests. Please try again later.') {
    return new ApiError(429, message);
  }

  static internal(message = 'Internal Server Error') {
    return new ApiError(500, message);
  }

  static serviceUnavailable(message = 'Service temporarily unavailable') {
    return new ApiError(503, message);
  }
}

// ─── Named Semantic Error Subclasses ─────────────────────────────────────────
// Extend ApiError so that instanceof checks work in the error handler.
// Usage: throw new ValidationError('Invalid input', errors);

/**
 * 400 – Malformed request or business rule violation.
 * @extends ApiError
 */
class ValidationError extends ApiError {
  /**
   * @param {string} [message]
   * @param {Array}  [errors]  Field-level validation errors
   */
  constructor(message = 'Validation failed', errors = []) {
    super(400, message, errors);
    this.name = 'ValidationError';
  }
}

/**
 * 401 – Missing or invalid authentication token.
 * @extends ApiError
 */
class AuthenticationError extends ApiError {
  /**
   * @param {string} [message]
   */
  constructor(message = 'Authentication required. Please log in.') {
    super(401, message);
    this.name = 'AuthenticationError';
  }
}

/**
 * 403 – Authenticated but lacks permission for the action.
 * @extends ApiError
 */
class AuthorizationError extends ApiError {
  /**
   * @param {string} [message]
   */
  constructor(message = 'You do not have permission to perform this action.') {
    super(403, message);
    this.name = 'AuthorizationError';
  }
}

/**
 * 404 – The requested resource does not exist.
 * @extends ApiError
 */
class NotFoundError extends ApiError {
  /**
   * @param {string} [resource]  Human-readable resource name (e.g., 'Contract')
   */
  constructor(resource = 'Resource') {
    super(404, `${resource} not found`);
    this.name = 'NotFoundError';
  }
}

/**
 * 409 – Resource already exists or state conflict.
 * @extends ApiError
 */
class ConflictError extends ApiError {
  /**
   * @param {string} [message]
   */
  constructor(message = 'A conflict occurred with the current state of the resource.') {
    super(409, message);
    this.name = 'ConflictError';
  }
}

/**
 * 429 – Rate limit exceeded.
 * @extends ApiError
 */
class RateLimitError extends ApiError {
  /**
   * @param {string} [message]
   */
  constructor(message = 'Too many requests. Please try again later.') {
    super(429, message);
    this.name = 'RateLimitError';
  }
}

/**
 * 500 – Unexpected server-side error.
 * @extends ApiError
 */
class InternalServerError extends ApiError {
  /**
   * @param {string} [message]
   */
  constructor(message = 'An unexpected error occurred. Please try again later.') {
    super(500, message);
    this.name = 'InternalServerError';
    // Programmer errors should not be marked operational by default
    this.isOperational = false;
  }
}

/**
 * 503 – Dependency (DB, payment provider) temporarily unavailable.
 * @extends ApiError
 */
class ServiceUnavailableError extends ApiError {
  /**
   * @param {string} [service]  Name of the unavailable service
   */
  constructor(service = 'Service') {
    super(503, `${service} is temporarily unavailable. Please try again shortly.`);
    this.name = 'ServiceUnavailableError';
  }
}

module.exports = {
  ApiError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
  RateLimitError,
  InternalServerError,
  ServiceUnavailableError,
};

