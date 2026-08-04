# TrustPay API Documentation

## Base URL

```
Development: http://localhost:5000/api/v1
Production:  https://api.trustpay.com/api/v1
```

## Response Format

All responses follow this standard shape:

### Success Response (2xx)
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Success",
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  },
  "requestId": "uuid-v4",
  "timestamp": "2026-08-01T12:00:00.000Z"
}
```

### Error Response (4xx / 5xx)
```json
{
  "success": false,
  "statusCode": 422,
  "message": "Validation failed",
  "errors": [
    { "field": "email", "message": "Please enter a valid email address" }
  ],
  "requestId": "uuid-v4",
  "timestamp": "2026-08-01T12:00:00.000Z"
}
```

---

## Authentication

All protected routes require:
```
Authorization: Bearer <access_token>
```

---

## Foundation Routes (Phase 1)

### Health Check
```
GET /api/v1/health
```
**Response:**
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "environment": "development",
    "database": "connected",
    "uptime": 120.5
  },
  "message": "TrustPay API is running"
}
```

---

## Planned Routes (Future Phases)

### Auth (Phase 1 Part 2 Complete)
| Method | Path | Access | Description |
|--------|------|--------|-------------|
| POST | /auth/register | Public | Register new user (creates active session) |
| POST | /auth/login | Public | Login with email/password (creates active session) |
| POST | /auth/refresh | Public | Exchange refresh token for new access token (Token Rotation & Session update) |
| POST | /auth/logout | Public | Logout current device (revokes refresh token & active session) |
| POST | /auth/logout-all | Private | Revoke all active sessions and refresh tokens across all devices |
| POST | /auth/verify-email | Public | Verify email address using token |
| POST | /auth/forgot-password | Public | Request password reset email |
| POST | /auth/reset-password | Public | Reset password using token (revokes all active sessions) |
| POST | /auth/change-password | Private | Change password for authenticated user (revokes all active sessions) |
| GET | /auth/me | Private | Get profile of currently authenticated user |
| PUT | /auth/profile | Private | Update profile details |

#### Session Management & Audit Logging Behavior
- **Automatic Session Creation**: Every successful login or registration initializes a database `Session` bound to the issued `RefreshToken` with client IP, User-Agent, Browser, OS, and Device details.
- **Token Rotation & Session Updates**: Upon `/auth/refresh`, the old refresh token is marked revoked and linked to the new token, while the `Session` record is updated with the new token reference and `lastActiveTime`.
- **Token Reuse Security**: If a revoked refresh token is presented at `/auth/refresh`, the system immediately revokes **all** active sessions for that user, logs a `SECURITY ALERT` audit event, and returns a 401 Unauthorized response.
- **Audit Logging**: All authentication activities automatically produce structured JSON logs via Winston `authLogger` without logging credentials or raw tokens.

### Contracts (Phase 2)
| Method | Path | Description |
|--------|------|-------------|
| GET | /contracts | List user's contracts |
| POST | /contracts | Create new contract |
| GET | /contracts/:id | Get contract details |
| PUT | /contracts/:id | Update contract |
| POST | /contracts/:id/sign | Sign contract |
| DELETE | /contracts/:id | Cancel contract |

### Escrow (Phase 3)
| Method | Path | Description |
|--------|------|-------------|
| POST | /escrow/fund | Fund escrow for contract |
| POST | /escrow/release | Release milestone payment |
| POST | /escrow/dispute | Open dispute |
| GET | /escrow/:contractId | Get escrow status |

---

## HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK |
| 201 | Created |
| 204 | No Content |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict (e.g., duplicate email) |
| 422 | Unprocessable Entity (validation) |
| 429 | Too Many Requests |
| 500 | Internal Server Error |
| 503 | Service Unavailable |
