import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';
import { RabbitMQService } from './rabbitmq.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  rabbitmq = new RabbitMQService();
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService,
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

  async login(body: any) {
    const user = await this.userModel
      .findOne({
        email: body.email,
      })
      .select('+password');

    // console.log(user);

    if (!user) {
      return {
        message: 'User Not found, please register before login',
      };
    }
    // console.log(body.password);
    // console.log(user.password);

    if (user.password !== body.password) {
      return {
        message: 'Wrong password',
      };
    }

    const token = this.jwtService.sign({
      id: user._id,
      email: user.email,
    });

    await this.rabbitmq.publish({
      type: 'LOGIN_SUCCESS',
      email: user.email,
      name: user.name,
    });

    return {
      message: 'Login successfull',
      token,
    };
  }
}
