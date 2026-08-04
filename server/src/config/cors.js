'use strict';

const { env } = require('./env');

/**
 * CORS configuration.
 *
 * Parses ALLOWED_ORIGINS from comma-separated env var.
 * Supports credentials for JWT cookie flows.
 */
const allowedOrigins = env.ALLOWED_ORIGINS.split(',').map((o) => o.trim());

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (Postman, mobile clients, server-to-server)
    if (!origin) {return callback(null, true);}

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    callback(new Error(`CORS: Origin '${origin}' is not allowed`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'X-Request-ID',
  ],
  exposedHeaders: ['X-Total-Count', 'X-Request-ID'],
  maxAge: 86400, // 24 hours – preflight cache
};

module.exports = { corsOptions };
