'use strict';

const morgan = require('morgan');
const { logger } = require('../utils/logger');
const { v4: uuidv4 } = require('uuid');

/**
 * Morgan HTTP request logger using Winston as the write stream.
 *
 * Each request gets a unique X-Request-ID header that is propagated
 * through the entire request lifecycle for traceability.
 */

// Pipe morgan's output into Winston
const stream = {
  write: (message) => logger.http(message.trim()),
};

// Skip logging in test environments
const skip = () => process.env.NODE_ENV === 'test';

const morganMiddleware = morgan(
  ':remote-addr :method :url :status :res[content-length] - :response-time ms',
  { stream, skip }
);

/**
 * Attaches a unique X-Request-ID header to every incoming request.
 * Uses the client-provided ID if present, otherwise generates a new UUID.
 *
 * @type {import('express').RequestHandler}
 */
function requestIdMiddleware(req, res, next) {
  const requestId = req.headers['x-request-id'] || uuidv4();
  req.requestId = requestId;
  res.setHeader('X-Request-ID', requestId);
  next();
}

module.exports = { morganMiddleware, requestIdMiddleware };
