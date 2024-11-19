import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { ApiError } from 'src/common/helper/error_description';
import { CurrentUser } from '../auth/decorators/get-current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CartService } from './cart.service';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { CartAddressDto } from './dto/create-address.dto';
import { UpdateCartItemQuantityDto } from './dto/update-cart-item.dto';

@Controller('customer/cart')
@ApiTags('Cart')
@UseGuards(JwtAuthGuard)
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
  async getCartByUserId(@CurrentUser() user: User) {
    return this.cartService.findByUserId(user.id);
  }

  @Post()
  async createCart(@Request() req) {
    const UserId = req.user.id;
    return this.cartService.createCart(UserId);
  }

  @Post('/:cartId/add-item')
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
  async addItemToCart(
    @Param('cartId') cartId: string,
    @Body() dto: AddCartItemDto,
    @Request() req,
  ) {
    const UserId = req.user.id;
    return this.cartService.addItemToCart(cartId, dto, UserId);
  }

  @Put('/:cartId/update-item-quantity/:itemId')
  async updateCartItemQuantity(
    @Request() req,
    @Param('cartId') cartId: string,
    @Param('itemId') itemId: string,
    @Body() dto: UpdateCartItemQuantityDto,
  ) {
    const UserId = req.user.id;
    return this.cartService.updateCartItemQuantity(cartId, itemId, dto, UserId);
  }

  @Delete('/:cartId/remove-item/:itemId')
  async removeItemFromCart(
    @Request() req,
    @Param('cartId') cartId: string,
    @Param('itemId') itemId: string,
  ) {
    const UserId = req.user.id;
    return await this.cartService.removeItemFromCart(cartId, itemId, UserId);
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

  @Put('/:cartId/update-address')
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
    summary: 'update address by USER',
    description: 'update address by USER',
  })
  async updateCartAddress(
    @Request() req,
    @Param('cartId') cartId: string,
    @Body() dto: CartAddressDto,
  ) {
    const UserId = req.user.id;
    return this.cartService.updateCartAddress(cartId, UserId, dto);
  }
}
