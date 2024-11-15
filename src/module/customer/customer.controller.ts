import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { CurrentUser } from 'src/module/admin/auth/decorators/get-current-user.decorator';
import { CustomerService } from './customer.service';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@ApiTags('Customer')
@Controller('customer')
@UseGuards(JwtAuthGuard)
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get('addresses')
  async getUserAddresses(@CurrentUser() user: User) {
    return this.customerService.getUserAddresses(user.id);
  }

  @Post('address')
  async createAddress(
    @CurrentUser() user: User,
    @Body() dto: CreateAddressDto,
  ) {
    return this.customerService.createAddress(user.id, dto);
  }

  @Put('address/:id')
  async updateAddress(@Param('id') id: string, @Body() dto: UpdateAddressDto) {
    return this.customerService.updateAddress(id, dto);
  }
}
