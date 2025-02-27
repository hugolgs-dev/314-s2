import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  app.enableCors({
    origin: 'http://localhost:5173',
    methods: 'GET,PUT,POST,DELETE',
    credentials: true,
  });

  console.log('App listening on : ' + process.env.PORT);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
