'use strict';

/**
 * Zod validation middleware factory.
 *
 * Creates Express middleware that validates req.body, req.params,
 * and req.query against provided Zod schemas. Validation errors
 * are passed to the global error handler as ZodError instances,
 * which formats them into structured 422 responses.
 *
 * Usage:
 *   router.post('/users', validate({ body: CreateUserSchema }), controller.create)
 *
 * @param {{ body?: ZodSchema, params?: ZodSchema, query?: ZodSchema }} schemas
 * @returns {import('express').RequestHandler}
 */
function validate(schemas) {
  return (req, _res, next) => {
    try {
      if (schemas.body) {
        req.body = schemas.body.parse(req.body);
      }
      if (schemas.params) {
        req.params = schemas.params.parse(req.params);
      }
      if (schemas.query) {
        req.query = schemas.query.parse(req.query);
      }
      next();
    } catch (error) {
      // ZodError — the global errorHandler will format it as 422
      next(error);
    }
  };
}

/**
 * Helper wrapper for single schema validation.
 *
 * @param {import('zod').ZodSchema} schema
 * @param {'body' | 'params' | 'query'} [property='body']
 * @returns {import('express').RequestHandler}
 */
function validateRequest(schema, property = 'body') {
  return validate({ [property]: schema });
}

module.exports = { validate, validateRequest };
