'use strict';

const { createClient } = require('@supabase/supabase-js');
const { env } = require('./env');
const { prisma } = require('./database');

// Logger imported lazily to avoid circular dependency during startup
let _logger = null;
const getLogger = () => {
  if (!_logger) {
    _logger = require('../utils/logger').logger;
  }
  return _logger;
};

/**
 * Supabase Client — Admin (Service Role)
 *
 * Uses the SERVICE_ROLE_KEY which bypasses Row Level Security (RLS).
 * This client is for SERVER-SIDE use ONLY.
 */
const supabaseAdmin = createClient(
  env.SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
    db: {
      schema: 'public',
    },
    global: {
      headers: {
        'x-application-name': 'trustpay-server',
      },
    },
  }
);

/**
 * Supabase Client — Public (Anon Key)
 *
 * Uses the ANON_KEY which respects Row Level Security (RLS).
 */
const supabase = createClient(
  env.SUPABASE_URL,
  env.SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: false,
      detectSessionInUrl: false,
    },
    db: {
      schema: 'public',
    },
    global: {
      headers: {
        'x-application-name': 'trustpay-server',
      },
    },
  }
);

/**
 * Verify Supabase PostgreSQL connectivity using Prisma.
 * Prisma is the primary database driver for TrustPay.
 */
async function verifySupabaseConnection() {
  try {
    // Lightweight database connectivity check
    await prisma.$queryRaw`SELECT 1`;

    getLogger().info(
      'Supabase PostgreSQL connection verified via Prisma'
    );
  } catch (error) {
    getLogger().error('Supabase connection verification failed', {
      message: error.message,
      hint: 'Verify DATABASE_URL, DIRECT_URL, Prisma configuration, and PostgreSQL connectivity.',
    });

    // Non-fatal: do not terminate the server
  }
}

module.exports = {
  supabase,
  supabaseAdmin,
  verifySupabaseConnection,
};