import { z } from 'zod';

export * from './wellness-packages';
export * from './auth';
export * from './orders';
export * from './reviews';

export const healthSchema = z.object({
  status: z.literal('ok')
});

export type Health = z.infer<typeof healthSchema>;
