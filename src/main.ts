import { NestFactory } from '@nestjs/core';
import { AppModule } from './module/app.module';
import { JwtAuthGuard } from './common/jwt-auth.guard';
import { Reflector } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  

  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      transform: true, // auto transform types
    }),
  );

  

  const reflector = app.get(Reflector); // ✅ get instance
  app.useGlobalGuards(new JwtAuthGuard(reflector)); // ✅ pass instance

  await app.listen(process.env.PORT || 3000);
  console.log(`Server running on http://localhost:3000/api/v1`);
}
bootstrap();