import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { readFileSync } from 'fs';
import * as path from 'path';

@Injectable()
export class AppConfigService {
  private readonly logger = new Logger(AppConfigService.name);

  constructor(private readonly configService: ConfigService) {}

  private get<T>(key: string) {
    const value = this.configService.get<T>(key);
    if (value == null) {
      throw new InternalServerErrorException(`app env config error ${key}`);
    }
    return value;
  }

  private getKeyPath(fileName: string): string {
    if (this.isDevelopment) {
      return readFileSync(
        path.join('src/module/customer/auth/certs/' + fileName),
      ).toString();
    } else {
      return readFileSync(
        path.join(
          __dirname,
          '..',
          '..',
          'module',
          'customer',
          'auth',
          'certs',
          fileName,
        ),
      ).toString();
    }
  }

  get jwtPublicKey(): string {
    let str;
    try {
      str = this.getKeyPath('public-key.pem');
    } catch (e) {
      this.logger.error('Error in public ', e);
      throw new InternalServerErrorException(
        'app env config error - public key',
      );
    }
    return str;
  }

  get jwtPrivateKey(): string {
    let str;
    try {
      str = this.getKeyPath('private-key.pem');
    } catch (e) {
      this.logger.error('Error in private key', e);
      throw new InternalServerErrorException(
        'app env config error - private key',
      );
    }
    return str;
  }

  get isDevelopment(): boolean {
    return this.get('NODE_ENV') === 'development';
  }

  get accessTokenCookieName(): string {
    return this.get<string>('app.accessTokenCookieName');
  }

  get refreshTokenCookieName(): string {
    return this.get<string>('app.refreshTokenCookieName');
  }

  get refreshTokenSecretExpire(): string {
    return this.get<string>('app.refreshTokenExpiresIn');
  }

  get accessTokenSecretExpire(): string {
    return this.get<string>('app.accessTokenExpiresIn');
  }

  get redisHost(): string {
    return this.get<string>('app.redisHost');
  }

  get redisPort(): number {
    return this.get<number>('app.redisPort');
  }

  get redisPassword(): string {
    return this.get<string>('app.redisPassword');
  }

  get port(): number {
    return this.get<number>('app.port');
  }

  get smtpPassword() {
    return this.get<string>('app.smtpPassword');
  }

  get smtpUsername() {
    return this.get<string>('app.smtpUsername');
  }

  get smtpPort() {
    return this.get<string>('app.smtpPort');
  }

  get smtpHost() {
    return this.get<string>('app.smtpHostname');
  }

  get razorpayKeyId() {
    return this.get<string>('app.razorpayKeyId');
  }

  get razorpayKeySecret() {
    return this.get<string>('app.razorpayKeySecret');
  }

  get shiprocketApiUrl() {
    return this.get<string>('app.shiprocketApiUrl');
  }

  get shiprocketEmail() {
    return this.get<string>('app.shiprocketEmail');
  }

  get shiprocketPassword() {
    return this.get<string>('app.shiprocketPassword');
  }
}
