# TrustPay – Enterprise System Architecture Overview

TrustPay is built as a multi-tenant, micro-modular enterprise web platform designed for secure freelancing, digital contract execution, escrow payments, AI productivity, and multi-tenant organization management.

---

## 1. High-Level System Architecture

```
[ React 18 + Vite + Tailwind CSS Frontend ]
                    │  (REST API + WebSockets)
                    ▼
[ Express Node.js Backend API Engine (v1) ]
     ├── Auth & RBAC Middleware
     ├── Google Gemini AI Provider
     ├── Supabase Storage Adapter Engine
     └── HMAC Webhook Event Dispatcher
                    │  (Prisma ORM)
                    ▼
[ PostgreSQL Database (Supabase Host) ]
```

---

## 2. Platform Feature Modules (17 Total)

1. **Authentication & Identity**: JWT tokens, refresh tokens, role-based access.
2. **Worker Management**: Profiles, skills taxonomy, search, public showcase.
3. **Client Management**: Hiring profiles, favorite talent list.
4. **Digital Contracts**: Multi-milestone contracts, versioning, SHA-256 signatures.
5. **Escrow Wallet**: Deposit holding, milestone release, invoice generation.
6. **Project Management**: Project state machine (`DRAFT`, `ACTIVE`, `COMPLETED`), milestone dependencies.
7. **Communication**: Realtime WebSocket chat, delivery state machine (`SENT`, `DELIVERED`, `READ`).
8. **Analytics**: Recharts business intelligence for Clients, Workers, and Admins.
9. **Notifications**: In-app notifications & batching preferences.
10. **AI Assistant**: Google Gemini API integration, auto-titling, document summarization, prompt templates.
11. **Global Search**: Cross-module weighted search with `<mark>` text highlights and facets.
12. **Productivity Suite**: `Ctrl+K` Command Palette, Pinned items, Bookmarks.
13. **Administration**: Executive dashboard, feature flags, announcements, platform settings.
14. **Organizations**: Multi-tenant organizations, workspaces, RBAC role matrix (`OWNER` to `VIEWER`).
15. **Security Center**: Security health score, active session revocation, login history, incidents.
16. **File Management**: Supabase storage signed URLs, SHA-256 checksums, version history, password-protected share links.
17. **Operations & Compliance**: Background job logs, backup metadata, GDPR export requests.
