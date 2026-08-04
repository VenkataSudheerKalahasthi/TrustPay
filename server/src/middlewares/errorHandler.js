'use strict';

const { logger } = require('../utils/logger');
const { ApiError } = require('../utils/ApiError');
const { env } = require('../config/env');
const { v4: uuidv4 } = require('uuid');

/**
 * Global error handling middleware.
 *
 * Catches all errors thrown anywhere in the Express pipeline.
 * Distinguishes between:
 *   - Operational errors (ApiError instances) — send structured JSON
 *   - Programmer errors / unexpected crashes — log full stack, send 500
 *
 * Must be registered AFTER all routes as the last middleware.
 *
 * @type {import('express').ErrorRequestHandler}
 */
function errorHandler(err, req, res, _next) {
  const requestId = req.headers['x-request-id'] || uuidv4();

  // ─── Prisma Known Request Errors ──────────────────────────────────────────
  if (err.constructor?.name === 'PrismaClientKnownRequestError') {
    const prismaError = handlePrismaError(err);
    logger.warn(`Prisma error [${prismaError.statusCode}]: ${prismaError.message}`, {
      requestId,
      code: err.code,
      path: req.path,
    });
    return res.status(prismaError.statusCode).json({
      success: false,
      statusCode: prismaError.statusCode,
      message: prismaError.message,
      errors: [],
      requestId,
      timestamp: new Date().toISOString(),
    });
  }

  // ─── Zod Validation Errors ────────────────────────────────────────────────
  if (err.name === 'ZodError') {
    const errors = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    logger.warn('Validation error', { requestId, errors });
    return res.status(422).json({
      success: false,
      statusCode: 422,
      message: 'Validation failed',
      errors,
      requestId,
      timestamp: new Date().toISOString(),
    });
  }

  // ─── Operational ApiErrors ────────────────────────────────────────────────
  if (err instanceof ApiError && err.isOperational) {
    logger.warn(`API error [${err.statusCode}]: ${err.message}`, {
      requestId,
      path: req.path,
      method: req.method,
    });
    return res.status(err.statusCode).json({
      success: false,
      statusCode: err.statusCode,
      message: err.message,
      errors: err.errors || [],
      requestId,
      timestamp: new Date().toISOString(),
    });
  }

  // ─── Unexpected / Programmer Errors ───────────────────────────────────────
  logger.error('Unhandled error', {
    requestId,
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  const message =
    env.NODE_ENV === 'production'
      ? 'An unexpected error occurred. Please try again later.'
      : err.message;

  return res.status(500).json({
    success: false,
    statusCode: 500,
    message,
    errors: [],
    requestId,
    timestamp: new Date().toISOString(),
    ...(env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
}

/**
 * Map Prisma error codes to HTTP status codes.
 * @param {import('@prisma/client').Prisma.PrismaClientKnownRequestError} err
 * @returns {{ statusCode: number, message: string }}
 */
function handlePrismaError(err) {
  switch (err.code) {
    case 'P2002':
      return {
        statusCode: 409,
        message: `A record with this ${err.meta?.target?.join(', ')} already exists`,
      };
    case 'P2025':
      return { statusCode: 404, message: 'Record not found' };
    case 'P2003':
      return { statusCode: 400, message: 'Foreign key constraint failed' };
    case 'P2014':
      return { statusCode: 400, message: 'The change violates a required relation' };
    default:
      return { statusCode: 500, message: 'Database error occurred' };
  }
}

module.exports = { errorHandler };
