import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('register')
  register(@Body() body: any) {
    return this.authService.register(body);
  }

  @HttpCode(200)
  @Post('login')
  login(@Body() body: any) {
    return this.authService.login(body);
  }
}
