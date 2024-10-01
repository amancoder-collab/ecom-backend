import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Roles } from 'src/common/decorator/role.decorator';
import { ListOrder } from 'src/common/enums/utiles.enum';
import { RolesGuard } from 'src/common/guard/role.guard';
import { ApiError } from 'src/common/helper/error_description';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SubEmailDto } from './dto/submail.dto';
import { SubscribeService } from './subscribe.service';

@Controller('subscribemail')
@ApiTags('Subscribe-email')
export class SubscribeController {
  constructor(private readonly emailService: SubscribeService) {}

  @Post()
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
    summary: 'add subscribe email by CUSTOMER',
    description: 'add subscribe email by CUSTOMER',
  })
  async addProducts(@Body() dto: SubEmailDto) {
    return this.emailService.subscribe(dto);
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SELLER)
  @ApiResponse({
    status: HttpStatus.OK,
    description: ApiError.SUCCESS_MESSAGE,
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
    summary: 'Find subscribe email list by SELLER',
    description: 'Find subscribe email list by SELLER',
  })
  @ApiQuery({
    name: 'type',
    description: 'Type of customer details to fetch',
    enum: ListOrder,
    example: ListOrder.ASCENDING,
  })
  @ApiQuery({
    name: 'page',
    description: 'Type of customer details to fetch',
    required: false,
  })
  @ApiQuery({
    name: 'limit',
    description: 'Type of customer details to fetch',
    required: false,
  })
  customer(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('type') type: ListOrder,
    @Request() req,
  ) {
    const sellerId = req.user.id;
    return this.emailService.list(page, limit, type, sellerId);
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
    summary: 'remove subscribe email by SELLER',
    description: 'remove subscribe email by SELLER',
  })
  async remove(@Param('id') id: string, @Request() req) {
    const sellerId = req.user.id;
    return this.emailService.remove(id, sellerId);
  }
}
