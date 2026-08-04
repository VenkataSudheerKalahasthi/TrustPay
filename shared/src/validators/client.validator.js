'use strict';

const { z } = require('zod');

const updateClientProfileSchema = z.object({
  companyName: z.string().max(120, 'Company name cannot exceed 120 characters').optional().nullable(),
  companyType: z.string().max(60).optional().nullable(),
  companyWebsite: z.string().url().or(z.literal('')).optional().nullable(),
  companyLogo: z.string().url().or(z.literal('')).optional().nullable(),
  businessDescription: z.string().max(2000).optional().nullable(),
  industry: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  postalCode: z.string().optional().nullable(),
  latitude: z.number().min(-90).max(90).optional().nullable(),
  longitude: z.number().min(-180).max(180).optional().nullable(),
  formattedAddress: z.string().optional().nullable(),
});

module.exports = {
  updateClientProfileSchema,
};
