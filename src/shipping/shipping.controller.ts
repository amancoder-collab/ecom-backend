import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { ShippingService } from './shipping.service';
import { CreateShipRocketOrderDto } from './dto/create-order.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/module/customer/auth/guards/jwt-auth.guard';
import { CalculateShippingDto } from './dto/calculate-shipping.dto';
import { User } from '@prisma/client';
import { CurrentUser } from 'src/module/customer/auth/decorators/get-current-user.decorator';

@ApiTags('Shipping')
@UseGuards(JwtAuthGuard)
@Controller('customer/shipping')
export class ShippingController {
  constructor(private readonly shippingService: ShippingService) {}

  @Post('create-order')
  async createShipRocketOrder(@Body() orderData: CreateShipRocketOrderDto) {
    return this.shippingService.createShipRocketOrder(orderData);
  }

  @Get('pickup-locations')
  async getAllPickupLocations() {
    return this.shippingService.getAllPickupLocations();
  }

  @Post('charges')
  async getShippingCharges(
    @CurrentUser() user: User,
    @Body() data: CalculateShippingDto,
  ) {
    console.log('User ', user);
    return this.shippingService.getCharges(user.id, data);
  }
}
