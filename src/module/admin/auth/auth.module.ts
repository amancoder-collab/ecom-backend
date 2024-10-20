import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MulterModule } from '@nestjs/platform-express';
import { JwtStrategy } from 'src/module/admin/auth/jwt.strategy';
import { AppConfigModule } from 'src/lib/config/config.module';
import { AppConfigService } from 'src/lib/config/config.service';
import { PrismaModule } from 'src/module/prisma/prisma.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { HashService } from './hash.service';
import { TokensService } from './tokens.service';

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
