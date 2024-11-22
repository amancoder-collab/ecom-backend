import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: true,
  });

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  const logger = new Logger();

  app.use(cookieParser());
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders:
      'Origin,X-Requested-With,Content-Type,Accept,Authorization,authorization,X-Forwarded-for,External_Network,external_network',
    credentials: true,
  });

  // Memory monitoring with Winston
  const memoryUsageLog = () => {
    const used = process.memoryUsage();
    const memoryUsed = Math.round(used.heapUsed / 1024 / 1024);

    if (memoryUsed > 400) {
      logger.warn(`High Memory Usage: ${memoryUsed}MB`, 'MemoryMonitor');
      if (global.gc) {
        global.gc();
      }
    } else {
      logger.debug(`Memory Usage: ${memoryUsed}MB`, 'MemoryMonitor');
    }
  };

  setInterval(memoryUsageLog, 5000);

  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('E-commerce')
    .setDescription('Here is the API for E-commerce backend')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT);
  logger.log(`Server is running on port ${process.env.PORT}...`);
}
bootstrap();
