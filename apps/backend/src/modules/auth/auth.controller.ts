import { Body, Controller, Get, Headers, Post } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';

@Controller('/api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(@Body() body: LoginDto) {
    return this.authService.login(body.email, body.password);
  }

  @Get('/me')
  async me(@Headers('authorization') authorization?: string) {
    return this.authService.requireUserFromAuthorizationHeader(authorization);
  }
}
