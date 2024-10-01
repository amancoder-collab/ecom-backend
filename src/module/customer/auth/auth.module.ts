import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import * as fs from 'fs';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MulterModule } from '@nestjs/platform-express';
import { AppConfigModule } from 'src/lib/config/config.module';
import { PrismaModule } from 'src/module/prisma/prisma.module';
import { JwtStrategy } from 'src/common/strategy/jwt.strategy';
import { TokensService } from './tokens.service';
import { HashService } from './hash.service';
import { AppConfigService } from 'src/lib/config/config.service';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads',
    }),
    AppConfigModule,
    PrismaModule,
    JwtModule.registerAsync({
      imports: [AppConfigModule],
      useFactory: async (configService: AppConfigService) => ({
        global: true,
        signOptions: {
          algorithm: 'RS256',
          expiresIn: configService.accessTokenSecretExpire,
        },
        privateKey: configService.jwtPrivateKey,
        publicKey: configService.jwtPublicKey,
      }),
      inject: [AppConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, TokensService, JwtStrategy, HashService],
})
export class AuthModule {}
