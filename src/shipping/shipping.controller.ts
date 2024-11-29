import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/module/customer/auth/guards/jwt-auth.guard";
import { CalculateShippingDto } from "./dto/calculate-shipping.dto";
import { IPickupLocationsResponse } from "./interface/shiprocket-responses";
import { ShippingService } from "./shipping.service";

@ApiTags("Customer Shipping")
@UseGuards(JwtAuthGuard)
@Controller("customer/shipping")
export class ShippingController {
  constructor(private readonly shippingService: ShippingService) {}

  @Get("pickup-locations")
  async getAllPickupLocations(): Promise<IPickupLocationsResponse["data"]> {
    return await this.shippingService.getAllPickupLocations();
  }

  @Post("charges/:cartId")
  async getShippingCharges(
    @Param("cartId") cartId: string,
    @Body() data: CalculateShippingDto,
  ) {
    return this.shippingService.getCharges(cartId, data);
  }

  @Get("validate-pincode/:pincode")
  @ApiOperation({ summary: "Validate pincode" })
  @ApiResponse({ status: 200, description: "Pincode is valid" })
  @ApiResponse({ status: 400, description: "Invalid pincode" })
  async validatePincode(@Param("pincode") pincode: string) {
    return this.shippingService.validatePincode(pincode);
  }

  @Get("shiprocket-orders")
  async getShipRocketOrders() {
    return this.shippingService.getShipRocketOrders();
  }
}
