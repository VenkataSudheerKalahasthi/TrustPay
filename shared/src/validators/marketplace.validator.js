'use strict';

const { z } = require('zod');

const createJobSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(150),
  description: z.string().min(20, 'Description must be detailed'),
  categoryId: z.string().optional(),
  workType: z.enum(['HOURLY', 'FIXED', 'MILESTONE']).default('FIXED'),
  budget: z.number().positive().optional(),
  hourlyMin: z.number().positive().optional(),
  hourlyMax: z.number().positive().optional(),
  experienceLevel: z.enum(['ENTRY', 'INTERMEDIATE', 'EXPERT']).default('INTERMEDIATE'),
  visibility: z.enum(['PUBLIC', 'PRIVATE', 'ORGANIZATION', 'INVITATION_ONLY']).default('PUBLIC'),
  deadlineAt: z.string().datetime().optional(),
  skills: z.array(z.string()).optional(),
  screeningQuestions: z
    .array(
      z.object({
        question: z.string().min(3),
        type: z.enum(['SHORT_TEXT', 'PARAGRAPH', 'MULTIPLE_CHOICE', 'BOOLEAN', 'NUMERIC']).default('SHORT_TEXT'),
        isRequired: z.boolean().default(true),
      })
    )
    .optional(),
});

const submitProposalSchema = z.object({
  jobId: z.string().min(1),
  coverLetter: z.string().min(10, 'Cover letter must be detailed'),
  bidAmount: z.number().positive(),
  estimatedDays: z.number().int().positive(),
  milestones: z
    .array(
      z.object({
        title: z.string().min(3),
        amount: z.number().positive(),
        durationDays: z.number().int().positive(),
      })
    )
    .optional(),
  answers: z
    .array(
      z.object({
        screeningQuestionId: z.string().min(1),
        answerText: z.string().min(1),
      })
    )
    .optional(),
});

const scheduleInterviewSchema = z.object({
  jobId: z.string().min(1),
  proposalId: z.string().min(1),
  workerUserId: z.string().min(1),
  scheduledAt: z.string().datetime(),
  meetingUrl: z.string().url().optional(),
});

const sendOfferSchema = z.object({
  jobId: z.string().min(1),
  proposalId: z.string().min(1),
  workerUserId: z.string().min(1),
  totalAmount: z.number().positive(),
  terms: z.string().min(10),
});

module.exports = {
  createJobSchema,
  submitProposalSchema,
  scheduleInterviewSchema,
  sendOfferSchema,
};
