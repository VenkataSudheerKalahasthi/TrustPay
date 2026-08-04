'use strict';

/**
 * Shared constants used by both client and server.
 * Keep this file framework-agnostic — no React, no Express.
 */

// ─── User Roles ───────────────────────────────────────────────────────────────
const USER_ROLES = Object.freeze({
  CLIENT: 'CLIENT',
  WORKER: 'WORKER',
  ADMIN: 'ADMIN',
});

// ─── Verification Statuses ───────────────────────────────────────────────────
const VERIFICATION_STATUS = Object.freeze({
  PENDING: 'PENDING',
  VERIFIED: 'VERIFIED',
  REJECTED: 'REJECTED',
});

// ─── Availability Statuses ───────────────────────────────────────────────────
const AVAILABILITY_STATUS = Object.freeze({
  AVAILABLE: 'AVAILABLE',
  BUSY: 'BUSY',
  ON_VACATION: 'ON_VACATION',
  OFFLINE: 'OFFLINE',
});

// ─── Document Types ───────────────────────────────────────────────────────────
const DOCUMENT_TYPES = Object.freeze({
  GOVERNMENT_ID: 'GOVERNMENT_ID',
  PASSPORT: 'PASSPORT',
  DRIVING_LICENSE: 'DRIVING_LICENSE',
  NATIONAL_ID: 'NATIONAL_ID',
  PAN_CARD: 'PAN_CARD',
  AADHAAR_CARD: 'AADHAAR_CARD',
  OTHER: 'OTHER',
});

// ─── Storage Bucket Paths ─────────────────────────────────────────────────────
const STORAGE_PATHS = Object.freeze({
  PROFILE_PHOTOS: 'profile-photos',
  WORKER_COVERS: 'worker-covers',
  PORTFOLIO_IMAGES: 'portfolio-images',
  PORTFOLIO_DOCUMENTS: 'portfolio-documents',
  RESUMES: 'resumes',
  VERIFICATION_DOCUMENTS: 'verification-documents',
  CONTRACT_ATTACHMENTS: 'contracts/attachments',
  CONTRACT_PDFS: 'contracts/pdfs',
  CONTRACT_SIGNATURES: 'contracts/signatures',
  FINANCIAL_INVOICES: 'financial/invoices',
  FINANCIAL_RECEIPTS: 'financial/receipts',
  FINANCIAL_PAYMENT_PROOFS: 'financial/payment-proofs',
});

// ─── Contract Statuses ────────────────────────────────────────────────────────
const CONTRACT_STATUS = Object.freeze({
  DRAFT: 'DRAFT',
  PENDING_REVIEW: 'PENDING_REVIEW',
  PENDING_ACCEPTANCE: 'PENDING_ACCEPTANCE',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
  CANCELLED: 'CANCELLED',
  EXPIRED: 'EXPIRED',
  ARCHIVED: 'ARCHIVED',
});

// ─── Signature Statuses ───────────────────────────────────────────────────────
const SIGNATURE_STATUS = Object.freeze({
  PENDING: 'PENDING',
  SIGNED: 'SIGNED',
});

// ─── Contract Activity Actions ────────────────────────────────────────────────
const CONTRACT_ACTIVITY_ACTIONS = Object.freeze({
  CREATED: 'CREATED',
  EDITED: 'EDITED',
  SUBMITTED: 'SUBMITTED',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
  CANCELLED: 'CANCELLED',
  DOWNLOADED: 'DOWNLOADED',
  VIEWED: 'VIEWED',
  VERSION_CREATED: 'VERSION_CREATED',
  SIGNATURE_ADDED: 'SIGNATURE_ADDED',
});

// ─── Escrow Wallet Statuses ───────────────────────────────────────────────────
const ESCROW_WALLET_STATUS = Object.freeze({
  ACTIVE: 'ACTIVE',
  FROZEN: 'FROZEN',
  SUSPENDED: 'SUSPENDED',
  CLOSED: 'CLOSED',
});

// ─── Escrow States ────────────────────────────────────────────────────────────
const ESCROW_STATE = Object.freeze({
  PENDING: 'PENDING',
  FUNDED: 'FUNDED',
  HELD: 'HELD',
  RELEASED: 'RELEASED',
  REFUNDED: 'REFUNDED',
  CANCELLED: 'CANCELLED',
});

// ─── Transaction Types ────────────────────────────────────────────────────────
const TRANSACTION_TYPES = Object.freeze({
  DEPOSIT: 'DEPOSIT',
  HOLD: 'HOLD',
  RELEASE: 'RELEASE',
  REFUND: 'REFUND',
  CANCEL: 'CANCEL',
  REVERSAL: 'REVERSAL',
});

// ─── Escrow Statuses ──────────────────────────────────────────────────────────
const ESCROW_STATUS = Object.freeze({
  FUNDED: 'FUNDED',
  HELD: 'HELD',
  RELEASED: 'RELEASED',
  REFUNDED: 'REFUNDED',
  DISPUTED: 'DISPUTED',
});

// ─── Milestone Statuses ───────────────────────────────────────────────────────
const MILESTONE_STATUS = Object.freeze({
  PENDING: 'PENDING',
  IN_PROGRESS: 'IN_PROGRESS',
  SUBMITTED: 'SUBMITTED',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  PAID: 'PAID',
});

// ─── Transaction Statuses ─────────────────────────────────────────────────────
const TRANSACTION_STATUS = Object.freeze({
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  REVERSED: 'REVERSED',
});

// ─── Notification Types ───────────────────────────────────────────────────────
const NOTIFICATION_TYPES = Object.freeze({
  CONTRACT_CREATED: 'CONTRACT_CREATED',
  CONTRACT_SIGNED: 'CONTRACT_SIGNED',
  MILESTONE_SUBMITTED: 'MILESTONE_SUBMITTED',
  MILESTONE_APPROVED: 'MILESTONE_APPROVED',
  PAYMENT_RECEIVED: 'PAYMENT_RECEIVED',
  PAYMENT_RELEASED: 'PAYMENT_RELEASED',
  DISPUTE_OPENED: 'DISPUTE_OPENED',
  DISPUTE_RESOLVED: 'DISPUTE_RESOLVED',
  REVIEW_RECEIVED: 'REVIEW_RECEIVED',
});

// ─── Limits ───────────────────────────────────────────────────────────────────
const LIMITS = Object.freeze({
  MAX_FILE_SIZE_MB: 10,
  MAX_MILESTONES_PER_CONTRACT: 20,
  MAX_IMAGES_PER_PROFILE: 5,
  MIN_CONTRACT_AMOUNT: 500,   // INR
  MAX_CONTRACT_AMOUNT: 10000000, // 1 Crore INR
  PASSWORD_MIN_LENGTH: 8,
  USERNAME_MAX_LENGTH: 30,
  BIO_MAX_LENGTH: 1000,
  REVIEW_MAX_LENGTH: 500,
});

module.exports = {
  USER_ROLES,
  VERIFICATION_STATUS,
  AVAILABILITY_STATUS,
  DOCUMENT_TYPES,
  STORAGE_PATHS,
  CONTRACT_STATUS,
  SIGNATURE_STATUS,
  CONTRACT_ACTIVITY_ACTIONS,
  ESCROW_WALLET_STATUS,
  ESCROW_STATE,
  TRANSACTION_TYPES,
  ESCROW_STATUS,
  MILESTONE_STATUS,
  TRANSACTION_STATUS,
  NOTIFICATION_TYPES,
  LIMITS,
};
