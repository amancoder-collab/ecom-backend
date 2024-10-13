import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { CurrentUser } from '../auth/decorators/get-current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderService } from './order.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Customer Order')
@UseGuards(JwtAuthGuard)
@Controller('customer/order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async createOrder(@CurrentUser() user: User) {
    return this.orderService.createOrder(user.id);
  }

  @Get()
  async getOrders(@CurrentUser() user: User) {
    return this.orderService.findOrdersByUserId(user.id);
  }

  @Get(':id')
  async getOrderById(@Param('id') id: string) {
    return this.orderService.findOrderById(id);
  }

  @Get('ship-rocket-order-id/:shipRocketOrderId')
  async getOrderByShipRocketOrderId(
    @Param('shipRocketOrderId') shipRocketOrderId: string,
  ) {
    return this.orderService.findOrderByShipRocketOrderId(shipRocketOrderId);
  }
}
