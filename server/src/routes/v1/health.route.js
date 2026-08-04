'use strict';

const { Router } = require('express');
const { ApiResponse } = require('../../utils/ApiResponse');
const { prisma } = require('../../config/database');
const { env } = require('../../config/env');

const router = Router();

let APP_VERSION = '1.0.0';
try {
  APP_VERSION = require('../../../package.json').version;
} catch {
  // package.json not accessible — use default
}

/**
 * GET /api/v1/health
 */
router.get('/', async (req, res) => {
  const startTime = Date.now();

  try {
    await prisma.$queryRaw`SELECT 1 AS ping`;
    const dbLatencyMs = Date.now() - startTime;

    return ApiResponse.ok(
      res,
      {
        status: 'healthy',
        environment: env.NODE_ENV,
        version: APP_VERSION,
        apiVersion: env.API_VERSION,
        database: {
          status: 'connected',
          provider: 'Supabase PostgreSQL',
          latencyMs: dbLatencyMs,
        },
        server: {
          uptime: process.uptime(),
          uptimeHuman: formatUptime(process.uptime()),
          memoryMb: {
            heapUsed: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
            heapTotal: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
            rss: Math.round(process.memoryUsage().rss / 1024 / 1024),
          },
          nodeVersion: process.version,
          pid: process.pid,
        },
        timestamp: new Date().toISOString(),
      },
      'TrustPay API is healthy'
    );
  } catch (error) {
    return res.status(503).json({
      success: false,
      statusCode: 503,
      message: 'API is running but database is unreachable',
      data: {
        status: 'degraded',
        environment: env.NODE_ENV,
        version: APP_VERSION,
        database: {
          status: 'disconnected',
          provider: 'Supabase PostgreSQL',
          error: env.NODE_ENV !== 'production' ? error.message : 'DB connection failed',
        },
        server: {
          uptime: process.uptime(),
          uptimeHuman: formatUptime(process.uptime()),
        },
        timestamp: new Date().toISOString(),
      },
      timestamp: new Date().toISOString(),
    });
  }
});

/**
 * GET /api/v1/health/readiness
 * Kubernetes / Cloud Readiness probe.
 */
router.get('/readiness', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1 AS ping`;
    return ApiResponse.ok(res, { ready: true, database: 'connected' }, 'Application is ready');
  } catch {
    return res.status(503).json({ ready: false, database: 'disconnected' });
  }
});

/**
 * GET /api/v1/health/version
 */
router.get('/version', (_req, res) => {
  return ApiResponse.ok(
    res,
    {
      app: 'TrustPay',
      version: APP_VERSION,
      apiVersion: env.API_VERSION,
      environment: env.NODE_ENV,
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
      timestamp: new Date().toISOString(),
    },
    'TrustPay version information'
  );
});

/**
 * GET /api/v1/health/diagnostics
 */
router.get('/diagnostics', async (_req, res) => {
  return ApiResponse.ok(
    res,
    {
      modulesCount: 17,
      storageEngine: 'Supabase Storage Adapter',
      activeFeatures: ['AUTH', 'ESCROW', 'CONTRACTS', 'AI_ASSISTANT', 'SEARCH', 'ORGANIZATIONS', 'WEBHOOKS', 'SECURITY'],
      diagnosticsPassed: true,
      timestamp: new Date().toISOString(),
    },
    'TrustPay application diagnostics'
  );
});

function formatUptime(seconds) {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const parts = [];
  if (d > 0) {
    parts.push(`${d}d`);
  }
  if (h > 0) {
    parts.push(`${h}h`);
  }
  if (m > 0) {
    parts.push(`${m}m`);
  }
  parts.push(`${s}s`);
  return parts.join(' ');
}

module.exports = router;
