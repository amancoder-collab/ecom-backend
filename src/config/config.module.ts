import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppConfigService } from './config.service';
import appConfig from './config';
@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig], // Load your configuration object
      isGlobal: true, // Makes your configuration module global
    }),
  ],
  providers: [ConfigService, AppConfigService], // Provide ConfigService and your custom AppConfigService
  exports: [ConfigService, AppConfigService], // Export ConfigService and your custom AppConfigService for dependency injection
})
export class AppConfigModule {}
