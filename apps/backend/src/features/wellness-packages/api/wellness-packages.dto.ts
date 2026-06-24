import {
  createWellnessPackageSchema,
  updateWellnessPackageSchema,
  wellnessPackageIdSchema,
  wellnessPackageListQuerySchema,
  type CreateWellnessPackageInput,
  type UpdateWellnessPackageInput,
  type WellnessPackageIdInput,
  type WellnessPackageListQuery
} from '@tug/api-schemas';
import { createZodDto } from 'nestjs-zod';

export class WellnessPackagesListQueryDto extends createZodDto(wellnessPackageListQuerySchema) {}
export class WellnessPackageIdDto extends createZodDto(wellnessPackageIdSchema) {}
export class CreateWellnessPackageDto extends createZodDto(createWellnessPackageSchema) {}
export class UpdateWellnessPackageDto extends createZodDto(updateWellnessPackageSchema) {}

export type WellnessPackagesListQueryDtoType = WellnessPackageListQuery;
export type WellnessPackageIdDtoType = WellnessPackageIdInput;
export type CreateWellnessPackageDtoType = CreateWellnessPackageInput;
export type UpdateWellnessPackageDtoType = UpdateWellnessPackageInput;
