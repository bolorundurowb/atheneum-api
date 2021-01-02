import {
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  Body,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CredentialsDto } from './dtos/credentials.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() credentials: CredentialsDto) {
    return this.authService.login(
      credentials.emailAddress,
      credentials.password,
    );
  }

  @Post('register')
  async register(@Body() credentials: CredentialsDto) {
    return this.authService.register(
      credentials.emailAddress,
      credentials.password,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
