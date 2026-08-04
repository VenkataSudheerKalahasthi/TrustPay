'use strict';

const { z } = require('zod');

/**
 * Environment variable schema validation using Zod.
 * The application will crash with a descriptive error if any required
 * variable is missing or malformed — fail fast, fail loud.
 */
const envSchema = z.object({
  // Server
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(5000),
  API_VERSION: z.string().default('v1'),

  // ─── Supabase / Database ──────────────────────────────────────────────────
  // Pooled connection via PgBouncer — used by Prisma Client at runtime
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required (Supabase PgBouncer URL)'),
  // Direct connection — used ONLY by Prisma Migrate (bypasses pgBouncer)
  DIRECT_URL: z.string().min(1, 'DIRECT_URL is required (Supabase direct DB URL)'),
  // Supabase project URL (https://<project-ref>.supabase.co)
  SUPABASE_URL: z.string().url('SUPABASE_URL must be a valid URL'),
  // Supabase anonymous/public key (safe to use client-side)
  SUPABASE_ANON_KEY: z.string().min(1, 'SUPABASE_ANON_KEY is required'),
  // Supabase service role key (server-side ONLY — never expose to client)
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, 'SUPABASE_SERVICE_ROLE_KEY is required'),

  // CORS
  CLIENT_ORIGIN: z.string().default('http://localhost:5173'),
  ALLOWED_ORIGINS: z.string().default('http://localhost:5173'),

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(900000),
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().int().positive().default(100),

  // JWT – required in Phase 1 Part 2 (validated now so startup fails fast)
  JWT_ACCESS_SECRET: z
    .string()
    .min(32, 'JWT_ACCESS_SECRET must be at least 32 characters for security'),
  JWT_REFRESH_SECRET: z
    .string()
    .min(32, 'JWT_REFRESH_SECRET must be at least 32 characters for security'),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),

  // File Upload
  UPLOAD_DIR: z.string().default('uploads'),
  MAX_FILE_SIZE_MB: z.coerce.number().int().positive().default(10),

  // Logging
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'http', 'debug']).default('debug'),
  LOG_DIR: z.string().default('logs'),

  // External services – optional in Phase 1
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  EMAIL_FROM: z.string().optional(),
  RAZORPAY_KEY_ID: z.string().optional(),
  RAZORPAY_KEY_SECRET: z.string().optional(),
  GEMINI_API_KEY: z.string().optional(),
  GOOGLE_MAPS_API_KEY: z.string().optional(),
});

const parseResult = envSchema.safeParse(process.env);

if (!parseResult.success) {
  console.error('❌  Invalid environment configuration:');
  console.error(parseResult.error.format());
  process.exit(1);
}

const env = parseResult.data;

module.exports = { env };
