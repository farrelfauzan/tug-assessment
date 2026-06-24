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
  reviewIdSchema,
  type CreateReviewInput,
  type ListReviewsQuery,
  type UpdateReviewInput
} from '@tug/api-schemas';
import { Roles } from '../../shared/decorators/roles.decorator';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { RolesGuard } from '../../shared/guards/roles.guard';
import {
  CreateReviewDto,
  ListReviewsQueryDto,
  UpdateReviewDto
} from './api/reviews.dto';
import { ReviewsService } from './services/reviews.service';

@Controller('reviews')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@ApiTags('reviews')
@ApiBearerAuth()
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  async create(@Body() body: CreateReviewDto) {
    return {
      success: true,
      data: await this.reviewsService.create(body as CreateReviewInput)
    };
  }

  @Get()
  async list(@Query() query: ListReviewsQueryDto) {
    return {
      success: true,
      data: await this.reviewsService.list(query as ListReviewsQuery)
    };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: UpdateReviewDto) {
    const parsed = reviewIdSchema.parse({ id });
    return {
      success: true,
      data: await this.reviewsService.update(parsed.id, body as UpdateReviewInput)
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const parsed = reviewIdSchema.parse({ id });
    return {
      success: true,
      data: await this.reviewsService.remove(parsed.id)
    };
  }
}
