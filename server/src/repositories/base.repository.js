'use strict';

const { prisma } = require('../config/database');
const { buildPaginationArgs, buildPaginationMeta } = require('../utils/pagination');
const { NotFoundError } = require('../utils/ApiError');

/**
 * TrustPay – Base Repository
 *
 * Abstract base class that provides standard CRUD operations for any
 * Prisma model. Feature repositories extend this and only add
 * domain-specific query methods.
 *
 * This enforces:
 *  - Consistent method names across all repositories
 *  - Centralized Prisma client access
 *  - DRY pagination logic
 *
 * @example
 * class ContractRepository extends BaseRepository {
 *   constructor() { super('contract'); }
 *
 *   // Add domain-specific methods:
 *   findByClientId(clientId) {
 *     return this.prisma.contract.findMany({ where: { clientId } });
 *   }
 * }
 */
class BaseRepository {
  /**
   * @param {string} modelName  Prisma model name (camelCase, e.g., 'user', 'contract')
   */
  constructor(modelName) {
    if (!modelName) {
      throw new Error('BaseRepository requires a modelName');
    }
    this.modelName = modelName;
    this.prisma = prisma;
    /** @type {import('@prisma/client').PrismaClient[typeof modelName]} */
    this.model = prisma[modelName];
  }

  // ─── Read Operations ────────────────────────────────────────────────────────

  /**
   * Find a record by its primary key (id).
   *
   * @param {string}  id
   * @param {object}  [options]          Prisma query options (select, include)
   * @param {boolean} [throwIfNotFound]  If true, throws NotFoundError when missing
   * @returns {Promise<object|null>}
   */
  async findById(id, options = {}, throwIfNotFound = false) {
    const record = await this.model.findUnique({ where: { id }, ...options });
    if (!record && throwIfNotFound) {
      throw new NotFoundError(this.modelName);
    }
    return record;
  }

  /**
   * Find a single record by arbitrary conditions.
   *
   * @param {object} where               Prisma where clause
   * @param {object} [options]           Additional query options
   * @param {boolean} [throwIfNotFound]
   * @returns {Promise<object|null>}
   */
  async findOne(where, options = {}, throwIfNotFound = false) {
    const record = await this.model.findFirst({ where, ...options });
    if (!record && throwIfNotFound) {
      throw new NotFoundError(this.modelName);
    }
    return record;
  }

  /**
   * Find all records matching criteria, with pagination.
   *
   * @param {object} [where]   Prisma where clause
   * @param {object} [query]   Pagination query ({ page, limit, sortBy, sortOrder })
   * @param {object} [options] Additional query options (select, include)
   * @returns {Promise<{ data: object[], meta: import('../../../shared/src/types').PaginationMeta }>}
   */
  async findMany(where = {}, query = {}, options = {}) {
    const paginationArgs = buildPaginationArgs(query);

    const [data, total] = await Promise.all([
      this.model.findMany({ where, ...paginationArgs, ...options }),
      this.model.count({ where }),
    ]);

    return {
      data,
      meta: buildPaginationMeta({ page: query.page || 1, limit: query.limit || 10, total }),
    };
  }

  /**
   * Count records matching criteria.
   *
   * @param {object} [where]
   * @returns {Promise<number>}
   */
  async count(where = {}) {
    return this.model.count({ where });
  }

  // ─── Write Operations ───────────────────────────────────────────────────────

  /**
   * Create a new record.
   *
   * @param {object} data
   * @param {object} [options]  Additional Prisma options (select, include)
   * @returns {Promise<object>}
   */
  async create(data, options = {}) {
    return this.model.create({ data, ...options });
  }

  /**
   * Update an existing record by ID.
   *
   * @param {string} id
   * @param {object} data
   * @param {object} [options]
   * @returns {Promise<object>}
   */
  async update(id, data, options = {}) {
    return this.model.update({ where: { id }, data, ...options });
  }

  /**
   * Update records matching arbitrary conditions.
   *
   * @param {object} where
   * @param {object} data
   * @returns {Promise<{ count: number }>}
   */
  async updateMany(where, data) {
    return this.model.updateMany({ where, data });
  }

  /**
   * Delete a record by ID.
   *
   * @param {string} id
   * @returns {Promise<object>}
   */
  async delete(id) {
    return this.model.delete({ where: { id } });
  }

  /**
   * Delete records matching conditions.
   *
   * @param {object} where
   * @returns {Promise<{ count: number }>}
   */
  async deleteMany(where) {
    return this.model.deleteMany({ where });
  }

  /**
   * Upsert — create if not exists, update if exists.
   *
   * @param {object} where   Unique constraint for lookup
   * @param {object} create  Data to use when creating
   * @param {object} update  Data to use when updating
   * @returns {Promise<object>}
   */
  async upsert(where, create, update) {
    return this.model.upsert({ where, create, update });
  }

  /**
   * Check if a record exists.
   *
   * @param {object} where
   * @returns {Promise<boolean>}
   */
  async exists(where) {
    const record = await this.model.findFirst({ where, select: { id: true } });
    return record !== null;
  }

  // ─── Transaction Support ────────────────────────────────────────────────────

  /**
   * Expose the Prisma client for transaction usage.
   * Use this when multiple operations need to be atomic:
   *
   * @example
   * await prisma.$transaction(async (tx) => {
   *   const user = await userRepo.model.create({ data: {...} }); // using model directly
   * });
   */
  get db() {
    return this.prisma;
  }
}

module.exports = { BaseRepository };
