import {
    Body,
    Controller,
    Get,
    HttpStatus,
    Post,
    Request,
    UseGuards,
} from '@nestjs/common';
import { CouponsService } from './coupons.service';
import { CreateCouponDto } from './dto/coupons.dto';
import { ApiBearerAuth, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { ApiError } from 'src/common/helper/error_description';
import { JwtAuthGuard } from 'src/module/customer/auth/guards/jwt-auth.guard';

@Controller('coupons')
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
        summary: 'add the coupons SELLER',
        description: 'add the coupons SELLER',
    })
    async createCoupon(
        @Body() createCouponDto: CreateCouponDto,
        @Request() req,
    ) {
        const userId = req.user.id;
        return this.couponsService.createCoupon(createCouponDto, userId);
    }

    // Apply coupon
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
        summary: 'apply the coupons SELLER',
        description: 'apply the coupons SELLER',
    })
    async applyCoupon(
        @Body('code') code: string,
        @Body('orderAmount') orderAmount: number,
        @Request() req,
    ) {
        const userId = req.user.id;
        return this.couponsService.applyCoupon(code, userId, orderAmount);
    }
}
