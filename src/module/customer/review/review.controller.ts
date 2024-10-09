import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ReviewDto } from './dto/review.dto';
import { ReviewService } from './review.service';
import {
  ApiBearerAuth,
  ApiResponse,
  ApiOperation,
  ApiTags,
  ApiQuery,
} from '@nestjs/swagger';
import { ApiError } from 'src/common/helper/error_description';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '@prisma/client';
import { CurrentUser } from '../auth/decorators/get-current-user.decorator';

@Controller('customer/review')
@ApiTags('Review')
@UseGuards(JwtAuthGuard)
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post(':productId')
  @ApiBearerAuth()
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
    summary: 'add review by USER',
    description: 'add review by USER',
  })
  async addProducts(
    @Param('productId') productId: string,
    @Body() dto: ReviewDto,
    @CurrentUser() user: User,
  ) {
    return this.reviewService.postReview(dto, user.id, productId);
  }

  @Get()
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
    summary: 'Get review by USER ',
    description: 'Get review by USER',
  })
  @ApiQuery({
    name: 'page',
    description: 'Type of review details to fetch',
    required: false,
  })
  @ApiQuery({
    name: 'limit',
    description: 'Type of review to fetch',
    required: false,
  })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.reviewService.findAll(page, limit);
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
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
    summary: 'get single product review by USER ',
    description: 'get single product review by USER ',
  })
  async getOne(@Query('productId') productId: string, @Request() req) {
    const UserId = req.user.id;
    return this.reviewService.findOneReview(UserId, productId);
  }
}
