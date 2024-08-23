import {
    Body,
    Controller,
    Delete,
    Get,
    HttpStatus,
    Param,
    Patch,
    Post,
    Query,
    Request,
    UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiQuery,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { ApiError } from 'src/common/helper/error_description';
import { AddProductDto } from './dto/product.dto';
import { UpdateProductDto } from './dto/update.product.dto';
import { Role } from '@prisma/client';
import { RolesGuard } from 'src/common/guard/role.guard';
import { JwtAuthGuard } from 'src/module/customer/auth/guards/jwt-auth.guard';
import { Roles } from 'src/common/decorator/role.decorator';

@Controller('products')
@ApiTags('Products-admin')
export class ProductsController {
    constructor(private readonly productService: ProductsService) {}

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
        summary: 'Get product by USER and SELLER',
        description: 'Get product by USER and SELLER',
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
    async getListOfProducts(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
    ) {
        return this.productService.getListProduct(page, limit);
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
        summary: 'add product by SELLER',
        description: 'add product by SELLER',
    })
    async addProducts(@Body() dto: AddProductDto, @Request() req) {
        const AdminId = req.user.id;
        return this.productService.addProducts(dto, AdminId);
    }

    @Patch(':id')
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
        summary: 'update product by SELLER',
        description: 'update product by SELLER',
    })
    async updateProducts(
        @Param('id') productId: string,
        @Body() dto: UpdateProductDto,
        @Request() req,
    ) {
        const AdminId = req.user.id;
        return this.productService.updateProducts(dto, AdminId, productId);
    }

    @Patch('deactivate/:id')
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
        summary: 'DeActive product by SELLER',
        description: 'DeActive product by SELLER',
    })
    async deactivateProduct(@Param('id') productId: string, @Request() req) {
        const AdminId = req.user.id;
        return this.productService.deactivateProduct(AdminId, productId);
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
        summary: 'update product by SELLER',
        description: 'update product by SELLER',
    })
    async deleteProducts(@Param('id') productId: string, @Request() req) {
        const AdminId = req.user.id;
        return this.productService.deleteProducts(productId, AdminId);
    }
}
