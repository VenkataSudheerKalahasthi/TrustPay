'use strict';

/**
 * Generate a unique, sequential business contract number.
 * Format: TP-YYYY-XXXXXX (e.g. TP-2026-000001)
 *
 * @param {number} count - Existing contract count in the current year
 * @returns {string}
 */
function generateContractNumber(count = 0) {
  const year = new Date().getFullYear();
  const sequence = String(count + 1).padStart(6, '0');
  return `TP-${year}-${sequence}`;
}

module.exports = {
  generateContractNumber,
};
