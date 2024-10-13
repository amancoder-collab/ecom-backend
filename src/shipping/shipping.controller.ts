import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { CurrentUser } from 'src/module/customer/auth/decorators/get-current-user.decorator';
import { JwtAuthGuard } from 'src/module/customer/auth/guards/jwt-auth.guard';
import { CalculateShippingDto } from './dto/calculate-shipping.dto';
import { GetCouriersDto } from './dto/get-couriers.dto';
import { ShippingService } from './shipping.service';

@ApiTags('Customer Shipping')
@UseGuards(JwtAuthGuard)
@Controller('customer/shipping')
export class ShippingController {
  constructor(private readonly shippingService: ShippingService) {}

  @Get('pickup-locations')
  async getAllPickupLocations() {
    return this.shippingService.getAllPickupLocations();
  }

  @Post('charges/:cartId')
  async getShippingCharges(
    @CurrentUser() user: User,
    @Param('cartId') cartId: string,
    @Body() data: CalculateShippingDto,
  ) {
    console.log('User ', user);
    return this.shippingService.getCharges(user.id, cartId, data);
  }

  @Post('get-available-couriers')
  async getAvailableCouriers(@Body() dto: GetCouriersDto) {
    return this.shippingService.getAvailableCouriers(dto);
  }

  @Get('validate-pincode/:pincode')
  @ApiOperation({ summary: 'Validate pincode' })
  @ApiResponse({ status: 200, description: 'Pincode is valid' })
  @ApiResponse({ status: 400, description: 'Invalid pincode' })
  async validatePincode(@Param('pincode') pincode: string) {
    return this.shippingService.validatePincode(pincode);
  }

  @Get('shiprocket-orders')
  async getShipRocketOrders() {
    return this.shippingService.getShipRocketOrders();
  }
}
