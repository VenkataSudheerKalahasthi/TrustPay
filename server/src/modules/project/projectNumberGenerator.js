'use strict';

const prisma = require('../../config/database');

/**
 * Project Number Generator
 * Generates sequential business project numbers formatted as PRJ-YYYY-XXXXXX.
 * Separate from database internal CUID IDs.
 */
async function generateProjectNumber() {
  const currentYear = new Date().getFullYear();
  const prefix = `PRJ-${currentYear}-`;

  // Find the highest existing project number for the current year
  const lastProject = await prisma.project.findFirst({
    where: {
      projectNumber: {
        startsWith: prefix,
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      projectNumber: true,
    },
  });

  let nextSequence = 1;
  if (lastProject && lastProject.projectNumber) {
    const parts = lastProject.projectNumber.split('-');
    if (parts.length === 3) {
      const lastSeq = parseInt(parts[2], 10);
      if (!isNaN(lastSeq)) {
        nextSequence = lastSeq + 1;
      }
    }
  }

  const paddedSequence = String(nextSequence).padStart(6, '0');
  return `${prefix}${paddedSequence}`;
}

module.exports = {
  generateProjectNumber,
};
