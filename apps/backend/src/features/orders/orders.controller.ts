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
@Roles('ADMIN')
@ApiTags('orders')
@ApiBearerAuth()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async create(@Body() body: CreateOrderDto) {
    return {
      success: true,
      data: await this.ordersService.create(body as CreateOrderInput)
    };
  }

  @Get()
  async list(@Query() query: ListOrdersQueryDto) {
    return {
      success: true,
      data: await this.ordersService.list(query as ListOrdersQuery)
    };
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    const parsed = orderIdSchema.parse({ id });
    return {
      success: true,
      data: await this.ordersService.getById(parsed.id)
    };
  }

  @Patch(':id/status')
  async updateStatus(@Param('id') id: string, @Body() body: UpdateOrderStatusDto) {
    const parsed = orderIdSchema.parse({ id });
    return {
      success: true,
      data: await this.ordersService.updateStatus(parsed.id, body as UpdateOrderStatusInput)
    };
  }
}
