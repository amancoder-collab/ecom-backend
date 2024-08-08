import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { readFileSync } from 'fs';

@Injectable()
export class AppConfigService {
    constructor(private readonly configService: ConfigService) {}

    private get<T>(key: string) {
        const value = this.configService.get<T>(key);
        if (value == null) {
            throw new InternalServerErrorException(
                `app env config error ${key}`,
            );
        }
        return value;
    }
    get jwtPublic(): string {
        let str;
        try {
            str = readFileSync(
                'src/module/auth/certs/private-key.pem',
            ).toString();
        } catch (e) {
            throw new InternalServerErrorException(
                'app env config error - public',
            );
        }
        return str;
    }
    get port(): number {
        return this.get<number>('app.port');
    }

    get jwtSecret(): string {
        return this.get<string>('app.jwtSecret');
    }

    get emailPort(): number {
        return this.get<number>('app.emailPort');
    }

    get emailHost(): string {
        return this.get<string>('app.emailHost');
    }

    get emailFrom(): string {
        return this.get<string>('app.emailFrom');
    }

    get emailAppPasswod() {
        return this.get<string>('app.emailAppPasswod');
    }
    get cloudName() {
        return this.get<string>('app.cloud_name');
    }
    get apiKey() {
        return this.get<string>('app.api_key');
    }
    get apiSecret() {
        return this.get<string>('app.api_secret');
    }
    get smtpPassword() {
        return this.get<string>('app.smtp_password_img');
    }
    get smtpUsername() {
        return this.get<string>('app.smtp_username_img');
    }
    get smtpPort() {
        return this.get<string>('app.smtp_port_img');
    }
    get smtpHost() {
        return this.get<string>('app.smtp_hostname_img');
    }
}
