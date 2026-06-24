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
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import {
  requireCurrentUser,
  type AuthenticatedUser
} from '../../shared/decorators/require-current-user.decorator';
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
@ApiTags('reviews')
@ApiBearerAuth()
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @Roles('USER')
  async create(
    @Body() body: CreateReviewDto,
    @CurrentUser() user?: AuthenticatedUser
  ) {
    const actor = requireCurrentUser(user);

    return {
      success: true,
      data: await this.reviewsService.create({
        ...(body as CreateReviewInput),
        userId: actor.sub
      })
    };
  }

  @Get()
  @Roles('ADMIN', 'USER')
  async list(
    @Query() query: ListReviewsQueryDto,
    @CurrentUser() user?: AuthenticatedUser
  ) {
    const actor = requireCurrentUser(user);

    return {
      success: true,
      data: await this.reviewsService.list(query as ListReviewsQuery, {
        id: actor.sub,
        role: actor.role
      })
    };
  }

  @Patch(':id')
  @Roles('ADMIN')
  async update(@Param('id') id: string, @Body() body: UpdateReviewDto) {
    const parsed = reviewIdSchema.parse({ id });
    return {
      success: true,
      data: await this.reviewsService.update(parsed.id, body as UpdateReviewInput)
    };
  }

  @Delete(':id')
  @Roles('ADMIN')
  async remove(@Param('id') id: string) {
    const parsed = reviewIdSchema.parse({ id });
    return {
      success: true,
      data: await this.reviewsService.remove(parsed.id)
    };
  }
}
