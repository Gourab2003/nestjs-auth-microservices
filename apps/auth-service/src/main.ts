import * as dotenv from 'dotenv';

dotenv.config();
console.log(process.env.MONGO_URI);

import { NestFactory } from '@nestjs/core';
import { AuthServiceModule } from './auth-service.module';

async function bootstrap() {
  const app = await NestFactory.create(AuthServiceModule);
  await app.listen(process.env.port ?? 3000);
  console.log('auth service is running');
}

bootstrap();
