# 03. Database Specifications & Schema Architecture – TrustPay Enterprise v2.0

## 1. Database Schema Overview

TrustPay Enterprise v2.0 uses a highly normalized **PostgreSQL** relational schema managed via **Prisma ORM**. 

- **Total Models**: 88 Normalized Models
- **Total Enums**: 34 Typed Enums
- **Primary Data Store**: Supabase PostgreSQL with PgBouncer Transaction Pooler (Port 6543)
- **Direct Migration Port**: PostgreSQL Direct Connection (Port 5432)

---

## 2. High-Level Entity Relationship Diagram (ERD)

```mermaid
erDiagram
    User ||--o{ UserProfile : has
    User ||--o{ RefreshToken : owns
    User ||--o{ JobPost : creates
    User ||--o{ JobApplication : submits
    User ||--o{ Contract : signs
    User ||--o1 EscrowWallet : possesses
    
    Organization ||--o{ User : employs
    Organization ||--o{ JobPost : sponsors
    Organization ||--o{ Contract : executes
    
    JobPost ||--o{ JobApplication : receives
    JobPost ||--o1 Contract : results_in
    
    Contract ||--o{ Milestone : contains
    Contract ||--o{ ContractVersion : tracks
    
    Milestone ||--o1 EscrowDeposit : funds
    EscrowWallet ||--o{ EscrowDeposit : holds
    EscrowWallet ||--o{ TransactionLedger : records
    
    Milestone ||--o{ DisputeCase : escalates
    DisputeCase ||--o{ DisputeEvidence : attaches
```

---

## 3. Core Database Tables & Enums Breakdown

### A. Authentication & User Management Models

#### 1. `User` Model
Represents every platform user account across all 5 roles.
- `id`: `String` (UUID v4 Primary Key)
- `email`: `String` (Unique, Indexed)
- `passwordHash`: `String` (bcrypt salt factor 10)
- `role`: `UserRole` Enum (`ADMIN`, `ORG_ADMIN`, `CLIENT`, `WORKER`, `GUEST`)
- `status`: `UserStatus` Enum (`ACTIVE`, `PENDING_VERIFICATION`, `SUSPENDED`, `ARCHIVED`)
- `organizationId`: `String` (Nullable Foreign Key to `Organization.id`)
- `createdAt`, `updatedAt`: `DateTime`

#### 2. `Organization` Model
Represents enterprise entities hiring talent at scale.
- `id`: `String` (UUID v4 Primary Key)
- `name`: `String` (Organization Legal Name)
- `domain`: `String` (Unique Domain Name)
- `subscriptionTier`: `SubscriptionTier` Enum (`FREE`, `PROFESSIONAL`, `ENTERPRISE`)
- `isVerified`: `Boolean` (Default: `false`)

---

### B. Marketplace & Hiring Models

#### 3. `JobPost` Model
- `id`: `String` (UUID Primary Key)
- `title`: `String` (Job Title)
- `description`: `String` (Full Description)
- `budget`: `Decimal` (Total Allocated Budget)
- `jobType`: `JobType` Enum (`FIXED_PRICE`, `HOURLY`, `MILESTONE_BASED`)
- `status`: `JobStatus` Enum (`DRAFT`, `OPEN`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`)
- `clientId`: `String` (Foreign Key to `User.id`)

#### 4. `JobApplication` Model
- `id`: `String` (UUID Primary Key)
- `jobId`: `String` (Foreign Key to `JobPost.id`)
- `workerId`: `String` (Foreign Key to `User.id`)
- `proposedRate`: `Decimal`
- `coverLetter`: `String`
- `aiMatchScore`: `Float` (AI-calculated candidate relevance score 0.0 - 100.0)
- `status`: `ApplicationStatus` Enum (`SUBMITTED`, `SHORTLISTED`, `REJECTED`, `HIRED`)

---

### C. Contracts & Escrow Models

#### 5. `Contract` Model
- `id`: `String` (UUID Primary Key)
- `contractNumber`: `String` (Unique Serial Identifier e.g., `TP-CNT-2026-0042`)
- `title`: `String`
- `totalAmount`: `Decimal`
- `clientId`: `String` (Foreign Key to `User.id`)
- `workerId`: `String` (Foreign Key to `User.id`)
- `status`: `ContractStatus` Enum (`DRAFT`, `PENDING_SIGNATURE`, `ACTIVE`, `COMPLETED`, `DISPUTED`, `TERMINATED`)
- `digitalSignatureHash`: `String` (Cryptographic signature hash)

#### 6. `EscrowWallet` Model
- `id`: `String` (UUID Primary Key)
- `userId`: `String` (Unique Foreign Key to `User.id`)
- `balance`: `Decimal` (Available Available Unlocked Cash)
- `lockedBalance`: `Decimal` (Locked Active Escrow Funds)
- `currency`: `String` (Default: `INR`)

#### 7. `EscrowDeposit` Model
- `id`: `String` (UUID Primary Key)
- `walletId`: `String` (Foreign Key to `EscrowWallet.id`)
- `contractId`: `String` (Foreign Key to `Contract.id`)
- `milestoneId`: `String` (Foreign Key to `Milestone.id`)
- `amount`: `Decimal`
- `status`: `EscrowStatus` Enum (`HELD`, `RELEASED`, `REFUNDED`, `DISPUTED`)

---

### D. Governance, Performance & Release Models (Phase 4 & 5)

#### 8. `PerformanceProfile` Model
- `id`: `String` (UUID Primary Key)
- `metricName`: `String`
- `targetLatencyMs`: `Float`
- `actualLatencyMs`: `Float`
- `status`: `String` (`PASSED`, `WARNING`, `FAILED`)

#### 9. `ReleaseCertification` Model
- `id`: `String` (UUID Primary Key)
- `version`: `String` (Unique e.g. `v2.0.0`)
- `stage`: `ReleaseStage` Enum (`ALPHA`, `BETA`, `STAGING`, `PRODUCTION`)
- `status`: `CertificationStatus` Enum (`PENDING`, `IN_REVIEW`, `CERTIFIED`, `REJECTED`)
- `certifiedBy`: `String`

---

## 4. Foreign Key Constraints & Cascade Rules

To guarantee financial and relational data integrity:
1. **User Deletion**: `User` ➔ `UserProfile` uses `ON DELETE CASCADE`.
2. **Contract Deletion Safeguard**: `Contract` references `User` using `ON DELETE RESTRICT`. Users cannot be deleted while active contracts exist.
3. **Escrow Double-Entry Security**: `EscrowDeposit` references `EscrowWallet` using `ON DELETE RESTRICT`. Escrow deposits can never be deleted if transactions are active.
4. **Soft Delete Policy**: High-value records (`JobPost`, `Contract`, `Invoice`) utilize soft-deletion flags (`isArchived: Boolean`, `deletedAt: DateTime`) rather than physical DB row deletion.

---

## 5. High-Frequency Database Indexes

To achieve sub-50ms API query response times, explicit PostgreSQL indexes are defined in `schema.prisma`:
- `@@index([email])` on `User`
- `@@index([clientId, status])` on `JobPost`
- `@@index([workerId, status])` on `JobApplication`
- `@@index([contractNumber])` on `Contract`
- `@@index([userId])` on `EscrowWallet`
- `@@index([status, createdAt])` on `DisputeCase`
