'use strict';

const { PrismaClient } = require('@prisma/client');
const { env } = require('./env');
// Logger imported lazily to avoid circular dependency during startup
let _logger = null;
const getLogger = () => {
  if (!_logger) {_logger = require('../utils/logger').logger;}
  return _logger;
};

/**
 * Prisma Client Singleton — connected to Supabase PostgreSQL.
 *
 * Runtime queries go through the Supabase PgBouncer pooler (DATABASE_URL).
 * Migrations use the direct connection (DIRECT_URL) via `prisma migrate`.
 *
 * In development, the instance is cached on `global` to prevent
 * creating multiple connections during hot-reload cycles.
 * In production, a single module-scoped instance is used.
 */
const globalForPrisma = global;

const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      env.NODE_ENV === 'development'
        ? ['query', 'info', 'warn', 'error']
        : ['warn', 'error'],
    errorFormat: 'pretty',
  });

if (env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

/**
 * Verify the Supabase PostgreSQL connection via Prisma on startup.
 * Runs a lightweight raw query to confirm the pooler + DB are reachable.
 * @returns {Promise<void>}
 */
async function connectDatabase() {
  try {
    await prisma.$connect();
    // Lightweight connectivity probe — works through pgBouncer
    await prisma.$queryRaw`SELECT 1 AS connection_test`;
    getLogger().info('Supabase PostgreSQL connected via Prisma (PgBouncer)');
  } catch (error) {
    getLogger().warn('Database connection warning (offline/unconfigured DB credentials):', {
      message: error.message,
      hint: 'Verify DATABASE_URL and DIRECT_URL in server/.env when live database access is needed.',
    });
  }
}

/**
 * Gracefully disconnect Prisma on shutdown.
 * @returns {Promise<void>}
 */
async function disconnectDatabase() {
  await prisma.$disconnect();
  getLogger().info('Supabase database disconnected');
}

module.exports = { prisma, connectDatabase, disconnectDatabase };
