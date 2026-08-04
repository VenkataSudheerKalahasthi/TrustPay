'use strict';

/**
 * Generate a unique, sequential invoice number.
 * Format: INV-YYYY-XXXXXX (e.g. INV-2026-000001)
 *
 * @param {number} count - Existing invoice count in the current year
 * @returns {string}
 */
function generateInvoiceNumber(count = 0) {
  const year = new Date().getFullYear();
  const sequence = String(count + 1).padStart(6, '0');
  return `INV-${year}-${sequence}`;
}

module.exports = {
  generateInvoiceNumber,
};
