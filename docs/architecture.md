# TrustPay – Architecture Documentation

## System Overview

TrustPay is a monorepo SaaS platform for secure digital contracts and milestone-based escrow payments between clients and freelance workers. Built for the Indian market with Supabase PostgreSQL, Razorpay payments, and Gemini AI integration.

```
trustpay/
├── client/          # React 19 SPA – Vite + Tailwind + Three.js
├── server/          # Node.js API – Express + Prisma + Socket.IO
├── shared/          # Shared constants, config, validators, types
└── docs/            # Architecture & API documentation
```

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                     CLIENT (Port 5173)                   │
│  React 19 + Vite + Tailwind CSS + Framer Motion          │
│  Three.js (hero)  │  React Router DOM  │  Axios          │
│  React Hook Form  │  Socket.IO Client  │  Zod (client)   │
└───────────────────────────┬─────────────────────────────┘
                            │  HTTP / WebSocket
                            │  (proxied in dev via Vite)
┌───────────────────────────▼─────────────────────────────┐
│                   SERVER (Port 5000)                     │
│  Express.js  │  Helmet  │  CORS  │  Rate Limit           │
│  Socket.IO   │  Morgan  │  Winston  │  express-async     │
│                                                          │
│  /api/v1/                                                │
│   ├── /health          ✅ Phase 1 – DB probe + metrics   │
│   ├── /version         ✅ Phase 1 – version info only    │
│   ├── /auth            🔜 Phase 1 Part 2                 │
│   ├── /users           🔜 Phase 2                        │
│   ├── /workers         🔜 Phase 2                        │
│   ├── /contracts       🔜 Phase 2                        │
│   ├── /escrow          🔜 Phase 3                        │
│   ├── /wallet          🔜 Phase 3                        │
│   ├── /chat            🔜 Phase 4                        │
│   ├── /notifications   🔜 Phase 4                        │
│   ├── /reviews         🔜 Phase 4                        │
│   ├── /analytics       🔜 Phase 5                        │
│   └── /admin           🔜 Phase 5                        │
└───────────────────────────┬─────────────────────────────┘
                            │  Prisma ORM (PgBouncer)
┌───────────────────────────▼─────────────────────────────┐
│              DATABASE – Supabase PostgreSQL               │
│  system_migrations  │  users  │  refresh_tokens          │
│  contracts  │  milestones  │  escrow_accounts            │
│  transactions  │  wallets  │  conversations  │  messages  │
│  notifications  │  reviews  │  admin_logs  │  disputes   │
└─────────────────────────────────────────────────────────┘
                            │  Supabase Storage SDK
┌───────────────────────────▼─────────────────────────────┐
│              STORAGE – Supabase Storage                   │
│  profile-photos (public)  │  contract-attachments        │
│  work-evidence            │  generated-pdfs              │
│  invoices                                                │
└─────────────────────────────────────────────────────────┘
```

---

## Module Architecture (Server)

Each feature module follows a consistent 5-layer architecture:

```
src/modules/<module>/
├── <module>.route.js        # Express routes + middleware
├── <module>.controller.js   # Request/Response handling
├── <module>.service.js      # Business logic
├── <module>.repository.js   # Database queries (extends BaseRepository)
└── <module>.validator.js    # Zod schemas
```

### Layer Responsibilities

| Layer | Responsibility |
|-------|---------------|
| **Route** | Define HTTP endpoints, apply middleware (validate, authenticate, authorize) |
| **Controller** | Parse request, call service, format response via ApiResponse |
| **Service** | Business logic, orchestration between repositories |
| **Repository** | All Prisma queries — extends BaseRepository, no business logic |
| **Validator** | Zod schemas for request validation |

---

## Shared Package Architecture

```
shared/src/
├── constants/
│   └── index.js     # USER_ROLES, CONTRACT_STATUS, ESCROW_STATUS, LIMITS, etc.
├── config/
│   └── index.js     # APP_CONFIG, JWT_CONFIG, STORAGE_BUCKET_NAMES, etc.
├── types/
│   └── index.js     # JSDoc type definitions (AuthUser, JwtPayload, etc.)
├── validators/
│   └── common.js    # Shared Zod schemas (email, password, phone, pagination)
└── index.js         # Barrel export — single import point
```

The shared package is imported in:
- **Server**: `require('../../shared/src')` for constants and config
- **Client**: `import from '../../shared/src'` (via Vite alias)

---

## Server Utilities

```
server/src/utils/
├── ApiError.js      # Base error class + named subclasses
│                    #   ValidationError, AuthenticationError,
│                    #   AuthorizationError, NotFoundError,
│                    #   ConflictError, RateLimitError,
│                    #   InternalServerError, ServiceUnavailableError
├── ApiResponse.js   # Standardized success response builder
├── logger.js        # Winston logger + createChildLogger factory
│                    #   authLogger, walletLogger, contractLogger,
│                    #   adminLogger, storageLogger, socketLogger
├── pagination.js    # buildPaginationArgs, buildPaginationMeta, paginate()
├── crypto.js        # generateSecureToken, hashToken, generateOtp,
│                    #   computeHmac, timingSafeEqual
└── email.js         # Nodemailer service + email templates
```

---

## Repository Pattern

All feature repositories extend `BaseRepository`:

```
server/src/repositories/
└── base.repository.js   # findById, findOne, findMany (paginated), create,
                         # update, updateMany, delete, deleteMany, upsert, exists, count
```

Feature modules provide domain-specific repositories that extend `BaseRepository` and add query methods specific to that domain.

---

## Security Architecture

| Layer | Mechanism |
|-------|-----------|
| Transport | HTTPS (TLS 1.3 in production) |
| Headers | Helmet (CSP, HSTS, X-Frame-Options, etc.) |
| CORS | Origin allowlist from env, credentials enabled |
| Rate Limiting | 100 req/15min global, 10/15min on auth routes |
| Validation | Zod on all inputs, server-side always |
| Authentication | JWT HS256 – Phase 1 Part 2 |
| Authorization | Role-based (CLIENT / WORKER / ADMIN) |
| Passwords | bcrypt + salt (cost factor 12) – Phase 1 Part 2 |
| Tokens | SHA-256 hashed before DB storage |
| Webhooks | HMAC-SHA256 signature verification |
| Uploads | Supabase Storage (MIME + size limits enforced) |
| Logging | Winston structured logs (JSON in prod) + Morgan HTTP logs |

---

## Logging Architecture

Winston logger with domain-specific child loggers:

```javascript
// Generic
const { logger } = require('./utils/logger');

// Domain-specific (preferred)
const { authLogger } = require('./utils/logger');     // module: 'auth'
const { walletLogger } = require('./utils/logger');   // module: 'wallet'
const { contractLogger } = require('./utils/logger'); // module: 'contracts'
const { adminLogger } = require('./utils/logger');    // module: 'admin'
const { storageLogger } = require('./utils/logger');  // module: 'storage'
const { socketLogger } = require('./utils/logger');   // module: 'socket'

// Custom domains
const { createChildLogger } = require('./utils/logger');
const myLogger = createChildLogger('my-module');
```

Log files:
- `logs/combined.log` – all log levels (structured JSON)
- `logs/error.log` – errors only
- `logs/exceptions.log` – uncaught exceptions
- `logs/rejections.log` – unhandled promise rejections

---

## Storage Architecture

All file storage uses **Supabase Storage** (never local filesystem in production).

| Bucket | Access | Max Size | Allowed Types |
|--------|--------|----------|---------------|
| `profile-photos` | Public | 2 MB | JPEG, PNG, WebP |
| `contract-attachments` | Private (signed URL) | 10 MB | PDF, DOCX, DOC, TXT, images |
| `work-evidence` | Private (signed URL) | 50 MB | Images, PDF, ZIP, video |
| `generated-pdfs` | Private (signed URL) | 5 MB | PDF only |
| `invoices` | Private (signed URL) | 5 MB | PDF only |

Bucket constants are in `shared/src/config` as `STORAGE_BUCKET_NAMES`.

---

## Environment Variables

### Required (server startup fails if missing)

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Supabase PgBouncer URL (port 6543, `?pgbouncer=true`) |
| `DIRECT_URL` | Supabase direct URL (port 5432, for migrations) |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_ANON_KEY` | Supabase public/anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-side only) |
| `JWT_ACCESS_SECRET` | JWT signing secret (min 32 chars) |
| `JWT_REFRESH_SECRET` | JWT refresh secret (min 32 chars) |

### Optional (sensible defaults)

| Variable | Default | Description |
|----------|---------|-------------|
| `NODE_ENV` | `development` | Environment |
| `PORT` | `5000` | Server port |
| `API_VERSION` | `v1` | API route prefix |
| `JWT_ACCESS_EXPIRES_IN` | `15m` | Access token TTL |
| `JWT_REFRESH_EXPIRES_IN` | `7d` | Refresh token TTL |
| `CLIENT_ORIGIN` | `http://localhost:5173` | CORS origin |
| `RATE_LIMIT_WINDOW_MS` | `900000` | Rate limit window |
| `RATE_LIMIT_MAX_REQUESTS` | `100` | Max requests per window |
| `LOG_LEVEL` | `debug` | Winston log level |
| `SMTP_HOST` | — | Email SMTP host |
| `SMTP_PORT` | `587` | Email SMTP port |
| `EMAIL_FROM` | — | From address for emails |
| `RAZORPAY_KEY_ID` | — | Razorpay API key |
| `GEMINI_API_KEY` | — | Gemini AI key |

---

## Real-Time Architecture (Socket.IO)

Socket.IO is configured in Phase 1. Events are implemented in Phase 4.

```
Namespaces (planned):
/chat          – Real-time messaging
/notifications – Push notifications
/contracts     – Live contract status updates
```

---

## Development Phases

| Phase | Scope | Status |
|-------|-------|--------|
| 1 – Part 1 | Foundation + Refinement v1.1 | ✅ Complete |
| 1 – Part 2 | Authentication & Session Management + Enterprise Refinement v1.1 | ✅ Complete |
| 1 – Part 3 | Frontend Foundation, Shared UI & Theme System v1.2 | ✅ Complete |
| 1 – Part 4 | Foundation Integration, Security Validation & Production Readiness | ✅ Complete |
| 2 – Part 1 | Worker & Client Management + Enterprise Refinement v1.1 | ✅ Complete |
| 2 – Part 2 | Digital Contract System + Enterprise Refinement v1.1 | ✅ Complete |
| 3 | Escrow, Wallet, Razorpay payments | 🔜 Pending |
| 4 | Chat, Notifications, Reviews, AI (Gemini) | 🔜 Pending |
| 5 | Analytics dashboard, Admin panel, Disputes | 🔜 Pending |

---

## Session Lifecycle & Refresh Token Architecture (Phase 1 Part 2 Refinement)

### Session Model Schema
- **id**: Unique session identifier (`cuid`).
- **userId**: User ID associated with the session.
- **refreshTokenId**: One-to-one reference to the active `RefreshToken` record in database.
- **deviceName**, **browser**, **operatingSystem**, **ipAddress**: Client environment metadata extracted automatically from incoming requests.
- **loginTime**: Timestamp when session was created.
- **lastActiveTime**: Updated during token rotation.
- **logoutTime**: Timestamp recorded when session is revoked.
- **expiresAt**: Session expiration timestamp.
- **status**: `ACTIVE` | `REVOKED` | `EXPIRED`.

### Refresh Token Lifecycle & Rotation Flow
```
User Login / Register
       │
       ▼
Issue Access Token (15m) + Refresh Token (7d)
       │
       ▼
Create Session record (status: ACTIVE, bound to RefreshToken)
       │
       ├─────────────────────────────────────────────┐
       │ (Access Token Expired)                      │ (User Logged Out / Password Changed)
       ▼                                             ▼
POST /api/v1/auth/refresh                    Revoke RefreshToken
       │                                     Mark Session status = REVOKED
       ├── Token Valid & Active?                     LogoutTime set to current time
       │    ├── YES: Issue new RefreshToken & Access Token
       │    │        Revoke old RefreshToken (replacedByToken = newTokenHash)
       │    │        Update Session refreshTokenId & lastActiveTime (Token Rotation)
       │    │        Log REFRESH_TOKEN_ROTATED audit event
       │    │
       │    └── REVOKED TOKEN DETECTED (Token Reuse Attack Alert):
       │             Revoke ALL active RefreshTokens for user
       │             Revoke ALL active Sessions for user
       │             Log UNAUTHORIZED_ACCESS & LOGOUT_ALL_DEVICES audit events
       │             Return 401 Unauthorized Security Alert
       │
       └── Token Expired?
            Set Session status = EXPIRED
            Return 401 Unauthorized
```

---

## Authentication Audit Logging Flow

All authentication activities are automatically recorded via the pre-built Winston `authLogger`.

### Supported Audit Events
- `USER_REGISTRATION` – User account created.
- `LOGIN_SUCCESS` – Successful login authentication.
- `LOGIN_FAILED` – Invalid credentials, disabled account attempt.
- `LOGOUT` – Single-device logout.
- `LOGOUT_ALL_DEVICES` – Total account logout across all devices.
- `REFRESH_TOKEN_ISSUED` – New refresh token granted.
- `REFRESH_TOKEN_ROTATED` – Refresh token exchange & rotation.
- `PASSWORD_RESET_REQUESTED` – Password reset email dispatch.
- `PASSWORD_RESET_SUCCESS` – Password successfully reset.
- `PASSWORD_CHANGED` – Password updated from user profile.
- `EMAIL_VERIFICATION_SENT` – Verification email sent.
- `EMAIL_VERIFIED_SUCCESS` – Email address verified.
- `UNAUTHORIZED_ACCESS` – Missing/invalid access token, token reuse attack.
- `FORBIDDEN_ACCESS` – Insufficient user role permissions.

### Structured Audit Payload Format
Every audit entry contains:
```json
{
  "module": "auth",
  "eventType": "LOGIN_SUCCESS",
  "userId": "cm123456789",
  "email": "user@example.com",
  "role": "CLIENT",
  "status": "SUCCESS",
  "errorMessage": null,
  "ipAddress": "127.0.0.1",
  "userAgent": "Mozilla/5.0...",
  "browser": "Chrome 120",
  "operatingSystem": "Windows 10/11",
  "deviceType": "Desktop",
  "requestId": "550e8400-e29b-41d4-a716-446655440000",
  "timestamp": "2026-08-02T12:00:00.000Z"
}
```
> **Security Requirement**: Passwords, raw JWTs, refresh tokens, and sensitive PII are strictly omitted from all log payloads.

---

## Digital Contract System Architecture (Phase 2 Part 2 Refinement v1.1)

### 1. Human-Readable Contract Numbering
- **Format**: `TP-YYYY-XXXXXX` (e.g. `TP-2026-000001`).
- **Generation**: Auto-generated sequential business number per calendar year, stored in `contractNumber` column separately from internal `cuid` database IDs.

### 2. Contract Lifecycle & Immutable Accepted State
```
DRAFT ➔ PENDING_REVIEW ➔ PENDING_ACCEPTANCE ➔ ACCEPTED (Immutable)
                                          │
                                          ├─► REJECTED
                                          ├─► CANCELLED
                                          └─► EXPIRED / ARCHIVED
```
- **Immutability Enforcement**: Contracts in `ACCEPTED` or `ARCHIVED` status are immutable. Modifying accepted terms requires spawning a new contract or creating a new version without overwriting executed contracts.

### 3. SHA-256 Cryptographic Integrity Hashing
- **`contentHash`**: SHA-256 digest of contract scope, deliverables, title, and terms & conditions.
- **`pdfHash`**: SHA-256 digest of the generated PDF document buffer.
- **`signatureHash`**: SHA-256 combined digest of contract number, signer ID, role, IP address, and timestamp.

### 4. Contract Permissions Model
- **`Contract Creator (Client)`**: Full draft/edit rights prior to acceptance, sign, view, download PDF.
- **`Assigned Specialist (Worker)`**: Review terms, sign, reject, view, download PDF.
- **`Admin`**: Superuser audit access, view, download PDF, archive.

### 5. Attachment & Storage Organization
Centralized bucket paths via `STORAGE_PATHS`:
- `contracts/attachments/{contractId}/` – Contract attachments linked to `contractVersionId`.
- `contracts/pdfs/{contractId}/` – Generated contract PDF files.
- `contracts/signatures/{contractId}/` – Digital signature artifacts.

---

## Escrow Wallet & Payment Management Architecture (Phase 2 Part 3 Refinement v1.1)

### 1. Wallet Lifecycle & Multi-Currency Schema
- **Statuses**: `ACTIVE`, `FROZEN`, `SUSPENDED`, `CLOSED`.
- **Multi-Currency Fields**: ISO-4217 currency code (`INR`), minor units (`100` paise per INR), and exchange rate (nullable).

### 2. Append-Only Immutable Double-Entry Ledger
- **Immutability Protection**: `WalletTransaction` entries are append-only. No updates or deletions are allowed. Reversals use reversing & correcting transaction records.
- **Balances Tracked**: `balanceBefore` and `balanceAfter` calculated per transaction for `availableBalance`, `heldBalance`, `releasedBalance`, and `refundedBalance`.

### 3. Financial Idempotency Strategy
- Financial endpoints (`/escrow/deposit/order`, `/escrow/deposit/verify`, `/escrow/release`, `/escrow/refund`) accept `idempotencyKey` headers or body fields.
- Duplicate incoming requests return existing completed transaction results without duplicating financial ledger entries.

### 4. Escrow State Machine
```
PENDING ➔ FUNDED ➔ HELD ➔ RELEASED (to Specialist)
                       │
                       ├─► REFUNDED (to Client)
                       └─► CANCELLED
```

### 5. Dedicated Gateway Payment Event Log
- Gateway events (`ORDER_CREATED`, `PAYMENT_SUCCESS`, `PAYMENT_FAILURE`, `WEBHOOK_RECEIVED`) are tracked in `PaymentEvent` table, isolated from the accounting ledger.

### 6. Invoice Versioning & Tax Invoice PDF Generation
- Invoices track `invoiceNumber` (`INV-2026-000001`), `versionNumber`, and `isLatest`.
- PDFs generated on demand using PDFKit with TrustPay branding, party details, line items, and tax breakdown.

### 7. Financial Storage Structure
Centralized bucket paths via `STORAGE_PATHS`:
- `financial/invoices/{invoiceId}/` – Invoice PDF documents.
- `financial/receipts/{receiptId}/` – Deposit payment receipts.
- `financial/payment-proofs/{paymentId}/` – Payment gateway verification artifacts.


