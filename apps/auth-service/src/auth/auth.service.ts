import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';
import { RabbitMQService } from './rabbitmq.service';

@Injectable()
export class AuthService {
  rabbitmq = new RabbitMQService();
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {
    this.rabbitmq.connect();
  }

  async register(body: any) {
    const user = await this.userModel.create({
      name: body.name,
      email: body.email,
      password: body.password,
    });

    await this.rabbitmq.publish({
      name: user.name,
      email: user.email,
    });

    return {
      message: 'User Registered Successfull',
      user,
    };
  }
}
