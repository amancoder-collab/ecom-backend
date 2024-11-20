import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { AppConfigService } from 'src/lib/config/config.service';
import { ITokens } from './interfaces/tokens';
@Injectable()
export class TokensService {
  private readonly logger = new Logger(TokensService.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: AppConfigService,
  ) {}

  async generate(user: Partial<User>): Promise<ITokens> {
    try {
      const [accessToken, refreshToken] = await Promise.all([
        this.generateAccessToken(user),
        this.generateRefreshToken(user),
      ]);

      return {
        accessToken,
        refreshToken,
        expiresIn: this.getExpiryInMs(accessToken),
        refreshTokenExpiresIn: this.getExpiryInMs(refreshToken),
      };
    } catch (error) {
      this.logger.error('Error generating tokens', error);
      throw error;
    }
  }

  async verifyRefreshToken(refreshToken: string): Promise<any> {
    try {
      return await this.jwtService.verifyAsync(refreshToken, {
        publicKey: this.configService.jwtPublicKey,
        algorithms: ['RS256'],
      });
    } catch (error) {
      this.logger.error('Error verifying refresh token', error);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  async generateAccessTokenFromRefreshToken(
    user: Partial<User>,
  ): Promise<string> {
    return this.generateAccessToken(user);
  }

  private async generateAccessToken(user: Partial<User>): Promise<string> {
    const payload = {
      sub: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    return await this.jwtService.signAsync(payload, {
      algorithm: 'RS256',
      privateKey: this.configService.jwtPrivateKey,
      expiresIn: this.configService.accessTokenSecretExpire,
    });
  }

  private async generateRefreshToken(user: Partial<User>): Promise<string> {
    const payload = {
      sub: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    return await this.jwtService.signAsync(payload, {
      algorithm: 'RS256',
      privateKey: this.configService.jwtPrivateKey,
      expiresIn: this.configService.refreshTokenSecretExpire,
    });
  }

  private getExpiryInMs(token: string): number {
    const decoded = this.jwtService.decode(token) as { exp: number };
    return decoded.exp * 1000;
  }
}
