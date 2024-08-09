import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import * as fs from 'fs';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MulterModule } from '@nestjs/platform-express';
import { AppConfigModule } from 'src/config/config.module';
import { PrismaModule } from 'src/module/prisma/prisma.module';
import { JwtStrategy } from 'src/common/strategy/jwt.strategy';

@Module({
    imports: [
        MulterModule.register({
            dest: './uploads',
        }),
        AppConfigModule,
        PrismaModule,
        JwtModule.register({
            global: true,
            signOptions: {
                algorithm: 'RS256',
                expiresIn: process.env.JWT_EXPIRES_IN,
            },
            privateKey: fs.readFileSync(
                'src/module/customer/auth/certs/private-key.pem',
            ),

            publicKey: fs.readFileSync(
                'src/module/customer/auth/certs/public-key.pem',
            ),
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
