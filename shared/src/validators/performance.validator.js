const { z } = require('zod');

const executeBenchmarkSchema = z.object({
  metricName: z.string().min(2, 'Metric name is required'),
  targetMs: z.number().positive('Target latency in ms must be positive'),
});

const cacheConfigSchema = z.object({
  cacheKey: z.string().min(2, 'Cache key is required'),
  strategy: z.enum(['NONE', 'MEMORY', 'REDIS', 'HYBRID']).optional(),
  ttlSeconds: z.number().int().min(1, 'TTL must be at least 1 second'),
});

const runLoadTestSchema = z.object({
  scenarioName: z.string().min(2, 'Scenario name is required'),
  concurrentUsers: z.number().int().min(1, 'At least 1 concurrent user is required'),
  durationSec: z.number().int().min(1, 'Duration in seconds must be positive'),
});

const createRecommendationSchema = z.object({
  category: z.string().min(2, 'Category is required'),
  title: z.string().min(2, 'Title is required'),
  impact: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
  description: z.string().min(2, 'Description is required'),
});

const createReleaseCandidateSchema = z.object({
  version: z.string().min(1, 'Release candidate version is required'),
  environment: z.enum(['LOCAL', 'DEVELOPMENT', 'STAGING', 'PRODUCTION']).optional(),
  score: z.number().min(0).max(100).optional(),
});

module.exports = {
  executeBenchmarkSchema,
  cacheConfigSchema,
  runLoadTestSchema,
  createRecommendationSchema,
  createReleaseCandidateSchema,
};
