import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CouponsService } from './coupons.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import {
  ApiBearerAuth,
  ApiResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ApiError } from 'src/common/helper/error_description';
import { JwtAuthGuard } from 'src/module/customer/auth/guards/jwt-auth.guard';
import { Role } from '@prisma/client';
import { Roles } from 'src/common/decorator/role.decorator';
import { RolesGuard } from 'src/common/guard/role.guard';
import { ApplyCouponDto } from './dto/coupons.apply.dto';

@Controller('coupons')
@ApiTags('Coupons')
export class CouponsController {
  constructor(private couponsService: CouponsService) {}

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: HttpStatus.OK,
    description: ApiError.SUCCESS_MESSAGE,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: ApiError.UNAUTHORIZED_MESSAGE,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: ApiError.INTERNAL_SERVER_ERROR_MESSAGE,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: ApiError.BAD_REQUEST,
  })
  @ApiOperation({
    summary: 'Get all the active coupons by USER and SELLER',
    description: 'Get all the coupons by USER and SELLER',
  })
  async getAllCoupons(@Request() req) {
    const userId = req.user.id;
    return this.couponsService.getAllCoupons(userId);
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SELLER)
  @ApiResponse({
    status: HttpStatus.OK,
    description: ApiError.SUCCESS_MESSAGE,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: ApiError.UNAUTHORIZED_MESSAGE,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: ApiError.INTERNAL_SERVER_ERROR_MESSAGE,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: ApiError.BAD_REQUEST,
  })
  @ApiOperation({
    summary: 'add the coupons SELLER',
    description: 'add the coupons SELLER',
  })
  async createCoupon(@Body() dto: CreateCouponDto, @Request() req) {
    const adminId = req.user.id;
    return this.couponsService.createCoupon(dto, adminId);
  }

  @Post('apply')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: HttpStatus.OK,
    description: ApiError.SUCCESS_MESSAGE,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: ApiError.UNAUTHORIZED_MESSAGE,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: ApiError.INTERNAL_SERVER_ERROR_MESSAGE,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: ApiError.BAD_REQUEST,
  })
  @ApiOperation({
    summary: 'apply the coupons USER',
    description: 'apply the coupons USER',
  })
  async applyCoupon(@Body() dto: ApplyCouponDto, @Request() req) {
    const userId = req.user.id;
    return this.couponsService.applyCoupon(userId, dto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SELLER)
  @ApiResponse({
    status: HttpStatus.OK,
    description: ApiError.SUCCESS_MESSAGE,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: ApiError.UNAUTHORIZED_MESSAGE,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: ApiError.INTERNAL_SERVER_ERROR_MESSAGE,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: ApiError.BAD_REQUEST,
  })
  @ApiOperation({
    summary: 'Delete coupons SELLER',
    description: 'Delete coupons SELLER',
  })
  async DeleteCoupon(@Param('id') couponID: string, @Request() req) {
    const adminId = req.user.id;
    return this.couponsService.deleteCoupon(adminId, couponID);
  }
}
