import { NestFactory,Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { JwtAuthGuard } from './auth/auth.guard';
import { JwtService } from '@nestjs/jwt';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('My NestJS API')
    .setDescription('API documentation for my NestJS project')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  const reflector=app.get(Reflector);
  const jwtService=app.get(JwtService);

  app.useGlobalGuards(new JwtAuthGuard(reflector, jwtService));
  
  await app.listen(process.env.PORT ?? 3000);

  console.log(`Swagger docs available at: http://localhost:${3000}/api-docs`);
}
bootstrap();
