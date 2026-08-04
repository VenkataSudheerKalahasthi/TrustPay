'use strict';

/**
 * TrustPay – Pagination Utilities
 *
 * Standardized helpers for paginated Prisma queries and response metadata.
 * Use these in every repository method that returns a list of records.
 */

/**
 * Build Prisma pagination arguments from a validated query object.
 *
 * @param {object} query
 * @param {number} query.page       Current page (1-indexed)
 * @param {number} query.limit      Items per page
 * @param {string} [query.sortBy]   Field to sort by
 * @param {'asc'|'desc'} [query.sortOrder]  Sort direction
 * @returns {{ skip: number, take: number, orderBy?: object }}
 *
 * @example
 * const { skip, take, orderBy } = buildPaginationArgs({ page: 2, limit: 10, sortBy: 'createdAt', sortOrder: 'desc' });
 * const records = await prisma.contract.findMany({ skip, take, orderBy });
 */
function buildPaginationArgs(query) {
  const { page = 1, limit = 10, sortBy, sortOrder = 'desc' } = query;

  const args = {
    skip: (page - 1) * limit,
    take: limit,
  };

  if (sortBy) {
    args.orderBy = { [sortBy]: sortOrder };
  }

  return args;
}

/**
 * Build a PaginationMeta object for API responses.
 *
 * @param {object} params
 * @param {number} params.page    Current page
 * @param {number} params.limit   Items per page
 * @param {number} params.total   Total record count
 * @returns {import('../../../shared/src/types').PaginationMeta}
 *
 * @example
 * const meta = buildPaginationMeta({ page: 2, limit: 10, total: 45 });
 * // → { page: 2, limit: 10, total: 45, totalPages: 5, hasNextPage: true, hasPrevPage: true }
 */
function buildPaginationMeta({ page, limit, total }) {
  const totalPages = Math.ceil(total / limit);
  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
}

/**
 * Execute a Prisma query with an automatic count query and return both data + meta.
 *
 * @template T
 * @param {object} params
 * @param {() => Promise<T[]>} params.findMany   Prisma findMany call
 * @param {() => Promise<number>} params.count   Prisma count call
 * @param {object} params.query                  Pagination query ({ page, limit })
 * @returns {Promise<{ data: T[], meta: import('../../../shared/src/types').PaginationMeta }>}
 *
 * @example
 * const { data, meta } = await paginate({
 *   findMany: () => prisma.contract.findMany({ where, ...buildPaginationArgs(query) }),
 *   count: () => prisma.contract.count({ where }),
 *   query,
 * });
 */
async function paginate({ findMany, count, query }) {
  const { page = 1, limit = 10 } = query;

  const [data, total] = await Promise.all([findMany(), count()]);

  return {
    data,
    meta: buildPaginationMeta({ page, limit, total }),
  };
}

module.exports = { buildPaginationArgs, buildPaginationMeta, paginate };
