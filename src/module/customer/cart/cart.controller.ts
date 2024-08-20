import {
    Body,
    Controller,
    HttpStatus,
    Post,
    UseGuards,
    Request,
    Delete,
    Param,
    Get,
    Query,
} from '@nestjs/common';
import { CartService } from './cart.service';
import {
    ApiBearerAuth,
    ApiResponse,
    ApiOperation,
    ApiTags,
    ApiQuery,
} from '@nestjs/swagger';
import { ApiError } from 'src/common/helper/error_description';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AddCart } from './dto/cart.dto';

@Controller('cart')
@ApiTags('Cart')
export class CartController {
    constructor(private readonly cartService: CartService) {}

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
        summary: 'Get cart by USER',
        description: 'Get cart by USER',
    })
    @ApiQuery({ name: 'page', required: false })
    @ApiQuery({ name: 'limit', required: false })
    async getListOfProducts(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
    ) {
        return this.cartService.listAllCart(page, limit);
    }

    @Get('count')
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
        summary: 'Get cart count by USER',
        description: 'Get cart count by USER',
    })
    async listCartCount(@Request() req) {
        const UserId = req.user.id;
        return this.cartService.listCartCount(UserId);
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
        summary: 'add cart by USER',
        description: 'add cart by USER',
    })
    async addProducts(@Body() dto: AddCart, @Request() req) {
        const UserId = req.user.id;
        return this.cartService.addCart(dto, UserId);
    }

    @Delete(':id')
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
        summary: 'update cart by USER',
        description: 'update cart by USER',
    })
    async deleteProducts(@Param('id') productId: string, @Request() req) {
        const UserId = req.user.id;
        return this.cartService.removeFromCart(productId, UserId);
    }
}
