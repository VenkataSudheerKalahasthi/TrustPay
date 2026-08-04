'use strict';

const winston = require('winston');
const path = require('path');
const { env } = require('../config/env');

const { combine, timestamp, printf, colorize, errors, json } = winston.format;

// Custom log format for development console output
const devFormat = printf(({ level, message, timestamp: ts, stack }) => {
  return `${ts} [${level}]: ${stack || message}`;
});

// Custom log format for production (JSON for log aggregators)
const prodFormat = combine(timestamp(), errors({ stack: true }), json());

const transports = [
  // Console transport – always active
  new winston.transports.Console({
    format:
      env.NODE_ENV === 'production'
        ? prodFormat
        : combine(
            colorize({ all: true }),
            timestamp({ format: 'HH:mm:ss' }),
            errors({ stack: true }),
            devFormat
          ),
  }),
];

// File transports – active in all environments
const logDir = path.resolve(process.cwd(), env.LOG_DIR);
transports.push(
  new winston.transports.File({
    filename: path.join(logDir, 'error.log'),
    level: 'error',
    format: prodFormat,
    maxsize: 5 * 1024 * 1024, // 5 MB
    maxFiles: 5,
  }),
  new winston.transports.File({
    filename: path.join(logDir, 'combined.log'),
    format: prodFormat,
    maxsize: 10 * 1024 * 1024, // 10 MB
    maxFiles: 10,
  })
);

const logger = winston.createLogger({
  level: env.LOG_LEVEL,
  transports,
  exceptionHandlers: [
    new winston.transports.File({ filename: path.join(logDir, 'exceptions.log') }),
  ],
  rejectionHandlers: [
    new winston.transports.File({ filename: path.join(logDir, 'rejections.log') }),
  ],
  exitOnError: false,
});

// ─── Child Logger Factory ─────────────────────────────────────────────────────

/**
 * Create a domain-specific child logger.
 *
 * Every log entry from a child logger includes the module name,
 * making it easy to filter logs by domain in production:
 *   grep '"module":"auth"' logs/combined.log
 *
 * @param {string} module  Domain name (e.g., 'auth', 'wallet', 'contracts')
 * @param {object} [meta]  Additional default metadata attached to every log
 * @returns {import('winston').Logger}
 *
 * @example
 * const authLogger = createChildLogger('auth');
 * authLogger.info('User registered', { userId: user.id });
 */
function createChildLogger(module, meta = {}) {
  return logger.child({ module, ...meta });
}

// ─── Pre-built Domain Loggers ─────────────────────────────────────────────────
// Import directly from this file for zero-boilerplate domain logging.

/** Authentication & session events */
const authLogger = createChildLogger('auth');

/** Wallet & transaction events */
const walletLogger = createChildLogger('wallet');

/** Contract lifecycle events */
const contractLogger = createChildLogger('contracts');

/** Admin actions & audit trail */
const adminLogger = createChildLogger('admin');

/** Supabase Storage operations */
const storageLogger = createChildLogger('storage');

/** Socket.IO connection events */
const socketLogger = createChildLogger('socket');

module.exports = {
  logger,
  createChildLogger,
  authLogger,
  walletLogger,
  contractLogger,
  adminLogger,
  storageLogger,
  socketLogger,
};

