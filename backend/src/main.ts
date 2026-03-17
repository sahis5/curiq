import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Enable CORS for all frontend portals
  app.enableCors({
    origin: [
      'http://localhost:5173', // Patient Portal
      'http://localhost:5174', // Reception Dashboard
      'http://localhost:5175', // Doctor Dashboard
      'http://localhost:5176', // Pharmacy Portal
      'http://localhost:5177', // Lab Portal
      'http://localhost:5178', // Admin Dashboard
      'http://localhost:8000', // AI Engine
    ],
    credentials: true,
  });

  // Serve the unified gateway landing page from /public
  app.useStaticAssets(join(__dirname, '..', '..', 'public'));

  await app.listen(process.env.PORT ?? 3000);
  console.log('🚀 Curiq Platform Gateway → http://localhost:3000');
}
bootstrap();
