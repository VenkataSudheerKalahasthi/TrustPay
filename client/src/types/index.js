/**
 * TrustPay – Client-Side JSDoc Type Definitions
 *
 * Expanded type documentation for the React application.
 * All types align with the server Prisma schema and shared types.
 *
 * @module types
 */

// ─── User & Auth ─────────────────────────────────────────────────────────────

/**
 * @typedef {'CLIENT' | 'WORKER' | 'ADMIN'} UserRole
 */

/**
 * @typedef {object} User
 * @property {string}      id
 * @property {string}      email
 * @property {UserRole}    role
 * @property {string}      firstName
 * @property {string}      lastName
 * @property {string|null} avatarUrl
 * @property {boolean}     isEmailVerified
 * @property {boolean}     isActive
 * @property {string}      createdAt      - ISO 8601
 */

/**
 * @typedef {object} AuthState
 * @property {User|null} user
 * @property {boolean}   isAuthenticated
 * @property {boolean}   isLoading
 */

// ─── API ─────────────────────────────────────────────────────────────────────

/**
 * @template T
 * @typedef {object} ApiResponse
 * @property {true}            success
 * @property {number}          statusCode
 * @property {string}          message
 * @property {T}               data
 * @property {PaginationMeta|null} meta
 * @property {string}          requestId
 * @property {string}          timestamp
 */

/**
 * @typedef {object} ApiErrorResponse
 * @property {false}       success
 * @property {number}      statusCode
 * @property {string}      message
 * @property {FieldError[]} errors
 */

/**
 * @typedef {object} FieldError
 * @property {string} field
 * @property {string} message
 */

/**
 * @typedef {object} PaginationMeta
 * @property {number}  page
 * @property {number}  limit
 * @property {number}  total
 * @property {number}  totalPages
 * @property {boolean} hasNextPage
 * @property {boolean} hasPrevPage
 */

// ─── Contracts ────────────────────────────────────────────────────────────────

/**
 * @typedef {'DRAFT'|'PENDING'|'ACTIVE'|'COMPLETED'|'DISPUTED'|'CANCELLED'} ContractStatus
 */

/**
 * @typedef {object} Contract
 * @property {string}         id
 * @property {string}         title
 * @property {string}         description
 * @property {number}         totalAmount    - INR
 * @property {ContractStatus} status
 * @property {string}         clientId
 * @property {string}         workerId
 * @property {Milestone[]}    milestones
 * @property {string}         createdAt
 * @property {string}         updatedAt
 */

/**
 * @typedef {'PENDING'|'IN_PROGRESS'|'SUBMITTED'|'APPROVED'|'REJECTED'|'PAID'} MilestoneStatus
 */

/**
 * @typedef {object} Milestone
 * @property {string}          id
 * @property {string}          title
 * @property {string}          description
 * @property {number}          amount
 * @property {MilestoneStatus} status
 * @property {string|null}     dueDate
 */

// ─── Notifications ────────────────────────────────────────────────────────────

/**
 * @typedef {object} Notification
 * @property {string}      id
 * @property {string}      type
 * @property {string}      title
 * @property {string}      message
 * @property {boolean}     isRead
 * @property {object|null} data
 * @property {string}      createdAt
 */

// ─── UI Components ────────────────────────────────────────────────────────────

/**
 * @typedef {'primary'|'secondary'|'outline'|'ghost'|'danger'|'success'|'gradient'} ButtonVariant
 */

/**
 * @typedef {'xs'|'sm'|'md'|'lg'|'xl'} ComponentSize
 */

/**
 * @typedef {'primary'|'secondary'|'accent'|'surface'|'danger'|'success'|'warning'} BadgeVariant
 */

// ─── Forms ───────────────────────────────────────────────────────────────────

/**
 * @typedef {object} RegisterFormData
 * @property {string}   firstName
 * @property {string}   lastName
 * @property {string}   email
 * @property {string}   password
 * @property {string}   confirmPassword
 * @property {UserRole} role
 */

/**
 * @typedef {object} LoginFormData
 * @property {string}  email
 * @property {string}  password
 * @property {boolean} [rememberMe]
 */

export {};
