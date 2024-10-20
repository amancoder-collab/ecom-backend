import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AppConfigService } from 'src/lib/config/config.service';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  private logger = new Logger(JwtStrategy.name);

  constructor(
    private readonly authService: AuthService,
    private readonly configService: AppConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        (req: Request) => req.cookies?.[configService.accessTokenCookieName],
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.jwtPublicKey,
      algorithms: ['RS256'],
    });
  }
  async validate(payload: any) {
    const id = payload.sub;
    try {
      const user = await this.authService.findUserById(id);
      if (!user) {
        throw new UnauthorizedException('User not found.');
      }
      return user;
    } catch (error) {
      this.logger.error(error);
      throw new UnauthorizedException('User not found');
    }
  }
}
