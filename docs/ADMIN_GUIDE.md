# TrustPay – Administrator Guide

Welcome to the **TrustPay Enterprise Administrator Manual**. This guide covers the operational procedures, organization management, fine-grained RBAC roles, feature flags, webhook subscriptions, API keys, and security controls for TrustPay platform administrators.

---

## 1. Executive Admin Dashboard

Accessible at `/dashboard/admin`, the Executive Dashboard provides platform-wide metrics:
- **Total Users & Organizations**: Track registered client accounts, worker profiles, and multi-tenant organizations.
- **Project & Digital Contract Oversight**: Realtime count of active projects, deliverables, and SHA-256 signed contracts.
- **Escrow Financial Volume**: Aggregate escrow wallet balances and payment deposits.
- **AI Token Usage**: Token accounting for Google Gemini AI assistant queries.
- **System Announcements**: Broadcast system-wide notices to specific user roles (`ALL`, `CLIENT`, `WORKER`).

---

## 2. Organization & Workspace Management

TrustPay supports a multi-tenant hierarchy (`Organization -> Workspace -> Member`):
1. **Organization Creation**: Create organizations, customize logos, brand primary colors (`primaryColor`), and set company addresses.
2. **Workspace Isolation**: Workspaces allow teams to segment projects and contracts.
3. **Member Management**:
   - Invite members by email with 7-day token expiration.
   - Assign roles: `OWNER`, `ADMIN`, `MANAGER`, `MEMBER`, `VIEWER`.
   - Inspect effective permission matrices (`RolePermissionMatrix.jsx`).

---

## 3. Feature Flags & Rollout Management

Managed at `/dashboard/admin/feature-flags`:
- **Toggle Feature Flags**: Dynamically enable or disable experimental capabilities (`AI_COPILOT_V2`, `ESCROW_AUTO_RELEASE`, `PUBLIC_REST_API`, `WEBHOOK_SUBSCRIPTIONS`).
- **Gradual Rollouts**: Configure rollout percentages (`rolloutPercentage: 0-100%`).

---

## 4. Public REST API Keys & Webhooks

- **API Keys (`/dashboard/admin/api-keys`)**: Generate hashed API keys (`tp_live_...`) with custom scopes (`READ_ONLY`, `FULL_ACCESS`, `WEBHOOKS_ONLY`), IP restrictions, and expiration dates.
- **Webhooks (`/dashboard/admin/webhooks`)**: Register external endpoints, subscribe to events (`project.created`, `contract.signed`, `escrow.deposited`), generate HMAC-SHA256 signatures (`X-TrustPay-Signature`), and inspect delivery logs.

---

## 5. Security & Session Control

- **Security Center (`/dashboard/admin/security`)**: Monitor security health scores (0-100), active session audits, login history, and trusted devices.
- **Session Revocation**: Instantly revoke suspicious active user sessions.
- **Security Incidents**: Log and investigate high-risk security incidents.
