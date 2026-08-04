'use strict';

const crypto = require('crypto');

/**
 * Generate a SHA-256 cryptographic hash digest of any text or object.
 *
 * @param {string|object} content
 * @returns {string} SHA-256 hex string
 */
function createSha256Hash(content) {
  const text = typeof content === 'object' ? JSON.stringify(content) : String(content);
  return crypto.createHash('sha256').update(text).digest('hex');
}

/**
 * Generate a digital signature verification hash.
 *
 * @param {object} params
 * @param {string} params.contractNumber
 * @param {string} params.signerUserId
 * @param {string} params.signerRole
 * @param {string} params.ipAddress
 * @param {string} params.timestamp
 * @returns {string} SHA-256 hex string
 */
function generateSignatureHash({ contractNumber, signerUserId, signerRole, ipAddress, timestamp }) {
  const payload = `${contractNumber}:${signerUserId}:${signerRole}:${ipAddress}:${timestamp}`;
  return createSha256Hash(payload);
}

module.exports = {
  createSha256Hash,
  hashSHA256: createSha256Hash,
  generateSignatureHash,
};
