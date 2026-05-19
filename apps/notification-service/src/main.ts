import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { NotificationServiceModule } from './notification-service.module';

import * as amqp from 'amqplib';

async function bootstrap() {
  const app = await NestFactory.create(NotificationServiceModule);

  await app.listen(process.env.port ?? 3001);

  console.log('Notification Service Running on 3001');

  const connection = await amqp.connect('amqp://localhost:5672');

  const channel = await connection.createChannel();

  await channel.assertQueue('user_registered');

  console.log('Waiting for messages...');

  channel.consume('user_registered', (message) => {
    if (!message) return;
    const data = JSON.parse(message.content.toString());
    console.log('Received Event');
    console.log(data);
    if (data.type === 'LOGIN_SUCCESS') {
      console.log(`${data.email} logged in successfully`);
    }
    else {
      console.log(`${data.email} registered successfully`);
    }
    channel.ack(message);
  });
}

bootstrap();
