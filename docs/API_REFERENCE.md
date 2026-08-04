# TrustPay – API Reference Specification (v1)

Base URL: `/api/v1`

---

## 1. Authentication & System Health

- `GET /health` – Returns API health, uptime, and database latency.
- `GET /health/readiness` – Returns application readiness probe.
- `GET /health/version` – Returns API and package version.
- `POST /auth/register` – User registration.
- `POST /auth/login` – User authentication & JWT issuance.

---

## 2. Digital Contracts & Escrow

- `GET /contracts` – List user contracts.
- `POST /contracts` – Create contract draft.
- `POST /contracts/:id/sign` – Digitally sign contract with SHA-256 hash.
- `GET /escrow/wallet` – Escrow wallet balance & transactions.
- `POST /escrow/deposit` – Deposit milestone funds into escrow.

---

## 3. AI Assistant & Unified Search

- `POST /ai/chat` – Process prompt completion via Google Gemini.
- `POST /ai/summarize` – Executive document summarization.
- `GET /search?query={q}&entityType={type}` – Cross-module search engine.

---

## 4. Multi-Tenant Organizations & RBAC

- `POST /organizations` – Create new organization.
- `GET /organizations` – List user organizations.
- `POST /organizations/:id/invite` – Invite member with 7-day token.
- `PATCH /organizations/:id/members/:userId/role` – Update RBAC role.

---

## 5. API Keys, Webhooks & Files

- `POST /integrations/api-keys` – Generate hashed API key (`tp_live_...`).
- `POST /integrations/webhooks` – Register event webhook with HMAC-SHA256 secret.
- `POST /files` – Register file asset with SHA-256 checksum.
- `POST /files/:id/share` – Create password-protected share link.
