import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const header = [
    'Accept',
    'Access-Control-Allow-Headers',
    'Access-Control-Allow-Methods',
    'Access-Control-Allow-Origin',
    'Authorization',
    'Content-Type',
    'Origin',
    'X-Requested-With',
  ];

  app.enableCors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5173/",
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    // allowed headers
    allowedHeaders: header,
    // headers exposed to the client
    exposedHeaders: header,
    credentials: true, // Enable credentials (cookies, authorization headers) cross-origin
  });

  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('EPM-api')
    .setDescription('The API of EPM Project')
    .setVersion('1.0')
    .addTag('User')
    .addTag('Auth')
    .addTag('Local-Files')
    .addTag('Clubs')
    .addTag('Departments')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
