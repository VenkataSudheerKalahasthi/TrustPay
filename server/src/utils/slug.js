'use strict';

/**
 * Generate an SEO-friendly URL slug.
 * Example: "John Doe", "Fullstack Developer" => "john-doe-fullstack-developer"
 *
 * @param {string} text - Primary text (name)
 * @param {string} [secondaryText] - Secondary text (title)
 * @returns {string}
 */
function generateSlug(text, secondaryText = '') {
  const combined = `${text} ${secondaryText}`.trim();
  const slugified = combined
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove diacritics
    .replace(/[^a-z0-9\s-]/g, '')    // remove invalid chars
    .trim()
    .replace(/\s+/g, '-')             // collapse whitespace into -
    .replace(/-+/g, '-');             // collapse multiple -

  return slugified || 'worker';
}

module.exports = {
  generateSlug,
};
