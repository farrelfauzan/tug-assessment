import { z } from 'zod';

export const wellnessPackageStatusSchema = z.enum([
  'DRAFT',
  'ACTIVE',
  'INACTIVE',
  'ARCHIVED'
]);

export const wellnessPackageSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(3).max(100),
  description: z.string().min(10).max(1000),
  price: z.number().positive().multipleOf(0.01),
  durationWeeks: z.number().int().min(1).max(52),
  status: wellnessPackageStatusSchema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
});

export const createWellnessPackageSchema = z.object({
  name: z.string().min(3).max(100),
  description: z.string().min(10).max(1000),
  price: z.number().positive().multipleOf(0.01),
  durationWeeks: z.number().int().min(1).max(52),
  status: z.enum(['DRAFT', 'ACTIVE']).default('DRAFT')
});

export const updateWellnessPackageSchema = createWellnessPackageSchema
  .extend({
    status: wellnessPackageStatusSchema.optional()
  })
  .partial();

export const wellnessPackageListQuerySchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
  status: wellnessPackageStatusSchema.optional(),
  search: z.string().optional()
});

export type WellnessPackage = z.infer<typeof wellnessPackageSchema>;
export type CreateWellnessPackageInput = z.infer<typeof createWellnessPackageSchema>;
export type UpdateWellnessPackageInput = z.infer<typeof updateWellnessPackageSchema>;
export type WellnessPackageListQuery = z.infer<typeof wellnessPackageListQuerySchema>;
