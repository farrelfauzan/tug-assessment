import { createWellnessPackageSchema } from '@tug/api-schemas';
import { DEFAULT_PAGE_SIZE } from '@tug/utils';

export const adminSchemasCheck: {
  createWellnessPackageSchema: typeof createWellnessPackageSchema;
  defaultPageSize: number;
} = {
  createWellnessPackageSchema,
  defaultPageSize: DEFAULT_PAGE_SIZE
};
