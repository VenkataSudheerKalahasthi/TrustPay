'use strict';

/**
 * TrustPay – Shared JSDoc Type Definitions
 *
 * Centralized type documentation used across the entire monorepo.
 * These are pure JSDoc types — no runtime code, no imports.
 *
 * Usage: Import this file only in JSDoc @type annotations.
 * In TypeScript projects, these would be .d.ts files.
 */

// ─── User & Auth Types ────────────────────────────────────────────────────────

/**
 * @typedef {'CLIENT' | 'WORKER' | 'ADMIN'} UserRole
 */

/**
 * @typedef {object} AuthUser
 * @property {string}   id              - CUID
 * @property {string}   email
 * @property {UserRole} role
 * @property {string}   firstName
 * @property {string}   lastName
 * @property {string|null} avatarUrl
 * @property {boolean}  isEmailVerified
 * @property {boolean}  isActive
 * @property {string}   createdAt       - ISO 8601
 */

/**
 * @typedef {object} JwtPayload
 * @property {string}   sub             - User ID
 * @property {string}   email
 * @property {UserRole} role
 * @property {string}   type            - 'access' | 'refresh'
 * @property {number}   iat             - Issued at (Unix timestamp)
 * @property {number}   exp             - Expires at (Unix timestamp)
 */

/**
 * @typedef {object} TokenPair
 * @property {string} accessToken
 * @property {string} refreshToken
 * @property {number} expiresIn        - Access token TTL in seconds
 */

// ─── API Response Types ───────────────────────────────────────────────────────

/**
 * @template T
 * @typedef {object} ApiSuccessResponse
 * @property {true}   success
 * @property {number} statusCode
 * @property {string} message
 * @property {T}      data
 * @property {PaginationMeta|null} meta
 * @property {string} requestId
 * @property {string} timestamp        - ISO 8601
 */

/**
 * @typedef {object} ApiErrorResponse
 * @property {false}  success
 * @property {number} statusCode
 * @property {string} message
 * @property {ValidationError[]} errors
 * @property {string} requestId
 * @property {string} timestamp        - ISO 8601
 */

/**
 * @typedef {object} ValidationError
 * @property {string} field
 * @property {string} message
 */

/**
 * @typedef {object} PaginationMeta
 * @property {number} page
 * @property {number} limit
 * @property {number} total
 * @property {number} totalPages
 * @property {boolean} hasNextPage
 * @property {boolean} hasPrevPage
 */

// ─── Contract Types ───────────────────────────────────────────────────────────

/**
 * @typedef {'DRAFT' | 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'DISPUTED' | 'CANCELLED'} ContractStatus
 */

/**
 * @typedef {'PENDING' | 'IN_PROGRESS' | 'SUBMITTED' | 'APPROVED' | 'REJECTED' | 'PAID'} MilestoneStatus
 */

/**
 * @typedef {object} Milestone
 * @property {string}          id
 * @property {string}          title
 * @property {string}          description
 * @property {number}          amount         - INR
 * @property {MilestoneStatus} status
 * @property {string|null}     dueDate        - ISO 8601
 */

// ─── Escrow & Wallet Types ────────────────────────────────────────────────────

/**
 * @typedef {'FUNDED' | 'HELD' | 'RELEASED' | 'REFUNDED' | 'DISPUTED'} EscrowStatus
 */

/**
 * @typedef {'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'REVERSED'} TransactionStatus
 */

/**
 * @typedef {object} Transaction
 * @property {string}            id
 * @property {string}            type        - 'CREDIT' | 'DEBIT'
 * @property {number}            amount      - INR
 * @property {TransactionStatus} status
 * @property {string|null}       description
 * @property {string}            createdAt   - ISO 8601
 */

// ─── Notification Types ───────────────────────────────────────────────────────

/**
 * @typedef {object} Notification
 * @property {string}  id
 * @property {string}  type        - One of NOTIFICATION_TYPES
 * @property {string}  title
 * @property {string}  message
 * @property {boolean} isRead
 * @property {object|null} data    - Type-specific payload
 * @property {string}  createdAt  - ISO 8601
 */

// ─── Storage Types ────────────────────────────────────────────────────────────

/**
 * @typedef {object} UploadResult
 * @property {string} path        - Supabase storage path
 * @property {string} bucket      - Bucket name
 * @property {string} url         - Public or signed URL
 * @property {string} filename    - Original filename
 * @property {number} size        - Size in bytes
 * @property {string} mimeType
 */

// ─── Pagination Query ─────────────────────────────────────────────────────────

/**
 * @typedef {object} PaginationQuery
 * @property {number} page
 * @property {number} limit
 * @property {string} [sortBy]
 * @property {'asc' | 'desc'} [sortOrder]
 * @property {string} [search]
 */

module.exports = {};
