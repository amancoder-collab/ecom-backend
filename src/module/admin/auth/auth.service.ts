import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role, User } from '@prisma/client';
import { AppConfigService } from 'src/lib/config/config.service';
import { PrismaService } from 'src/module/prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { HashService } from './hash.service';
import { TokensService } from './tokens.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly hashService: HashService,
    private readonly prismaService: PrismaService,
    private readonly tokensService: TokensService,
  ) {}

  private async findUserByEmail(email: string): Promise<User | null> {
    return this.prismaService.user.findUnique({
      where: { email, role: Role.ADMIN, isDeleted: false },
    });
  }

  async findUserById(id: string): Promise<User | null> {
    return await this.prismaService.user.findUnique({
      where: { id, role: Role.ADMIN, isDeleted: false },
    });
  }

  async signup(dto: SignupDto) {
    const existingUser = await this.findUserByEmail(dto.email);

    if (existingUser) {
      throw new BadRequestException('Email is already registered.');
    }

    const newUser = await this.createNewUser(dto);

    const tokens = await this.tokensService.generate(newUser);

    return {
      message: 'User registered successfully!',
      user: newUser,
      tokens,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.validateUser(dto.email, dto.password);
    const tokens = await this.tokensService.generate(user);

    return {
      message: 'Login successful!',
      user,
      tokens,
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = await this.tokensService.verifyRefreshToken(refreshToken);

      const user = await this.findUserById(payload.sub);

      const newAccessToken =
        await this.tokensService.generateAccessTokenFromRefreshToken(user);

      return {
        message: 'Token refreshed successfully!',
        accessToken: newAccessToken,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  private async validateUser(email: string, password: string): Promise<User> {
    const user = await this.findUserByEmail(email);
    if (
      !user ||
      !(await this.hashService.comparePassword(password, user.password))
    ) {
      throw new UnauthorizedException('Invalid email or password');
    }
    return user;
  }

  private async createNewUser(dto: SignupDto): Promise<User> {
    const hashedPassword = await this.hashService.hashPassword(dto.password);
    return this.prismaService.user.create({
      data: {
        firstName: dto.fullName,
        email: dto.email,
        phoneNumber: dto.phoneNumber,
        password: hashedPassword,
        dateOfBirth: new Date(dto.birthDate),
        gender: dto.gender,
        role: Role.ADMIN,
      },
    });
  }
}
