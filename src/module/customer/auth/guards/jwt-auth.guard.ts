import {
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { PUBLIC_KEY } from '../decorators/public';
import { AppConfigService } from 'src/lib/config/config.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);
  constructor(
    private reflector: Reflector,
    private readonly configService: AppConfigService,
  ) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride(PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    const token =
      request.cookies?.[this.configService.accessTokenCookieName] ??
      request.headers.authorization;

    this.logger.debug(token);
    if (!token) {
      throw new UnauthorizedException(
        JSON.stringify({
          message: 'Auth header or cookie not found',
          authorization: request.headers.authorization,
          cookie: request.cookies?.[this.configService.accessTokenCookieName],
        }),
      );
    }

    return super.canActivate(context);
  }
}
