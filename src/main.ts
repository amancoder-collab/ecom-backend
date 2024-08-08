import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors({
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        allowedHeaders:
            'Origin,X-Requested-With,Content-Type,Accept,Authorization,authorization,X-Forwarded-for,External_Network,external_network',
        credentials: true,
    });

    const config = new DocumentBuilder()
        .addBearerAuth()
        .setTitle('E-commerce')
        .setDescription('Here is the API for E-commerce backend')
        .setVersion('1.0')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    await app.listen(4044);
    console.log('server is running 4044...');
}
bootstrap();
