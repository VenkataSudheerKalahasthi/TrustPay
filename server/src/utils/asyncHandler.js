'use strict';

/**
 * Higher-order function to wrap async Express route handlers.
 * Catches rejected promises and forwards errors to the next() error middleware.
 *
 * @param {import('express').RequestHandler} fn
 * @returns {import('express').RequestHandler}
 */
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler;
module.exports.asyncHandler = asyncHandler;
