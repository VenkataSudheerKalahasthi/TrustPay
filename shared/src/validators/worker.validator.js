'use strict';

const { z } = require('zod');

const updateWorkerProfileSchema = z.object({
  title: z.string().max(120, 'Title cannot exceed 120 characters').optional().nullable(),
  bio: z.string().max(2000, 'Bio cannot exceed 2000 characters').optional().nullable(),
  hourlyRate: z.number().min(0, 'Hourly rate must be non-negative').optional().nullable(),
  preferFixedPrice: z.boolean().optional(),
  availabilityStatus: z.enum(['AVAILABLE', 'BUSY', 'ON_VACATION', 'OFFLINE']).optional(),
  workingDays: z.array(z.string()).optional(),
  workingHours: z.string().optional().nullable(),
  timeZone: z.string().optional().nullable(),
  preferredSchedule: z.string().optional().nullable(),
  yearsExperience: z.number().min(0).max(60).optional(),
  address: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  postalCode: z.string().optional().nullable(),
  latitude: z.number().min(-90).max(90).optional().nullable(),
  longitude: z.number().min(-180).max(180).optional().nullable(),
  formattedAddress: z.string().optional().nullable(),
  resumeUrl: z.string().url().optional().nullable(),
  coverImageUrl: z.string().url().optional().nullable(),
  categories: z.array(z.string()).optional(), // category IDs or slugs
  skills: z.array(z.string()).optional(),     // skill IDs or slugs
});

const createPortfolioProjectSchema = z.object({
  title: z.string().min(2, 'Project title is required').max(120),
  description: z.string().max(3000).optional().nullable(),
  projectUrl: z.string().url().or(z.literal('')).optional().nullable(),
  githubUrl: z.string().url().or(z.literal('')).optional().nullable(),
  completionDate: z.string().optional().nullable(),
  images: z.array(z.string().url()).optional(),
  documents: z.array(z.string().url()).optional(),
  technologies: z.array(z.string()).optional(), // Technology names or IDs
});

const createEducationSchema = z.object({
  institution: z.string().min(2, 'Institution name is required'),
  degree: z.string().min(2, 'Degree title is required'),
  fieldOfStudy: z.string().optional().nullable(),
  startDate: z.string(),
  endDate: z.string().optional().nullable(),
  isCurrent: z.boolean().optional(),
});

const createCertificationSchema = z.object({
  title: z.string().min(2, 'Certification title is required'),
  issuingOrganization: z.string().min(2, 'Issuing organization is required'),
  issueDate: z.string(),
  expirationDate: z.string().optional().nullable(),
  credentialId: z.string().optional().nullable(),
  credentialUrl: z.string().url().or(z.literal('')).optional().nullable(),
});

const uploadVerificationDocumentSchema = z.object({
  documentType: z.enum(['GOVERNMENT_ID', 'PASSPORT', 'DRIVING_LICENSE', 'NATIONAL_ID', 'PAN_CARD', 'AADHAAR_CARD', 'OTHER']),
  documentUrl: z.string().url('Document URL must be valid'),
  documentNumber: z.string().optional().nullable(),
});

const workerSearchQuerySchema = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
  skills: z.string().optional(), // comma-separated or string
  minRate: z.coerce.number().min(0).optional(),
  maxRate: z.coerce.number().min(0).optional(),
  minExp: z.coerce.number().min(0).optional(),
  availability: z.enum(['AVAILABLE', 'BUSY', 'ON_VACATION', 'OFFLINE']).optional(),
  verificationStatus: z.enum(['PENDING', 'VERIFIED', 'REJECTED']).optional(),
  city: z.string().optional(),
  lat: z.coerce.number().optional(),
  lng: z.coerce.number().optional(),
  radiusKm: z.coerce.number().default(50).optional(),
  sort: z.enum(['newest', 'experience', 'rate_asc', 'rate_desc', 'completion', 'distance']).default('newest').optional(),
  page: z.coerce.number().min(1).default(1).optional(),
  limit: z.coerce.number().min(1).max(100).default(10).optional(),
});

module.exports = {
  updateWorkerProfileSchema,
  createPortfolioProjectSchema,
  createEducationSchema,
  createCertificationSchema,
  uploadVerificationDocumentSchema,
  workerSearchQuerySchema,
};
