import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { Response } from 'express';
import { ApiError } from 'src/common/helper/error_description';
import { AuthService } from './auth.service';
import { clearTokenCookie, setTokenCookie } from './auth.utils';
import { CurrentUser } from './decorators/get-current-user.decorator';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { SignupDto } from './dto/signup.dto';
import { AppConfigService } from 'src/lib/config/config.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Public } from './decorators/public';

@Controller('auth')
@UseGuards(JwtAuthGuard)
@ApiTags('Authentication')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: AppConfigService,
  ) {}

  @Post('signup')
  @Public()
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
    summary: 'user Signup',
    description: 'user Signup',
  })
  async signup(
    @Body() dto: SignupDto,
    @Res({
      passthrough: true,
    })
    res: Response,
  ) {
    const response = await this.authService.signup(dto);
    setTokenCookie(res, response.tokens, this.configService);
    return response;
  }

  @Post('login')
  @Public()
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
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiOperation({
    summary: 'user Login',
    description: 'user Login',
  })
  async login(
    @Body() dto: LoginDto,
    @Res({
      passthrough: true,
    })
    res: Response,
  ) {
    const response = await this.authService.login(dto);
    setTokenCookie(res, response.tokens, this.configService);
    return response;
  }

  @Post('refresh-token')
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
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiOperation({
    summary: 'Refresh token',
    description: 'Generate new access token using refresh token.',
  })
  async refreshToken(@Body() dto: RefreshTokenDto) {
    return await this.authService.refreshToken(dto.refreshToken);
  }

  @Post('logout')
  @ApiOperation({ summary: 'Logout store' })
  async logout(
    @Res({
      passthrough: true,
    })
    res: Response,
  ) {
    clearTokenCookie(res, this.configService);
    return {
      message: 'Logout successful',
    };
  }

  @Get('session')
  @ApiOperation({ summary: 'Get session' })
  async session(@CurrentUser() user: User) {
    return {
      user,
      message: 'Session retrieved',
    };
  }
}
