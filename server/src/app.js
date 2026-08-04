'use strict';

require('dotenv').config();
require('express-async-errors');

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');

const { env } = require('./config/env');
const { corsOptions } = require('./config/cors');
const { globalRateLimiter } = require('./middlewares/rateLimiter');
const { morganMiddleware, requestIdMiddleware } = require('./middlewares/logger');
const { notFound } = require('./middlewares/notFound');
const { errorHandler } = require('./middlewares/errorHandler');
const v1Router = require('./routes/v1/index');

const app = express();

// ─── Trust Proxy (for reverse proxies like Nginx) ─────────────────────────────
app.set('trust proxy', 1);

// ─── Security Headers (Helmet) ────────────────────────────────────────────────
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
      },
    },
  })
);

// ─── CORS ─────────────────────────────────────────────────────────────────────
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// ─── Compression ──────────────────────────────────────────────────────────────
app.use(compression());

// ─── Request ID + HTTP Logging ────────────────────────────────────────────────
app.use(requestIdMiddleware);
app.use(morganMiddleware);

const cookieParser = require('cookie-parser');

// ─── Body Parsers & Cookie Parser ─────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// ─── Rate Limiting ────────────────────────────────────────────────────────────
app.use('/api', globalRateLimiter);

// ─── Static File Serving (uploads) ───────────────────────────────────────────
app.use('/uploads', express.static('uploads'));

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use(`/api/${env.API_VERSION}`, v1Router);

// ─── Root Redirect ────────────────────────────────────────────────────────────
app.get('/', (_req, res) => {
  res.redirect(`/api/${env.API_VERSION}/health`);
});

// ─── 404 Handler ──────────────────────────────────────────────────────────────
app.use(notFound);

// ─── Global Error Handler (must be last) ──────────────────────────────────────
app.use(errorHandler);

module.exports = app;
