import { createWellnessPackageSchema } from '@tug/api-schemas';
import { toPagination } from '@tug/utils';

export const schemasCheck: {
  createWellnessPackageSchema: typeof createWellnessPackageSchema;
  toPagination: typeof toPagination;
} = {
  createWellnessPackageSchema,
  toPagination
};
