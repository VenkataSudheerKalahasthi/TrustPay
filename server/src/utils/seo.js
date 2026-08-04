'use strict';

/**
 * Generate OpenGraph and Meta tags data for public worker profile.
 *
 * @param {object} workerProfile
 * @returns {object}
 */
function generateWorkerMetadata(workerProfile) {
  const name = `${workerProfile.user?.firstName || ''} ${workerProfile.user?.lastName || ''}`.trim() || 'Worker Profile';
  const title = workerProfile.title ? `${name} - ${workerProfile.title}` : `${name} on TrustPay`;
  const description = workerProfile.bio
    ? workerProfile.bio.substring(0, 160)
    : `Hire ${name} for high-quality verified digital escrow contracts on TrustPay.`;

  return {
    metaTitle: `${title} | TrustPay Escrow Marketplace`,
    metaDescription: description,
    openGraph: {
      title,
      description,
      image: workerProfile.user?.avatar || workerProfile.coverImageUrl || 'https://trustpay.dev/og-default.jpg',
      url: `https://trustpay.dev/workers/${workerProfile.slug || workerProfile.id}`,
      type: 'profile',
    },
  };
}

module.exports = {
  generateWorkerMetadata,
};
