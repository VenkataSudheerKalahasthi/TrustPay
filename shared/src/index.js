'use strict';

/**
 * TrustPay – Shared Package Barrel Export
 *
 * Central entry point for the shared package.
 * Import from 'trustpay-shared' in server/client,
 * or from the relative path in monorepo context.
 *
 * Usage (server):
 *   const { USER_ROLES, APP_CONFIG } = require('../../shared/src');
 *
 * Usage (client — ESM):
 *   import { USER_ROLES, APP_CONFIG } from '../../shared/src';
 */

const constants = require('./constants');
const config = require('./config');
// Types are JSDoc-only — no runtime export needed
// const types = require('./types');

module.exports = {
  // ─── Constants ─────────────────────────────────────────────────────────────
  ...constants,

  // ─── Config ────────────────────────────────────────────────────────────────
  ...config,
};
