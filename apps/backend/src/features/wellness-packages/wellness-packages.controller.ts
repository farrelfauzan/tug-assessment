import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  type CreateWellnessPackageInput,
  type UpdateWellnessPackageInput,
  type WellnessPackageListQuery,
  wellnessPackageIdSchema,
  wellnessPackageListResponseSchema,
  wellnessPackageSchema
} from '@tug/api-schemas';
import { Roles } from '../../shared/decorators/roles.decorator';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { RolesGuard } from '../../shared/guards/roles.guard';
import {
  CreateWellnessPackageDto,
  UpdateWellnessPackageDto,
  WellnessPackagesListQueryDto
} from './api/wellness-packages.dto';
import { WellnessPackagesService } from './services/wellness-packages.service';

@Controller('wellness-packages')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@ApiTags('wellness-packages')
@ApiBearerAuth()
export class WellnessPackagesController {
  constructor(private readonly wellnessPackagesService: WellnessPackagesService) {}

  @Get()
  async list(@Query() query: WellnessPackagesListQueryDto) {
    const data = await this.wellnessPackagesService.list(query as WellnessPackageListQuery);
    return {
      success: true,
      data: wellnessPackageListResponseSchema.parse(data)
    };
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    const parsed = wellnessPackageIdSchema.parse({ id });
    const data = await this.wellnessPackagesService.getById(parsed.id);
    return {
      success: true,
      data: wellnessPackageSchema.parse(data)
    };
  }

  @Post()
  async create(@Body() body: CreateWellnessPackageDto) {
    const data = await this.wellnessPackagesService.create(body as CreateWellnessPackageInput);
    return {
      success: true,
      data: wellnessPackageSchema.parse(data)
    };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: UpdateWellnessPackageDto) {
    const parsed = wellnessPackageIdSchema.parse({ id });
    const data = await this.wellnessPackagesService.update(
      parsed.id,
      body as UpdateWellnessPackageInput
    );
    return {
      success: true,
      data: wellnessPackageSchema.parse(data)
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const parsed = wellnessPackageIdSchema.parse({ id });
    return {
      success: true,
      data: await this.wellnessPackagesService.remove(parsed.id)
    };
  }
}
