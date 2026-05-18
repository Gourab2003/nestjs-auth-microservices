import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { connection } from 'mongoose';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI!, {
      connectionFactory: (connection) => {
        console.log('db connection successfull');
        return connection;
      },
    }),
    AuthModule,
  ],
})
export class AuthServiceModule {}
