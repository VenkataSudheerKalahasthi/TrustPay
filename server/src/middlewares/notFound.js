'use strict';

const { ApiError } = require('../utils/ApiError');

/**
 * 404 Not Found handler.
 *
 * Catches all requests that fall through the route handlers
 * and returns a structured 404 response.
 *
 * @type {import('express').RequestHandler}
 */
function notFound(req, res, next) {
  next(ApiError.notFound(`Route '${req.method} ${req.originalUrl}' not found`));
}

module.exports = { notFound };
