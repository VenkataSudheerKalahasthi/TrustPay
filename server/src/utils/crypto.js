'use strict';

const crypto = require('crypto');

/**
 * TrustPay – Cryptographic Utilities
 *
 * Secure token generation and hashing helpers.
 * All tokens use Node.js built-in crypto — no external dependencies.
 */

/**
 * Generate a cryptographically secure random token.
 * Used for email verification and password reset tokens.
 *
 * @param {number} [bytes=32]  Number of random bytes (default: 32 → 64 hex chars)
 * @returns {string}           Hex-encoded token
 *
 * @example
 * const token = generateSecureToken();       // 64-character hex string
 * const shortToken = generateSecureToken(16); // 32-character hex string
 */
function generateSecureToken(bytes = 32) {
  return crypto.randomBytes(bytes).toString('hex');
}

/**
 * Hash a plain token with SHA-256 for secure database storage.
 *
 * NEVER store plain tokens in the database.
 * Store the hash, compare the hash when verifying.
 *
 * @param {string} token  Plain token string
 * @returns {string}      SHA-256 hex digest
 *
 * @example
 * const token = generateSecureToken();
 * const tokenHash = hashToken(token);
 * // Store tokenHash in DB, send token to user via email
 *
 * // On verification:
 * const isValid = hashToken(userProvidedToken) === storedHash;
 */
function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

/**
 * Generate a secure random numeric OTP of the given length.
 *
 * @param {number} [length=6]  OTP digit length
 * @returns {string}           Zero-padded numeric string
 *
 * @example
 * const otp = generateOtp(); // '082931'
 */
function generateOtp(length = 6) {
  const max = Math.pow(10, length);
  const randomBytes = crypto.randomBytes(4);
  const randomInt = randomBytes.readUInt32BE(0) % max;
  return String(randomInt).padStart(length, '0');
}

/**
 * Generate a UUID v4.
 * Prefer this over the `uuid` package where built-ins suffice.
 *
 * @returns {string}  UUID v4 string
 */
function generateUUID() {
  return crypto.randomUUID();
}

/**
 * Compute a SHA-256 HMAC signature for webhook payload verification.
 * Used for Razorpay webhook signature checks.
 *
 * @param {string} payload    Raw request body string
 * @param {string} secret     Webhook secret
 * @returns {string}          Hex HMAC signature
 *
 * @example
 * const expected = computeHmac(rawBody, env.RAZORPAY_WEBHOOK_SECRET);
 * const actual = req.headers['x-razorpay-signature'];
 * if (!timingSafeEqual(expected, actual)) throw new AuthenticationError('Invalid webhook signature');
 */
function computeHmac(payload, secret) {
  return crypto.createHmac('sha256', secret).update(payload).digest('hex');
}

/**
 * Timing-safe string comparison to prevent timing attacks.
 * Use when comparing tokens or HMAC signatures.
 *
 * @param {string} a
 * @param {string} b
 * @returns {boolean}
 */
function timingSafeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') {return false;}
  if (a.length !== b.length) {return false;}
  const bufA = Buffer.from(a, 'utf8');
  const bufB = Buffer.from(b, 'utf8');
  return crypto.timingSafeEqual(bufA, bufB);
}

module.exports = {
  generateSecureToken,
  hashToken,
  generateOtp,
  generateUUID,
  computeHmac,
  timingSafeEqual,
};
