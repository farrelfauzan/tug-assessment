import { wellnessPackageSchema } from '@tug/api-schemas';
import { formatCurrency } from '@tug/utils';

export const mobileSchemasCheck: {
  wellnessPackageSchema: typeof wellnessPackageSchema;
  formatCurrency: typeof formatCurrency;
} = {
  wellnessPackageSchema,
  formatCurrency
};
