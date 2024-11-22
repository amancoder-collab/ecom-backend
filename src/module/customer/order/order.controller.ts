import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { User } from "@prisma/client";
import { CurrentUser } from "../auth/decorators/get-current-user.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { OrderService } from "./order.service";
import { CreateOrderDto } from "./dto/create-order.dto";

@ApiTags("Customer Order")
@UseGuards(JwtAuthGuard)
@Controller("customer/order")
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async createOrder(@CurrentUser() user: User, @Body() dto: CreateOrderDto) {
    return this.orderService.createOrder(user.id, dto);
  }

  @Get()
  async getOrders(@CurrentUser() user: User) {
    return this.orderService.findOrdersByUserId(user.id);
  }

  @Get(":id")
  async getOrderById(@Param("id") id: string) {
    return this.orderService.findOrderById(id);
  }

  @Get("ship-rocket-order-id/:shipRocketOrderId")
  async getOrderByShipRocketOrderId(
    @Param("shipRocketOrderId") shipRocketOrderId: string,
  ) {
    return this.orderService.findOrderByShipRocketOrderId(shipRocketOrderId);
  }
}
