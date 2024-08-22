import {
    Body,
    Controller,
    Get,
    HttpStatus,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import { ApiResponse, ApiOperation, ApiTags, ApiQuery } from '@nestjs/swagger';
import { ApiError } from 'src/common/helper/error_description';

import { SubscribemailService } from './subscribemail.service';
import { SubEmailDto } from './dto/submail.dto';
import { ListOrder } from 'src/common/enums/utiles.enum';
import { subscribe } from 'diagnostics_channel';

@Controller('subscribemail')
@ApiTags('Subscribe-email')
export class SubscribemailController {
    constructor(private readonly emailService: SubscribemailService) {}

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
        summary: 'add review by USER',
        description: 'add review by USER',
    })
    async addProducts(@Body() dto: SubEmailDto) {
        return this.emailService.subscribe(dto);
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
        summary: 'Find Customer Details with entering the CUSTOMER_ID only',
        description: 'Find Customer Details with entering the CUSTOMER_ID only',
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
    ) {
        return this.emailService.list(page, limit, type);
    }
}
