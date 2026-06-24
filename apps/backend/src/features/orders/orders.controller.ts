import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  orderIdSchema,
  type CreateOrderInput,
  type ListOrdersQuery,
  type UpdateOrderStatusInput
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
  CreateOrderDto,
  ListOrdersQueryDto,
  UpdateOrderStatusDto
} from './api/orders.dto';
import { OrdersService } from './services/orders.service';

@Controller('orders')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('orders')
@ApiBearerAuth()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @Roles('USER')
  async create(
    @Body() body: CreateOrderDto,
    @CurrentUser() user?: AuthenticatedUser
  ) {
    const actor = requireCurrentUser(user);

    return {
      success: true,
      data: await this.ordersService.create({
        ...(body as CreateOrderInput),
        userId: actor.sub
      })
    };
  }

  @Get()
  @Roles('ADMIN', 'USER')
  async list(
    @Query() query: ListOrdersQueryDto,
    @CurrentUser() user?: AuthenticatedUser
  ) {
    const actor = requireCurrentUser(user);

    return {
      success: true,
      data: await this.ordersService.list(query as ListOrdersQuery, {
        id: actor.sub,
        role: actor.role
      })
    };
  }

  @Get(':id')
  @Roles('ADMIN', 'USER')
  async getById(
    @Param('id') id: string,
    @CurrentUser() user?: AuthenticatedUser
  ) {
    const actor = requireCurrentUser(user);

    const parsed = orderIdSchema.parse({ id });
    return {
      success: true,
      data: await this.ordersService.getById(parsed.id, {
        id: actor.sub,
        role: actor.role
      })
    };
  }

  @Patch(':id/status')
  @Roles('ADMIN')
  async updateStatus(@Param('id') id: string, @Body() body: UpdateOrderStatusDto) {
    const parsed = orderIdSchema.parse({ id });
    return {
      success: true,
      data: await this.ordersService.updateStatus(parsed.id, body as UpdateOrderStatusInput)
    };
  }
}
