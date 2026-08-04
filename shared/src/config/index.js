'use strict';

/**
 * TrustPay – Shared Application Configuration
 *
 * Centralized constants for application identity, versioning,
 * storage buckets, and environment-level settings.
 * Keep this file framework-agnostic — no React, no Express.
 */

// ─── Application Identity ─────────────────────────────────────────────────────
const APP_CONFIG = Object.freeze({
  NAME: 'TrustPay',
  TAGLINE: 'Secure Digital Contract & Escrow Platform',
  VERSION: '1.0.0',
  SUPPORT_EMAIL: 'support@trustpay.app',
  WEBSITE: 'https://trustpay.app',
  /** Indian market focus */
  LOCALE: 'en-IN',
  CURRENCY: 'INR',
  TIMEZONE: 'Asia/Kolkata',
});

// ─── API Configuration ────────────────────────────────────────────────────────
const API_CONFIG = Object.freeze({
  VERSION: 'v1',
  PREFIX: '/api',
  /** Requests older than this are considered timed out (ms) */
  DEFAULT_TIMEOUT_MS: 30000,
});

// ─── Supabase Storage Bucket Names ────────────────────────────────────────────
/**
 * Use these constants everywhere — never hard-code bucket name strings.
 * Matches the bucket definitions in server/src/config/storage.js.
 */
const STORAGE_BUCKET_NAMES = Object.freeze({
  PROFILE_PHOTOS: 'profile-photos',
  CONTRACT_ATTACHMENTS: 'contract-attachments',
  WORK_EVIDENCE: 'work-evidence',
  GENERATED_PDFS: 'generated-pdfs',
  INVOICES: 'invoices',
});

// ─── JWT Configuration ────────────────────────────────────────────────────────
const JWT_CONFIG = Object.freeze({
  ACCESS_EXPIRES_IN: '15m',
  REFRESH_EXPIRES_IN: '7d',
  ALGORITHM: 'HS256',
});

// ─── Pagination Defaults ──────────────────────────────────────────────────────
const PAGINATION_CONFIG = Object.freeze({
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
});

// ─── Rate Limiting ────────────────────────────────────────────────────────────
const RATE_LIMIT_CONFIG = Object.freeze({
  /** Global API rate limit */
  GLOBAL_WINDOW_MS: 15 * 60 * 1000,  // 15 minutes
  GLOBAL_MAX_REQUESTS: 100,
  /** Strict limit for auth endpoints */
  AUTH_WINDOW_MS: 15 * 60 * 1000,    // 15 minutes
  AUTH_MAX_REQUESTS: 10,
});

// ─── File Upload Constraints ──────────────────────────────────────────────────
const UPLOAD_CONFIG = Object.freeze({
  MAX_PROFILE_PHOTO_MB: 2,
  MAX_CONTRACT_ATTACHMENT_MB: 10,
  MAX_WORK_EVIDENCE_MB: 50,
  MAX_PDF_MB: 5,
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
    'text/plain',
  ],
});

// ─── Password Policy ──────────────────────────────────────────────────────────
const PASSWORD_CONFIG = Object.freeze({
  MIN_LENGTH: 8,
  MAX_LENGTH: 128,
  BCRYPT_SALT_ROUNDS: 12,
  RESET_TOKEN_EXPIRES_MS: 60 * 60 * 1000,         // 1 hour
  EMAIL_VERIFY_TOKEN_EXPIRES_MS: 24 * 60 * 60 * 1000, // 24 hours
});

// ─── Socket.IO Namespaces ─────────────────────────────────────────────────────
const SOCKET_NAMESPACES = Object.freeze({
  CHAT: '/chat',
  NOTIFICATIONS: '/notifications',
  CONTRACTS: '/contracts',
});

// ─── Razorpay ─────────────────────────────────────────────────────────────────
const PAYMENT_CONFIG = Object.freeze({
  CURRENCY: 'INR',
  /** Minimum payout amount in paisa (₹1 = 100 paisa) */
  MIN_PAYOUT_PAISA: 50000,  // ₹500
  /** Platform fee percentage */
  PLATFORM_FEE_PERCENT: 2.5,
});

module.exports = {
  APP_CONFIG,
  API_CONFIG,
  STORAGE_BUCKET_NAMES,
  JWT_CONFIG,
  PAGINATION_CONFIG,
  RATE_LIMIT_CONFIG,
  UPLOAD_CONFIG,
  PASSWORD_CONFIG,
  SOCKET_NAMESPACES,
  PAYMENT_CONFIG,
};
