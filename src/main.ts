import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from './common/pipes/validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: true,
  });

  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders:
      'Origin,X-Requested-With,Content-Type,Accept,Authorization,authorization,X-Forwarded-for,External_Network,external_network',
    credentials: true,
  });

  // Force garbage collection every 30 seconds
  if (global.gc) {
    setInterval(() => {
      try {
        global.gc();
      } catch (e) {
        console.error('Global GC Failed:', e);
      }
    }, 30000);
  }

  // Add other middleware and configuration
  // ...

  // Monitor memory usage
  setInterval(() => {
    const used = process.memoryUsage();
    console.log(`Memory usage: ${Math.round(used.heapUsed / 1024 / 1024)}MB`);
  }, 3000);

  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('E-commerce')
    .setDescription('Here is the API for E-commerce backend')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT);
  console.log(`server is running ${process.env.PORT}...`);
}
bootstrap();
