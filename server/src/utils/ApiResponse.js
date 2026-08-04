'use strict';

const { v4: uuidv4 } = require('uuid');

/**
 * Standard API success response shape.
 *
 * All successful API responses follow this contract:
 * {
 *   success: true,
 *   statusCode: number,
 *   message: string,
 *   data: T | null,
 *   meta: object | null,
 *   requestId: string,
 *   timestamp: string,
 * }
 */
class ApiResponse {
  constructor(statusCode = 200, data = null, message = 'Success', meta = null) {
    this.success = statusCode < 400;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.meta = meta;
    this.timestamp = new Date().toISOString();
  }

  /**
   * @param {import('express').Response} res
   * @param {object} options
   * @param {number}  options.statusCode   HTTP status code (default: 200)
   * @param {string}  options.message      Human-readable message
   * @param {*}       options.data         Response payload
   * @param {object}  [options.meta]       Pagination or extra metadata
   * @param {string}  [options.requestId]  Passed from req header if available
   */
  static send(
    res,
    { statusCode = 200, message = 'Success', data = null, meta = null, requestId = uuidv4() }
  ) {
    return res.status(statusCode).json({
      success: true,
      statusCode,
      message,
      data,
      meta,
      requestId,
      timestamp: new Date().toISOString(),
    });
  }

  /** Convenience — 200 OK */
  static ok(res, data, message = 'Success', meta = null) {
    return ApiResponse.send(res, { statusCode: 200, message, data, meta });
  }

  /** Convenience alias — 200 OK */
  static success(res, data, message = 'Success', meta = null) {
    return ApiResponse.send(res, { statusCode: 200, message, data, meta });
  }

  /** Convenience — 201 Created */
  static created(res, data, message = 'Created successfully') {
    return ApiResponse.send(res, { statusCode: 201, message, data });
  }

  /** Convenience — 204 No Content */
  static noContent(res) {
    return res.status(204).send();
  }
}

module.exports = ApiResponse;
module.exports.ApiResponse = ApiResponse;
