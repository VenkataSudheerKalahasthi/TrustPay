# TrustPay

**Secure Digital Contract & Escrow Platform for Clients and Workers**

TrustPay enables freelancers and clients to create legally binding digital contracts, manage milestone-based escrow payments, collaborate with AI assistance, and administer multi-tenant organizations — all in one enterprise platform.

---

## Monorepo Structure

```
trustpay/
├── client/          # React 18 + Vite + Tailwind CSS frontend
├── server/          # Node.js + Express + Prisma backend
├── shared/          # Shared constants, validators, and types
└── docs/            # Architecture, API Reference, Admin, and User Guides
```

## Tech Stack

| Layer        | Technology                                          |
|--------------|-----------------------------------------------------|
| Frontend     | React 18, Vite, Tailwind CSS, Framer Motion, Lucide Icons |
| Backend      | Node.js LTS, Express.js                             |
| Database     | PostgreSQL + Prisma ORM (Supabase Host)             |
| AI Engine    | Google Gemini API v1beta Provider                   |
| Storage      | Supabase Storage Adapter & Signed URLs              |
| Validation   | Zod                                                 |
| Security     | SHA-256 Hashing, HMAC Signatures, Helmet, CORS      |
| Real-Time    | Socket.IO                                           |

## Getting Started

### Prerequisites

- Node.js >= 20.0.0
- PostgreSQL >= 15
- npm >= 10.0.0

### Installation

```bash
# Install all workspace dependencies
npm install

# Set up environment variables
cp server/.env.example server/.env
cp client/.env.example client/.env

# Generate Prisma client
cd server
npx prisma generate
```

### Running in Development

```bash
# From root — starts both client and server
npm run dev

# Or individually:
npm run dev:client     # http://localhost:5173
npm run dev:server     # http://localhost:5000
```

### API Health Check

```
GET http://localhost:5000/api/v1/health             # Full health check (DB latency, memory, uptime)
GET http://localhost:5000/api/v1/health/readiness   # Readiness probe
GET http://localhost:5000/api/v1/health/version     # Version info
GET http://localhost:5000/api/v1/health/diagnostics # Diagnostics
```

---

## Complete Feature Matrix (Phase 1 to Phase 3)

| Module | Feature Capabilities | Status |
|--------|----------------------|--------|
| **Phase 1** | Auth, JWT, Registration, Password Reset, Design System | ✅ Locked & Verified |
| **Phase 2 – Part 1** | Worker Profiles, Skills Taxonomy, Client Profiles | ✅ Locked & Verified |
| **Phase 2 – Part 2** | Digital Contracts, Revisions, SHA-256 Signatures | ✅ Locked & Verified |
| **Phase 2 – Part 3** | Escrow Wallet, Milestone Release, Automated Invoices | ✅ Locked & Verified |
| **Phase 2 – Part 4** | Project Management State Machine, Milestone Dependencies | ✅ Locked & Verified |
| **Phase 2 – Part 5** | Realtime WebSocket Chat, Delivery State Machine | ✅ Locked & Verified |
| **Phase 2 – Part 6** | Recharts Business Intelligence Analytics | ✅ Locked & Verified |
| **Phase 3 – Part 1** | Realtime Notifications, Activity Center, Preferences | ✅ Locked & Verified |
| **Phase 3 – Part 2** | AI Assistant (Gemini), Global Search, `Ctrl+K` Command Palette | ✅ Locked & Verified |
| **Phase 3 – Part 3** | Admin Dashboard, Organizations, API Keys, Webhooks, Integrations | ✅ Locked & Verified |
| **Phase 3 – Part 4** | Security Center, Supabase Storage Files, Operations, Compliance | ✅ Locked & Verified |
| **Phase 3 – Part 5** | Production Readiness, QA, Polish, Health Probe & Docs | ✅ Locked & Verified |

---

## Documentation Suite

- [System Architecture Overview](docs/SYSTEM_OVERVIEW.md)
- [Administrator Guide](docs/ADMIN_GUIDE.md)
- [User Guide](docs/USER_GUIDE.md)
- [API Reference Specification](docs/API_REFERENCE.md)
- [Master Changelog](CHANGELOG.md)

---

© 2026 TrustPay. All rights reserved.
