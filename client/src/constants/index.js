/**
 * Application-wide constants.
 * Import from '@constants' anywhere in the app.
 */

// ─── App Metadata ─────────────────────────────────────────────────────────────
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'TrustPay';
export const APP_TAGLINE =
  import.meta.env.VITE_APP_TAGLINE || 'Secure Digital Contract & Escrow Platform';
export const APP_VERSION = import.meta.env.VITE_APP_VERSION || '1.0.0';

// ─── API ──────────────────────────────────────────────────────────────────────
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';
export const API_TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT) || 30000;

// ─── Socket ───────────────────────────────────────────────────────────────────
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

// ─── Routes ───────────────────────────────────────────────────────────────────
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  // Client
  CLIENT_DASHBOARD: '/client/dashboard',
  CLIENT_PROJECTS: '/client/projects',
  CLIENT_CONTRACTS: '/client/contracts',
  CLIENT_WALLET: '/client/wallet',
  CLIENT_PROFILE: '/client/profile',
  // Worker
  WORKER_DASHBOARD: '/worker/dashboard',
  WORKER_PROJECTS: '/worker/projects',
  WORKER_CONTRACTS: '/worker/contracts',
  WORKER_WALLET: '/worker/wallet',
  WORKER_PROFILE: '/worker/profile',
  // Shared
  CHAT: '/chat',
  NOTIFICATIONS: '/notifications',
  SETTINGS: '/settings',
  // Admin
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_USERS: '/admin/users',
  ADMIN_DISPUTES: '/admin/disputes',
  // Error
  NOT_FOUND: '/404',
  SERVER_ERROR: '/500',
};

// ─── User Roles ───────────────────────────────────────────────────────────────
export const USER_ROLES = {
  CLIENT: 'CLIENT',
  WORKER: 'WORKER',
  ADMIN: 'ADMIN',
};

// ─── Contract Status ──────────────────────────────────────────────────────────
export const CONTRACT_STATUS = {
  DRAFT: 'DRAFT',
  PENDING: 'PENDING',
  ACTIVE: 'ACTIVE',
  COMPLETED: 'COMPLETED',
  DISPUTED: 'DISPUTED',
  CANCELLED: 'CANCELLED',
};

// ─── Escrow Status ────────────────────────────────────────────────────────────
export const ESCROW_STATUS = {
  FUNDED: 'FUNDED',
  HELD: 'HELD',
  RELEASED: 'RELEASED',
  REFUNDED: 'REFUNDED',
  DISPUTED: 'DISPUTED',
};

// ─── Transaction Status ───────────────────────────────────────────────────────
export const TRANSACTION_STATUS = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  REVERSED: 'REVERSED',
};

// ─── Pagination ───────────────────────────────────────────────────────────────
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

// ─── Local Storage Keys ───────────────────────────────────────────────────────
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'tp_access_token',
  REFRESH_TOKEN: 'tp_refresh_token',
  USER: 'tp_user',
  THEME: 'tp_theme',
  SIDEBAR_COLLAPSED: 'tp_sidebar_collapsed',
};

// ─── Feature Flags ────────────────────────────────────────────────────────────
export const FEATURES = {
  AI: import.meta.env.VITE_ENABLE_AI === 'true',
  MAPS: import.meta.env.VITE_ENABLE_MAPS === 'true',
  ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
};
