import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { ExtractJwt, Strategy } from 'passport-jwt';
import { AppConfigService } from 'src/config/config.service';
import { AuthService } from 'src/module/customer/auth/auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(
        private readonly authService: AuthService,
        private readonly configService: AppConfigService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.jwtPublic,
            algorithms: ['RS256'],
        });
    }
    async validate(payload: any) {
        const id = payload.id;
        try {
            const user = await this.authService.findOne(id);
            if (!user) {
                throw new UnauthorizedException('User not found.');
            }
            return user;
        } catch (error) {
            throw new UnauthorizedException(
                'Access denied: Invalid token, user deleted, or admin access only',
            );
        }
    }
}
